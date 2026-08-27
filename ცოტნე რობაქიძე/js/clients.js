// Redirect the user to the login page if they are not authenticated
requireAuth();

const clientsGrid = document.getElementById("clientsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const addClientButton = document.getElementById("addClientButton");

const filterButtons = document.querySelectorAll(".filter-chip");

const clientModal = document.getElementById("clientModal");
const addClientForm = document.getElementById("addClientForm");
const closeModalButton = document.getElementById("closeModalButton");
const cancelModalButton = document.getElementById("cancelModalButton");

// Store all clients and the current filter, search, and sorting values
let clients = [];
let activeStatus = "All";
let searchValue = "";
let sortValue = "newest";

function renderClients() {
  // Clear the previous client cards before rendering again
  clientsGrid.innerHTML = "";
  clientsGrid.classList.remove("empty-state");

  // Create a copy so the original clients array is not changed by sorting
  let visibleClients = [...clients];

  // Filter clients by their selected status
  if (activeStatus !== "All") {
    visibleClients = visibleClients.filter(function (client) {
      return client.status === activeStatus;
    });
  }

  // Filter clients by name, company, or email search value
  if (searchValue.length !== 0) {
    visibleClients = visibleClients.filter(function (client) {
      return (
        client.name.toLowerCase().includes(searchValue) ||
        client.company.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue)
      );
    });
  }

  // Sort clients based on the selected sort option
  if (sortValue === "newest") {
    visibleClients.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (sortValue === "name") {
    visibleClients.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortValue === "dealValue") {
    visibleClients.sort(function (a, b) {
      return b.dealValue - a.dealValue;
    });
  }

  // Show an empty-state message if no clients match the filters
  if (visibleClients.length === 0) {
    clientsGrid.textContent = "No clients found";
    clientsGrid.classList.add("empty-state");
    return;
  }

  // Create and display one client card for every visible client
  visibleClients.forEach(function (client) {
    const clientCard = document.createElement("article");
    clientCard.classList.add("client-card");

    const clientHeader = document.createElement("div");
    clientHeader.classList.add("client-header");

    const avatar = document.createElement("img");
    avatar.src = client.image;
    avatar.alt = client.name;
    avatar.classList.add("client-avatar");

    const clientIdentity = document.createElement("div");
    clientIdentity.classList.add("client-identity");

    const clientName = document.createElement("h3");
    clientName.textContent = client.name;

    const clientCompany = document.createElement("p");
    clientCompany.textContent = client.company;

    // Add the client's name and company to the card header
    clientIdentity.append(clientName, clientCompany);
    clientHeader.append(avatar, clientIdentity);

    const clientDetails = document.createElement("div");
    clientDetails.classList.add("client-details");

    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status-badge");
    statusBadge.textContent = client.status;

    const dealValue = document.createElement("p");
    dealValue.classList.add("deal-value");
    dealValue.textContent = `$${client.dealValue.toLocaleString()}`;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    const viewButton = document.createElement("button");
    viewButton.classList.add("view-button");
    viewButton.textContent = "View details";

    // Add client details and buttons to the card
    clientDetails.append(statusBadge, dealValue, viewButton, deleteButton);
    clientCard.append(clientHeader, clientDetails);
    clientsGrid.append(clientCard);

    // Open the details page for this specific client
    viewButton.addEventListener("click", function () {
      window.location.href = `../html/client-details.html?id=${client.id}`;
    });

    // Delete the selected client after confirmation
    deleteButton.addEventListener("click", async function () {
      const isConfirmed = confirm(
        "Are you sure you want to delete this client?",
      );

      if (!isConfirmed) {
        return;
      }

      try {
        // Simulate deleting the client through the API
        const response = await fetch(
          `https://dummyjson.com/users/${client.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Could not delete client");
        }

        // Read the simulated API response
        await response.json();

        // Remove the client from the local CRM array
        clients = clients.filter(function (oneClient) {
          return oneClient.id !== client.id;
        });

        // Save the updated clients array locally
        localStorage.setItem("crm_clients", JSON.stringify(clients));

        renderClients();
      } catch (error) {
        toast.textContent = "Could not delete client. Please try again.";
        toast.classList.remove("hidden");
        setTimeout(function () {
          toast.classList.add("hidden");
        }, 2000);
      }
    });
  });
}

async function initializeClientsPage() {
  // Load clients from localStorage or the API, then display them
  clients = await loadClients();
  renderClients();
}

// Start loading the client page
initializeClientsPage();

// Add a click event to every filter button
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Save the selected status from the button's data-status attribute
    activeStatus = button.dataset.status;

    // Remove the active class from every filter button
    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    // Add the active class to the clicked filter button
    button.classList.add("active");

    // Render clients using the new filter
    renderClients();
  });
});

// Update the search value while the user types
searchInput.addEventListener("input", function () {
  searchValue = searchInput.value.trim().toLowerCase();
  renderClients();
});

// Update the sort value when the selected option changes
sortSelect.addEventListener("change", function () {
  sortValue = sortSelect.value;
  renderClients();
});

// Open the add-client modal
addClientButton.addEventListener("click", () => {
  clientModal.classList.remove("hidden");
});

// Close the modal using the close button
closeModalButton.addEventListener("click", () => {
  clientModal.classList.add("hidden");
});

// Close the modal using the cancel button
cancelModalButton.addEventListener("click", () => {
  clientModal.classList.add("hidden");
});

const clientNameInput = document.getElementById("clientName");
const clientEmailInput = document.getElementById("clientEmail");
const clientPhoneInput = document.getElementById("clientPhone");
const clientCompanyInput = document.getElementById("clientCompany");
const clientDealValueInput = document.getElementById("clientDealValue");
const clientStatusInput = document.getElementById("clientStatus");

const clientNameError = document.getElementById("clientNameError");
const clientEmailError = document.getElementById("clientEmailError");
const clientPhoneError = document.getElementById("clientPhoneError");
const clientDealValueError = document.getElementById("clientDealValueError");

const toast = document.getElementById("toast");

// Handle the add-client form submission
addClientForm.addEventListener("submit", async (event) => {
  // Prevent page refresh
  event.preventDefault();

  // Clear old validation errors
  clientNameError.textContent = "";
  clientEmailError.textContent = "";
  clientPhoneError.textContent = "";
  clientDealValueError.textContent = "";

  // Get and prepare input values
  const clientName = clientNameInput.value.trim();
  const clientEmail = clientEmailInput.value.trim();
  const clientPhone = clientPhoneInput.value.trim();
  const clientCompany = clientCompanyInput.value.trim();
  const clientDealValue = Number(clientDealValueInput.value);
  const clientStatus = clientStatusInput.value;

  let hasError = false;

  // Validate the client name
  if (clientName.length === 0) {
    clientNameError.textContent = "Client name is required";
    hasError = true;
  }

  // Check if the email field is empty
  if (clientEmail.length === 0) {
    clientEmailError.textContent = "Client email is required";
    hasError = true;
  }

  // Deal value must be greater than zero
  if (clientDealValue <= 0) {
    clientDealValueError.textContent = "Deal value must be greater than 0";
    hasError = true;
  }

  // Find the position of @ and a dot after @
  const atIndex = clientEmail.indexOf("@");
  const dotIndex = clientEmail.indexOf(".", atIndex + 1);

  // Check if the email format is valid
  const isEmailValid =
    clientEmail.length > 0 && atIndex !== -1 && dotIndex !== -1;

  // Show an error only when a non-empty email has an invalid format
  if (clientEmail.length > 0 && !isEmailValid) {
    clientEmailError.textContent = "Please enter a valid email address";
    hasError = true;
  }

  // Stop the function if any validation error exists
  if (hasError) {
    return;
  }

  // Create a new client object from the form values
  const newClient = {
    id: Date.now(),
    name: clientName,
    email: clientEmail,
    phone: clientPhone,
    company: clientCompany,
    status: clientStatus,
    dealValue: clientDealValue,
    notes: [],
    createdAt: new Date().toISOString(),

    // Create an avatar image based on the client's name
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}`,
  };

  try {
    // Simulate creating a new user through the API
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: clientName,
        lastName: "",
        email: clientEmail,
        phone: clientPhone,
        company: {
          name: clientCompany,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Could not add client");
    }

    // Read the simulated API response
    await response.json();

    // Save the new CRM client locally
    clients.push(newClient);
    localStorage.setItem("crm_clients", JSON.stringify(clients));

    renderClients();
    addClientForm.reset();
    clientModal.classList.add("hidden");

    toast.textContent = "Client added successfully";
    toast.classList.remove("hidden");

    setTimeout(function () {
      toast.classList.add("hidden");
    }, 2000);
  } catch (error) {
    toast.textContent = "Could not add client. Please try again.";
    toast.classList.remove("hidden");
    setTimeout(function () {
      toast.classList.add("hidden");
    }, 2000);
  }
});
