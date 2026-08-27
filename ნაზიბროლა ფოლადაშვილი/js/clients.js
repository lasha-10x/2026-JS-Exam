"use strict";

/* =========================================================
   LOCAL STORAGE
========================================================= */

const CLIENTS_STORAGE_KEY = "crm_clients";


/* =========================================================
   CLIENTS PAGE ELEMENTS
========================================================= */

const openAddClientModalButton = document.querySelector(
    "#open-add-client-modal"
);

const addClientModal = document.querySelector(
    "#add-client-modal"
);

const closeAddClientModalButton = document.querySelector(
    "#close-add-client-modal"
);

const clientForm = document.querySelector(
    "#client-form"
);

const clientNameInput = document.querySelector(
    "#client-name"
);

const clientEmailInput = document.querySelector(
    "#client-email"
);

const clientPhoneInput = document.querySelector(
    "#client-phone"
);

const clientCompanyInput = document.querySelector(
    "#client-company"
);

const clientDealValueInput = document.querySelector(
    "#client-deal-value"
);

const clientStatusInput = document.querySelector(
    "#client-status"
);

const clientNameError = document.querySelector(
    "#client-name-error"
);

const clientEmailError = document.querySelector(
    "#client-email-error"
);

const clientPhoneError = document.querySelector(
    "#client-phone-error"
);

const clientDealValueError = document.querySelector(
    "#client-deal-value-error"
);

const clientsList = document.querySelector(
    "#clients-list"
);

const clientSearchInput = document.querySelector(
    "#client-search"
);

const clientSortSelect = document.querySelector(
    "#client-sort"
);

const filterButtons = document.querySelectorAll(
    ".filter-button"
);


/* =========================================================
   CLIENT DETAILS MODAL ELEMENTS
========================================================= */

const clientDetailsModal = document.querySelector(
    "#client-details-modal"
);

const closeClientDetailsModalButton = document.querySelector(
    "#close-client-details-modal"
);

const detailsClientImage = document.querySelector(
    "#details-client-image"
);

const clientDetailsTitle = document.querySelector(
    "#client-details-title"
);

const detailsClientCompany = document.querySelector(
    "#details-client-company"
);

const detailsClientEmail = document.querySelector(
    "#details-client-email"
);

const detailsClientPhone = document.querySelector(
    "#details-client-phone"
);

const detailsClientStatus = document.querySelector(
    "#details-client-status"
);

const detailsClientDealValue = document.querySelector(
    "#details-client-deal-value"
);

const detailsClientCreatedAt = document.querySelector(
    "#details-client-created-at"
);

const clientNotesList = document.querySelector(
    "#client-notes-list"
);

const clientNoteInput = document.querySelector(
    "#client-note"
);

const addNoteButton = document.querySelector(
    "#add-note-button"
);

const reminderButton = document.querySelector(
    "#reminder-button"
);


/* =========================================================
   PAGE STATE
========================================================= */

let clientsState = [];
let activeStatus = "All";
let selectedClientId = null;
let isSubmittingClient = false;


/* =========================================================
   GENERAL HELPERS
========================================================= */

function saveClientsState() {
    saveClients(clientsState);
}


function findClientById(clientId) {
    return clientsState.find((client) => {
        return String(client.id) === String(clientId);
    });
}


function formatDealValue(value) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return "$0";
    }

    return `$${numericValue.toLocaleString()}`;
}


function formatClientDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString();
}


function getClientInitials(name) {
    return String(name || "Client")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => {
            return word.charAt(0).toUpperCase();
        })
        .join("");
}


function createDefaultAvatar(name) {
    const initials = getClientInitials(name);

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 128 128"
        >
            <rect
                width="128"
                height="128"
                rx="64"
                fill="#dbeafe"
            />

            <text
                x="64"
                y="68"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="38"
                font-weight="700"
                fill="#1e3a8a"
            >
                ${initials}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}


function getClientImage(client) {
    if (
        typeof client.image === "string" &&
        client.image.trim() !== ""
    ) {
        return client.image;
    }

    return createDefaultAvatar(client.name);
}


function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


function clientEmailExists(email) {
    return clientsState.some((client) => {
        return (
            String(client.email || "")
                .trim()
                .toLowerCase() === email
        );
    });
}


/* =========================================================
   CLIENT NAME DUPLICATE CHECK
========================================================= */

function normalizeClientName(name) {
    return String(name || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}


function clientNameExists(name) {
    const normalizedName =
        normalizeClientName(name);

    return clientsState.some((client) => {
        return (
            normalizeClientName(client.name) ===
            normalizedName
        );
    });
}


function generateClientId(apiClientId) {
    const idAlreadyExists = clientsState.some((client) => {
        return String(client.id) === String(apiClientId);
    });

    if (
        apiClientId !== undefined &&
        apiClientId !== null &&
        !idAlreadyExists
    ) {
        return apiClientId;
    }

    return `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}


/* =========================================================
   FIELD ERROR HELPERS
========================================================= */

function setFieldError(
    inputElement,
    errorElement,
    message
) {
    if (!inputElement) {
        return;
    }

    inputElement.classList.add("input-error");

    inputElement.setAttribute(
        "aria-invalid",
        "true"
    );

    if (errorElement) {
        errorElement.textContent = message;
    }
}


function clearFieldError(
    inputElement,
    errorElement
) {
    if (!inputElement) {
        return;
    }

    inputElement.classList.remove("input-error");

    inputElement.removeAttribute(
        "aria-invalid"
    );

    if (errorElement) {
        errorElement.textContent = "";
    }
}


function clearClientFormErrors() {
    clearFieldError(
        clientNameInput,
        clientNameError
    );

    clearFieldError(
        clientEmailInput,
        clientEmailError
    );

    clearFieldError(
        clientPhoneInput,
        clientPhoneError
    );

    clearFieldError(
        clientDealValueInput,
        clientDealValueError
    );
}


/* =========================================================
   CLIENT FORM VALIDATION
========================================================= */

function validateClientForm() {
    clearClientFormErrors();

    const name = clientNameInput.value.trim();

    const email = clientEmailInput.value
        .trim()
        .toLowerCase();

    const phone = clientPhoneInput.value.trim();

    const dealValueText =
        clientDealValueInput.value.trim();

    const dealValue = Number(dealValueText);

    let isFormValid = true;


    if (name.length < 3) {
        setFieldError(
            clientNameInput,
            clientNameError,
            "Name must be at least 3 characters"
        );

        isFormValid = false;
    } else if (clientNameExists(name)) {
        setFieldError(
            clientNameInput,
            clientNameError,
            "A client with this name already exists"
        );

        isFormValid = false;
    }


    if (!isValidEmail(email)) {
        setFieldError(
            clientEmailInput,
            clientEmailError,
            "Please enter a valid email address"
        );

        isFormValid = false;
    } else if (clientEmailExists(email)) {
        setFieldError(
            clientEmailInput,
            clientEmailError,
            "A client with this email already exists"
        );

        isFormValid = false;
    }


    if (
        phone !== "" &&
        phone.length < 6
    ) {
        setFieldError(
            clientPhoneInput,
            clientPhoneError,
            "Phone number looks too short"
        );

        isFormValid = false;
    }


    if (
        dealValueText === "" ||
        Number.isNaN(dealValue) ||
        dealValue <= 0
    ) {
        setFieldError(
            clientDealValueInput,
            clientDealValueError,
            "Deal value must be a positive number"
        );

        isFormValid = false;
    }

    return isFormValid;
}


/* =========================================================
   ADD CLIENT MODAL
========================================================= */

function openAddClientModal() {
    clientForm.reset();

    clearClientFormErrors();

    clientStatusInput.value = "Lead";

    addClientModal.classList.remove("hidden");

    addClientModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("modal-open");

    clientNameInput.focus();
}


function closeAddClientModal() {
    addClientModal.classList.add("hidden");

    addClientModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("modal-open");

    clientForm.reset();

    clearClientFormErrors();
}


/* =========================================================
   CLIENT DETAILS MODAL
========================================================= */

function closeClientDetailsModal() {
    clientDetailsModal.classList.add("hidden");

    clientDetailsModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("modal-open");

    selectedClientId = null;

    clientNoteInput.value = "";
}


/* =========================================================
   FILTERING, SEARCHING AND SORTING
========================================================= */

function getVisibleClients() {
    let visibleClients = [...clientsState];

    if (activeStatus !== "All") {
        visibleClients = visibleClients.filter((client) => {
            return client.status === activeStatus;
        });
    }

    const searchValue = clientSearchInput.value
        .trim()
        .toLowerCase();

    if (searchValue !== "") {
        visibleClients = visibleClients.filter((client) => {
            const clientName = String(
                client.name || ""
            ).toLowerCase();

            const companyName = String(
                client.company || ""
            ).toLowerCase();

            const clientEmail = String(
                client.email || ""
            ).toLowerCase();

            return (
                clientName.includes(searchValue) ||
                companyName.includes(searchValue) ||
                clientEmail.includes(searchValue)
            );
        });
    }

    switch (clientSortSelect.value) {
        case "name-az":
            visibleClients.sort((a, b) => {
                return String(a.name || "").localeCompare(
                    String(b.name || "")
                );
            });
            break;

        case "name-za":
            visibleClients.sort((a, b) => {
                return String(b.name || "").localeCompare(
                    String(a.name || "")
                );
            });
            break;

        case "deal-high":
            visibleClients.sort((a, b) => {
                return (
                    Number(b.dealValue || 0) -
                    Number(a.dealValue || 0)
                );
            });
            break;

        case "deal-low":
            visibleClients.sort((a, b) => {
                return (
                    Number(a.dealValue || 0) -
                    Number(b.dealValue || 0)
                );
            });
            break;

        case "oldest":
            visibleClients.sort((a, b) => {
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
            });
            break;

        case "newest":
        default:
            visibleClients.sort((a, b) => {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            });
            break;
    }

    return visibleClients;
}


/* =========================================================
   STATUS BADGE
========================================================= */

function getStatusClass(status) {
    switch (status) {
        case "Contacted":
            return "status-contacted";

        case "Won":
            return "status-won";

        case "Lost":
            return "status-lost";

        case "Lead":
        default:
            return "status-lead";
    }
}


function createStatusBadge(client) {
    const badge = document.createElement("span");

    badge.className =
        `status-badge ${getStatusClass(client.status)}`;

    badge.textContent = client.status;

    return badge;
}


/* =========================================================
   STATUS SELECT
========================================================= */

function createStatusSelect(client) {
    const select = document.createElement("select");

    select.className =
        `client-status-select ${getStatusClass(client.status)}`;

    select.setAttribute(
        "aria-label",
        `Change status for ${client.name}`
    );

    const statuses = [
        "Lead",
        "Contacted",
        "Won",
        "Lost"
    ];

    statuses.forEach((status) => {
        const option = document.createElement("option");

        option.value = status;
        option.textContent = status;

        if (status === client.status) {
            option.selected = true;
        }

        select.append(option);
    });

    select.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    select.addEventListener("change", (event) => {
        event.stopPropagation();

        client.status = select.value;

        select.className =
            `client-status-select ${getStatusClass(client.status)}`;

        saveClientsState();

        renderClients();

        refreshSelectedClientDetails();

        showToast(
            "Status updated",
            "success"
        );
    });

    return select;
}


/* =========================================================
   DELETE CLIENT
========================================================= */

async function deleteClient(client) {
    const response = await fetch(
        `https://dummyjson.com/users/${client.id}`,
        {
            method: "DELETE"
        }
    );

    if (
        !response.ok &&
        response.status !== 404
    ) {
        throw new Error(
            `Could not delete client: ${response.status}`
        );
    }
}


function createDeleteButton(client) {
    const button = document.createElement("button");

    button.type = "button";

    button.className = "delete-client-button";

    button.textContent = "Delete";

    button.setAttribute(
        "aria-label",
        `Delete ${client.name}`
    );

    button.addEventListener("click", async (event) => {
        event.stopPropagation();

        const confirmed = window.confirm(
            `Delete ${client.name}? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        button.disabled = true;
        button.textContent = "Deleting...";

        try {
            await deleteClient(client);

            clientsState = clientsState.filter(
                (currentClient) => {
                    return (
                        String(currentClient.id) !==
                        String(client.id)
                    );
                }
            );

            saveClientsState();

            if (
                selectedClientId !== null &&
                String(selectedClientId) ===
                String(client.id)
            ) {
                closeClientDetailsModal();
            }

            renderClients();

            showToast(
                "Client deleted",
                "success"
            );

        } catch (error) {
            console.error(
                "Could not delete client:",
                error
            );

            button.disabled = false;
            button.textContent = "Delete";

            showToast(
                "Could not delete client.",
                "error"
            );
        }
    });

    return button;
}


/* =========================================================
   CLIENT CARD
========================================================= */

function createClientCard(client) {
    const card = document.createElement("article");

    card.className = "client-card";

    card.dataset.id = client.id;

    card.tabIndex = 0;

    card.setAttribute(
        "role",
        "button"
    );

    card.setAttribute(
        "aria-label",
        `Open details for ${client.name}`
    );

    card.addEventListener("click", () => {
        openClientDetails(client.id);
    });

    card.addEventListener("keydown", (event) => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();

            openClientDetails(client.id);
        }
    });


    const avatar = document.createElement("img");

    avatar.src = getClientImage(client);

    avatar.alt = `${client.name} avatar`;

    avatar.className = "client-avatar";


    const content = document.createElement("div");

    content.className = "client-card-content";


    const name = document.createElement("h3");

    name.className = "client-name";

    name.textContent = client.name;


    const company = document.createElement("p");

    company.className = "client-company";

    company.textContent =
        client.company || "No company";


    const email = document.createElement("p");

    email.className = "client-email";

    email.textContent =
        client.email || "No email";


    const dealValue = document.createElement("p");

    dealValue.className = "client-deal-value";

    dealValue.textContent = formatDealValue(
        client.dealValue
    );

    const actions = document.createElement("div");

    actions.className = "client-actions";

    actions.append(
        createStatusSelect(client),
        createDeleteButton(client)
    );


    content.append(
        name,
        company,
        email,
        dealValue
    );


    card.append(
        avatar,
        content,
        actions
    );

    return card;
}


/* =========================================================
   RENDER CLIENTS
========================================================= */

function renderClients() {
    clientsList.replaceChildren();

    const visibleClients =
        getVisibleClients();

    if (visibleClients.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "clients-message empty-clients-message";

        emptyMessage.textContent =
            "No clients found.";

        clientsList.append(emptyMessage);

        return;
    }

    const clientsFragment =
        document.createDocumentFragment();

    visibleClients.forEach((client) => {
        clientsFragment.append(
            createClientCard(client)
        );
    });

    clientsList.append(clientsFragment);
}


/* =========================================================
   LOADING STATE
========================================================= */

function showClientsLoading() {
    clientsList.replaceChildren();

    const loadingMessage =
        document.createElement("p");

    loadingMessage.className =
        "clients-message";

    loadingMessage.textContent =
        "Loading clients...";

    clientsList.append(loadingMessage);
}


/* =========================================================
   ERROR STATE AND RETRY
========================================================= */

function showClientsLoadError() {
    clientsList.replaceChildren();

    const errorContainer =
        document.createElement("div");

    errorContainer.className =
        "clients-error-state";


    const errorMessage =
        document.createElement("p");

    errorMessage.textContent =
        "Could not load clients. Check your connection and try again.";


    const retryButton =
        document.createElement("button");

    retryButton.type = "button";

    retryButton.className =
        "btn retry-button";

    retryButton.textContent = "Retry";

    retryButton.addEventListener("click", () => {
        loadClientsData();
    });


    errorContainer.append(
        errorMessage,
        retryButton
    );

    clientsList.append(errorContainer);
}


/* =========================================================
   LOAD CLIENTS FROM API
========================================================= */

async function fetchClientsFromApi() {
    const response = await fetch(
        "https://dummyjson.com/users?limit=30"
    );

    if (!response.ok) {
        throw new Error(
            `Could not load clients: ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data.users)) {
        throw new Error(
            "The API returned an invalid clients list."
        );
    }

    return data.users.map((user) => {
        return createClientFromApiUser(user);
    });
}


/* =========================================================
   READ STORED CLIENTS
========================================================= */

function readStoredClients() {
    const storedClients = localStorage.getItem(
        CLIENTS_STORAGE_KEY
    );

    if (storedClients === null) {
        return null;
    }

    try {
        const parsedClients =
            JSON.parse(storedClients);

        if (!Array.isArray(parsedClients)) {
            throw new Error(
                "Stored clients must be an array."
            );
        }

        return parsedClients;

    } catch (error) {
        console.error(
            "Stored clients data is invalid:",
            error
        );

        localStorage.removeItem(
            CLIENTS_STORAGE_KEY
        );

        return null;
    }
}


/* =========================================================
   LOAD CLIENTS DATA
========================================================= */

async function loadClientsData() {
    showClientsLoading();

    try {
        const storedClients =
            readStoredClients();

        if (storedClients !== null) {
            clientsState = storedClients;

            renderClients();

            return;
        }

        clientsState =
            await fetchClientsFromApi();

        saveClientsState();

        renderClients();

    } catch (error) {
        console.error(
            "Could not load clients:",
            error
        );

        showClientsLoadError();
    }
}


/* =========================================================
   CREATE NEW CLIENT REQUEST BODY
========================================================= */

function createClientRequestBody() {
    const fullName =
        clientNameInput.value.trim();

    const nameParts =
        fullName.split(/\s+/);

    const firstName =
        nameParts.shift() || fullName;

    const lastName =
        nameParts.join(" ");

    return {
        firstName,

        lastName,

        email: clientEmailInput.value
            .trim()
            .toLowerCase(),

        phone:
            clientPhoneInput.value.trim(),

        company: {
            name:
                clientCompanyInput.value.trim()
        }
    };
}


/* =========================================================
   SEND NEW CLIENT TO API
========================================================= */

async function postClientToApi(requestBody) {
    const response = await fetch(
        "https://dummyjson.com/users/add",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(requestBody)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Could not add client: ${response.status}`
        );
    }

    return response.json();
}


/* =========================================================
   CREATE CLIENT OBJECT FROM FORM
========================================================= */

function createClientFromForm(apiClient) {
    return {
        id: generateClientId(
            apiClient?.id
        ),

        name:
            clientNameInput.value.trim(),

        email: clientEmailInput.value
            .trim()
            .toLowerCase(),

        phone:
            clientPhoneInput.value.trim(),

        company:
            clientCompanyInput.value.trim(),

        image: String(
            apiClient?.image || ""
        ).trim(),

        status:
            clientStatusInput.value,

        dealValue: Number(
            clientDealValueInput.value
        ),

        notes: [],

        createdAt:
            new Date().toISOString()
    };
}


/* =========================================================
   SUBMIT BUTTON STATE
========================================================= */

function setClientFormSubmitting(isSubmitting) {
    isSubmittingClient = isSubmitting;

    const submitButton =
        clientForm.querySelector(
            'button[type="submit"]'
        );

    if (!submitButton) {
        return;
    }

    submitButton.disabled = isSubmitting;

    submitButton.textContent = isSubmitting
        ? "Adding..."
        : "Add Client";
}


/* =========================================================
   ADD CLIENT FORM SUBMIT
========================================================= */

async function handleClientFormSubmit(event) {
    event.preventDefault();

    if (isSubmittingClient) {
        return;
    }

    const isFormValid =
        validateClientForm();

    if (!isFormValid) {
        return;
    }

    setClientFormSubmitting(true);

    try {
        const requestBody =
            createClientRequestBody();

        const apiClient =
            await postClientToApi(
                requestBody
            );

        const newClient =
            createClientFromForm(
                apiClient
            );

        clientsState.unshift(newClient);

        saveClientsState();

        renderClients();

        closeAddClientModal();

        showToast(
            "Client added ✓",
            "success"
        );

    } catch (error) {
        console.error(
            "Could not add client:",
            error
        );

        showToast(
            "Could not add client.",
            "error"
        );

    } finally {
        setClientFormSubmitting(false);
    }
}


/* =========================================================
   CLIENT NOTES RENDERING
========================================================= */

function renderClientNotes(client) {
    clientNotesList.replaceChildren();

    if (
        !Array.isArray(client.notes) ||
        client.notes.length === 0
    ) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "empty-notes-message";

        emptyMessage.textContent =
            "No notes have been added yet.";

        clientNotesList.append(
            emptyMessage
        );

        return;
    }

    const notesFragment =
        document.createDocumentFragment();

    client.notes
        .slice()
        .forEach((note) => {
            const noteItem =
                document.createElement("li");

            noteItem.className =
                "client-note-item";

            const noteText =
                document.createElement("p");

            noteText.className =
                "client-note-text";

            noteText.textContent =
                note.text;

            const noteDate =
                document.createElement("time");

            noteDate.className =
                "client-note-date";

            noteDate.textContent =
                note.date ||
                "Unknown date";

            noteItem.append(
                noteText,
                noteDate
            );

            notesFragment.append(
                noteItem
            );
        });

    clientNotesList.append(
        notesFragment
    );
}


/* =========================================================
   FILL CLIENT DETAILS
========================================================= */

function fillClientDetails(client) {
    detailsClientImage.src =
        getClientImage(client);

    detailsClientImage.alt =
        `${client.name} avatar`;

    clientDetailsTitle.textContent =
        client.name;

    detailsClientCompany.textContent =
        client.company || "No company";

    detailsClientEmail.textContent =
        client.email || "No email";

    detailsClientPhone.textContent =
        client.phone || "No phone number";

    detailsClientStatus.textContent =
        client.status || "Lead";

    detailsClientStatus.className =
        `status-badge ${getStatusClass(client.status)}`;

    detailsClientDealValue.textContent =
        formatDealValue(client.dealValue);

    detailsClientCreatedAt.textContent =
        formatClientDate(client.createdAt);

    renderClientNotes(client);
}


/* =========================================================
   OPEN CLIENT DETAILS MODAL
========================================================= */

function openClientDetails(clientId) {
    const client =
        findClientById(clientId);

    if (!client) {
        showToast(
            "Client could not be found.",
            "error"
        );

        return;
    }

    selectedClientId = client.id;

    fillClientDetails(client);

    clientNoteInput.value = "";

    clientDetailsModal.classList.remove(
        "hidden"
    );

    clientDetailsModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    if (
        typeof clientDetailsTitle.focus ===
        "function"
    ) {
        clientDetailsTitle.focus();
    }
}


/* =========================================================
   REFRESH OPEN DETAILS MODAL
========================================================= */

function refreshSelectedClientDetails() {
    if (selectedClientId === null) {
        return;
    }

    const selectedClient =
        findClientById(selectedClientId);

    if (!selectedClient) {
        closeClientDetailsModal();

        return;
    }

    fillClientDetails(selectedClient);
}


/* =========================================================
   ADD CLIENT NOTE
========================================================= */

function handleAddClientNote() {
    if (selectedClientId === null) {
        showToast(
            "Select a client first.",
            "error"
        );

        return;
    }

    const noteText =
        clientNoteInput.value.trim();

    if (noteText === "") {
        showToast(
            "Note cannot be empty.",
            "error"
        );

        clientNoteInput.focus();

        return;
    }

    const client =
        findClientById(selectedClientId);

    if (!client) {
        showToast(
            "Client could not be found.",
            "error"
        );

        return;
    }

    if (!Array.isArray(client.notes)) {
        client.notes = [];
    }

    const newNote = {
        id: `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,

        text: noteText,

        date:
            new Date().toLocaleString()
    };

    client.notes.push(newNote);

    saveClientsState();

    renderClientNotes(client);

    clientNoteInput.value = "";

    clientNoteInput.focus();

    showToast(
        "Note added ✓",
        "success"
    );
}


/* =========================================================
   CLIENT REMINDER
========================================================= */

function handleClientReminder() {
    if (selectedClientId === null) {
        showToast(
            "Select a client first.",
            "error"
        );

        return;
    }

    const client =
        findClientById(selectedClientId);

    if (!client) {
        showToast(
            "Client could not be found.",
            "error"
        );

        return;
    }

    const clientName = client.name;

    showToast(
        "Reminder set ✓",
        "success"
    );

    window.setTimeout(() => {
        showToast(
            `⏰ Follow up ${clientName}`,
            "info"
        );
    }, 60000);
}


/* =========================================================
   FILTER BUTTONS
========================================================= */

function updateActiveFilterButton(
    selectedButton
) {
    filterButtons.forEach((button) => {
        const isSelected =
            button === selectedButton;

        button.classList.toggle(
            "active",
            isSelected
        );

        button.classList.toggle(
            "filter-button--active",
            isSelected
        );

        button.setAttribute(
            "aria-pressed",
            String(isSelected)
        );
    });
}


function handleFilterButtonClick(event) {
    const clickedButton =
        event.currentTarget;

    activeStatus =
        clickedButton.dataset.status ||
        clickedButton.textContent.trim();

    updateActiveFilterButton(
        clickedButton
    );

    renderClients();
}


/* =========================================================
   CLOSE MODALS BY OVERLAY CLICK
========================================================= */

function handleAddModalOverlayClick(event) {
    if (event.target === addClientModal) {
        closeAddClientModal();
    }
}


function handleDetailsModalOverlayClick(event) {
    if (
        event.target ===
        clientDetailsModal
    ) {
        closeClientDetailsModal();
    }
}


/* =========================================================
   CLOSE MODALS WITH ESCAPE KEY
========================================================= */

function handleModalEscapeKey(event) {
    if (event.key !== "Escape") {
        return;
    }

    if (
        !addClientModal.classList.contains(
            "hidden"
        )
    ) {
        closeAddClientModal();

        return;
    }

    if (
        !clientDetailsModal.classList.contains(
            "hidden"
        )
    ) {
        closeClientDetailsModal();
    }
}


/* =========================================================
   NOTE INPUT KEYBOARD SUPPORT
========================================================= */

function handleNoteInputKeydown(event) {
    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {
        event.preventDefault();

        handleAddClientNote();
    }
}


/* =========================================================
   FORM INPUT ERROR CLEARING
========================================================= */

function addClientInputListeners() {
    clientNameInput.addEventListener(
        "input",
        () => {
            clearFieldError(
                clientNameInput,
                clientNameError
            );
        }
    );

    clientEmailInput.addEventListener(
        "input",
        () => {
            clearFieldError(
                clientEmailInput,
                clientEmailError
            );
        }
    );

    clientPhoneInput.addEventListener(
        "input",
        () => {
            clearFieldError(
                clientPhoneInput,
                clientPhoneError
            );
        }
    );

    clientDealValueInput.addEventListener(
        "input",
        () => {
            clearFieldError(
                clientDealValueInput,
                clientDealValueError
            );
        }
    );
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function addClientsPageEventListeners() {
    openAddClientModalButton.addEventListener(
        "click",
        openAddClientModal
    );

    closeAddClientModalButton.addEventListener(
        "click",
        closeAddClientModal
    );

    closeClientDetailsModalButton.addEventListener(
        "click",
        closeClientDetailsModal
    );

    clientForm.addEventListener(
        "submit",
        handleClientFormSubmit
    );

    clientSearchInput.addEventListener(
        "input",
        renderClients
    );

    clientSortSelect.addEventListener(
        "change",
        renderClients
    );

    filterButtons.forEach((button) => {
        button.addEventListener(
            "click",
            handleFilterButtonClick
        );
    });

    addNoteButton.addEventListener(
        "click",
        handleAddClientNote
    );

    reminderButton.addEventListener(
        "click",
        handleClientReminder
    );

    clientNoteInput.addEventListener(
        "keydown",
        handleNoteInputKeydown
    );

    addClientModal.addEventListener(
        "click",
        handleAddModalOverlayClick
    );

    clientDetailsModal.addEventListener(
        "click",
        handleDetailsModalOverlayClick
    );

    document.addEventListener(
        "keydown",
        handleModalEscapeKey
    );

    addClientInputListeners();
}


/* =========================================================
   INITIAL ACTIVE FILTER
========================================================= */

function initializeActiveFilter() {
    const activeButton = Array.from(
        filterButtons
    ).find((button) => {
        const buttonStatus =
            button.dataset.status ||
            button.textContent.trim();

        return buttonStatus === activeStatus;
    });

    if (activeButton) {
        updateActiveFilterButton(
            activeButton
        );
    }
}


/* =========================================================
   REQUIRED ELEMENT CHECK
========================================================= */

function clientsPageElementsExist() {
    const requiredElements = [
        openAddClientModalButton,
        addClientModal,
        closeAddClientModalButton,
        clientForm,
        clientNameInput,
        clientEmailInput,
        clientPhoneInput,
        clientCompanyInput,
        clientDealValueInput,
        clientStatusInput,
        clientsList,
        clientSearchInput,
        clientSortSelect,
        clientDetailsModal,
        closeClientDetailsModalButton,
        detailsClientImage,
        clientDetailsTitle,
        detailsClientCompany,
        detailsClientEmail,
        detailsClientPhone,
        detailsClientStatus,
        detailsClientDealValue,
        detailsClientCreatedAt,
        clientNotesList,
        clientNoteInput,
        addNoteButton,
        reminderButton
    ];

    return requiredElements.every(
        (element) => element !== null
    );
}


/* =========================================================
   INITIALIZE CLIENTS PAGE
========================================================= */

async function initializeClientsPage() {
    if (!clientsPageElementsExist()) {
        console.error(
            "Clients page could not initialize because one or more required HTML elements are missing."
        );

        return;
    }

    initializeActiveFilter();

    addClientsPageEventListeners();

    await loadClientsData();
}


/* =========================================================
   START CLIENTS PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeClientsPage
);