const clientDetailsContent = document.querySelector("#client-details-content");
const clientNotFoundMessage = document.querySelector("#client-not-found");
const clientAvatarElement = document.querySelector("#client-avatar");
const clientAvatarFallback = document.querySelector("#client-avatar-fallback");
const clientNameElement = document.querySelector("#client-name");
const clientEmailElement = document.querySelector("#client-email");
const clientPhoneElement = document.querySelector("#client-phone");
const clientCompanyElement = document.querySelector("#client-company");
const clientStatusElement = document.querySelector("#client-status");
const clientDealValueElement = document.querySelector("#client-deal-value");
const clientCreatedElement = document.querySelector("#client-created");
const editClientButton = document.querySelector("#edit-client-button");
const reminderButton = document.querySelector("#reminder-button");
const reminderStatus = document.querySelector("#reminder-status");
const deleteClientButton = document.querySelector("#delete-client-button");
const editClientForm = document.querySelector("#edit-client-form");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const editClientNameInput = document.querySelector("#edit-client-name");
const editClientEmailInput = document.querySelector("#edit-client-email");
const editClientCompanyInput = document.querySelector("#edit-client-company");
const editClientStatusInput = document.querySelector("#edit-client-status");
const editClientDealValueInput = document.querySelector(
  "#edit-client-deal-value",
);
const addNoteForm = document.querySelector("#add-note-form");
const noteTextInput = document.querySelector("#note-text");
const noteError = document.querySelector("#note-error");
const notesList = document.querySelector("#notes-list");
const notesEmptyMessage = document.querySelector("#notes-empty-message");
const validStatuses = ["Lead", "Contacted", "Won", "Lost"];

// The query-string id connects a client card to its details page.
function getClientIdFromUrl() {
  const urlParameters = new URLSearchParams(window.location.search);

  return urlParameters.get("id");
}

function getClients() {
  return getStoredClients() || [];
}

function getClientById() {
  const clientId = Number(getClientIdFromUrl());
  const clients = getClients();

  return clients.find(function (client) {
    return Number(client.id) === clientId;
  });
}

function getClientInitials(name) {
  const nameParts = (name || "")
    .trim()
    .split(" ")
    .filter(function (part) {
      return part !== "";
    });
  const initials = nameParts
    .slice(0, 2)
    .map(function (part) {
      return part.charAt(0);
    })
    .join("");

  return initials.toUpperCase() || "?";
}

function getStatusClass(status) {
  if (status === "Contacted") {
    return "status-contacted";
  }

  if (status === "Won") {
    return "status-won";
  }

  if (status === "Lost") {
    return "status-lost";
  }

  return "status-lead";
}

function updateEditStatusStyle() {
  editClientStatusInput.classList.remove(
    "status-select-lead",
    "status-select-contacted",
    "status-select-won",
    "status-select-lost",
  );
  editClientStatusInput.classList.add(
    `status-select-${editClientStatusInput.value.toLowerCase()}`,
  );
}

function displayClientAvatar(client) {
  clientAvatarFallback.textContent = getClientInitials(client.name);

  if (client.image) {
    clientAvatarElement.src = client.image;
    clientAvatarElement.alt = `${client.name || "Client"} avatar`;
    clientAvatarElement.classList.remove("hidden");
    clientAvatarFallback.classList.add("hidden");
  } else {
    clientAvatarElement.removeAttribute("src");
    clientAvatarElement.alt = "";
    clientAvatarElement.classList.add("hidden");
    clientAvatarFallback.classList.remove("hidden");
  }
}

function populateEditForm(client) {
  editClientNameInput.value = client.name || "";
  editClientEmailInput.value = client.email || "";
  editClientCompanyInput.value = client.company || "";
  editClientStatusInput.value = client.status || "";
  updateEditStatusStyle();

  if (client.dealValue === undefined || client.dealValue === null) {
    editClientDealValueInput.value = "";
  } else {
    editClientDealValueInput.value = client.dealValue;
  }
}

function clearEditErrors() {
  const errorMessages = editClientForm.querySelectorAll(".error-message");
  const formFields = editClientForm.querySelectorAll(
    ".form-input, .form-select",
  );

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });

  formFields.forEach(function (field) {
    field.classList.remove("input-error");
  });
}

function showEditError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function validateEditForm() {
  let isValid = true;
  const name = editClientNameInput.value.trim();
  const email = editClientEmailInput.value.trim().toLowerCase();
  const status = editClientStatusInput.value;
  const dealValueText = editClientDealValueInput.value.trim();
  const nameError =
    editClientNameInput.parentElement.querySelector(".error-message");
  const emailError =
    editClientEmailInput.parentElement.querySelector(".error-message");
  const statusError =
    editClientStatusInput.parentElement.querySelector(".error-message");
  const dealValueError =
    editClientDealValueInput.parentElement.querySelector(".error-message");

  if (name === "") {
    showEditError(editClientNameInput, nameError, "Name is required.");
    isValid = false;
  } else if (name.length < 3) {
    showEditError(
      editClientNameInput,
      nameError,
      "Name must be at least 3 characters.",
    );
    isValid = false;
  }

  if (email === "") {
    showEditError(editClientEmailInput, emailError, "Email is required.");
    isValid = false;
  } else {
    const atPosition = email.indexOf("@");
    const dotAfterAt = email.indexOf(".", atPosition + 1);

    if (atPosition === -1 || dotAfterAt === -1) {
      showEditError(
        editClientEmailInput,
        emailError,
        "Please enter a valid email address.",
      );
      isValid = false;
    }
  }

  if (status === "") {
    showEditError(editClientStatusInput, statusError, "Status is required.");
    isValid = false;
  } else if (!validStatuses.includes(status)) {
    showEditError(
      editClientStatusInput,
      statusError,
      "Please select a valid status.",
    );
    isValid = false;
  }

  if (dealValueText !== "") {
    const dealValue = Number(dealValueText);

    if (Number.isNaN(dealValue)) {
      showEditError(
        editClientDealValueInput,
        dealValueError,
        "Deal value must be a number.",
      );
      isValid = false;
    } else if (dealValue < 0) {
      showEditError(
        editClientDealValueInput,
        dealValueError,
        "Deal value cannot be negative.",
      );
      isValid = false;
    }
  }

  return isValid;
}

// Notes are created with textContent so saved user text is treated as text.
function renderNotes(notes) {
  notesList.textContent = "";

  if (notes.length === 0) {
    notesList.classList.add("hidden");
    notesEmptyMessage.classList.add("visible");
    return;
  }

  notesList.classList.remove("hidden");
  notesEmptyMessage.classList.remove("visible");

  notes.forEach(function (note) {
    const noteCard = document.createElement("article");
    const noteText = document.createElement("p");
    const noteDate = document.createElement("p");

    noteCard.classList.add("note-card");
    noteText.classList.add("note-text");
    noteDate.classList.add("note-date", "text-muted");

    noteText.textContent = note.text;

    if (note.date) {
      noteDate.textContent = note.date;
    } else if (note.createdAt) {
      noteDate.textContent = new Date(note.createdAt).toLocaleString();
    } else {
      noteDate.textContent = "Date unavailable";
    }

    noteCard.appendChild(noteText);
    noteCard.appendChild(noteDate);
    notesList.appendChild(noteCard);
  });
}

function displayClientDetails() {
  const client = getClientById();

  if (!client) {
    clientDetailsContent.classList.add("hidden");
    editClientForm.classList.add("hidden");
    clientNotFoundMessage.classList.add("visible");
    return;
  }

  clientDetailsContent.classList.remove("hidden");
  editClientForm.classList.add("hidden");
  clientNotFoundMessage.classList.remove("visible");
  displayClientAvatar(client);
  clientNameElement.textContent = client.name || "Unnamed Client";
  clientEmailElement.textContent = client.email || "—";
  clientPhoneElement.textContent = client.phone || "—";
  clientCompanyElement.textContent = client.company || "—";
  clientStatusElement.className = "status-badge";
  clientStatusElement.classList.add(getStatusClass(client.status));
  clientStatusElement.textContent = client.status || "Lead";
  clientDealValueElement.textContent = `$${(Number(client.dealValue) || 0).toLocaleString()}`;

  const createdDate = new Date(client.createdAt);

  clientCreatedElement.textContent = Number.isNaN(createdDate.getTime())
    ? "—"
    : createdDate.toLocaleDateString();

  const notes = Array.isArray(client.notes) ? client.notes : [];
  renderNotes(notes);
}

// The reminder uses an in-memory timer, so this page must remain open.
function setClientReminder() {
  const client = getClientById();

  if (!client) {
    showMessage("Client not found.", "error");
    return;
  }

  const clientName = client.name;
  const reminderTime = new Date(Date.now() + 60000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  showMessage("Reminder set ✓", "success");
  reminderStatus.textContent = `Reminder scheduled for ${reminderTime}. Keep this page open.`;

  setTimeout(function () {
    showMessage(`⏰ Follow up: ${clientName}`, "success", 5000);
    reminderStatus.textContent = `Reminder delivered for ${clientName}.`;
  }, 60000);
}

async function deleteClient() {
  const clients = getClients();
  const clientId = getClientIdFromUrl();
  const updatedClients = clients.filter(function (client) {
    return Number(client.id) !== Number(clientId);
  });

  if (updatedClients.length === clients.length) {
    displayClientDetails();
    return;
  }

  const shouldDelete = confirm("Delete this client? This cannot be undone.");

  if (!shouldDelete) {
    return;
  }

  try {
    await deleteClientFromApi(clientId);
    saveClientsForCurrentUser(updatedClients);
    showMessage("Client deleted", "success");

    setTimeout(function () {
      window.location.href = "clients.html";
    }, 1500);
  } catch (error) {
    console.error("Could not delete client:", error);
    showMessage("Could not delete client. Try again.", "error");
  }
}

editClientButton.addEventListener("click", function () {
  const client = getClientById();

  if (!client) {
    displayClientDetails();
    return;
  }

  clearEditErrors();
  populateEditForm(client);
  clientDetailsContent.classList.add("hidden");
  editClientForm.classList.remove("hidden");
});

cancelEditButton.addEventListener("click", function () {
  clearEditErrors();
  displayClientDetails();
});

deleteClientButton.addEventListener("click", deleteClient);
reminderButton.addEventListener("click", setClientReminder);
editClientStatusInput.addEventListener("change", updateEditStatusStyle);

// Notes are stored inside only the selected client object.
addNoteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const noteText = noteTextInput.value.trim();

  noteError.textContent = "";
  noteTextInput.classList.remove("input-error");

  if (noteText.length < 2) {
    noteError.textContent = "Note must be at least 2 characters";
    noteTextInput.classList.add("input-error");
    return;
  }

  if (noteText.length > 500) {
    noteError.textContent = "Note must not exceed 500 characters";
    noteTextInput.classList.add("input-error");
    return;
  }

  const clients = getClients();
  const clientId = Number(getClientIdFromUrl());
  const clientIndex = clients.findIndex(function (client) {
    return Number(client.id) === clientId;
  });

  if (clientIndex === -1) {
    displayClientDetails();
    return;
  }

  if (!Array.isArray(clients[clientIndex].notes)) {
    clients[clientIndex].notes = [];
  }

  const newNote = {
    text: noteTextInput.value.trim(),
    date: new Date().toLocaleString(),
  };

  clients[clientIndex].notes.push(newNote);
  saveClientsForCurrentUser(clients);

  noteTextInput.value = "";
  noteError.textContent = "";
  noteTextInput.classList.remove("input-error");
  renderNotes(clients[clientIndex].notes);
  showMessage("Note added successfully!", "success");
});

// Editing finds one array position and leaves the client's id and notes unchanged.
editClientForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearEditErrors();

  if (!validateEditForm()) {
    return;
  }

  const clients = getClients();
  const clientId = Number(getClientIdFromUrl());
  const clientIndex = clients.findIndex(function (client) {
    return Number(client.id) === clientId;
  });

  if (clientIndex === -1) {
    displayClientDetails();
    return;
  }

  const dealValueText = editClientDealValueInput.value.trim();
  const editedEmail = editClientEmailInput.value.trim().toLowerCase();
  const emailAlreadyExists = clients.some(function (client) {
    return (
      Number(client.id) !== clientId &&
      (client.email || "").trim().toLowerCase() === editedEmail
    );
  });

  if (emailAlreadyExists) {
    const emailError =
      editClientEmailInput.parentElement.querySelector(".error-message");

    showEditError(
      editClientEmailInput,
      emailError,
      "A client with this email already exists.",
    );
    return;
  }

  clients[clientIndex].name = editClientNameInput.value.trim();
  clients[clientIndex].email = editedEmail;
  clients[clientIndex].company = editClientCompanyInput.value.trim();
  clients[clientIndex].status = editClientStatusInput.value;
  clients[clientIndex].dealValue =
    dealValueText === "" ? "" : Number(dealValueText);

  saveClientsForCurrentUser(clients);

  displayClientDetails();
  showMessage("Client updated successfully!", "success");
});

displayClientDetails();

clientAvatarElement.addEventListener("error", function () {
  clientAvatarElement.classList.add("hidden");
  clientAvatarFallback.classList.remove("hidden");
});
