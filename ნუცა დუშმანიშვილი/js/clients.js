/* Clients page */

let clients = [];
let selectedClientId = null;

let selectedStatus = "All";

// Starts the Clients page after the HTML is ready
document.addEventListener(
    "DOMContentLoaded",
    initializeClientsPage
);

// Selects a status chip and refreshes the client list
function handleStatusFilterClick(event) {
    const selectedChip =
        event.target.closest("[data-status]");

    if (selectedChip === null) {
        return;
    }

    selectedStatus = selectedChip.dataset.status;

    const allChips =
        document.querySelectorAll(".filter-chip");

    allChips.forEach(function (chip) {
        chip.classList.toggle(
            "active",
            chip === selectedChip
        );
    });

    refreshVisibleClients();
}

// Displays the Add Client modal
function openClientModal() {
    const modal =
        document.getElementById("clientModal");

    modal.classList.remove("hidden");

    document.getElementById("clientName").focus();
}

// Hides the Add Client modal
function closeClientModal() {
    const modal =
        document.getElementById("clientModal");

    modal.classList.add("hidden");
}

// Removes all previous Add Client form errors
function clearClientFormErrors() {
    const errorElements =
        document.querySelectorAll(
            "#clientForm .form-error"
        );

    const inputElements =
        document.querySelectorAll(
            "#clientForm input"
        );

    errorElements.forEach(function (errorElement) {
        errorElement.textContent = "";
    });

    inputElements.forEach(function (inputElement) {
        inputElement.classList.remove("input-error");
    });
}

// Displays an error for one Add Client field
function showClientFormError(
    input,
    errorId,
    message
) {
    input.classList.add("input-error");

    document.getElementById(errorId)
        .textContent = message;
}

// Checks the client email format
function clientEmailIsValid(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

// Checks whether another client uses the email
function clientEmailAlreadyExists(email) {
    const normalizedEmail =
        email.trim().toLowerCase();

    return clients.some(function (client) {
        return String(client.email)
            .toLowerCase() === normalizedEmail;
    });
}

// Validates all Add Client form fields
function validateClientForm() {
    clearClientFormErrors();

    const nameInput = document.getElementById("clientName");

    const emailInput = document.getElementById("clientEmail");

    const phoneInput = document.getElementById("clientPhone");

    const companyInput = document.getElementById("clientCompany");

    const dealValueInput = document.getElementById("clientDealValue");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    const phone = phoneInput.value.trim();
    const company = companyInput.value.trim();
    const dealValue = Number(dealValueInput.value);

    let formIsValid = true;

    if (name.length < 3) {
        showClientFormError(
            nameInput,
            "clientNameError",
            "Name must be at least 3 characters"
        );

        formIsValid = false;
    }

    if (!clientEmailIsValid(email)) {
        showClientFormError(
            emailInput,
            "clientEmailError",
            "Please enter a valid email address"
        );

        formIsValid = false;
    } else if (clientEmailAlreadyExists(email)) {
        showClientFormError(
            emailInput,
            "clientEmailError",
            "A client with this email already exists"
        );

        formIsValid = false;
    }

    const phoneDigits =
        phone.replace(/\D/g, "");

    if (phone !== "" && phoneDigits.length < 7) {
        showClientFormError(
            phoneInput,
            "clientPhoneError",
            "Phone number looks too short"
        );

        formIsValid = false;
    }

    if (company === "") {
        showClientFormError(
            companyInput,
            "clientCompanyError",
            "Company is required"
        );

        formIsValid = false;
    }

    if (dealValue <= 0) {
        showClientFormError(
            dealValueInput,
            "clientDealValueError",
            "Deal value must be a positive number"
        );

        formIsValid = false;
    }

    return formIsValid;
}

// Displays a temporary notification message
function showClientToast(message, type) {
    const toastContainer =
        document.getElementById("toastContainer");

    const toast =
        document.createElement("div");

    toast.className =
        "toast toast-" + type;

    toast.textContent = message;

    toast.setAttribute(
        "role",
        "status"
    );

    toastContainer.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3000);
}

// Creates a client after the Add Client form is submitted
async function handleClientFormSubmit(event) {
    event.preventDefault();

    const formIsValid =
        validateClientForm();

    if (!formIsValid) {
        return;
    }

    const form = event.currentTarget;

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    const clientData = {
        name: document
            .getElementById("clientName")
            .value.trim(),

        email: document
            .getElementById("clientEmail")
            .value.trim()
            .toLowerCase(),

        phone: document
            .getElementById("clientPhone")
            .value.trim(),

        company: document
            .getElementById("clientCompany")
            .value.trim(),

        dealValue: Number(
            document
                .getElementById("clientDealValue")
                .value
        ),

        status: document
            .getElementById("clientStatus")
            .value
    };

    submitButton.disabled = true;

    try {
        const apiClient =
            await createClientOnApi(clientData);

        const newClient = {
            id: apiClient.id || Date.now(),
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            company: clientData.company,
            image: "",
            status: clientData.status,
            dealValue: clientData.dealValue,
            notes: [],
            createdAt: new Date().toISOString()
        };

        clients.unshift(newClient);

        saveClients(clients);

        form.reset();
        closeClientModal();
        refreshVisibleClients();

        showClientToast(
            "Client added ✓",
            "success"
        );
    } catch (error) {
        showClientToast(
            error.message,
            "error"
        );
    } finally {
        submitButton.disabled = false;
    }
}
function handleDeleteClient(client) {
    const deletionWasConfirmed = window.confirm(
        "Delete this client? This cannot be undone."
    );

    if (!deletionWasConfirmed) {
        return;
    }

    clients = clients.filter(function (savedClient) {
        return savedClient.id !== client.id;
    });

    saveClients(clients);
    refreshVisibleClients();

    showClientToast(
        "Client deleted",
        "success"
    );
}

// Displays all notes saved for one client
function renderClientNotes(client) {
    const notesList =
        document.getElementById("clientNotesList");

    notesList.replaceChildren();

    if (client.notes.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className = "empty-state";
        emptyMessage.textContent =
            "No notes yet.";

        notesList.appendChild(emptyMessage);

        return;
    }

    client.notes.forEach(function (note) {
        const noteElement =
            document.createElement("article");

        noteElement.className = "client-note";

        const noteText =
            document.createElement("p");

        noteText.textContent = note.text;

        const noteDate =
            document.createElement("time");

        noteDate.textContent = note.date;

        noteElement.append(
            noteText,
            noteDate
        );

        notesList.appendChild(noteElement);
    });
}

// Displays one client's complete information
function openClientDetails(client) {
    selectedClientId = client.id;

    document.getElementById(
        "detailsAvatar"
    ).textContent = getClientInitials(client.name);

    document.getElementById(
        "detailsName"
    ).textContent = client.name;

    document.getElementById(
        "detailsCompany"
    ).textContent = client.company || "No company";

    document.getElementById(
        "detailsPhone"
    ).textContent = client.phone || "—";

    document.getElementById(
        "detailsEmail"
    ).textContent = client.email;

    document.getElementById(
        "detailsStatus"
    ).value = client.status;

    document.getElementById(
        "detailsDealValue"
    ).textContent = formatDealValue(client.dealValue);

    document.getElementById(
        "detailsCreatedAt"
    ).textContent =
        new Date(
            client.createdAt
        ).toLocaleDateString();

    renderClientNotes(client);

    document.getElementById(
        "clientDetailsModal"
    ).classList.remove("hidden");
}

// Saves a new status for the selected client
function handleClientStatusChange(event) {
    const selectedClient = clients.find(function (client) {
        return client.id === selectedClientId;
    });

    if (selectedClient === undefined) {
        return;
    }

    selectedClient.status = event.target.value;

    saveClients(clients);
    refreshVisibleClients();

    showClientToast(
        "Client status updated",
        "success"
    );
}

// Closes the client details modal
function closeClientDetails() {
    document.getElementById(
        "clientDetailsModal"
    ).classList.add("hidden");

    selectedClientId = null;
}

// Adds a timestamped note to the selected client
function handleClientNoteSubmit(event) {
    event.preventDefault();

    const noteInput =
        document.getElementById("clientNoteInput");

    const noteText =
        noteInput.value.trim();

    if (noteText === "") {
        return;
    }

    const selectedClient =
        clients.find(function (client) {
            return client.id === selectedClientId;
        });

    if (selectedClient === undefined) {
        return;
    }

    const newNote = {
        text: noteText,
        date: new Date().toLocaleString()
    };

    selectedClient.notes.push(newNote);

    saveClients(clients);
    renderClientNotes(selectedClient);

    noteInput.value = "";

    showClientToast(
        "Note added",
        "success"
    );
}

// Closes a modal when its dark backdrop is clicked
function handleModalBackdropClick(event) {
    if (event.target.id === "clientModal") {
        closeClientModal();
    }

    if (event.target.id === "clientDetailsModal") {
        closeClientDetails();
    }
}

// Closes the currently open modal with the Escape key
function handleModalEscapeKey(event) {
    if (event.key !== "Escape") {
        return;
    }

    const clientModal =
        document.getElementById("clientModal");

    const detailsModal =
        document.getElementById(
            "clientDetailsModal"
        );

    if (!clientModal.classList.contains("hidden")) {
        closeClientModal();
    }

    if (!detailsModal.classList.contains("hidden")) {
        closeClientDetails();
    }
}


// Loads the client collection for the current browser
async function initializeClientsPage() {
    const clientForm =document.getElementById("clientForm");

    clientForm.addEventListener("submit", handleClientFormSubmit);

    const clientNoteForm = document.getElementById("clientNoteForm");

    clientNoteForm.addEventListener(  "submit", handleClientNoteSubmit);
    
    const addClientButton = document.getElementById("addClientButton");

    const closeModalButton = document.getElementById("closeModalButton");

    addClientButton.addEventListener("click", openClientModal);

    closeModalButton.addEventListener( "click", closeClientModal);

    const searchInput = document.getElementById("clientSearch");

    searchInput.addEventListener( "input", refreshVisibleClients);

    const sortSelect = document.getElementById("clientSort");

    sortSelect.addEventListener("change",refreshVisibleClients);

    const filterChips = document.getElementById("filterChips");

    filterChips.addEventListener("click", handleStatusFilterClick);

    const closeDetailsButton = document.getElementById("closeDetailsButton");

    closeDetailsButton.addEventListener("click",closeClientDetails);
    const detailsStatus = document.getElementById("detailsStatus");

    detailsStatus.addEventListener(
        "change",
        handleClientStatusChange
    );

    const clientModal = document.getElementById("clientModal");

    const detailsModal =
        document.getElementById(
            "clientDetailsModal"
        );

    clientModal.addEventListener("click", handleModalBackdropClick );

    detailsModal.addEventListener( "click", handleModalBackdropClick);

    document.addEventListener("keydown", handleModalEscapeKey);

    if (hasStoredClients()) {
    clients = getClients();
    renderClients(clients);
    return;
}

    try {
        clients = await loadClients();
        renderClients(clients);
    } catch (error) {
        console.error(error);
    }
}

// Formats a number as US dollar currency
function formatDealValue(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(value);
}

// Creates initials such as "Emily Johnson" -> "EJ"
function getClientInitials(name) {
    return name
        .split(" ")
        .filter(function (part) {
            return part !== "";
        })
        .slice(0, 2)
        .map(function (part) {
            return part.charAt(0).toUpperCase();
        })
        .join("");
}

// Creates one client card
function createClientCard(client) {
    const card = document.createElement("article");
    card.className = "client-card";
    card.dataset.id = client.id;

    const avatar = document.createElement("div");
    avatar.className = "avatar client-avatar";
    avatar.textContent = getClientInitials(client.name);

    const name = document.createElement("h2");
    name.className = "client-name";
    name.textContent = client.name;

    const company = document.createElement("p");
    company.className = "client-company";
    company.textContent =
        client.company || "No company";

    const email = document.createElement("a");
    email.className = "client-email";
    email.href = "mailto:" + client.email;
    email.textContent = client.email;

    const status = document.createElement("span");
    status.className =
        "badge badge-" + client.status.toLowerCase();
    status.textContent = client.status;

    const dealValue = document.createElement("strong");
    dealValue.className = "client-deal-value";
    dealValue.textContent = formatDealValue(client.dealValue);

    const detailsButton = document.createElement("button");

    detailsButton.type = "button";
    detailsButton.className ="btn btn-secondary view-client-details";

    detailsButton.textContent = "View details";

    detailsButton.addEventListener(
        "click",
        function () {
            openClientDetails(client);
        }
    );

    const deleteButton =
    document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger delete-client";

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click",
        function () {
            handleDeleteClient(client);
        }
    );

    card.append(
        avatar,
        name,
        company,
        email,
        status,
        dealValue,
        detailsButton,
        deleteButton
    );

    return card;
}

// Displays a supplied client array
function renderClients(clientList) {
    const container = document.getElementById("clientsContainer");

    container.replaceChildren();

    if (clientList.length === 0) {
    const emptyState = document.createElement("div");

    emptyState.className = "clients-state";

    const title = document.createElement("h2");

    title.textContent = "No clients found.";

    const message = document.createElement("p");

    message.textContent = "Try changing your search or filter.";

    emptyState.append(title, message);
    container.appendChild(emptyState);

    return;
}

    clientList.forEach(function (client) {
        const card = createClientCard(client);

        container.appendChild(card);
    });
}

// Returns clients matching the current controls
function getVisibleClients() {
    const searchInput =
        document.getElementById("clientSearch");

    const sortSelect =
        document.getElementById("clientSort");

    const searchText =
        searchInput.value.trim().toLowerCase();

    const visibleClients =
        clients.filter(function (client) {
            const searchableValues = [
                client.name,
                client.email,
                client.phone,
                client.company
            ];

            const matchesSearch =
                searchableValues.some(function (value) {
                    return String(value)
                        .toLowerCase()
                        .includes(searchText);
                });

            const matchesStatus =
                selectedStatus === "All" ||
                client.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

    if (sortSelect.value === "name") {
        visibleClients.sort(function (first, second) {
            return first.name.localeCompare(second.name);
        });
    }

    if (sortSelect.value === "deal-value") {
        visibleClients.sort(function (first, second) {
            return second.dealValue - first.dealValue;
        });
    }

    if (sortSelect.value === "newest") {
        visibleClients.sort(function (first, second) {
            return (
                new Date(second.createdAt) -
                new Date(first.createdAt)
            );
        });
    }

    return visibleClients;
}

// Renders the clients matching all current controls
function refreshVisibleClients() {
    const visibleClients = getVisibleClients();

    renderClients(visibleClients);
}