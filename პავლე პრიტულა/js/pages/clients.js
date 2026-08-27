// Main CRM workflow: client CRUD, filters, details, notes, and reminder creation.
import { requireAuthentication } from "../core/guard.js";
import { createClient, deleteClientFromApi, isLocalClient, loadClients, saveClients, updateClient } from "../core/data.js";
import { addNotification } from "../core/notifications.js";
import { isValidEmail } from "../core/utils.js";
import { formatCurrency, formatDate, t } from "../core/i18n.js";
import { initializeProtectedLayout } from "../ui/navigation.js";
import { showToast } from "../ui/toast.js";

requireAuthentication();
initializeProtectedLayout();

const clientsContent = document.querySelector("#clients-content");
const searchInput = document.querySelector("#client-search");
const filterChips = document.querySelector(".filter-chips");
const sortSelect = document.querySelector("#client-sort");
const clientModal = document.querySelector("#client-modal");
const detailsModal = document.querySelector("#client-details-modal");
const detailsContent = document.querySelector("#client-details-content");
const clientForm = document.querySelector("#client-form");
const clientModalTitle = document.querySelector("#client-modal-title");
const clientFormSubmit = document.querySelector("#client-form-submit");
const clientFields = {
  name: document.querySelector("#client-name"),
  email: document.querySelector("#client-email"),
  phone: document.querySelector("#client-phone"),
  company: document.querySelector("#client-company"),
  dealValue: document.querySelector("#client-deal-value"),
  status: document.querySelector("#client-status")
};
let clientsState = [];
let activeStatus = "All";
let selectedClientId = null;
let editingClientId = null;
let editingNoteId = null;

/** Renders the currently visible client cards and their interactive controls. */
function renderClients(clients) {
  if (clients.length === 0) {
    clientsContent.innerHTML = `<p class="no-results">${t("noClients")}</p>`;
    return;
  }

  clientsContent.innerHTML = `<div class="client-grid">${clients
    .map(
      (client) => `<article class="client-card" data-id="${client.id}">
        <div class="client-card-header">
          ${client.image ? `<img class="client-avatar" src="${client.image}" alt="" />` : `<span class="client-avatar client-avatar-placeholder">${getInitials(client.name)}</span>`}
          <div><h2 class="client-name">${client.name}</h2><p class="client-company">${client.company}</p></div>
        </div>
        <p class="client-email">${client.email}</p>
        <div class="client-meta"><select class="status-badge status-select status-${client.status.toLowerCase()}" data-id="${client.id}" aria-label="Status for ${client.name}">${renderStatusOptions(client.status)}</select><span class="deal-value">${formatCurrency(client.dealValue)}</span></div>
        <div class="client-actions"><button class="button button-secondary client-action-button view-client-button" type="button" data-id="${client.id}" aria-label="${t("view")}" title="${t("view")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg><span class="visually-hidden">${t("view")}</span></button><button class="button button-secondary client-action-button edit-client-button" type="button" data-id="${client.id}" aria-label="${t("edit")}" title="${t("edit")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" /></svg><span class="visually-hidden">${t("edit")}</span></button><button class="button button-danger client-action-button delete-client-button" type="button" data-id="${client.id}" aria-label="${t("delete")}" title="${t("delete")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m-9 0 1 13h10l1-13" /></svg><span class="visually-hidden">${t("delete")}</span></button></div>
      </article>`
    )
    .join("")}</div>`;
}

/** Creates translated status options while keeping stable English values in storage. */
function renderStatusOptions(selectedStatus) {
  return ["Lead", "Contacted", "Won", "Lost"]
    .map((status) => `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${t(status.toLowerCase())}</option>`)
    .join("");
}

/** Applies active status, search text, and sort mode without mutating saved client state. */
function getVisibleClients() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleClients = [...clientsState];

  if (activeStatus !== "All") {
    visibleClients = visibleClients.filter((client) => client.status === activeStatus);
  }

  if (searchTerm) {
    visibleClients = visibleClients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm) || client.company.toLowerCase().includes(searchTerm)
    );
  }

  if (sortSelect.value === "name") {
    visibleClients.sort((first, second) => first.name.localeCompare(second.name));
  } else if (sortSelect.value === "deal") {
    visibleClients.sort((first, second) => second.dealValue - first.dealValue);
  } else {
    visibleClients.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
  }

  return visibleClients;
}

clientsContent.addEventListener("click", async (event) => {
  const editButton = event.target.closest(".edit-client-button");
  const viewButton = event.target.closest(".view-client-button");
  const deleteButton = event.target.closest(".delete-client-button");

  if (viewButton) {
    openClientDetails(Number(viewButton.dataset.id));
    return;
  }

  if (editButton) {
    openClientModal(Number(editButton.dataset.id));
    return;
  }

  if (!deleteButton) {
    const card = event.target.closest(".client-card");
    const interactiveElement = event.target.closest("button, select");
    if (card && !interactiveElement) openClientDetails(Number(card.dataset.id));
    return;
  }

  const clientId = Number(deleteButton.dataset.id);
  const clientToDelete = getClientById(clientId);
  const confirmed = window.confirm(t("deleteConfirm"));
  if (!confirmed) return;

  try {
    if (!isLocalClient(clientToDelete)) await deleteClientFromApi(clientId);
    clientsState = clientsState.filter((client) => client.id !== clientId);
    saveClients(clientsState);
    renderClients(getVisibleClients());
    showToast(t("clientDeleted"));
  } catch (error) {
    console.error("Unable to delete client", error);
    showToast(t("clientActionError"), "error");
  }
});

/** Finds one client in the local state by its stable numeric ID. */
function getClientById(clientId) {
  return clientsState.find((client) => client.id === clientId);
}

/** Builds the details modal, including notes and reminder controls for the selected client. */
function renderClientDetails() {
  const client = getClientById(selectedClientId);
  if (!client) return;

  const notes = client.notes
    .map((note, index) => `<article class="note-item"><div><p>${note.text}</p><time>${note.updatedAt ? `${t("edit")} ${note.updatedAt}` : note.date}</time></div><div class="note-actions"><button class="note-edit-button" type="button" data-note-index="${index}">${t("edit")}</button><button class="note-delete-button" type="button" data-note-index="${index}">${t("delete")}</button></div></article>`)
    .join("");

  detailsContent.innerHTML = `
    <div class="details-client-header">${client.image ? `<img class="client-avatar" src="${client.image}" alt="" />` : `<span class="client-avatar client-avatar-placeholder">${getInitials(client.name)}</span>`}<div><h3>${client.name}</h3><p class="client-company">${client.company || t("independent")}</p><span class="status-badge status-${client.status.toLowerCase()}">${t(client.status.toLowerCase())}</span></div></div>
    <ul class="detail-list">
      <li><strong>${t("company")}</strong>${client.company || t("notSpecified")}</li>
      <li><strong>${t("emailLabel")}</strong>${client.email}</li>
      <li><strong>${t("phoneLabel")}</strong>${client.phone || t("notSpecified")}</li>
      <li><strong>${t("dealValue")}</strong>${formatCurrency(client.dealValue)}</li>
      <li><strong>${t("clientSince")}</strong>${formatDate(client.createdAt)}</li>
    </ul>
    <div class="notes-panel">
      <h3>${t("notes")}</h3>
      <div class="notes-list">${notes || `<p>${t("noNotes")}</p>`}</div>
      <form class="note-form" id="note-form"><label class="visually-hidden" for="note-text">${t("addNote")}</label><input id="note-text" type="text" placeholder="${t("addNote")}" /><button class="button button-primary" id="note-submit-button" type="submit">${t("addNote")}</button><button class="button button-secondary" id="cancel-note-edit" type="button" hidden>${t("cancel")}</button></form>
      <button class="button" id="reminder-button" type="button">${t("remind")}</button>
    </div>`;

  document.querySelector("#note-form").addEventListener("submit", addNote);
  document.querySelector(".notes-list").addEventListener("click", startNoteEdit);
  document.querySelector("#cancel-note-edit").addEventListener("click", cancelNoteEdit);
  document.querySelector("#reminder-button").addEventListener("click", setReminder);
}

/** Selects a client and opens its details modal. */
function openClientDetails(clientId) {
  selectedClientId = clientId;
  editingNoteId = null;
  renderClientDetails();
  detailsModal.hidden = false;
}

/** Hides client details and clears transient note-edit state. */
function closeClientDetails() {
  detailsModal.hidden = true;
  selectedClientId = null;
  editingNoteId = null;
}

/** Adds a note or saves the note currently being edited. */
function addNote(event) {
  event.preventDefault();
  const input = document.querySelector("#note-text");
  const text = input.value.trim();
  const client = getClientById(selectedClientId);

  if (!text || !client) return;

  if (editingNoteId) {
    client.notes = client.notes.map((note) => note.id === editingNoteId ? { ...note, text, updatedAt: new Date().toLocaleString() } : note);
  } else {
    client.notes.push({ id: crypto.randomUUID(), text, date: new Date().toLocaleString() });
  }
  saveClients(clientsState);
  editingNoteId = null;
  renderClientDetails();
}

/** Loads the selected note into the form and switches the form into edit mode. */
function startNoteEdit(event) {
  const deleteButton = event.target.closest(".note-delete-button");
  if (deleteButton) {
    deleteNote(Number(deleteButton.dataset.noteIndex));
    return;
  }

  const button = event.target.closest(".note-edit-button");
  if (!button) return;

  const client = getClientById(selectedClientId);
  const note = client?.notes[Number(button.dataset.noteIndex)];
  if (!note) return;

  if (!note.id) {
    note.id = crypto.randomUUID();
    saveClients(clientsState);
  }

  editingNoteId = note.id;
  document.querySelector("#note-text").value = note.text;
  document.querySelector("#note-submit-button").textContent = t("saveNote");
  document.querySelector("#cancel-note-edit").hidden = false;
  document.querySelector("#note-text").focus();
}

/** Deletes one note after confirmation and redraws the still-open details modal. */
function deleteNote(noteIndex) {
  const client = getClientById(selectedClientId);
  if (!client || !client.notes[noteIndex] || !window.confirm(t("deleteNoteConfirm"))) return;

  client.notes.splice(noteIndex, 1);
  saveClients(clientsState);
  editingNoteId = null;
  renderClientDetails();
  showToast(t("noteDeleted"));
}

/** Resets note-edit state without changing the saved client data. */
function cancelNoteEdit() {
  editingNoteId = null;
  document.querySelector("#note-form").reset();
  document.querySelector("#note-submit-button").textContent = t("addNote");
  document.querySelector("#cancel-note-edit").hidden = true;
}

/** Creates a persistent one-minute follow-up reminder for the selected client. */
function setReminder() {
  const client = getClientById(selectedClientId);
  if (!client) return;

  const notification = {
    clientId: client.id,
    clientName: client.name,
    clientEmail: client.email,
    clientCompany: client.company || t("independent"),
    message: `Follow up with ${client.name}`,
    createdAt: new Date().toISOString(),
    scheduledFor: new Date(Date.now() + 60000).toISOString(),
    status: "Pending"
  };
  addNotification(notification);
  showToast(`${t("reminderScheduled")}: ${client.name} · ${client.company || t("independent")}`);
}

clientsContent.addEventListener("change", (event) => {
  const statusSelect = event.target.closest(".status-select");
  if (!statusSelect) return;

  const client = clientsState.find((item) => item.id === Number(statusSelect.dataset.id));
  if (!client) return;

  client.status = statusSelect.value;
  saveClients(clientsState);
  ["lead", "contacted", "won", "lost"].forEach((status) => statusSelect.classList.remove(`status-${status}`));
  statusSelect.classList.add(`status-${client.status.toLowerCase()}`);
});

/** Creates initials used when a client record does not include an image. */
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Shows a retryable client-loading error when the initial API request fails. */
function renderError() {
  clientsContent.innerHTML = `<div class="error-state">
    <p>${t("loadClientsError")}</p>
    <button class="button button-primary" id="retry-button" type="button">${t("retry")}</button>
  </div>`;
  document.querySelector("#retry-button").addEventListener("click", initializeClients);
}

/** Loads client state, renders it, and optionally opens a client linked from Notifications. */
async function initializeClients() {
  clientsContent.innerHTML = `<p class="loading-state">${t("loadingClients")}</p>`;

  try {
    const clients = await loadClients();
    clientsState = clients;
    renderClients(getVisibleClients());
    const clientId = Number(new URLSearchParams(window.location.search).get("clientId"));
    if (clientId && getClientById(clientId)) {
      openClientDetails(clientId);
      const url = new URL(window.location.href);
      url.searchParams.delete("clientId");
      window.history.replaceState({}, "", url);
    }
  } catch (error) {
    console.error("Unable to load clients", error);
    renderError();
  }
}

initializeClients();

searchInput.addEventListener("input", () => renderClients(getVisibleClients()));
sortSelect.addEventListener("change", () => renderClients(getVisibleClients()));
filterChips.addEventListener("click", (event) => {
  const chip = event.target.closest(".filter-chip");
  if (!chip) return;

  activeStatus = chip.dataset.status;
  document.querySelectorAll(".filter-chip").forEach((item) => item.classList.toggle("active", item === chip));
  renderClients(getVisibleClients());
});

/** Opens the shared client form in create mode or with existing values in edit mode. */
function openClientModal(clientId = null) {
  const client = clientId ? getClientById(clientId) : null;
  editingClientId = client?.id || null;
  clientModalTitle.textContent = client ? t("edit") : t("addClientTitle");
  clientFormSubmit.textContent = client ? t("saveChanges") : t("addClientTitle");

  if (client) {
    clientFields.name.value = client.name;
    clientFields.email.value = client.email;
    clientFields.phone.value = client.phone;
    clientFields.company.value = client.company;
    clientFields.dealValue.value = client.dealValue;
    clientFields.status.value = client.status;
  }

  clientModal.hidden = false;
  clientFields.name.focus();
}

/** Closes and resets the client form so the next open starts from a clean state. */
function closeClientModal() {
  clientModal.hidden = true;
  clientForm.reset();
  editingClientId = null;
  clientModalTitle.textContent = t("addClientTitle");
  clientFormSubmit.textContent = t("addClientTitle");
  Object.keys(clientFields).forEach((fieldName) => setFieldError(fieldName));
}

/** Updates validation UI and ARIA attributes for one client-form field. */
function setFieldError(fieldName, message = "") {
  const field = clientFields[fieldName];
  const error = document.querySelector(`#${field.id}-error`);
  field.classList.toggle("input-error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

/** Returns all client-form errors before an API or local-storage change is attempted. */
function validateClient(values) {
  const errors = {};

  if (values.name.length < 3) errors.name = "Name must be at least 3 characters";
  if (!isValidEmail(values.email)) {
    errors.email = t("validEmailRule");
  } else if (clientsState.some((client) => client.id !== editingClientId && client.email.toLowerCase() === values.email)) {
    errors.email = t("clientExists");
  }
  if (values.phone && values.phone.length < 6) errors.phone = t("phoneShort");
  if (!Number.isFinite(values.dealValue) || values.dealValue <= 0) errors.dealValue = t("dealPositive");

  return errors;
}

document.querySelector("#add-client-button").addEventListener("click", openClientModal);
document.querySelector("#close-client-modal").addEventListener("click", closeClientModal);
document.querySelector("#close-details-modal").addEventListener("click", closeClientDetails);
clientModal.addEventListener("click", (event) => {
  if (event.target === clientModal) closeClientModal();
});
detailsModal.addEventListener("click", (event) => {
  if (event.target === detailsModal) closeClientDetails();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!clientModal.hidden) closeClientModal();
  if (!detailsModal.hidden) closeClientDetails();
});

clientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = {
    name: clientFields.name.value.trim(),
    email: clientFields.email.value.trim().toLowerCase(),
    phone: clientFields.phone.value.trim(),
    company: clientFields.company.value.trim(),
    dealValue: Number(clientFields.dealValue.value),
    status: clientFields.status.value
  };
  const errors = validateClient(values);

  Object.keys(clientFields).forEach((fieldName) => setFieldError(fieldName, errors[fieldName]));
  if (Object.keys(errors).length > 0) return;

  try {
    if (editingClientId) {
      const existingClient = getClientById(editingClientId);
      const updatedClient = { ...existingClient, ...values, id: editingClientId };
      if (!isLocalClient(existingClient)) await updateClient(updatedClient);
      clientsState = clientsState.map((client) => client.id === editingClientId ? updatedClient : client);
      saveClients(clientsState);
      renderClients(getVisibleClients());
      closeClientModal();
      showToast(t("clientUpdated"));
      return;
    }

    await createClient(values);
    const newClient = {
      ...values,
      id: Date.now(),
      image: "",
      notes: [],
      source: "local",
      createdAt: new Date().toISOString()
    };

    clientsState.unshift(newClient);
    saveClients(clientsState);
    renderClients(getVisibleClients());
    closeClientModal();
    showToast(t("clientAdded"));
  } catch (error) {
    console.error("Unable to save client", error);
    showToast(t("clientActionError"), "error");
  }
});
