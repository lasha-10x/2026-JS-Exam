const clientsList = document.querySelector("#clients-list");
const clientsEmptyMessage = document.querySelector("#clients-empty-message");
const clientsLoadState = document.querySelector("#clients-load-state");
const clientsPagination = document.querySelector("#clients-pagination");
const paginationSummary = document.querySelector("#pagination-summary");
const paginationPages = document.querySelector("#pagination-pages");
const previousPageButton = document.querySelector("#previous-page-button");
const nextPageButton = document.querySelector("#next-page-button");
const clientSearchInput = document.getElementById("client-search");
const statusFilterButtons = document.querySelectorAll(
  ".status-filter-button"
);
const sortClientsSelect = document.getElementById("sort-clients");
const addClientButton = document.getElementById("add-client-button");
const addClientModal = document.getElementById("add-client-modal");
const closeClientModalButton = document.getElementById("close-client-modal");
const cancelAddClientButton = document.getElementById("cancel-add-client");
const addClientForm = document.getElementById("add-client-form");
const newClientNameInput = document.getElementById("new-client-name");
const newClientEmailInput = document.getElementById("new-client-email");
const newClientPhoneInput = document.getElementById("new-client-phone");
const newClientCompanyInput = document.getElementById("new-client-company");
const newClientStatusInput = document.getElementById("new-client-status");
const newClientDealValueInput = document.getElementById(
  "new-client-deal-value"
);
const newClientNameError = document.getElementById("new-client-name-error");
const newClientEmailError = document.getElementById("new-client-email-error");
const newClientPhoneError = document.getElementById("new-client-phone-error");
const newClientStatusError = document.getElementById(
  "new-client-status-error"
);
const newClientDealValueError = document.getElementById(
  "new-client-deal-value-error"
);
const validClientStatuses = ["Lead", "Contacted", "Won", "Lost"];
const clients = [];
const clientsPerPage = 10;
let clientsReady = false;
let selectedStatus = "all";
let currentClientPage = 1;

// This page array is the working state; localStorage remains the persistent copy.
function updateStatusSelectStyle(selectElement, status) {
  selectElement.classList.remove(
    "status-select-lead",
    "status-select-contacted",
    "status-select-won",
    "status-select-lost"
  );
  selectElement.classList.add(`status-select-${status.toLowerCase()}`);
}

function showClientsLoading() {
  clientsReady = false;
  clientsList.textContent = "";
  clientsList.classList.add("hidden");
  clientsEmptyMessage.classList.remove("visible");
  clientsPagination.classList.add("hidden");
  clientsLoadState.textContent = "";
  clientsLoadState.classList.remove("hidden");
  addClientButton.disabled = true;

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading clients...";
  clientsLoadState.appendChild(loadingMessage);
}

// Loading and error states replace the list so stale clients are not visible.
function showClientsError() {
  clientsReady = false;
  clients.length = 0;
  clientsList.textContent = "";
  clientsList.classList.add("hidden");
  clientsEmptyMessage.classList.remove("visible");
  clientsPagination.classList.add("hidden");
  clientsLoadState.textContent = "";
  clientsLoadState.classList.remove("hidden");
  addClientButton.disabled = true;

  const errorMessage = document.createElement("p");
  const retryButton = document.createElement("button");

  errorMessage.textContent =
    "Could not load clients. Check your connection and try again.";
  retryButton.type = "button";
  retryButton.id = "retry-clients-button";
  retryButton.classList.add("btn", "btn-primary");
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", function () {
    loadClientsPage(true);
  });

  clientsLoadState.appendChild(errorMessage);
  clientsLoadState.appendChild(retryButton);
}

async function loadClientsPage(forceFreshRequest) {
  showClientsLoading();

  try {
    const loadedClients = forceFreshRequest
      ? await fetchClientsFromApi()
      : await loadClients();

    clients.length = 0;

    loadedClients.forEach(function (client) {
      clients.push(client);
    });

    clientsReady = true;
    clientsLoadState.textContent = "";
    clientsLoadState.classList.add("hidden");
    addClientButton.disabled = false;
    applyClientFilters();
  } catch (error) {
    console.error("Could not load clients:", error);
    showClientsError();
  }
}

// The modal helpers reset both form values and validation feedback.
function clearAddClientErrors() {
  const formFields = addClientForm.querySelectorAll(
    ".form-input, .form-select"
  );
  const errorMessages = addClientForm.querySelectorAll(".error-message");

  formFields.forEach(function (field) {
    field.classList.remove("input-error");
  });

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });
}

function showAddClientError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function openAddClientModal() {
  addClientForm.reset();
  clearAddClientErrors();
  updateStatusSelectStyle(newClientStatusInput, newClientStatusInput.value);
  addClientModal.classList.remove("hidden");
  newClientNameInput.focus();
}

function closeAddClientModal() {
  addClientModal.classList.add("hidden");
  addClientForm.reset();
  clearAddClientErrors();
}

function validateAddClientForm() {
  let isValid = true;
  const name = newClientNameInput.value.trim();
  const email = newClientEmailInput.value.trim().toLowerCase();
  const phone = newClientPhoneInput.value.trim();
  const status = newClientStatusInput.value;
  const dealValueText = newClientDealValueInput.value.trim();

  if (name.length < 3) {
    showAddClientError(
      newClientNameInput,
      newClientNameError,
      "Name must be at least 3 characters"
    );
    isValid = false;
  }

  const atPosition = email.indexOf("@");
  const dotAfterAt = email.indexOf(".", atPosition + 1);

  if (email === "" || atPosition === -1 || dotAfterAt === -1) {
    showAddClientError(
      newClientEmailInput,
      newClientEmailError,
      "Please enter a valid email address"
    );
    isValid = false;
  }

  if (phone !== "" && phone.length < 6) {
    showAddClientError(
      newClientPhoneInput,
      newClientPhoneError,
      "Phone number looks too short"
    );
    isValid = false;
  }

  if (!validClientStatuses.includes(status)) {
    showAddClientError(
      newClientStatusInput,
      newClientStatusError,
      "Please select a valid status"
    );
    isValid = false;
  }

  const dealValue = Number(dealValueText);

  if (
    dealValueText !== "" &&
    (Number.isNaN(dealValue) || dealValue < 0)
  ) {
    showAddClientError(
      newClientDealValueInput,
      newClientDealValueError,
      "Deal value must be 0 or greater"
    );
    isValid = false;
  }

  return isValid;
}

function getClientInitials(name) {
  const nameParts = (name || "").trim().split(" ").filter(function (part) {
    return part !== "";
  });
  const initials = nameParts.slice(0, 2).map(function (part) {
    return part.charAt(0);
  }).join("");

  return initials.toUpperCase() || "?";
}

function openClientDetails(clientId) {
  window.location.href = `client-details.html?id=${clientId}`;
}

function updateClientStatus(clientId, status) {
  if (!validClientStatuses.includes(status)) {
    return;
  }

  const client = clients.find(function (savedClient) {
    return Number(savedClient.id) === Number(clientId);
  });

  if (!client) {
    showMessage("Client not found.", "error");
    return;
  }

  client.status = status;
  saveClientsForCurrentUser(clients);
  applyClientFilters();
}

// Rendering rebuilds the visible cards and attaches actions to each client.
function renderClients(visibleClients) {
  clientsList.textContent = "";

  if (visibleClients.length === 0) {
    clientsList.classList.add("hidden");
    clientsEmptyMessage.classList.add("visible");
    return;
  }

  clientsList.classList.remove("hidden");
  clientsEmptyMessage.classList.remove("visible");

  visibleClients.forEach(function (client) {
    const clientCard = document.createElement("article");
    const avatar = client.image
      ? document.createElement("img")
      : document.createElement("div");
    const clientInformation = document.createElement("div");
    const clientName = document.createElement("h2");
    const clientCompany = document.createElement("p");
    const clientEmail = document.createElement("p");
    const dealValue = document.createElement("p");
    const statusWrapper = document.createElement("div");
    const statusLabel = document.createElement("label");
    const statusSelect = document.createElement("select");
    const actionsWrapper = document.createElement("div");
    const viewButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const numericDealValue = Number(client.dealValue) || 0;

    clientCard.classList.add("card", "client-card");
    clientCard.dataset.clientId = client.id;

    avatar.classList.add("client-avatar");

    if (client.image) {
      avatar.src = client.image;
      avatar.alt = `${client.name || "Client"} avatar`;
      avatar.loading = "lazy";
    } else {
      avatar.textContent = getClientInitials(client.name);
    }

    clientInformation.classList.add("client-card-information");
    clientName.classList.add("client-card-name");
    clientCompany.classList.add("client-card-company", "text-muted");
    clientEmail.classList.add("client-card-email", "text-muted");
    dealValue.classList.add("client-deal-value");
    clientName.textContent = client.name || "Unnamed Client";
    clientCompany.textContent = client.company || "—";
    clientEmail.textContent = client.email || "—";
    dealValue.textContent = `$${numericDealValue.toLocaleString()}`;

    clientInformation.appendChild(clientName);
    clientInformation.appendChild(clientCompany);
    clientInformation.appendChild(clientEmail);
    clientInformation.appendChild(dealValue);

    statusWrapper.classList.add("client-status-control");
    statusLabel.classList.add("form-label");
    statusLabel.textContent = "Status";
    statusLabel.htmlFor = `client-status-${client.id}`;

    statusSelect.classList.add("form-select", "status-select");
    updateStatusSelectStyle(statusSelect, client.status || "Lead");
    statusSelect.id = `client-status-${client.id}`;
    statusSelect.setAttribute(
      "aria-label",
      `Status for ${client.name || "client"}`
    );

    validClientStatuses.forEach(function (status) {
      const statusOption = document.createElement("option");

      statusOption.value = status;
      statusOption.textContent = status;
      statusOption.selected = client.status === status;
      statusSelect.appendChild(statusOption);
    });

    statusWrapper.appendChild(statusLabel);
    statusWrapper.appendChild(statusSelect);

    viewButton.type = "button";
    viewButton.classList.add("btn", "btn-secondary");
    viewButton.textContent = "View";

    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-danger", "delete-client-button");
    deleteButton.textContent = "Delete";
    deleteButton.dataset.clientId = client.id;

    actionsWrapper.classList.add("client-card-actions");
    actionsWrapper.appendChild(viewButton);
    actionsWrapper.appendChild(deleteButton);

    clientCard.appendChild(avatar);
    clientCard.appendChild(clientInformation);
    clientCard.appendChild(statusWrapper);
    clientCard.appendChild(actionsWrapper);
    clientsList.appendChild(clientCard);

    clientCard.addEventListener("click", function () {
      openClientDetails(client.id);
    });

    viewButton.addEventListener("click", function (event) {
      event.stopPropagation();
      openClientDetails(client.id);
    });

    statusSelect.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    statusSelect.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });

    statusWrapper.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    statusWrapper.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });

    statusSelect.addEventListener("change", function (event) {
      event.stopPropagation();
      updateClientStatus(client.id, statusSelect.value);
    });

    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteClientFromList(client.id);
    });
  });
}

async function deleteClientFromList(clientId) {
  const clientExists = clients.some(function (client) {
    return Number(client.id) === Number(clientId);
  });

  if (!clientExists) {
    showMessage("Client not found.", "error");
    return;
  }

  const shouldDelete = confirm("Delete this client? This cannot be undone.");

  if (!shouldDelete) {
    return;
  }

  try {
    await deleteClientFromApi(clientId);

    const updatedClients = clients.filter(function (client) {
      return Number(client.id) !== Number(clientId);
    });

    clients.length = 0;

    updatedClients.forEach(function (client) {
      clients.push(client);
    });

    saveClientsForCurrentUser(clients);
    applyClientFilters();
    showMessage("Client deleted", "success");
  } catch (error) {
    console.error("Could not delete client:", error);
    showMessage("Could not delete client. Try again.", "error");
  }
}

// Search, status, and sorting are combined without changing the original array.
function getVisibleClients() {
  const searchText = clientSearchInput.value.trim().toLowerCase();
  const selectedSort = sortClientsSelect.value;
  const filteredClients = clients.filter(function (client) {
    const name = (client.name || "").toLowerCase();
    const company = (client.company || "").toLowerCase();
    const matchesSearch =
      name.includes(searchText) || company.includes(searchText);
    const matchesStatus =
      selectedStatus === "all" || client.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients];

  if (selectedSort === "newest" || selectedSort === "oldest") {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstDate = new Date(firstClient.createdAt).getTime() || 0;
      const secondDate = new Date(secondClient.createdAt).getTime() || 0;

      if (selectedSort === "newest") {
        return secondDate - firstDate;
      }

      return firstDate - secondDate;
    });
  } else if (
    selectedSort === "name-asc" ||
    selectedSort === "name-desc"
  ) {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstName = firstClient.name || "";
      const secondName = secondClient.name || "";

      if (selectedSort === "name-asc") {
        return firstName.localeCompare(secondName);
      }

      return secondName.localeCompare(firstName);
    });
  } else if (
    selectedSort === "deal-desc" ||
    selectedSort === "deal-asc"
  ) {
    sortedClients.sort(function (firstClient, secondClient) {
      const firstDealValue = Number(firstClient.dealValue) || 0;
      const secondDealValue = Number(secondClient.dealValue) || 0;

      if (selectedSort === "deal-desc") {
        return secondDealValue - firstDealValue;
      }

      return firstDealValue - secondDealValue;
    });
  }

  return sortedClients;
}

// Pagination renders only ten clients while keeping filters applied to the full list.
function renderPagination(totalClients) {
  paginationPages.textContent = "";

  if (totalClients === 0) {
    clientsPagination.classList.add("hidden");
    return;
  }

  const totalPages = Math.ceil(totalClients / clientsPerPage);
  const firstVisibleClient = (currentClientPage - 1) * clientsPerPage + 1;
  const lastVisibleClient = Math.min(
    currentClientPage * clientsPerPage,
    totalClients
  );

  clientsPagination.classList.remove("hidden");
  paginationSummary.textContent =
    `Showing ${firstVisibleClient}–${lastVisibleClient} of ${totalClients}`;
  previousPageButton.disabled = currentClientPage === 1;
  nextPageButton.disabled = currentClientPage === totalPages;

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const pageButton = document.createElement("button");

    pageButton.type = "button";
    pageButton.classList.add("pagination-page-button");
    pageButton.textContent = pageNumber;
    pageButton.setAttribute("aria-label", `Go to page ${pageNumber}`);

    if (pageNumber === currentClientPage) {
      pageButton.classList.add("active");
      pageButton.setAttribute("aria-current", "page");
    }

    pageButton.addEventListener("click", function () {
      currentClientPage = pageNumber;
      applyClientFilters();
    });

    paginationPages.appendChild(pageButton);
  }
}

function applyClientFilters() {
  if (!clientsReady) {
    return;
  }

  const visibleClients = getVisibleClients();
  const totalPages = Math.max(
    1,
    Math.ceil(visibleClients.length / clientsPerPage)
  );

  if (currentClientPage > totalPages) {
    currentClientPage = totalPages;
  }

  const firstClientIndex = (currentClientPage - 1) * clientsPerPage;
  const clientsForCurrentPage = visibleClients.slice(
    firstClientIndex,
    firstClientIndex + clientsPerPage
  );

  renderClients(clientsForCurrentPage);
  renderPagination(visibleClients.length);
}

function resetPaginationAndApplyFilters() {
  currentClientPage = 1;
  applyClientFilters();
}

if (clientSearchInput && sortClientsSelect) {
  clientSearchInput.addEventListener("input", resetPaginationAndApplyFilters);
  sortClientsSelect.addEventListener("change", resetPaginationAndApplyFilters);
}

newClientStatusInput.addEventListener("change", function () {
  updateStatusSelectStyle(newClientStatusInput, newClientStatusInput.value);
});

statusFilterButtons.forEach(function (filterButton) {
  filterButton.addEventListener("click", function () {
    selectedStatus = filterButton.dataset.status;

    statusFilterButtons.forEach(function (button) {
      const isActive = button === filterButton;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    resetPaginationAndApplyFilters();
  });
});

previousPageButton.addEventListener("click", function () {
  if (currentClientPage > 1) {
    currentClientPage -= 1;
    applyClientFilters();
  }
});

nextPageButton.addEventListener("click", function () {
  const totalPages = Math.ceil(getVisibleClients().length / clientsPerPage);

  if (currentClientPage < totalPages) {
    currentClientPage += 1;
    applyClientFilters();
  }
});

addClientButton.addEventListener("click", openAddClientModal);
closeClientModalButton.addEventListener("click", closeAddClientModal);
cancelAddClientButton.addEventListener("click", closeAddClientModal);

// A valid client is posted to DummyJSON, then saved locally for persistence.
addClientForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearAddClientErrors();

  if (!validateAddClientForm()) {
    return;
  }

  const currentClients = getStoredClients() || [];
  const email = newClientEmailInput.value.trim().toLowerCase();
  const emailExists = currentClients.some(function (client) {
    const savedEmail = (client.email || "").trim().toLowerCase();

    return savedEmail === email;
  });

  if (emailExists) {
    showAddClientError(
      newClientEmailInput,
      newClientEmailError,
      "A client with this email already exists"
    );
    return;
  }

  const clientData = {
    name: newClientNameInput.value.trim(),
    email: newClientEmailInput.value.trim().toLowerCase(),
    phone: newClientPhoneInput.value.trim(),
    company: newClientCompanyInput.value.trim(),
    status: newClientStatusInput.value,
    dealValue: newClientDealValueInput.value.trim() === ""
      ? 0
      : Number(newClientDealValueInput.value),
  };

  try {
    const apiClient = await createClientInApi(clientData);
    const apiClientId = Number(apiClient.id);
    const apiIdAlreadyExists = currentClients.some(function (client) {
      return Number(client.id) === apiClientId;
    });
    const clientId =
      apiClientId > 0 && !apiIdAlreadyExists
        ? apiClientId
        : Date.now();
    const newClient = {
      id: clientId,
      ownerId: getCurrentClientOwnerId(),
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      image: "",
      status: clientData.status,
      dealValue: clientData.dealValue,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    clients.length = 0;

    currentClients.forEach(function (client) {
      clients.push(client);
    });

    clients.unshift(newClient);
    saveClientsForCurrentUser(clients);

    closeAddClientModal();
    currentClientPage = 1;
    applyClientFilters();
    showMessage("Client added ✓", "success");
  } catch (error) {
    console.error("Could not add client:", error);
    showMessage("Could not add client. Try again.", "error");
  }
});

loadClientsPage(false);
