"use strict";

/* --- Shared Activity Log --- */
(function initActivityLog() {
  const constants = window.crmConstants;
  const storage = window.crmStorage;
  const data = window.crmData;

  if (!constants || !storage) return;

  const ACTIVITY_LIMIT = 10;

  /* --- Activity entries are explicit user events, never seeded demo data. --- */
  /* --- Reads stored activity entries from the persistence layer, defaulting to an empty array. --- */
  const read = () => {
    const entries = storage.read(constants.ACTIVITY_KEY, []);
    return Array.isArray(entries) ? entries : [];
  };
  /* --- Writes activity entries to storage and dispatches a custom update event across the window. --- */
  const write = (entries) => {
    storage.write(constants.ACTIVITY_KEY, Array.isArray(entries) ? entries : []);
    window.dispatchEvent(new CustomEvent("crm:activity:update", { detail: entries }));
  };
  /* --- Generates a unique identifier string for a new activity entry using crypto API or a fallback random approach. --- */
  const createId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `activity-${window.crypto.randomUUID()}`;
    }

    return `activity-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };
  /* --- Normalizes an activity entry object, ensuring required properties, standard structure, and valid timestamps. --- */
  const normalizeEntry = (entry = {}) => ({
    ...entry,
    id: entry.id || entry._id || createId(),
    details: Array.isArray(entry.details) ? entry.details : [],
    createdAt: entry.createdAt || new Date().toISOString(),
  });
  /* --- Loads activity entries asynchronously from the remote API if a valid session exists, falling back to local storage. --- */
  const load = async () => {
    if (!data?.fetchActivity || !data?.hasApiSession?.()) return read();

    try {
      const entries = (await data.fetchActivity()).map(normalizeEntry);
      write(entries);
      return entries;
    } catch (error) {
      return read();
    }
  };
  /* --- Constructs, prepends, and saves a new activity entry while attempting to sync it with the backend API. --- */
  const add = (entry = {}) => {
    const nextEntry = {
      id: createId(),
      type: entry.type || "general",
      icon: entry.icon || "clock",
      title: entry.title || "CRM activity",
      summary: entry.summary || "Account activity was recorded.",
      status: entry.status || "Updated",
      relatedLabel: entry.relatedLabel || "CRM",
      description: entry.description || entry.summary || "Account activity was recorded.",
      details: Array.isArray(entry.details) ? entry.details : [],
      actionHref: entry.actionHref || "./dashboard.html#activity",
      actionLabel: entry.actionLabel || "Open Activity",
      createdAt: entry.createdAt || new Date().toISOString(),
    };

    const entries = [nextEntry, ...read()].slice(0, ACTIVITY_LIMIT);
    write(entries);

    data
      ?.postActivity?.(nextEntry)
      .then((apiEntry) => {
        if (!apiEntry) return;

        const syncedEntries = read().map((item) => (item.id === nextEntry.id ? normalizeEntry(apiEntry) : item));
        write(syncedEntries);
      })
      .catch(() => {});

    return nextEntry;
  };
  /* --- Clears all activity entries from local storage and sends a clear request to the remote API if available. --- */
  const clear = () => {
    write([]);
    data?.clearActivityRequest?.().catch(() => {});
  };
  /* --- Deletes a selected set of activity entry IDs from storage and triggers remote API deletions if a session exists. --- */
  const deleteSelected = (ids = []) => {
    const selectedIds = new Set(ids.map((id) => String(id)));

    if (!selectedIds.size) return read();

    const nextEntries = read().filter((entry) => !selectedIds.has(String(entry.id)));
    write(nextEntries);

    if (data?.deleteActivityRequest && data?.hasApiSession?.()) {
      ids.forEach((id) => {
        data.deleteActivityRequest(id).catch(() => {});
      });
    }

    return nextEntries;
  };

  window.crmActivity = { add, read, clear, deleteSelected, load };
  load();
})();
