// Powers the Clients page: display controls, CRUD actions, details, and notes.

// Page state stays in memory so search, filter, and sort remain active.
let clients = [];
// This array is the page's current client data while it is open.
let activeStatus = "All";
let activeSort = "newest";
let selectedClientId = null;
// This stays null until a user opens one client-details modal.
let toastTimeoutId = null;

// Formatting and display helpers.
const clientCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function formatCurrency(value) {
  // Keep bad/missing values from reaching the currency formatter.
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return clientCurrencyFormatter.format(safeValue);
}

function formatClientDate(value) {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(timestamp));
}

function getStatusClass(status) {
  // Return the CSS class that gives this status its color.
  if (status === "Lead") {
    return "status-lead";
  }

  if (status === "Contacted") {
    return "status-contacted";
  }

  if (status === "Won") {
    return "status-won";
  }

  return "status-lost";
}

function getClientInitials(name) {
  const nameParts =
    typeof name === "string"
      ? name.trim().split(/\s+/).filter(Boolean)
      : [];

  if (nameParts.length === 0) {
    return "U";
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1].charAt(0)
      : "";

  return (firstInitial + lastInitial).toUpperCase();
}

function createAvatarFallback(client) {
  // Initials are shown when no usable client image exists.
  const fallback = document.createElement("span");
  fallback.className = "client-avatar-fallback";
  fallback.textContent = getClientInitials(client.name);
  return fallback;
}

function createClientAvatar(client, additionalClass) {
  const avatar = document.createElement("div");
  avatar.className = "client-avatar";

  if (additionalClass) {
    avatar.classList.add(additionalClass);
  }

  if (client.image) {
    // Use the saved photo when available, but replace broken images with initials.
    const image = document.createElement("img");
    image.className = "client-avatar-image";
    image.src = client.image;
    image.alt = `${client.name} avatar`;
    image.addEventListener(
      "error",
      function () {
        avatar.replaceChildren(createAvatarFallback(client));
      },
      { once: true }
    );
    avatar.appendChild(image);
  } else {
    avatar.appendChild(createAvatarFallback(client));
  }

  return avatar;
}

function getClientTimestamp(createdAt) {
  const timestamp = Date.parse(createdAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

// Applies search, status filtering, and sorting without changing the main array.
function getVisibleClients() {
  const searchInput = document.getElementById("client-search");
  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";
  let visibleClients = clients;

  if (activeStatus !== "All") {
    // First narrow the list by the selected status.
    visibleClients = visibleClients.filter(function (client) {
      return client.status === activeStatus;
    });
  }

  if (searchTerm !== "") {
    // Then match the typed text against both name and company.
    visibleClients = visibleClients.filter(function (client) {
      const clientName = client.name.toLowerCase();
      const clientCompany = client.company.toLowerCase();
      return (
        clientName.includes(searchTerm) ||
        clientCompany.includes(searchTerm)
      );
    });
  }

  // Copy before sorting because Array.sort mutates its input array.
  const sortedClients = [...visibleClients];

  if (activeSort === "newest") {
    sortedClients.sort(function (firstClient, secondClient) {
      return (
        getClientTimestamp(secondClient.createdAt) -
        getClientTimestamp(firstClient.createdAt)
      );
    });
  } else if (activeSort === "name") {
    sortedClients.sort(function (firstClient, secondClient) {
      return firstClient.name.localeCompare(secondClient.name);
    });
  } else if (activeSort === "deal-value") {
    sortedClients.sort(function (firstClient, secondClient) {
      return secondClient.dealValue - firstClient.dealValue;
    });
  }

  return sortedClients;
}

function updateClientList() {
  // Re-render using the latest search, filter, and sort choices.
  renderClients(getVisibleClients());
}

// Add Client form validation and field-error helpers.
function clearClientFormErrors() {
  const addClientForm = document.getElementById("add-client-form");

  if (!addClientForm) {
    return;
  }

  const errorElements = addClientForm.querySelectorAll(".field-error");
  const formControls = addClientForm.querySelectorAll(
    "input, select, textarea"
  );

  errorElements.forEach(function (errorElement) {
    errorElement.textContent = "";
  });

  formControls.forEach(function (formControl) {
    formControl.classList.remove("input-error");
  });
}

function showClientFieldError(input, message) {
  if (!input) {
    return;
  }

  const formGroup = input.closest(".form-group");
  const errorElement = formGroup
    ? formGroup.querySelector(".field-error")
    : null;

  input.classList.add("input-error");

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function isValidClientEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateClientForm() {
  clearClientFormErrors();

  const nameInput = document.getElementById("client-name");
  const emailInput = document.getElementById("client-email");
  const phoneInput = document.getElementById("client-phone");
  const companyInput = document.getElementById("client-company");
  const dealValueInput = document.getElementById("client-deal-value");
  const statusInput = document.getElementById("client-status");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const phone = phoneInput.value.trim();
  const company = companyInput.value.trim();
  const dealValueText = dealValueInput.value.trim();
  const dealValue = Number(dealValueText);
  // Inputs give us text, so convert the deal value before checking it.
  const status = statusInput.value.trim();
  let isValid = true;

  if (name.length < 3) {
    showClientFieldError(
      nameInput,
      "Name must be at least 3 characters"
    );
    isValid = false;
  }

  if (!isValidClientEmail(email)) {
    showClientFieldError(
      emailInput,
      "Please enter a valid email address"
    );
    isValid = false;
  } else {
    // some stops at the first match, which is all duplicate detection needs.
    const emailExists = clients.some(function (client) {
      return client.email.toLowerCase() === email;
    });

    if (emailExists) {
      showClientFieldError(
        emailInput,
        "A client with this email already exists"
      );
      isValid = false;
    }
  }

  if (phone !== "" && phone.length < 6) {
    showClientFieldError(phoneInput, "Phone number looks too short");
    isValid = false;
  }

  if (
    dealValueText === "" ||
    !Number.isFinite(dealValue) ||
    dealValue <= 0
  ) {
    showClientFieldError(
      dealValueInput,
      "Deal value must be a positive number"
    );
    isValid = false;
  }

  if (!CLIENT_STATUSES.includes(status)) {
    showClientFieldError(statusInput, "Please select a valid status");
    isValid = false;
  }

  if (!isValid) {
    return {
      isValid: false,
      values: null
    };
  }

  return {
    // Return clean values so later code does not need to read the form again.
    isValid: true,
    values: {
      name: name,
      email: email,
      phone: phone,
      company: company,
      dealValue: dealValue,
      status: status
    }
  };
}

// Creates a safe local ID and the complete client object.
function getUniqueClientId(serverId) {
  const numericServerId = Number(serverId);
  const serverIdIsAvailable =
    Number.isFinite(numericServerId) &&
    !clients.some(function (client) {
      return client.id === numericServerId;
    });

  if (serverIdIsAvailable) {
    return numericServerId;
  }

  // Date.now is a practical local fallback; the loop also handles rare same-ms IDs.
  let fallbackId = Date.now();

  while (
    clients.some(function (client) {
      return client.id === fallbackId;
    })
  ) {
    fallbackId += 1;
  }

  return fallbackId;
}

function createClient(clientValues, serverId) {
  // New local clients use the same object shape as loaded API clients.
  return {
    id: getUniqueClientId(serverId),
    name: clientValues.name,
    email: clientValues.email.toLowerCase(),
    phone: clientValues.phone,
    company: clientValues.company,
    image: "",
    status: clientValues.status,
    dealValue: Number(clientValues.dealValue),
    notes: [],
    createdAt: new Date().toISOString()
  };
}

// Shows one temporary toast and replaces any older toast timer.
function showToast(message, type) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  if (toastTimeoutId !== null) {
    // A new toast replaces the old one's timer as well as its text.
    clearTimeout(toastTimeoutId);
  }

  toast.textContent = message;
  toast.classList.remove("success", "error");
  toast.classList.add(type);
  toast.classList.add("show");

  toastTimeoutId = setTimeout(function () {
    toast.classList.remove("show");
    toastTimeoutId = null;
  }, 3000);
}

// Add Client modal open/close behavior and background scroll control.
function updateBodyModalState() {
  const openModal = document.querySelector(".modal.open");
  document.body.classList.toggle("modal-open", Boolean(openModal));
}

function openAddClientModal() {
  const addClientModal = document.getElementById("add-client-modal");
  const clientNameInput = document.getElementById("client-name");

  if (!addClientModal) {
    return;
  }

  addClientModal.hidden = false;
  // hidden controls visibility; open enables the modal's CSS animation/state.
  addClientModal.classList.add("open");
  updateBodyModalState();

  if (clientNameInput) {
    clientNameInput.focus();
  }
}

function closeAddClientModal() {
  const addClientModal = document.getElementById("add-client-modal");
  const addClientForm = document.getElementById("add-client-form");

  if (!addClientModal) {
    return;
  }

  addClientModal.classList.remove("open");
  addClientModal.hidden = true;

  if (addClientForm) {
    // Reset removes values typed during an unfinished add operation.
    addClientForm.reset();
  }

  clearClientFormErrors();
  updateBodyModalState();
}

// Loading and error states for the initial client collection.
function showClientsLoading() {
  const clientsStatus = document.getElementById("clients-status");

  if (!clientsStatus) {
    return;
  }

  clientsStatus.replaceChildren();
  clientsStatus.className = "status-message loading";
  clientsStatus.textContent = "Loading clients...";
}

function showClientsLoadError() {
  const clientsStatus = document.getElementById("clients-status");

  if (!clientsStatus) {
    return;
  }

  const message = document.createElement("p");
  message.textContent =
    "Could not load clients. Check your connection and try again.";

  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "retry-clients-button";
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", initializeClientsPage);

  clientsStatus.replaceChildren(message, retryButton);
  clientsStatus.className = "status-message error client-load-error";
}

// Builds every client card safely with DOM creation methods.
function renderClients(clientList) {
  const clientsListElement = document.getElementById("clients-list");
  const clientsStatus = document.getElementById("clients-status");

  if (!clientsListElement || !clientsStatus) {
    return;
  }

  clientsListElement.replaceChildren();
  clientsStatus.replaceChildren();
  clientsStatus.className = "";

  if (clientList.length === 0) {
    // Tell the user when search/filter choices find nothing.
    clientsStatus.textContent = "No clients found.";
    clientsStatus.className = "status-message";
    return;
  }

  // Create DOM nodes directly so client-entered text is never parsed as HTML.
  clientList.forEach(function (client) {
    const card = document.createElement("article");
    card.className = "client-card";
    card.dataset.clientId = String(client.id);
    card.tabIndex = 0;
    card.setAttribute(
      "aria-label",
      `Open details for ${client.name}`
    );

    const cardHeader = document.createElement("div");
    cardHeader.className = "client-card-header";

    const cardMain = document.createElement("div");
    cardMain.className = "client-card-main";

    const avatar = createClientAvatar(client, "client-card-avatar");
    const clientIdentity = document.createElement("div");
    clientIdentity.className = "client-card-identity";

    const clientName = document.createElement("h2");
    clientName.className = "client-name";
    clientName.textContent = client.name;

    const clientCompany = document.createElement("p");
    clientCompany.className = "client-company";
    clientCompany.textContent = client.company || "No company";

    clientIdentity.append(clientName, clientCompany);
    cardMain.append(avatar, clientIdentity);

    const statusBadge = document.createElement("span");
    statusBadge.classList.add(
      "status-badge",
      getStatusClass(client.status)
    );
    statusBadge.textContent = client.status;

    cardHeader.append(cardMain, statusBadge);

    const clientDetails = document.createElement("div");
    clientDetails.className = "client-details";

    const clientEmail = document.createElement("p");
    clientEmail.textContent = "Email: " + client.email;

    const clientPhone = document.createElement("p");
    clientPhone.textContent =
      "Phone: " + (client.phone || "Not provided");

    const clientDealValue = document.createElement("p");
    clientDealValue.textContent =
      "Deal value: " + formatCurrency(client.dealValue);

    const clientActions = document.createElement("div");
    clientActions.className = "client-actions";

    const statusSelect = document.createElement("select");
    statusSelect.className = "client-status-select";
    statusSelect.dataset.clientId = client.id;
    statusSelect.setAttribute(
      "aria-label",
      `Change status for ${client.name}`
    );

    CLIENT_STATUSES.forEach(function (status) {
      const statusOption = document.createElement("option");
      statusOption.value = status;
      statusOption.textContent = status;
      statusOption.selected = status === client.status;
      statusSelect.appendChild(statusOption);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-client-button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.clientId = client.id;

    clientActions.append(statusSelect, deleteButton);
    clientDetails.append(
      clientEmail,
      clientPhone,
      clientDealValue
    );
    card.append(cardHeader, clientDetails, clientActions);
    clientsListElement.appendChild(card);
  });
}

// Loads cached/API clients and then renders the current view.
async function initializeClientsPage() {
  if (!hasStoredClients()) {
    showClientsLoading();
  }

  try {
    clients = await loadClients();
    updateClientList();
  } catch (error) {
    // Keep the page usable by showing an error and Retry button.
    showClientsLoadError();
  }
}

// Creates a client through the API, saves it locally, and refreshes the view.
async function submitAddClientForm(event) {
  // Stop the browser from refreshing when the form is submitted.
  event.preventDefault();

  const validation = validateClientForm();

  if (!validation.isValid) {
    // Do not send invalid form values to the API.
    return;
  }

  const addClientForm = document.getElementById("add-client-form");
  const submitButton = addClientForm.querySelector(
    'button[type="submit"]'
  );
  const originalButtonText = submitButton.textContent;
  // Split the full name because the demo API expects first/last names.
  const nameParts = validation.values.name.split(/\s+/);
  const firstName = nameParts.shift() || validation.values.name;
  const lastName = nameParts.join(" ");

  submitButton.disabled = true;
  // Prevent a second click while the API request is running.
  submitButton.textContent = "Adding...";

  try {
    const response = await fetch(DUMMYJSON_ADD_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // JSON turns this JavaScript object into request text for the API.
        firstName: firstName,
        lastName: lastName,
        email: validation.values.email,
        phone: validation.values.phone,
        company: {
          name: validation.values.company
        },
        status: validation.values.status,
        dealValue: validation.values.dealValue
      })
    });

    if (!response.ok) {
      throw new Error("The add client request failed.");
    }

    const responseData = await response.json();
    // The API supplies an ID; createClient builds the rest of the local record.
    const newClient = createClient(
      validation.values,
      responseData.id
    );

    clients.unshift(newClient);
    // unshift adds the new client to the beginning of the list.
    saveClients(clients);
    updateClientList();
    closeAddClientModal();
    showToast("Client added ✓", "success");
  } catch (error) {
    // Keep the form open so the user can correct or retry it.
    showToast("Unable to add client.", "error");
  } finally {
    // finally runs after both success and failure, restoring the button.
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

// Deletes a client after confirmation and keeps localStorage synchronized.
async function deleteClient(clientId, deleteButton) {
  const shouldDelete = window.confirm(
    "Delete this client? This cannot be undone."
  );

  if (!shouldDelete) {
    return;
  }

  const numericClientId = Number(clientId);
  // dataset values are strings, so convert the ID before comparing it.
  const originalButtonText = deleteButton
    ? deleteButton.textContent
    : "Delete";

  if (deleteButton) {
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";
  }

  try {
    const response = await fetch(
      `${DUMMYJSON_USERS_BASE_URL}/${numericClientId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error("The delete client request failed.");
    }

    if (response.ok) {
      // Read a successful demo API response before updating local state.
      await response.json();
    }

    clients = clients.filter(function (client) {
      // Keep every client except the one being deleted.
      return client.id !== numericClientId;
    });
    saveClients(clients);
    updateClientList();
    showToast("Client deleted", "success");
  } catch (error) {
    showToast("Unable to delete client.", "error");

    if (deleteButton) {
      deleteButton.disabled = false;
      deleteButton.textContent = originalButtonText;
    }
  }
}

// Updates status in memory and storage; active filters are preserved.
function updateClientStatus(clientId, newStatus) {
  const numericClientId = Number(clientId);
  const clientToUpdate = clients.find(function (client) {
    return client.id === numericClientId;
  });

  if (!clientToUpdate || !CLIENT_STATUSES.includes(newStatus)) {
    // Do nothing when the card/client is missing or status is invalid.
    return;
  }

  clientToUpdate.status = newStatus;
  // Updating this object also updates the object held inside clients.
  saveClients(clients);
  updateClientList();
  showToast(
    "Client status updated successfully.",
    "success"
  );
}

// Client Details modal rendering helpers.
function createClientDetailRow(label, value) {
  // A definition-list row has a label (dt) and its value (dd).
  const row = document.createElement("div");
  row.className = "client-detail-row";

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  row.append(term, description);
  return row;
}

function renderClientDetails(client) {
  const detailsContent = document.getElementById(
    "client-details-content"
  );

  if (!detailsContent) {
    return;
  }

  const hero = document.createElement("div");
  // The hero groups the avatar, name, and status at the top of the modal.
  hero.className = "client-details-hero";

  const avatar = createClientAvatar(
    client,
    "client-details-avatar"
  );
  const identity = document.createElement("div");
  identity.className = "client-details-identity";

  const name = document.createElement("h3");
  name.textContent = client.name;

  const statusBadge = document.createElement("span");
  statusBadge.classList.add(
    "status-badge",
    getStatusClass(client.status)
  );
  statusBadge.textContent = client.status;

  identity.append(name, statusBadge);
  hero.append(avatar, identity);

  const information = document.createElement("dl");
  // dl is semantic HTML for a list of labels and descriptions.
  information.className = "client-details-grid";
  information.append(
    createClientDetailRow("Email", client.email || "Not provided"),
    createClientDetailRow("Phone", client.phone || "Not provided"),
    createClientDetailRow(
      "Company",
      client.company || "Not provided"
    ),
    createClientDetailRow(
      "Deal value",
      formatCurrency(client.dealValue)
    ),
    createClientDetailRow(
      "Client since",
      formatClientDate(client.createdAt)
    )
  );

  detailsContent.replaceChildren(hero, information);
}

function renderClientNotes(client) {
  const notesList = document.getElementById("client-notes-list");

  if (!notesList) {
    return;
  }

  notesList.replaceChildren();

  if (!Array.isArray(client.notes) || client.notes.length === 0) {
    // Give the empty notes section a helpful message.
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-notes-message";
    emptyMessage.textContent = "No notes yet.";
    notesList.appendChild(emptyMessage);
    return;
  }

  client.notes.forEach(function (note) {
    // Build one small article for each saved note.
    const noteItem = document.createElement("article");
    noteItem.className = "client-note-item";

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const noteDate = document.createElement("time");
    noteDate.className = "client-note-date";
    noteDate.textContent = note.date;

    noteItem.append(noteText, noteDate);
    notesList.appendChild(noteItem);
  });
}

function openClientDetails(clientId) {
  const numericClientId = Number(clientId);
  const client = clients.find(function (clientItem) {
    return clientItem.id === numericClientId;
  });
  const detailsModal = document.getElementById(
    "client-details-modal"
  );
  const closeButton = document.getElementById(
    "close-client-details-modal"
  );

  if (!client || !detailsModal) {
    // A missing client or modal means there is nothing safe to show.
    return;
  }

  selectedClientId = client.id;
  // Remember this ID so the Add Note and Reminder buttons know their client.
  renderClientDetails(client);
  renderClientNotes(client);
  detailsModal.hidden = false;
  detailsModal.classList.add("open");
  updateBodyModalState();

  if (closeButton) {
    closeButton.focus();
  }
}

function closeClientDetailsModal() {
  const detailsModal = document.getElementById(
    "client-details-modal"
  );
  const noteInput = document.getElementById("client-note-input");
  const noteError = document.getElementById("client-note-error");

  if (!detailsModal) {
    return;
  }

  detailsModal.classList.remove("open");
  detailsModal.hidden = true;
  selectedClientId = null;
  // Clear selection so later actions cannot affect a closed modal's client.

  if (noteInput) {
    noteInput.value = "";
  }

  if (noteError) {
    noteError.textContent = "";
  }

  updateBodyModalState();
}

// Notes and one-minute follow-up reminder actions for the selected client.
function addClientNote() {
  const noteInput = document.getElementById("client-note-input");
  const noteError = document.getElementById("client-note-error");
  const client = clients.find(function (clientItem) {
    return clientItem.id === selectedClientId;
  });
  const noteText = noteInput ? noteInput.value.trim() : "";

  if (!client || !noteInput) {
    return;
  }

  if (noteText === "") {
    // Empty notes are not saved as client history.
    if (noteError) {
      noteError.textContent = "Enter a note first.";
    }
    showToast("Enter a note first.", "error");
    return;
  }

  if (!Array.isArray(client.notes)) {
    // Older or malformed client data may not have a notes array yet.
    client.notes = [];
  }

  client.notes.push({
    // Store both the note itself and a readable creation time.
    text: noteText,
    date: new Date().toLocaleString()
  });
  saveClients(clients);
  renderClientNotes(client);
  noteInput.value = "";

  if (noteError) {
    noteError.textContent = "";
  }
}

function setClientReminder() {
  const client = clients.find(function (clientItem) {
    return clientItem.id === selectedClientId;
  });

  if (!client) {
    return;
  }

  const clientName = client.name;
  showToast("Reminder set ✓", "success");

  setTimeout(function () {
    // 60,000 milliseconds equals one minute.
    showToast(`⏰ Follow up: ${clientName}`, "success");
  }, 60000);
}

// Delegated events handle controls created later inside rendered client cards.
function handleClientListClick(event) {
  const clientsListElement = document.getElementById("clients-list");
  const deleteButton = event.target.closest(
    // closest lets clicks on button icons work too.
    ".delete-client-button"
  );

  if (deleteButton && clientsListElement.contains(deleteButton)) {
    deleteClient(deleteButton.dataset.clientId, deleteButton);
    return;
  }

  if (
    event.target.closest(
      // Ignore clicks on card controls so they do not open the details modal.
      "button, select, input, textarea, a, label"
    )
  ) {
    return;
  }

  const card = event.target.closest(".client-card");
  // Clicking the rest of a card opens the same details modal.

  if (card && clientsListElement.contains(card)) {
    openClientDetails(card.dataset.clientId);
  }
}

function handleClientListKeydown(event) {
  if (
    (event.key === "Enter" || event.key === " ") &&
    // Make focusable cards usable with a keyboard as well as a mouse.
    event.target.matches(".client-card")
  ) {
    event.preventDefault();
    openClientDetails(event.target.dataset.clientId);
  }
}

// Connects all Clients-page controls after the HTML is ready.
document.addEventListener("DOMContentLoaded", function () {
  const clientsListElement = document.getElementById("clients-list");
  const searchInput = document.getElementById("client-search");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const sortSelect = document.getElementById("client-sort");
  const addClientButton = document.getElementById(
    "add-client-button"
  );
  const addClientModal = document.getElementById(
    "add-client-modal"
  );
  const closeAddModalButton = document.getElementById(
    "close-add-client-modal"
  );
  const addClientForm = document.getElementById("add-client-form");
  const detailsModal = document.getElementById(
    "client-details-modal"
  );
  const closeDetailsModalButton = document.getElementById(
    "close-client-details-modal"
  );
  const addNoteButton = document.getElementById(
    "add-client-note-button"
  );
  const reminderButton = document.getElementById(
    "client-reminder-button"
  );

  if (!clientsListElement) {
    // This script is shared safely even if the list is not present.
    return;
  }

  clientsListElement.addEventListener(
    "click",
    handleClientListClick
  );
  clientsListElement.addEventListener(
    "keydown",
    handleClientListKeydown
  );
  clientsListElement.addEventListener("change", function (event) {
    if (event.target.matches(".client-status-select")) {
      updateClientStatus(
        event.target.dataset.clientId,
        event.target.value
      );
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateClientList);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Save the clicked filter, then update every chip's visual state.
      activeStatus = button.dataset.status;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");
      updateClientList();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      // The select value matches the sort names used in getVisibleClients.
      activeSort = sortSelect.value;
      updateClientList();
    });
  }

  if (addClientButton) {
    addClientButton.addEventListener(
      "click",
      openAddClientModal
    );
  }

  if (closeAddModalButton) {
    closeAddModalButton.addEventListener(
      "click",
      closeAddClientModal
    );
  }

  if (addClientModal) {
    addClientModal.addEventListener("click", function (event) {
      // A click directly on the backdrop closes the modal; inner clicks do not.
      if (event.target === addClientModal) {
        closeAddClientModal();
      }
    });
  }

  if (addClientForm) {
    addClientForm.addEventListener(
      "submit",
      submitAddClientForm
    );
  }

  if (closeDetailsModalButton) {
    closeDetailsModalButton.addEventListener(
      "click",
      closeClientDetailsModal
    );
  }

  if (detailsModal) {
    detailsModal.addEventListener("click", function (event) {
      if (event.target === detailsModal) {
        closeClientDetailsModal();
      }
    });
  }

  if (addNoteButton) {
    addNoteButton.addEventListener("click", addClientNote);
  }

  if (reminderButton) {
    reminderButton.addEventListener(
      "click",
      setClientReminder
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      // Only Escape is used as the universal modal-close shortcut.
      return;
    }

    if (
      detailsModal &&
      detailsModal.classList.contains("open")
    ) {
      closeClientDetailsModal();
    } else if (
      addClientModal &&
      addClientModal.classList.contains("open")
    ) {
      closeAddClientModal();
    }
  });

  initializeClientsPage();
});
