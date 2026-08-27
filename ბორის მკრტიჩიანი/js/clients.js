// ─── Imports ──────────────────────────────────────────────────────────────────
// Constants (API URLs, localStorage key, status list, page size, etc.)
// are kept in config.js to make them easy to find and change in one place.
import {
  API,
  STORAGE_KEY,
  STATUSES,
  PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
  REMINDER_DELAY_MS,
} from "./config.js";

// Pure helper functions (network requests, formatting, sounds, etc.)
// are kept in utils.js so this file stays focused on page logic.
import {
  requestJson,
  generateUniqueId,
  randomDealValue,
  formatCurrency,
  formatDate,
  formatDuration,
  escapeCsvValue,
  showToast,
  playReminderSound,
  phoneInputValidation,
} from "./utils.js";

// ─── Page State ───────────────────────────────────────────────────────────────
// These variables represent everything the page "remembers" between actions.
// Changing any of them should always be followed by a renderClients() call
// so the UI reflects the new state.

let clients = []; // The full list of all clients loaded from storage/API.
let activeStatus = "All"; // Which status filter chip is currently selected.
let currentView = "list"; // Whether the user is looking at the list or kanban view.
let currentPage = 1; // Current page number for numbered pagination.
let editingClientId = null; // ID of the client being edited; null when adding a new one.
let selectedClientId = null; // ID of the client whose details panel is open.
let serverSearchResults = null; // Results fetched from the API search endpoint; null when unused.
let searchTimerId = null; // Holds the debounce timer ID so it can be cancelled on new input.
let toastTimerId = null; // Holds the toast auto-hide timer so it can be reset.
let selectedIds = new Set(); // IDs of clients currently checked for bulk actions.
let pendingPhotoDataUrl = null; // base64 data URL of the uploaded photo (null = no photo).

// ─── DOM Element References ───────────────────────────────────────────────────
// All elements are grabbed once here and stored in variables.
// This is faster than calling document.getElementById() inside every function.

// Stat cards in the page header
const totalClientsEl = document.getElementById("total-clients");
const activeDealsEl = document.getElementById("active-deals");
const wonRevenueEl = document.getElementById("won-revenue");
const visibleClientsEl = document.getElementById("visible-clients");

// Pipeline chart and the two main content areas (list vs kanban)
const pipelineChartEl = document.getElementById("pipeline-chart");
const clientsListEl = document.getElementById("clients-list");
const kanbanBoardEl = document.getElementById("kanban-board");

// Toolbar controls
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const searchStatusEl = document.getElementById("search-status");
const listViewBtn = document.getElementById("list-view-btn");
const kanbanViewBtn = document.getElementById("kanban-view-btn");
const exportCsvBtn = document.getElementById("export-csv-btn");
const toastEl = document.getElementById("toast");

// Pagination
const paginationWrap = document.getElementById("pagination-wrap");
const pageNumbers = document.getElementById("page-numbers");
const pagePrevBtn = document.getElementById("page-prev-btn");
const pageNextBtn = document.getElementById("page-next-btn");
const pageInfo = document.getElementById("page-info");

// Bulk action bar
const bulkBar = document.getElementById("bulk-bar");
const bulkCountLabel = document.getElementById("bulk-count-label");
const bulkSelectAllBtn = document.getElementById("bulk-select-all-btn");
const bulkSelectAllLabel = document.getElementById("bulk-select-all-label");
const bulkStatusSelect = document.getElementById("bulk-status-select");
const bulkApplyStatusBtn = document.getElementById("bulk-apply-status-btn");
const bulkDeleteBtn = document.getElementById("bulk-delete-btn");
const bulkCancelBtn = document.getElementById("bulk-cancel-btn");

// Photo upload
const clientPhotoInput = document.getElementById("client-photo");
const avatarPreview = document.getElementById("avatar-preview");
const avatarPreviewImg = document.getElementById("avatar-preview-img");
const avatarPreviewInitials = document.getElementById("avatar-preview-initials");
const removePhotoBtn = document.getElementById("remove-photo-btn");

// Add / Edit client modal form fields
const clientModal = document.getElementById("client-modal");
const clientModalTitle = document.getElementById("client-modal-title");
const clientForm = document.getElementById("client-form");
const clientSubmitBtn = document.getElementById("client-submit-btn");
const clientNameInput = document.getElementById("client-name");
const clientEmailInput = document.getElementById("client-email");
const clientPhoneInput = document.getElementById("client-phone");
const clientCompanyInput = document.getElementById("client-company");
const clientDealInput = document.getElementById("client-deal");
const clientStatusInput = document.getElementById("client-status");

// Client details / notes modal
const detailsModal = document.getElementById("details-modal");
const detailAvatarEl = document.getElementById("detail-avatar");
const detailNameEl = document.getElementById("detail-name");
const detailCompanyEl = document.getElementById("detail-company");
const detailEmailEl = document.getElementById("detail-email");
const detailPhoneEl = document.getElementById("detail-phone");
const detailStatusEl = document.getElementById("detail-status");
const detailDealEl = document.getElementById("detail-deal");
const detailCreatedAtEl = document.getElementById("detail-created-at");
const notesListEl = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");

// ─── Entry Point ──────────────────────────────────────────────────────────────
// DOMContentLoaded fires once the HTML is fully parsed (before images load).
// We wait for it before touching any DOM elements.
document.addEventListener("DOMContentLoaded", initClients);

async function initClients() {
  bindEvents(); // Attach all click/input listeners.
  await loadClients(); // Fetch or restore client data, then render.
}

// ─── Event Binding ────────────────────────────────────────────────────────────
// All event listeners are registered in one place so they're easy to audit.

// DRY helper: shorthand for the repeated getElementById + addEventListener pattern.
function bindClick(id, handler) {
  document.getElementById(id).addEventListener("click", handler);
}

function bindEvents() {
  bindClick("add-client-btn", openAddModal);
  bindClick("close-client-modal-btn", closeClientModal);
  bindClick("cancel-client-btn", closeClientModal);
  bindClick("close-details-modal-btn", closeDetailsModal);

  // Form submit handles both "Add" and "Edit" depending on editingClientId.
  clientForm.addEventListener("submit", handleClientFormSubmit);

  // Clear the red error state from a field as soon as the user starts correcting it.
  clientForm.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field.id));
  });

  clientStatusInput.addEventListener("change", () => {
    clientStatusInput.className = `form-control status-select status-select-${clientStatusInput.value.toLowerCase()}`;
  });

  // Status filter chips (All / Lead / Contacted / Won / Lost)
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => setStatusFilter(chip.dataset.status));
  });

  searchInput.addEventListener("input", handleSearchInput);
  sortSelect.addEventListener("change", resetPaginationAndRender);
  listViewBtn.addEventListener("click", () => setView("list"));
  kanbanViewBtn.addEventListener("click", () => setView("kanban"));
  exportCsvBtn.addEventListener("click", exportVisibleClientsToCsv);

  // Pagination
  pagePrevBtn.addEventListener("click", () => goToPage(currentPage - 1));
  pageNextBtn.addEventListener("click", () => goToPage(currentPage + 1));

  // Bulk action bar
  bulkSelectAllBtn.addEventListener("click", toggleSelectAll);
  bulkApplyStatusBtn.addEventListener("click", bulkApplyStatus);
  bulkDeleteBtn.addEventListener("click", bulkDelete);
  bulkCancelBtn.addEventListener("click", clearSelection);

  // Photo upload
  clientPhotoInput.addEventListener("change", handlePhotoUpload);
  removePhotoBtn.addEventListener("click", clearPhotoPreview);

  // Live initials preview as name is typed
  clientNameInput.addEventListener("input", updateAvatarPreviewInitials);

  bindClick("detail-edit-btn", () => {
    if (selectedClientId) {
      closeDetailsModal();
      openEditModal(selectedClientId);
    }
  });
  bindClick("reminder-btn", setReminder);
  bindClick("add-note-btn", addNote);

  // Clicking the dark overlay behind a modal closes it.
  [clientModal, detailsModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal === clientModal ? closeClientModal() : closeDetailsModal();
      }
    });
  });

  // Global keyboard shortcuts: Escape closes modals, "/" focuses search, "N" opens Add modal.
  document.addEventListener("keydown", handleKeyboardShortcut);
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

async function loadClients(forceApi = false) {
  // Prefer saved CRM data. The API is only used on the first visit or after reset.
  showLoadingState();

  try {
    // If forceApi is true (e.g. Retry button clicked), skip localStorage.
    const storedClients = !forceApi ? readClientsFromStorage() : null;

    if (storedClients) {
      // We have valid local data — no network request needed.
      clients = storedClients;
    } else {
      // First visit or reset: fetch seed data from the DummyJSON API.
      const data = await requestJson(API.list);
      clients = data.users.map(normaliseClient);
      saveClients(); // Persist so the next page load uses local data.
    }

    renderClients();
  } catch (error) {
    console.error("Could not load clients", error);
    showLoadError(); // Show a friendly error with a Retry button.
  }
}

function readClientsFromStorage() {
  // Returns the parsed client array from localStorage, or null if nothing is stored.
  const savedClients = localStorage.getItem(STORAGE_KEY);

  if (!savedClients) {
    return null;
  }

  try {
    const parsedClients = JSON.parse(savedClients);

    if (!Array.isArray(parsedClients)) {
      throw new Error("crm_clients is not an array");
    }

    // Re-normalise on read so that old saved clients gain any new fields added later.
    const normalisedClients = parsedClients.map(normaliseClient);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalisedClients));
    return normalisedClients;
  } catch (error) {
    // Corrupted data: wipe it and fall back to the API.
    console.warn("Saved client data was invalid and will be reloaded", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function normaliseClient(client) {
  // Converts any raw object (from the API or localStorage) into our standard shape.
  // This makes the rest of the code safe to assume every client has the same fields.
  const company =
    typeof client.company === "object" ? client.company?.name : client.company;

  // Support both "name" (our format) and "firstName"/"lastName" (DummyJSON format).
  const name =
    client.name?.trim() ||
    `${client.firstName || ""} ${client.lastName || ""}`.trim() ||
    "Unknown client";

  const dealValue = Number(client.dealValue);

  return {
    id: String(client.id ?? generateUniqueId()),
    name,
    email: client.email || "No email",
    phone: client.phone || "No phone",
    company: company || "Independent",
    image: client.image || "",
    // Only accept statuses from our known list; default unknown ones to "Lead".
    status: STATUSES.includes(client.status) ? client.status : "Lead",
    // If dealValue is missing or invalid, assign a random realistic value.
    dealValue:
      Number.isFinite(dealValue) && dealValue > 0
        ? dealValue
        : randomDealValue(),
    notes: Array.isArray(client.notes) ? client.notes : [],
    createdAt: client.createdAt || new Date().toISOString(),
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

// BroadcastChannel is created once and reused for all saves.
const _crmUpdateChannel =
  "BroadcastChannel" in window ? new BroadcastChannel("crm_updates") : null;

function saveClients() {
  // Serialise the entire clients array to localStorage so it survives page reloads.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  // Notify any other open tabs (e.g. dashboard) that data changed.
  _crmUpdateChannel?.postMessage({ type: "clients_updated" });
}

// ─── Filtering & Sorting (pure — does not change state) ───────────────────────

function getVisibleClients() {
  // Builds the filtered + sorted snapshot that the UI should display.
  // It never mutates the original `clients` array — only returns a derived view.
  const searchQuery = searchInput.value.trim().toLowerCase();
  let result = getSearchSource(searchQuery); // Start from the right data source.

  // Apply status chip filter (skipped when "All" is selected).
  if (activeStatus !== "All") {
    result = result.filter((client) => client.status === activeStatus);
  }

  // Apply the text search filter.
  if (searchQuery) {
    result = result.filter((client) =>
      clientMatchesSearch(client, searchQuery),
    );
  }

  // Sort a copy so we don't accidentally mutate the source array.
  return [...result].sort((firstClient, secondClient) => {
    if (sortSelect.value === "name") {
      return firstClient.name.localeCompare(secondClient.name);
    }

    if (sortSelect.value === "deal") {
      // Highest deal value first.
      return secondClient.dealValue - firstClient.dealValue;
    }

    // Default: newest added first (most recent createdAt date).
    return new Date(secondClient.createdAt) - new Date(firstClient.createdAt);
  });
}

function getSearchSource(searchQuery) {
  // When there is no active search or no server results yet, use the local array.
  if (!searchQuery || !serverSearchResults) {
    return clients;
  }

  // When the server has returned results, merge them with the local array.
  // Using a Map keyed by ID prevents duplicates.
  // Local data wins for any field that exists on both objects (edit/notes are preserved).
  const mergedClients = new Map();

  serverSearchResults.forEach((serverClient) => {
    // Try to find a matching local record by ID or email.
    const localClient = clients.find(
      (client) =>
        client.id === serverClient.id || client.email === serverClient.email,
    );
    // Spread order matters: localClient fields overwrite serverClient fields.
    const client = localClient
      ? { ...serverClient, ...localClient }
      : serverClient;
    mergedClients.set(client.id, client);
  });

  // Also include any locally added clients that match the search query
  // but were never returned by the server (e.g. newly added during this session).
  clients
    .filter((client) => clientMatchesSearch(client, searchQuery))
    .forEach((client) => mergedClients.set(client.id, client));

  return [...mergedClients.values()];
}

function clientMatchesSearch(client, searchQuery) {
  // Returns true if name, company, or email contains the search query string.
  return [client.name, client.company, client.email].some((value) =>
    String(value).toLowerCase().includes(searchQuery),
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────
// All UI updates flow through renderClients() to keep everything in sync.

function renderClients() {
  // One rendering entry point keeps list, Kanban, chart, stats, and pagination in sync.
  const visibleClients = getVisibleClients();

  renderClientList(visibleClients); // Build the scrollable list of client rows.
  renderKanbanBoard(visibleClients); // Build the drag-and-drop kanban columns.
  renderPipelineChart(); // Update the horizontal bar chart.
  updateStats(visibleClients); // Refresh the header stat cards.
  updateViewVisibility(); // Show the correct panel (list or kanban).
  renderPagination(visibleClients); // Render numbered pagination.
  updateBulkBar(); // Sync the bulk action bar state.
}

function renderClientList(visibleClients) {
  clientsListEl.replaceChildren(); // Clear previous rows.

  if (!visibleClients.length) {
    clientsListEl.appendChild(createEmptyState("No clients found."));
    renderPagination(visibleClients);
    return;
  }

  // Numbered pagination: slice the correct page window.
  const totalPages = Math.ceil(visibleClients.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const clientsForPage = visibleClients.slice(start, start + PAGE_SIZE);

  clientsForPage.forEach((client) => {
    clientsListEl.appendChild(createClientRow(client));
  });
}

// ─── Numbered Pagination ───────────────────────────────────────────────────────

function renderPagination(visibleClients) {
  const totalPages = Math.ceil(visibleClients.length / PAGE_SIZE);
  const shouldShow = currentView === "list" && totalPages > 1;
  paginationWrap.classList.toggle("hidden", !shouldShow);

  if (!shouldShow) return;

  // Prev / Next state
  pagePrevBtn.disabled = currentPage <= 1;
  pageNextBtn.disabled = currentPage >= totalPages;

  // Page number buttons (show at most 7 with ellipsis)
  pageNumbers.replaceChildren();
  const pages = getPageRange(currentPage, totalPages);
  pages.forEach((p) => {
    if (p === "...") {
      const dots = document.createElement("span");
      dots.className = "page-ellipsis";
      dots.textContent = "...";
      pageNumbers.appendChild(dots);
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `page-num-btn${p === currentPage ? " active" : ""}`;
      btn.textContent = p;
      btn.addEventListener("click", () => goToPage(p));
      pageNumbers.appendChild(btn);
    }
  });

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, visibleClients.length);
  pageInfo.textContent = `${start}–${end} of ${visibleClients.length}`;
}

function getPageRange(current, total) {
  // Returns an array of page numbers and "..." strings.
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function goToPage(page) {
  const visibleClients = getVisibleClients();
  const totalPages = Math.ceil(visibleClients.length / PAGE_SIZE);
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderClients();
  clientsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createClientRow(client) {
  // Builds one row element for the list view.
  const row = document.createElement("article");
  row.className = `client-row status-row-${client.status.toLowerCase()}${selectedIds.has(client.id) ? " row-selected" : ""}`;
  row.dataset.clientId = client.id;

  // ── Checkbox for bulk selection ──────────────────────────────────────
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "bulk-checkbox";
  checkbox.checked = selectedIds.has(client.id);
  checkbox.setAttribute("aria-label", `Select ${client.name}`);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      selectedIds.add(client.id);
    } else {
      selectedIds.delete(client.id);
    }
    row.classList.toggle("row-selected", checkbox.checked);
    updateBulkBar();
  });

  // ── Left section: avatar + name / company / email ────────────────────
  const mainInfo = document.createElement("div");
  mainInfo.className = "client-row-main";
  mainInfo.tabIndex = 0;
  mainInfo.setAttribute("role", "button");
  mainInfo.setAttribute("aria-label", `Open details for ${client.name}`);
  mainInfo.append(createAvatar(client));

  const copy = document.createElement("div");
  copy.className = "client-copy";

  const name = document.createElement("div");
  name.className = "client-name";
  name.textContent = client.name;

  const company = document.createElement("div");
  company.className = "client-company";
  company.textContent = client.company;

  const email = document.createElement("div");
  email.className = "client-email";
  email.textContent = client.email;

  copy.append(name, company, email);
  mainInfo.appendChild(copy);

  mainInfo.addEventListener("click", () => openDetailsModal(client.id));
  mainInfo.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetailsModal(client.id);
    }
  });

  // ── Inline status dropdown ────────────────────────────────────────────
  const statusSelect = createStatusSelect(client);

  const dealValue = document.createElement("div");
  dealValue.className = `client-deal-value ${client.status === "Won" ? "deal-won" : client.status === "Lost" ? "deal-lost" : ""}`;
  if (client.status === "Won") {
    const trophy = document.createElement("i");
    trophy.className = "fa-solid fa-trophy";
    trophy.style.fontSize = "12px";
    trophy.style.marginRight = "4px";
    dealValue.append(trophy, formatCurrency(client.dealValue));
  } else {
    dealValue.textContent = formatCurrency(client.dealValue);
  }

  // ── Action buttons ────────────────────────────────────────────────────
  const actions = document.createElement("div");
  actions.className = "client-row-actions";
  actions.append(
    createIconButton("fa-solid fa-circle-info", "Open client details", () =>
      openDetailsModal(client.id),
    ),
    createIconButton("fa-solid fa-pen", "Edit client", () =>
      openEditModal(client.id),
    ),
    createIconButton(
      "fa-solid fa-trash",
      "Delete client",
      () => deleteClient(client.id),
      "delete-icon",
    ),
  );

  row.append(checkbox, mainInfo, statusSelect, dealValue, actions);
  return row;
}

function createAvatar(client) {
  // Creates the circular avatar element and passes it to fillAvatar for content.
  const avatar = document.createElement("div");
  fillAvatar(avatar, client);
  return avatar;
}

function fillAvatar(avatar, client, isLarge = false) {
  // Populates an existing avatar element with either an <img> or initials text.
  // isLarge adds an extra CSS class for the bigger avatar shown in the details modal.
  avatar.replaceChildren();
  avatar.className = `client-avatar client-avatar-fallback${isLarge ? " client-avatar-large" : ""}`;

  if (client.image) {
    const image = document.createElement("img");
    image.src = client.image;
    image.alt = `${client.name} profile`;
    // If the image URL is broken, fall back to showing initials instead.
    image.addEventListener("error", () => {
      avatar.textContent = getInitials(client.name);
    });
    avatar.appendChild(image);
  } else {
    // No image available — show the first letter of each name word.
    avatar.textContent = getInitials(client.name);
  }
}

function getInitials(name) {
  // "Boris Mkrtichiani" → "BM"
  return name
    .split(" ")
    .filter(Boolean) // Remove empty strings from extra spaces.
    .slice(0, 2) // Use at most two words.
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createStatusSelect(client) {
  // Builds a <select> dropdown pre-selected to the client's current status.
  const select = document.createElement("select");
  select.className = `status-select status-select-${client.status.toLowerCase()}`;
  select.setAttribute("aria-label", `Change status for ${client.name}`);

  STATUSES.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.selected = client.status === status; // Mark the current status as chosen.
    select.appendChild(option);
  });

  // Save and re-render whenever the user picks a different status.
  select.addEventListener("change", () => {
    select.className = `status-select status-select-${select.value.toLowerCase()}`;
    updateClientStatus(client.id, select.value);
  });
  return select;
}

function createIconButton(iconClass, label, onClick, extraClass = "") {
  // Reusable helper that builds a small icon-only button with accessibility attributes.
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-btn ${extraClass}`.trim();
  button.title = label; // Tooltip on hover.
  button.setAttribute("aria-label", label); // Screen reader label.

  const icon = document.createElement("i");
  icon.className = iconClass; // FontAwesome class e.g. "fa-solid fa-pen".
  button.appendChild(icon);
  button.addEventListener("click", onClick);
  return button;
}

// ─── Shared Status Grouping Helper ────────────────────────────────────────────

// DRY helper: groups any client array into a Map keyed by status.
// Used by both renderKanbanBoard and renderPipelineChart to avoid
// re-filtering the array inside every loop iteration.
function groupByStatus(arr) {
  const map = new Map(STATUSES.map((s) => [s, []]));
  arr.forEach((client) => map.get(client.status)?.push(client));
  return map;
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────

function renderKanbanBoard(visibleClients) {
  kanbanBoardEl.replaceChildren(); // Clear previous columns.

  // Group once, then build a column for each status.
  const byStatus = groupByStatus(visibleClients);
  STATUSES.forEach((status) => {
    kanbanBoardEl.appendChild(createKanbanColumn(status, byStatus.get(status)));
  });
}

function createKanbanColumn(status, clientsForStatus) {
  // Builds one kanban column (e.g. "Lead") with drag-and-drop drop zone support.
  const column = document.createElement("section");
  column.className = `kanban-column status-col-${status.toLowerCase()}`;

  // Column header: status name on the left, client count on the right.
  const heading = document.createElement("h3");
  const label = document.createElement("span");
  label.className = "kanban-col-title";

  let iconClass = "fa-circle-dot";
  if (status === "Won") iconClass = "fa-circle-check";
  else if (status === "Lost") iconClass = "fa-circle-xmark";
  else if (status === "Contacted") iconClass = "fa-comments";
  else if (status === "Lead") iconClass = "fa-user";

  const colIcon = document.createElement("i");
  colIcon.className = `fa-solid ${iconClass}`;
  label.append(colIcon, ` ${status}`);

  const count = document.createElement("span");
  count.className = `kanban-count-pill status-pill-${status.toLowerCase()}`;
  count.textContent = clientsForStatus.length;
  heading.append(label, count);

  // The list div is the actual drop target for dragged cards.
  const list = document.createElement("div");
  list.className = "kanban-list";

  // dragover: must call preventDefault() to allow a drop to happen here.
  list.addEventListener("dragover", (event) => event.preventDefault());
  // dragenter / dragleave: add/remove a visual highlight while a card hovers over.
  list.addEventListener("dragenter", () => list.classList.add("drop-target"));
  list.addEventListener("dragleave", () =>
    list.classList.remove("drop-target"),
  );
  // drop: read the dragged client's ID from the transfer data and change its status.
  list.addEventListener("drop", (event) => {
    event.preventDefault();
    list.classList.remove("drop-target");
    updateClientStatus(event.dataTransfer.getData("text/plain"), status);
  });

  if (!clientsForStatus.length) {
    const empty = document.createElement("p");
    empty.textContent = "No clients";
    list.appendChild(empty);
  }

  clientsForStatus.forEach((client) =>
    list.appendChild(createKanbanCard(client)),
  );
  column.append(heading, list);
  return column;
}

function createKanbanCard(client) {
  // Builds a draggable card for the kanban board.
  const card = document.createElement("article");
  card.className = `kanban-card status-card-${client.status.toLowerCase()}`;
  card.draggable = true; // Enables HTML5 drag-and-drop on this element.

  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.alignItems = "center";

  const name = document.createElement("strong");
  name.textContent = client.name;

  const badge = document.createElement("span");
  badge.className = `status-badge status-${client.status.toLowerCase()}`;
  badge.style.fontSize = "11px";
  badge.style.padding = "2px 7px";
  badge.textContent = client.status;

  headerRow.append(name, badge);

  const company = document.createElement("p");
  company.textContent = client.company;

  const deal = document.createElement("p");
  deal.className =
    client.status === "Won"
      ? "deal-won"
      : client.status === "Lost"
        ? "deal-lost"
        : "";
  deal.style.fontWeight = "bold";
  if (client.status === "Won") {
    const trophy = document.createElement("i");
    trophy.className = "fa-solid fa-trophy";
    trophy.style.fontSize = "11px";
    trophy.style.marginRight = "4px";
    deal.append(trophy, formatCurrency(client.dealValue));
  } else {
    deal.textContent = formatCurrency(client.dealValue);
  }

  card.append(headerRow, company, deal);

  // Clicking the card opens the full details modal.
  card.addEventListener("click", () => openDetailsModal(client.id));

  // When a drag starts, store the client's ID in the drag transfer data
  // so the drop zone knows which client was moved.
  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", client.id);
    card.classList.add("dragging"); // Dims the card while it's being dragged.
  });
  card.addEventListener("dragend", () => card.classList.remove("dragging"));
  return card;
}

// ─── Pipeline Chart ───────────────────────────────────────────────────────────

function renderPipelineChart() {
  // Builds a simple horizontal bar chart showing how many clients are in each status.
  pipelineChartEl.replaceChildren();
  const total = clients.length || 1; // Avoid dividing by zero when the list is empty.

  // Re-use groupByStatus so we don't re-filter the array on every iteration.
  const byStatus = groupByStatus(clients);

  STATUSES.forEach((status) => {
    const count = byStatus.get(status).length;
    const row = document.createElement("div");
    row.className = "pipeline-chart-row";

    const label = document.createElement("span");
    label.className = `pipeline-label status-text-${status.toLowerCase()}`;

    let iconClass = "fa-circle-dot";
    if (status === "Won") iconClass = "fa-circle-check";
    else if (status === "Lost") iconClass = "fa-circle-xmark";
    else if (status === "Contacted") iconClass = "fa-comments";
    else if (status === "Lead") iconClass = "fa-user";

    const rowIcon = document.createElement("i");
    rowIcon.className = `fa-solid ${iconClass}`;
    rowIcon.style.marginRight = "6px";
    label.append(rowIcon, status);

    const track = document.createElement("div");
    track.className = "pipeline-track"; // The grey background bar.

    const fill = document.createElement("div");
    fill.className = `pipeline-fill status-${status.toLowerCase()}`; // Coloured fill.
    fill.style.width = `${(count / total) * 100}%`; // Width is the % of all clients.

    track.appendChild(fill);

    const countLabel = document.createElement("strong");
    countLabel.className = `status-text-${status.toLowerCase()}`;
    countLabel.textContent = count; // Shows the raw number to the right of the bar.

    row.append(label, track, countLabel);
    pipelineChartEl.appendChild(row);
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function updateStats(visibleClients) {
  // Updates the four summary cards at the top of the page.
  totalClientsEl.textContent = clients.length; // Total includes hidden/filtered ones.
  visibleClientsEl.textContent = visibleClients.length;

  // Active deals = clients that haven't closed (not Won or Lost).
  const activeDeals = clients.filter(
    (client) => client.status !== "Won" && client.status !== "Lost",
  ).length;

  // Won revenue = sum of deal values for all Won clients.
  const wonRevenue = clients
    .filter((client) => client.status === "Won")
    .reduce((sum, client) => sum + client.dealValue, 0);

  activeDealsEl.textContent = activeDeals;
  wonRevenueEl.textContent = formatCurrency(wonRevenue);
}

// ─── Status Updates ───────────────────────────────────────────────────────────

function updateClientStatus(id, newStatus) {
  // Changes a client's status (used by both the inline dropdown and kanban drag-and-drop).
  const client = getClientById(id);

  // Do nothing if the client doesn't exist or the status isn't actually changing.
  if (!client || client.status === newStatus) {
    return;
  }

  client.status = newStatus;
  saveClients();
  renderClients();
  showToast(`${client.name} moved to ${newStatus}`);
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function setStatusFilter(status) {
  // Called when the user clicks a filter chip (All / Lead / Contacted / Won / Lost).
  activeStatus = status;
  currentPage = 1; // Reset pagination so we start from the first page.

  // Update the active chip highlight.
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.status === status);
  });

  renderClients();
}

// ─── Search ───────────────────────────────────────────────────────────────────

function handleSearchInput() {
  // Called on every keystroke in the search box.
  currentPage = 1; // Reset pagination so new results start at page 1.
  serverSearchResults = null; // Discard previous server results for a fresh search.
  window.clearTimeout(searchTimerId); // Cancel any pending debounced API request.

  const query = searchInput.value.trim();
  renderClients(); // Immediately filter the local data while we wait for the server.

  if (!query) {
    setSearchStatus("");
    return;
  }

  // Show a "Searching…" indicator and kick off the debounced server request.
  setSearchStatus("Searching server...");
  searchTimerId = window.setTimeout(
    () => searchServer(query),
    SEARCH_DEBOUNCE_MS, // Wait this many ms after the user stops typing before calling the API.
  );
}

async function searchServer(query) {
  // Debounce calls this once typing pauses, instead of making one request per key press.
  try {
    const data = await requestJson(
      `${API.search}?q=${encodeURIComponent(query)}`,
    );

    // By the time the response arrives the user may have typed something new.
    // If so, discard this result — a newer request is already in flight.
    if (query !== searchInput.value.trim()) {
      return;
    }

    serverSearchResults = data.users.map(normaliseClient);
    setSearchStatus(
      `Server search found ${serverSearchResults.length} record(s).`,
    );
    renderClients(); // Merge server results into the displayed list.
  } catch (error) {
    console.error("Server search failed", error);
    setSearchStatus("Server search is unavailable. Showing local results.");
  }
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function resetPaginationAndRender() {
  // Called when the sort dropdown or filter changes — always go back to page 1.
  currentPage = 1;
  renderClients();
}

// ─── View Switching (List / Kanban) ───────────────────────────────────────────

function setView(view) {
  // Switches between "list" and "kanban" and updates the active button highlight.
  currentView = view;

  // DRY: both view buttons share the exact same toggle + aria-pressed pattern.
  [
    [listViewBtn, "list"],
    [kanbanViewBtn, "kanban"],
  ].forEach(([btn, name]) => {
    const isActive = view === name;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  updateViewVisibility();
}

function updateViewVisibility() {
  // Shows the correct content panel and hides the other.
  // The CSS media query also hides the kanban board on mobile screens.
  clientsListEl.classList.toggle("hidden", currentView !== "list");
  kanbanBoardEl.classList.toggle("hidden", currentView !== "kanban");
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

// DRY helper: the final three steps of opening the client modal are identical
// in both openAddModal and openEditModal, so they live here once.
function showClientModal(title, submitLabel) {
  clearFormErrors();
  clientModalTitle.textContent = title;
  clientSubmitBtn.textContent = submitLabel;
  clientModal.classList.remove("hidden");
  clientNameInput.focus(); // Move keyboard focus to the first field for convenience.
}

function openAddModal() {
  editingClientId = null;
  clientForm.reset();
  clientStatusInput.className = "form-control status-select status-select-lead";
  clearPhotoPreview();
  updateAvatarPreviewInitials();
  showClientModal("Add New Client", "Add Client");
}

function openEditModal(id) {
  const client = getClientById(id);
  if (!client) return;

  editingClientId = client.id;

  clientNameInput.value = client.name;
  clientEmailInput.value = client.email;
  clientPhoneInput.value = client.phone === "No phone" ? "" : client.phone;
  clientCompanyInput.value = client.company === "Independent" ? "" : client.company;
  clientDealInput.value = client.dealValue;
  clientStatusInput.value = client.status;
  clientStatusInput.className = `form-control status-select status-select-${client.status.toLowerCase()}`;

  // Restore existing photo or show initials
  if (client.image) {
    pendingPhotoDataUrl = client.image;
    avatarPreviewImg.src = client.image;
    avatarPreviewImg.style.display = "block";
    avatarPreviewInitials.style.display = "none";
    removePhotoBtn.classList.remove("hidden");
  } else {
    clearPhotoPreview();
    updateAvatarPreviewInitials();
  }

  showClientModal("Edit Client", "Save Changes");
}

// ─── Photo Upload ──────────────────────────────────────────────────────────────

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file.", "error");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast("Image must be smaller than 2 MB.", "error");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    pendingPhotoDataUrl = e.target.result;
    avatarPreviewImg.src = pendingPhotoDataUrl;
    avatarPreviewImg.style.display = "block";
    avatarPreviewInitials.style.display = "none";
    removePhotoBtn.classList.remove("hidden");
  });
  reader.readAsDataURL(file);
}

function clearPhotoPreview() {
  pendingPhotoDataUrl = null;
  avatarPreviewImg.src = "";
  avatarPreviewImg.style.display = "none";
  avatarPreviewInitials.style.display = "";
  removePhotoBtn.classList.add("hidden");
  if (clientPhotoInput) clientPhotoInput.value = "";
}

function updateAvatarPreviewInitials() {
  if (pendingPhotoDataUrl) return; // Don't overwrite a photo preview.
  const name = clientNameInput?.value.trim() || "";
  avatarPreviewInitials.textContent = name ? getInitials(name) : "?";
}

function closeClientModal() {
  clientModal.classList.add("hidden");
  editingClientId = null; // Reset so the next open is clean.
}

async function handleClientFormSubmit(event) {
  // Handles both "Add Client" and "Save Changes" since they share the same form.
  event.preventDefault(); // Stop the browser from doing a full page reload.
  const formData = getClientFormData();

  if (!validateClientForm(formData)) {
    return; // Validation already showed field errors — stop here.
  }

  try {
    if (editingClientId) {
      await editClient(editingClientId, formData);
    } else {
      await addClient(formData);
    }

    clientForm.reset();
    closeClientModal();
    renderClients();
  } catch (error) {
    console.error("Could not save client", error);
    showToast("Could not save client. Please try again.", "error");
  }
}

function getClientFormData() {
  // Reads all form fields and returns a clean data object.
  return {
    name: clientNameInput.value.trim(),
    email: clientEmailInput.value.trim().toLowerCase(),
    phone: clientPhoneInput.value.trim(),
    company: clientCompanyInput.value.trim() || "Independent",
    dealValue: Number(clientDealInput.value),
    status: clientStatusInput.value,
    image: pendingPhotoDataUrl || "", // base64 data URL or empty string
  };
}

function validateClientForm(formData) {
  // Runs all validation rules and marks any invalid fields in red.
  // Returns true only if everything is valid.
  clearFormErrors();
  let isValid = true;

  if (formData.name.length < 3) {
    showFieldError("client-name", "Name must be at least 3 characters.");
    isValid = false;
  }

  if (!formData.email.includes("@") || !formData.email.includes(".")) {
    showFieldError("client-email", "Please enter a valid email address.");
    isValid = false;
  }

  // Prevent duplicate email addresses (skip the client being edited).
  const matchingEmail = clients.some(
    (client) =>
      client.email.toLowerCase() === formData.email &&
      client.id !== editingClientId,
  );
  if (matchingEmail) {
    showFieldError("client-email", "A client with this email already exists.");
    isValid = false;
  }

  // --- MOBILE NUMBER VALIDATION START ---
  // Strip spaces, dashes, and parentheses, keeping optional '+'

  const cleanedPhone = formData.phone.replace(/[^0-9\-+]/g, "");

  // RegEx: Optional '+' followed by exactly 10 to 14 digits (E.164 compliant)
  const phoneRegex = /^\+?\d{10,14}$/;

  if (!formData.phone) {
    showFieldError("client-phone", "Phone number is required.");
    isValid = false;
  } else if (!phoneRegex.test(cleanedPhone)) {
    showFieldError(
      "client-phone",
      "Please enter a valid 10-digit phone number.",
    );
    isValid = false;
  }
  // --- MOBILE NUMBER VALIDATION END ---

  if (!Number.isFinite(formData.dealValue) || formData.dealValue <= 0) {
    showFieldError("client-deal", "Deal value must be greater than 0.");
    isValid = false;
  }

  return isValid;
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

// DRY helper: both addClient and editClient send JSON to the API with the same
// headers structure. Build the options object once instead of duplicating it.
function buildJsonRequestOptions(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function addClient(formData) {
  // POST to the API to simulate a real save.
  const serverClient = await requestJson(
    API.add,
    buildJsonRequestOptions("POST", { ...formData, image: undefined }),
  );

  const newClient = normaliseClient({
    ...formData,
    id: serverClient.id ?? generateUniqueId(),
    image: formData.image || "", // store base64 photo or empty
    notes: [],
    createdAt: new Date().toISOString(),
  });

  clients.unshift(newClient);
  saveClients();
  showToast("Client added ✓");
}

async function editClient(id, formData) {
  // PUT to API (photo is local-only — not sent to DummyJSON)
  await requestJson(
    `${API.user}/${id}`,
    buildJsonRequestOptions("PUT", { ...formData, image: undefined }),
  );

  const client = getClientById(id);
  Object.assign(client, formData); // Merge including image field
  saveClients();
  showToast("Client updated ✓");
}

async function deleteClient(id) {
  if (!window.confirm("Delete this client? This cannot be undone.")) {
    return; // User clicked Cancel.
  }

  try {
    const response = await fetch(`${API.user}/${id}`, { method: "DELETE" });

    // DummyJSON returns 404 for locally added clients because they don't exist on the server.
    // We treat 404 as acceptable and still remove the client from local state.
    if (!response.ok && response.status !== 404) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Remove the client from the local array (filter returns a new array without it).
    clients = clients.filter((client) => client.id !== String(id));
    saveClients();
    closeDetailsModal();
    renderClients();
    showToast("Client deleted");
  } catch (error) {
    console.error("Could not delete client", error);
    showToast("Could not delete client. Please try again.", "error");
  }
}

// ─── Form Error Helpers ───────────────────────────────────────────────────────

function showFieldError(inputId, message) {
  // Marks an input red and shows the error message below it.
  const input = document.getElementById(inputId);
  const error = clientForm.querySelector(`[data-error-for="${inputId}"]`);
  input.classList.add("input-error");
  error.textContent = message;
}

function clearFieldError(inputId) {
  // Removes the red styling and error text for a single field.
  const input = document.getElementById(inputId);
  const error = clientForm.querySelector(`[data-error-for="${inputId}"]`);
  input.classList.remove("input-error");
  if (error) {
    error.textContent = "";
  }
}

function clearFormErrors() {
  // Clears all field errors at once (called before re-validating the whole form).
  clientForm.querySelectorAll(".form-error").forEach((error) => {
    error.textContent = "";
  });
  clientForm.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
}

// ─── Details Modal ────────────────────────────────────────────────────────────

function openDetailsModal(id) {
  // selectedClientId lets notes, reminders, and the call timer know which client is open.
  selectedClientId = String(id);
  renderDetails();
  detailsModal.classList.remove("hidden");
}

function closeDetailsModal() {
  detailsModal.classList.add("hidden");
  noteInput.value = ""; // Clear the note input so it's blank the next time the modal opens.
}

function renderDetails() {
  // Fills every field of the details modal with the selected client's data.
  const client = getClientById(selectedClientId);

  if (!client) {
    closeDetailsModal(); // Client may have been deleted; close gracefully.
    return;
  }

  fillAvatar(detailAvatarEl, client, true); // Large avatar for the details view.
  detailNameEl.textContent = client.name;
  detailCompanyEl.textContent = client.company;
  detailEmailEl.textContent = client.email;
  detailPhoneEl.textContent = client.phone;

  // Render status badge with icon & green/red styling
  detailStatusEl.replaceChildren();
  const badge = document.createElement("span");
  badge.className = `status-badge status-${client.status.toLowerCase()}`;

  let iconClass = "fa-circle-dot";
  if (client.status === "Won") iconClass = "fa-circle-check";
  else if (client.status === "Lost") iconClass = "fa-circle-xmark";
  else if (client.status === "Contacted") iconClass = "fa-comments";
  else if (client.status === "Lead") iconClass = "fa-user";

  const detailIcon = document.createElement("i");
  detailIcon.className = `fa-solid ${iconClass}`;
  badge.append(detailIcon, ` ${client.status}`);
  detailStatusEl.appendChild(badge);

  // Render deal value with trophy icon for Won
  detailDealEl.replaceChildren();
  if (client.status === "Won") {
    detailDealEl.className = "client-deal-value deal-won";
    const trophy = document.createElement("i");
    trophy.className = "fa-solid fa-trophy";
    trophy.style.fontSize = "12px";
    trophy.style.marginRight = "4px";
    detailDealEl.append(trophy, formatCurrency(client.dealValue));
  } else if (client.status === "Lost") {
    detailDealEl.className = "client-deal-value deal-lost";
    detailDealEl.textContent = formatCurrency(client.dealValue);
  } else {
    detailDealEl.className = "client-deal-value";
    detailDealEl.textContent = formatCurrency(client.dealValue);
  }

  detailCreatedAtEl.textContent = formatDate(client.createdAt);
  renderNotes(client);
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function renderNotes(client) {
  // Rebuilds the notes list inside the details modal.
  notesListEl.replaceChildren();

  if (!client.notes.length) {
    const empty = document.createElement("p");
    empty.className = "client-email"; // Reuses the muted text style.
    empty.textContent = "No notes yet.";
    notesListEl.appendChild(empty);
    return;
  }

  client.notes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "note-item";
    const text = document.createElement("p");
    text.textContent = note.text;
    const date = document.createElement("time");
    date.textContent = note.date;
    item.append(text, date);
    notesListEl.appendChild(item);
  });
}

function addNote() {
  const noteText = noteInput.value.trim();
  const client = getClientById(selectedClientId);

  // Do nothing if the note is empty or no client is selected.
  if (!noteText || !client) {
    return;
  }

  // unshift adds the new note to the start so the most recent note appears at the top.
  client.notes.unshift({
    text: noteText,
    date: new Date().toLocaleString(),
  });
  saveClients();
  noteInput.value = ""; // Clear the textarea after saving.
  renderNotes(client); // Refresh the notes list in the modal.
  showToast("Note added");
}

// ─── Reminders ────────────────────────────────────────────────────────────────

function setReminder() {
  // Sets a delayed reminder for the currently open client.
  // After REMINDER_DELAY_MS milliseconds a sound plays and a toast appears.
  const client = getClientById(selectedClientId);

  if (!client) {
    return;
  }

  showToast("Reminder set ✓");
  window.setTimeout(() => {
    playReminderSound(); // Plays the audio cue defined in utils.js.
    showToast(`Follow up: ${client.name}`, "success");
  }, REMINDER_DELAY_MS);
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportVisibleClientsToCsv() {
  // Export the current filtered/sorted result, not necessarily every saved client.
  const visibleClients = getVisibleClients();
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Status",
    "Deal Value",
    "Created At",
  ];
  const rows = visibleClients.map((client) => [
    client.name,
    client.email,
    client.phone,
    client.company,
    client.status,
    client.dealValue,
    client.createdAt,
  ]);

  // Join each row's fields with commas; join all rows with newlines.
  // escapeCsvValue wraps values containing commas or quotes in double-quotes.
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  // Create a temporary in-memory file (Blob), attach it to a hidden link, and click it.
  // The browser triggers a download without navigating away from the page.
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "10x-crm-clients.csv";
  link.click();
  URL.revokeObjectURL(downloadUrl); // Release the temporary URL to free memory.
  showToast("CSV exported");
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────

function updateBulkBar() {
  const count = selectedIds.size;
  const visibleClients = getVisibleClients();
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageClients = visibleClients.slice(pageStart, pageStart + PAGE_SIZE);
  const allOnPageSelected = pageClients.length > 0 && pageClients.every((c) => selectedIds.has(c.id));

  bulkBar.classList.toggle("hidden", count === 0);
  bulkCountLabel.textContent = `${count} selected`;
  bulkSelectAllLabel.textContent = allOnPageSelected ? "Deselect All" : "Select All";
}

function toggleSelectAll() {
  const visibleClients = getVisibleClients();
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageClients = visibleClients.slice(pageStart, pageStart + PAGE_SIZE);
  const allSelected = pageClients.every((c) => selectedIds.has(c.id));

  pageClients.forEach((c) => {
    if (allSelected) {
      selectedIds.delete(c.id);
    } else {
      selectedIds.add(c.id);
    }
  });
  renderClients();
}

function clearSelection() {
  selectedIds.clear();
  renderClients();
}

function bulkApplyStatus() {
  const newStatus = bulkStatusSelect.value;
  if (!newStatus) {
    showToast("Please select a status first.", "error");
    return;
  }
  let count = 0;
  selectedIds.forEach((id) => {
    const client = getClientById(id);
    if (client) {
      client.status = newStatus;
      count++;
    }
  });
  if (count === 0) return;
  saveClients();
  bulkStatusSelect.value = "";
  clearSelection();
  showToast(`${count} client(s) moved to ${newStatus}`);
}

function bulkDelete() {
  const count = selectedIds.size;
  if (!count) return;
  if (!window.confirm(`Delete ${count} selected client(s)? This cannot be undone.`)) return;
  clients = clients.filter((c) => !selectedIds.has(c.id));
  saveClients();
  clearSelection();
  showToast(`${count} client(s) deleted`);
}

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────

function handleKeyboardShortcut(event) {
  const isTyping = document.activeElement.matches("input, textarea, select");

  if (event.key === "Escape") {
    closeClientModal();
    closeDetailsModal();
    if (selectedIds.size > 0) clearSelection();
    return;
  }

  if (isTyping) return;

  if (event.key === "/") {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key.toLowerCase() === "n") {
    openAddModal();
  }
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function getClientById(id) {
  // Looks up a client from the main array by ID. Returns undefined if not found.
  return clients.find((client) => client.id === String(id));
}

function showLoadingState() {
  // Replaces the list content with a "Loading…" placeholder while data is fetched.
  clientsListEl.replaceChildren(createEmptyState("Loading clients..."));
  kanbanBoardEl.replaceChildren();
  searchStatusEl.textContent = "";
}

function showLoadError() {
  // Replaces the list content with an error message and a Retry button.
  const error = document.createElement("div");
  error.className = "load-error";
  const message = document.createElement("p");
  message.textContent =
    "Could not load clients. Check your connection and try again.";
  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "btn btn-primary";
  retryButton.textContent = "Retry";
  // forceApi = true bypasses localStorage and goes straight to the API.
  retryButton.addEventListener("click", () => loadClients(true));
  error.append(message, retryButton);
  clientsListEl.replaceChildren(error);
}

function createEmptyState(message) {
  // Creates a centred placeholder element for empty lists and loading states.
  const state = document.createElement("div");
  state.className = "empty-state";
  const text = document.createElement("p");
  text.textContent = message;
  state.appendChild(text);
  return state;
}

function setSearchStatus(message) {
  // Updates the small status line below the search box ("Searching server…", etc.).
  searchStatusEl.textContent = message;
}

// showToast is imported from ./utils.js

phoneInputValidation(clientPhoneInput);
