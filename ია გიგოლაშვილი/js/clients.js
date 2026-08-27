const clientsContainer = document.querySelector("#clientsContainer");
const clientSearchInput = document.querySelector("#clientSearch");
const clientSortSelect = document.querySelector("#clientSort");
const filterChips = document.querySelectorAll(".filter-chip");

// Add Client modal
const addClientModal = document.querySelector("#addClientModal");
const openAddClientModalButton = document.querySelector(
  "#openAddClientModal"
);
const closeAddClientModalButton = document.querySelector(
  "#closeAddClientModal"
);
const addClientForm = document.querySelector("#addClientForm");

// Client Details modal
const clientDetailsModal = document.querySelector(
  "#clientDetailsModal"
);
const closeClientDetailsModalButton = document.querySelector(
  "#closeClientDetailsModal"
);
const clientDetailsInfo = document.querySelector(
  "#clientDetailsInfo"
);
const clientNotesList = document.querySelector(
  "#clientNotesList"
);
const addNoteForm = document.querySelector("#addNoteForm");
const clientNoteInput = document.querySelector(
  "#clientNoteInput"
);
const reminderButton = document.querySelector(
  "#reminderButton"
);

// Main state
let clients = [];
let activeStatus = "All";
let searchTerm = "";
let sortOption = "newest";
let selectedClientId = null;

// Start page
initializeClientsPage();

// Search, filters and sorting
clientSearchInput.addEventListener("input", handleSearch);
clientSortSelect.addEventListener("change", handleSort);

filterChips.forEach((chip) => {
  chip.addEventListener("click", handleFilter);
});

// Client cards
clientsContainer.addEventListener("click", handleClientsClick);

clientsContainer.addEventListener(
  "change",
  handleClientStatusChange
);

// Add Client modal events
openAddClientModalButton.addEventListener(
  "click",
  openAddClientModal
);

closeAddClientModalButton.addEventListener(
  "click",
  closeAddClientModal
);

addClientForm.addEventListener("submit", handleAddClient);

addClientModal.addEventListener("click", (event) => {
  if (event.target === addClientModal) {
    closeAddClientModal();
  }
});

// Client Details modal events
closeClientDetailsModalButton.addEventListener(
  "click",
  closeClientDetailsModal
);

addNoteForm.addEventListener("submit", handleAddNote);

reminderButton.addEventListener(
  "click",
  handleClientReminder
);

clientDetailsModal.addEventListener("click", (event) => {
  if (event.target === clientDetailsModal) {
    closeClientDetailsModal();
  }
});

// Escape closes open modals
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!addClientModal.classList.contains("hidden")) {
    closeAddClientModal();
  }

  if (!clientDetailsModal.classList.contains("hidden")) {
    closeClientDetailsModal();
  }
});

async function initializeClientsPage() {
  try {
    clientsContainer.innerHTML = `
      <p class="loading-message">
        Loading clients...
      </p>
    `;

    clients = await loadClients();

    renderClients(getVisibleClients());
  } catch (error) {
    console.error(error);

    clientsContainer.innerHTML = `
      <div class="error-message">
        <p>
          Could not load clients. Check your connection and try again.
        </p>

        <button id="retryClientsButton" type="button">
          Retry
        </button>
      </div>
    `;

    const retryButton = document.querySelector(
      "#retryClientsButton"
    );

    retryButton.addEventListener(
      "click",
      initializeClientsPage
    );
  }
}

function renderClients(list) {
  clientsContainer.innerHTML = "";

  if (list.length === 0) {
    clientsContainer.innerHTML = `
      <p class="empty-message">
        No clients found.
      </p>
    `;

    return;
  }

  list.forEach((client) => {
    const card = document.createElement("article");

    card.className = "client-card";
    card.dataset.id = client.id;

    card.innerHTML = `
      <div class="client-card-header">
        <img
          src="${client.image}"
          alt="${client.name}"
          class="client-avatar"
        />

        <div>
          <h2>${client.name}</h2>
          <p>${client.company || "No company"}</p>
        </div>
      </div>

      <p class="client-email">${client.email}</p>

      <div class="client-card-footer">
        <select
          class="client-status-select"
          data-id="${client.id}"
          aria-label="Change status for ${client.name}"
        >
          <option
            value="Lead"
            ${client.status === "Lead" ? "selected" : ""}
          >
            Lead
          </option>

          <option
            value="Contacted"
            ${client.status === "Contacted" ? "selected" : ""}
          >
            Contacted
          </option>

          <option
            value="Won"
            ${client.status === "Won" ? "selected" : ""}
          >
            Won
          </option>

          <option
            value="Lost"
            ${client.status === "Lost" ? "selected" : ""}
          >
            Lost
          </option>
        </select>

        <strong>
          $${Number(client.dealValue).toLocaleString()}
        </strong>

        <button
          class="delete-client-button"
          type="button"
          data-id="${client.id}"
        >
          Delete
        </button>
      </div>
    `;

    clientsContainer.appendChild(card);
  });
}

// Search

function handleSearch(event) {
  searchTerm = event.target.value.trim().toLowerCase();

  renderClients(getVisibleClients());
}

// Sort

function handleSort(event) {
  sortOption = event.target.value;

  renderClients(getVisibleClients());
}

// Filter

function handleFilter(event) {
  activeStatus = event.currentTarget.dataset.status;

  filterChips.forEach((chip) => {
    chip.classList.remove("active");
  });

  event.currentTarget.classList.add("active");

  renderClients(getVisibleClients());
}

function getVisibleClients() {
  let visibleClients = [...clients];

  if (activeStatus !== "All") {
    visibleClients = visibleClients.filter((client) => {
      return client.status === activeStatus;
    });
  }

  if (searchTerm !== "") {
    visibleClients = visibleClients.filter((client) => {
      const clientName = client.name.toLowerCase();
      const clientCompany = (
        client.company || ""
      ).toLowerCase();

      return (
        clientName.includes(searchTerm) ||
        clientCompany.includes(searchTerm)
      );
    });
  }

  if (sortOption === "newest") {
    visibleClients.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  if (sortOption === "name") {
    visibleClients.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  if (sortOption === "dealValue") {
    visibleClients.sort((a, b) => {
      return Number(b.dealValue) - Number(a.dealValue);
    });
  }

  return visibleClients;
}

// Status change

function handleClientStatusChange(event) {
  const statusSelect = event.target.closest(
    ".client-status-select"
  );

  if (!statusSelect) {
    return;
  }

  const clientId = Number(statusSelect.dataset.id);
  const newStatus = statusSelect.value;

  const client = clients.find((item) => {
    return item.id === clientId;
  });

  if (!client) {
    return;
  }

  client.status = newStatus;

  saveClients(clients);
  renderClients(getVisibleClients());

  showToast("Client status updated ✓", "success");
}

// Card clicks: Delete or Details

async function handleClientsClick(event) {
  const deleteButton = event.target.closest(
    ".delete-client-button"
  );

  if (deleteButton) {
    const clientId = Number(deleteButton.dataset.id);

    await handleDeleteClient(clientId);
    return;
  }

  // Clicking the status select must not open details
  const statusSelect = event.target.closest(
    ".client-status-select"
  );

  if (statusSelect) {
    return;
  }

  const clientCard = event.target.closest(".client-card");

  if (!clientCard) {
    return;
  }

  const clientId = Number(clientCard.dataset.id);

  openClientDetails(clientId);
}

// Delete Client

async function handleDeleteClient(clientId) {
  const shouldDelete = confirm(
    "Delete this client? This cannot be undone."
  );

  if (!shouldDelete) {
    return;
  }

  try {
    await deleteClientFromApi(clientId);

    clients = clients.filter((client) => {
      return client.id !== clientId;
    });

    saveClients(clients);
    renderClients(getVisibleClients());

    showToast("Client deleted", "success");
  } catch (error) {
    console.error(error);
    showToast("Could not delete client", "error");
  }
}

async function deleteClientFromApi(clientId) {
  const response = await fetch(
    `https://dummyjson.com/users/${clientId}`,
    {
      method: "DELETE"
    }
  );

  // DummyJSON may return 404 for locally added clients
  if (!response.ok && response.status !== 404) {
    throw new Error("Could not delete client");
  }
}

// Add Client modal

function openAddClientModal() {
  clearAddClientErrors();
  addClientModal.classList.remove("hidden");
}

function closeAddClientModal() {
  addClientModal.classList.add("hidden");
  addClientForm.reset();
  clearAddClientErrors();
}

async function handleAddClient(event) {
  event.preventDefault();

  clearAddClientErrors();

  const name = document
    .querySelector("#clientName")
    .value
    .trim();

  const email = document
    .querySelector("#clientEmail")
    .value
    .trim()
    .toLowerCase();

  const phone = document
    .querySelector("#clientPhone")
    .value
    .trim();

  const company = document
    .querySelector("#clientCompany")
    .value
    .trim();

  const dealValueInput = document.querySelector(
    "#clientDealValue"
  ).value;

  const status = document.querySelector(
    "#clientStatus"
  ).value;

  const dealValue = Number(dealValueInput);

  let isValid = true;

  if (name.length < 3) {
    showAddClientError(
      "clientName",
      "clientNameError",
      "Name must be at least 3 characters"
    );

    isValid = false;
  }

  if (!isValidEmail(email)) {
    showAddClientError(
      "clientEmail",
      "clientEmailError",
      "Please enter a valid email address"
    );

    isValid = false;
  } else {
    const emailExists = clients.some((client) => {
      return client.email.toLowerCase() === email;
    });

    if (emailExists) {
      showAddClientError(
        "clientEmail",
        "clientEmailError",
        "A client with this email already exists"
      );

      isValid = false;
    }
  }

  if (phone !== "" && phone.length < 6) {
    showAddClientError(
      "clientPhone",
      "clientPhoneError",
      "Phone number looks too short"
    );

    isValid = false;
  }

  if (
    dealValueInput.trim() === "" ||
    Number.isNaN(dealValue) ||
    dealValue <= 0
  ) {
    showAddClientError(
      "clientDealValue",
      "clientDealValueError",
      "Deal value must be a positive number"
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    const response = await fetch(
      "https://dummyjson.com/users/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: name,
          email,
          phone,
          company,
          dealValue,
          status
        })
      }
    );

    if (!response.ok) {
      throw new Error("Could not add client");
    }

    const apiClient = await response.json();

    /*
      DummyJSON can return the same simulated ID
      for several added users. Date.now() keeps our
      local client IDs unique.
    */
    const newClient = {
      id: Date.now(),
      name,
      email,
      phone,
      company,
      image: `https://robohash.org/${encodeURIComponent(
        email
      )}?size=128x128`,
      status,
      dealValue,
      notes: [],
      createdAt: new Date().toISOString()
    };

    clients.unshift(newClient);

    saveClients(clients);
    renderClients(getVisibleClients());

    closeAddClientModal();

    showToast("Client added ✓", "success");
  } catch (error) {
    console.error(error);
    showToast("Could not add client", "error");
  }
}

function isValidEmail(email) {
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  return atIndex > 0 && dotIndex > atIndex + 1;
}

function showAddClientError(inputId, errorId, message) {
  const input = document.querySelector(`#${inputId}`);
  const errorElement = document.querySelector(`#${errorId}`);

  input.classList.add("input-error");
  errorElement.textContent = message;
}

function clearAddClientErrors() {
  const errorElements = document.querySelectorAll(
    "#addClientForm .field-error"
  );

  const formFields = document.querySelectorAll(
    "#addClientForm input, #addClientForm select"
  );

  errorElements.forEach((element) => {
    element.textContent = "";
  });

  formFields.forEach((field) => {
    field.classList.remove("input-error");
  });
}

// Client Details

function openClientDetails(clientId) {
  const client = clients.find((item) => {
    return item.id === clientId;
  });

  if (!client) {
    return;
  }

  selectedClientId = clientId;

  renderClientDetails(client);
  renderClientNotes(client);

  clientDetailsModal.classList.remove("hidden");
}

function closeClientDetailsModal() {
  selectedClientId = null;
  clientNoteInput.value = "";
  clientDetailsModal.classList.add("hidden");
}

function renderClientDetails(client) {
  clientDetailsInfo.innerHTML = `
    <div class="client-details-header">
      <img
        src="${client.image}"
        alt="${client.name}"
        class="client-details-avatar"
      />

      <div>
        <h2>${client.name}</h2>
        <p>${client.company || "No company"}</p>
      </div>
    </div>

    <div class="client-details-grid">
      <div class="client-detail-item">
        <span>Email</span>
        <strong>${client.email}</strong>
      </div>

      <div class="client-detail-item">
        <span>Phone</span>
        <strong>${client.phone || "Not provided"}</strong>
      </div>

      <div class="client-detail-item">
        <span>Status</span>
        <strong>${client.status}</strong>
      </div>

      <div class="client-detail-item">
        <span>Deal Value</span>
        <strong>
          $${Number(client.dealValue).toLocaleString()}
        </strong>
      </div>

      <div class="client-detail-item">
        <span>Client since</span>
        <strong>
          ${new Date(client.createdAt).toLocaleDateString()}
        </strong>
      </div>
    </div>
  `;
}

// Notes

function renderClientNotes(client) {
  clientNotesList.innerHTML = "";

  if (!Array.isArray(client.notes) || client.notes.length === 0) {
    clientNotesList.innerHTML = `
      <p class="empty-notes-message">
        No notes yet.
      </p>
    `;

    return;
  }

  client.notes.forEach((note) => {
    const noteElement = document.createElement("article");

    noteElement.className = "note-item";

    // textContent is safer than inserting user text in innerHTML
    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const noteDate = document.createElement("time");
    noteDate.textContent = note.date;

    noteElement.append(noteText, noteDate);
    clientNotesList.appendChild(noteElement);
  });
}

function handleAddNote(event) {
  event.preventDefault();

  const noteText = clientNoteInput.value.trim();

  if (noteText === "" || selectedClientId === null) {
    return;
  }

  const client = clients.find((item) => {
    return item.id === selectedClientId;
  });

  if (!client) {
    return;
  }

  if (!Array.isArray(client.notes)) {
    client.notes = [];
  }

  const newNote = {
    text: noteText,
    date: new Date().toLocaleString()
  };

  client.notes.push(newNote);

  saveClients(clients);
  renderClientNotes(client);

  clientNoteInput.value = "";

  showToast("Note added ✓", "success");
}

// Reminder

function handleClientReminder() {
  if (selectedClientId === null) {
    return;
  }

  const client = clients.find((item) => {
    return item.id === selectedClientId;
  });

  if (!client) {
    return;
  }

  const clientName = client.name;

  showToast("Reminder set ✓", "success");

  setTimeout(() => {
    showToast(
      `⏰ Follow up: ${clientName}`,
      "success"
    );
  }, 60000);
}