let clients = [];
let selectedStatus = "All";
let selectedClientId = null;


/* =========================
   ELEMENTS
========================= */

const clientsList =
    document.getElementById("clientsList");

const clientsLoading =
    document.getElementById("clientsLoading");

const clientsError =
    document.getElementById("clientsError");

const clientsEmpty =
    document.getElementById("clientsEmpty");

const clientSearch =
    document.getElementById("clientSearch");

const clientSort =
    document.getElementById("clientSort");

const statusFilters =
    document.getElementById("statusFilters");

const clientsSummary =
    document.getElementById("clientsSummary");

const retryClientsButton =
    document.getElementById("retryClientsButton");


/* ADD CLIENT */

const addClientModal =
    document.getElementById("addClientModal");

const openAddClientButton =
    document.getElementById("openAddClientButton");

const closeAddClientButton =
    document.getElementById("closeAddClientButton");

const cancelAddClientButton =
    document.getElementById("cancelAddClientButton");

const addClientForm =
    document.getElementById("addClientForm");

const clientName =
    document.getElementById("clientName");

const clientEmail =
    document.getElementById("clientEmail");

const clientPhone =
    document.getElementById("clientPhone");

const clientCompany =
    document.getElementById("clientCompany");

const clientDealValue =
    document.getElementById("clientDealValue");

const clientStatus =
    document.getElementById("clientStatus");


/* CLIENT DETAILS */

const clientDetailsModal =
    document.getElementById("clientDetailsModal");

const closeClientDetailsButton =
    document.getElementById(
        "closeClientDetailsButton"
    );

const clientDetailsContent =
    document.getElementById(
        "clientDetailsContent"
    );

const editClientButton =
    document.getElementById("editClientButton");


/* NOTES */

const noteForm =
    document.getElementById("noteForm");

const noteText =
    document.getElementById("noteText");

const noteError =
    document.getElementById("noteError");

const notesList =
    document.getElementById("notesList");

const reminderButton =
    document.getElementById("reminderButton");


/* SUMMARY */

const summaryTotal =
    document.getElementById("summaryTotal");

const summaryLead =
    document.getElementById("summaryLead");

const summaryContacted =
    document.getElementById("summaryContacted");

const summaryWon =
    document.getElementById("summaryWon");

const summaryLost =
    document.getElementById("summaryLost");


/* EDIT CLIENT */

const editClientModal =
    document.getElementById("editClientModal");

const closeEditClientButton =
    document.getElementById(
        "closeEditClientButton"
    );

const cancelEditClientButton =
    document.getElementById(
        "cancelEditClientButton"
    );

const editClientForm =
    document.getElementById("editClientForm");

const editClientName =
    document.getElementById("editClientName");

const editClientEmail =
    document.getElementById("editClientEmail");

const editClientPhone =
    document.getElementById("editClientPhone");

const editClientCompany =
    document.getElementById("editClientCompany");

const editClientDealValue =
    document.getElementById(
        "editClientDealValue"
    );

const editClientStatus =
    document.getElementById("editClientStatus");


/* =========================
   HELPERS
========================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatMoney(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );
}


function formatDate(value) {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function isValidClientEmail(email) {
    const atIndex =
        email.indexOf("@");

    const dotIndex =
        email.lastIndexOf(".");

    return (
        atIndex > 0 &&
        dotIndex > atIndex + 1 &&
        dotIndex < email.length - 1
    );
}


/* =========================
   STATES
========================= */

function showLoadingState() {
    clientsLoading.classList.remove(
        "hidden"
    );

    clientsError.classList.add(
        "hidden"
    );

    clientsEmpty.classList.add(
        "hidden"
    );

    clientsList.innerHTML = "";
}


function showErrorState() {
    clientsLoading.classList.add(
        "hidden"
    );

    clientsError.classList.remove(
        "hidden"
    );

    clientsEmpty.classList.add(
        "hidden"
    );

    clientsList.innerHTML = "";
}


function hideStateMessages() {
    clientsLoading.classList.add(
        "hidden"
    );

    clientsError.classList.add(
        "hidden"
    );

    clientsEmpty.classList.add(
        "hidden"
    );
}


/* =========================
   SUMMARY
========================= */

function updateClientSummary() {
    const lead =
        clients.filter(function (client) {
            return client.status === "Lead";
        }).length;

    const contacted =
        clients.filter(function (client) {
            return client.status === "Contacted";
        }).length;

    const won =
        clients.filter(function (client) {
            return client.status === "Won";
        }).length;

    const lost =
        clients.filter(function (client) {
            return client.status === "Lost";
        }).length;

    summaryTotal.textContent =
        clients.length;

    summaryLead.textContent =
        lead;

    summaryContacted.textContent =
        contacted;

    summaryWon.textContent =
        won;

    summaryLost.textContent =
        lost;
}


function syncFilterButtons() {
    document
        .querySelectorAll(".filter-button")
        .forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.status ===
                    selectedStatus
            );
        });

    document
        .querySelectorAll(
            ".client-summary-card"
        )
        .forEach(function (card) {
            card.classList.toggle(
                "active",
                card.dataset.summaryStatus ===
                    selectedStatus
            );
        });
}


/* =========================
   FILTER + SORT
========================= */

function getVisibleClients() {
    const searchValue =
        clientSearch.value
            .trim()
            .toLowerCase();

    let visibleClients =
        clients.filter(function (client) {
            const matchesStatus =
                selectedStatus === "All" ||
                client.status ===
                    selectedStatus;

            const name =
                String(
                    client.name || ""
                ).toLowerCase();

            const company =
                String(
                    client.company || ""
                ).toLowerCase();

            const matchesSearch =
                name.includes(searchValue) ||
                company.includes(searchValue);

            return (
                matchesStatus &&
                matchesSearch
            );
        });

    const sortValue =
        clientSort.value;

    if (sortValue === "name") {
        visibleClients.sort(
            function (first, second) {
                return String(
                    first.name || ""
                ).localeCompare(
                    String(
                        second.name || ""
                    )
                );
            }
        );
    }

    if (sortValue === "dealValue") {
        visibleClients.sort(
            function (first, second) {
                return (
                    Number(
                        second.dealValue || 0
                    ) -
                    Number(
                        first.dealValue || 0
                    )
                );
            }
        );
    }

    if (sortValue === "newest") {
        visibleClients.sort(
            function (first, second) {
                return (
                    new Date(
                        second.createdAt
                    ) -
                    new Date(
                        first.createdAt
                    )
                );
            }
        );
    }

    return visibleClients;
}


/* =========================
   CLIENT CARDS
========================= */

function renderClients() {
    hideStateMessages();

    updateClientSummary();

    const visibleClients =
        getVisibleClients();

    clientsList.innerHTML = "";

    if (
        visibleClients.length === 0
    ) {
        clientsEmpty.classList.remove(
            "hidden"
        );

        return;
    }

    visibleClients.forEach(
        function (client) {
            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "client-card";

            card.dataset.clientId =
                client.id;

            const safeName =
                escapeHtml(
                    client.name || "Unknown"
                );

            const safeCompany =
                escapeHtml(
                    client.company ||
                    "No company"
                );

            const safeEmail =
                escapeHtml(
                    client.email || ""
                );

            const safeImage =
                escapeHtml(
                    client.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        client.name || "Client"
                    )}`
                );

            card.innerHTML = `
                <div class="client-card-top">

                    <img
                        class="client-avatar"
                        src="${safeImage}"
                        alt="${safeName}"
                    >

                    <div class="client-card-title">
                        <h2>
                            ${safeName}
                        </h2>

                        <p>
                            ${safeCompany}
                        </p>
                    </div>

                </div>

                <div class="client-card-details">

                    <p>
                        <strong>Email:</strong>
                        ${safeEmail}
                    </p>

                    <p>
                        <strong>Deal value:</strong>
                        ${formatMoney(
                            client.dealValue
                        )}
                    </p>

                    <span
                        class="status-badge status-${String(
                            client.status
                        ).toLowerCase()}"
                    >
                        ${escapeHtml(
                            client.status
                        )}
                    </span>

                </div>

                <div class="client-card-actions">

                    <select
                        class="client-status-select"
                        data-client-id="${client.id}"
                        aria-label="Change client status"
                    >
                        <option
                            value="Lead"
                            ${
                                client.status ===
                                "Lead"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Lead
                        </option>

                        <option
                            value="Contacted"
                            ${
                                client.status ===
                                "Contacted"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Contacted
                        </option>

                        <option
                            value="Won"
                            ${
                                client.status ===
                                "Won"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Won
                        </option>

                        <option
                            value="Lost"
                            ${
                                client.status ===
                                "Lost"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Lost
                        </option>
                    </select>

                    <button
                        type="button"
                        class="delete-client-button"
                        data-client-id="${client.id}"
                    >
                        Delete
                    </button>

                </div>
            `;

            clientsList.appendChild(
                card
            );
        }
    );
}


/* =========================
   LOAD CLIENTS
========================= */

async function initializeClients() {
    showLoadingState();

    try {
        clients =
            await loadClients();

        if (
            !Array.isArray(clients)
        ) {
            clients = [];
        }

        renderClients();
    } catch (error) {
        console.error(error);

        showErrorState();
    }
}


/* =========================
   ADD CLIENT
========================= */

function clearAddClientErrors() {
    const errorIds = [
        "clientNameError",
        "clientEmailError",
        "clientPhoneError",
        "clientCompanyError",
        "clientDealValueError",
        "clientStatusError"
    ];

    errorIds.forEach(
        function (id) {
            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = "";
            }
        }
    );
}


function openAddClientModal() {
    clearAddClientErrors();

    addClientModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function closeAddClientModal() {
    addClientModal.classList.add(
        "hidden"
    );

    addClientForm.reset();

    clearAddClientErrors();

    document.body.style.overflow =
        "";
}


function validateAddClient(data) {
    clearAddClientErrors();

    let isValid = true;

    if (data.name.length < 3) {
        document.getElementById(
            "clientNameError"
        ).textContent =
            "Name must be at least 3 characters";

        isValid = false;
    }

    if (
        !isValidClientEmail(
            data.email
        )
    ) {
        document.getElementById(
            "clientEmailError"
        ).textContent =
            "Please enter a valid email address";

        isValid = false;
    }

    const duplicateEmail =
        clients.some(
            function (client) {
                return (
                    String(
                        client.email || ""
                    ).toLowerCase() ===
                    data.email.toLowerCase()
                );
            }
        );

    if (duplicateEmail) {
        document.getElementById(
            "clientEmailError"
        ).textContent =
            "Client with this email already exists";

        isValid = false;
    }

    const phoneDigits =
        data.phone.replace(
            /\D/g,
            ""
        );

    if (
        data.phone !== "" &&
        phoneDigits.length < 7
    ) {
        document.getElementById(
            "clientPhoneError"
        ).textContent =
            "Phone number looks too short";

        isValid = false;
    }

    if (
        Number.isNaN(
            data.dealValue
        ) ||
        data.dealValue <= 0
    ) {
        document.getElementById(
            "clientDealValueError"
        ).textContent =
            "Deal value must be a positive number";

        isValid = false;
    }

    return isValid;
}


function handleAddClient(event) {
    event.preventDefault();

    const data = {
        name:
            clientName.value.trim(),

        email:
            clientEmail.value
                .trim()
                .toLowerCase(),

        phone:
            clientPhone.value.trim(),

        company:
            clientCompany.value.trim(),

        dealValue:
            Number(
                clientDealValue.value
            ),

        status:
            clientStatus.value
    };

    if (
        !validateAddClient(data)
    ) {
        return;
    }

    const newClient = {
        id:
            Date.now(),

        name:
            data.name,

        email:
            data.email,

        phone:
            data.phone,

        company:
            data.company ||
            "No company",

        dealValue:
            data.dealValue,

        status:
            data.status,

        createdAt:
            new Date().toISOString(),

        notes: [],

        image:
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                data.name
            )}`
    };

    clients.unshift(
        newClient
    );

    saveClients(
        clients
    );

    renderClients();

    closeAddClientModal();

    showToast(
        "Client added ✓",
        "success"
    );
}


/* =========================
   DELETE CLIENT
========================= */

function deleteClient(clientId) {
    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(clientId)
                );
            }
        );

    if (!client) {
        return;
    }

    const confirmed =
        window.confirm(
            `Delete ${client.name}?`
        );

    if (!confirmed) {
        return;
    }

    clients =
        clients.filter(
            function (item) {
                return (
                    String(item.id) !==
                    String(clientId)
                );
            }
        );

    saveClients(
        clients
    );

    renderClients();

    showToast(
        "Client deleted",
        "success"
    );
}


/* =========================
   STATUS
========================= */

function updateClientStatus(
    clientId,
    newStatus
) {
    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(clientId)
                );
            }
        );

    if (!client) {
        return;
    }

    client.status =
        newStatus;

    saveClients(
        clients
    );

    renderClients();

    showToast(
        "Client status updated ✓",
        "success"
    );
}


/* =========================
   DETAILS
========================= */

function openClientDetails(
    clientId
) {
    selectedClientId =
        clientId;

    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(clientId)
                );
            }
        );

    if (!client) {
        return;
    }

    const safeName =
        escapeHtml(
            client.name
        );

    const safeImage =
        escapeHtml(
            client.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                client.name
            )}`
        );

    const safeCompany =
        escapeHtml(
            client.company ||
            "No company"
        );

    const safeEmail =
        escapeHtml(
            client.email
        );

    const safePhone =
        escapeHtml(
            client.phone ||
            "No phone"
        );

    clientDetailsContent.innerHTML = `
        <div class="client-details-header">

            <img
                class="client-details-avatar"
                src="${safeImage}"
                alt="${safeName}"
            >

            <div>
                <h2>
                    ${safeName}
                </h2>

                <p>
                    ${safeCompany}
                </p>
            </div>

        </div>

        <div class="client-details-list">

            <p>
                <strong>Email:</strong>
                ${safeEmail}
            </p>

            <p>
                <strong>Phone:</strong>
                ${safePhone}
            </p>

            <p>
                <strong>Status:</strong>
                ${escapeHtml(
                    client.status
                )}
            </p>

            <p>
                <strong>Deal value:</strong>
                ${formatMoney(
                    client.dealValue
                )}
            </p>

            <p>
                <strong>Client since:</strong>
                ${formatDate(
                    client.createdAt
                )}
            </p>

        </div>
    `;

    renderNotes(
        client
    );

    clientDetailsModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function closeClientDetailsModal() {
    clientDetailsModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

    selectedClientId =
        null;

    noteForm.reset();

    noteError.textContent =
        "";
}


/* =========================
   NOTES
========================= */

function renderNotes(client) {
    notesList.innerHTML = "";

    if (
        !Array.isArray(
            client.notes
        ) ||
        client.notes.length === 0
    ) {
        notesList.innerHTML = `
            <p class="state-message">
                No notes yet.
            </p>
        `;

        return;
    }

    [...client.notes]
        .reverse()
        .forEach(
            function (note) {
                const noteElement =
                    document.createElement(
                        "div"
                    );

                noteElement.className =
                    "note-item";

                noteElement.innerHTML = `
                    <p>
                        ${escapeHtml(
                            note.text
                        )}
                    </p>

                    <small>
                        ${escapeHtml(
                            note.date
                        )}
                    </small>
                `;

                notesList.appendChild(
                    noteElement
                );
            }
        );
}


function handleAddNote(event) {
    event.preventDefault();

    const text =
        noteText.value.trim();

    noteError.textContent =
        "";

    if (text === "") {
        noteError.textContent =
            "Note cannot be empty";

        return;
    }

    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(
                        selectedClientId
                    )
                );
            }
        );

    if (!client) {
        return;
    }

    if (
        !Array.isArray(
            client.notes
        )
    ) {
        client.notes = [];
    }

    client.notes.push({
        text: text,
        date:
            new Date().toLocaleString()
    });

    saveClients(
        clients
    );

    renderNotes(
        client
    );

    noteForm.reset();

    showToast(
        "Note added ✓",
        "success"
    );
}


/* =========================
   REMINDER
========================= */

function setClientReminder() {
    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(
                        selectedClientId
                    )
                );
            }
        );

    if (!client) {
        return;
    }

    const clientName =
        client.name;

    showToast(
        "Reminder set ✓",
        "success"
    );

    setTimeout(
        function () {
            showToast(
                `⏰ Follow up: ${clientName}`,
                "success"
            );
        },
        60000
    );
}


/* =========================
   EDIT CLIENT
========================= */

function clearEditClientErrors() {
    const errorIds = [
        "editClientNameError",
        "editClientEmailError",
        "editClientPhoneError",
        "editClientDealValueError"
    ];

    errorIds.forEach(
        function (id) {
            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = "";
            }
        }
    );
}


function openEditClientModal() {
    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(
                        selectedClientId
                    )
                );
            }
        );

    if (!client) {
        return;
    }

    clearEditClientErrors();

    editClientName.value =
        client.name || "";

    editClientEmail.value =
        client.email || "";

    editClientPhone.value =
        client.phone || "";

    editClientCompany.value =
        client.company || "";

    editClientDealValue.value =
        Number(
            client.dealValue || 0
        );

    editClientStatus.value =
        client.status || "Lead";

    clientDetailsModal.classList.add(
        "hidden"
    );

    editClientModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function closeEditClientModal(
    reopenDetails = false
) {
    editClientModal.classList.add(
        "hidden"
    );

    clearEditClientErrors();

    if (
        reopenDetails &&
        selectedClientId !== null
    ) {
        openClientDetails(
            selectedClientId
        );

        return;
    }

    document.body.style.overflow =
        "";
}


function validateEditClient(data) {
    clearEditClientErrors();

    let isValid = true;

    if (data.name.length < 3) {
        document.getElementById(
            "editClientNameError"
        ).textContent =
            "Name must be at least 3 characters";

        isValid = false;
    }

    if (
        !isValidClientEmail(
            data.email
        )
    ) {
        document.getElementById(
            "editClientEmailError"
        ).textContent =
            "Please enter a valid email address";

        isValid = false;
    }

    const duplicateEmail =
        clients.some(
            function (client) {
                return (
                    String(client.id) !==
                        String(
                            selectedClientId
                        ) &&
                    String(
                        client.email || ""
                    ).toLowerCase() ===
                        data.email.toLowerCase()
                );
            }
        );

    if (duplicateEmail) {
        document.getElementById(
            "editClientEmailError"
        ).textContent =
            "Another client already uses this email";

        isValid = false;
    }

    const phoneDigits =
        data.phone.replace(
            /\D/g,
            ""
        );

    if (
        data.phone !== "" &&
        phoneDigits.length < 7
    ) {
        document.getElementById(
            "editClientPhoneError"
        ).textContent =
            "Phone number looks too short";

        isValid = false;
    }

    if (
        Number.isNaN(
            data.dealValue
        ) ||
        data.dealValue <= 0
    ) {
        document.getElementById(
            "editClientDealValueError"
        ).textContent =
            "Deal value must be a positive number";

        isValid = false;
    }

    return isValid;
}


function handleEditClient(event) {
    event.preventDefault();

    const client =
        clients.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(
                        selectedClientId
                    )
                );
            }
        );

    if (!client) {
        return;
    }

    const updatedData = {
        name:
            editClientName.value.trim(),

        email:
            editClientEmail.value
                .trim()
                .toLowerCase(),

        phone:
            editClientPhone.value.trim(),

        company:
            editClientCompany.value.trim(),

        dealValue:
            Number(
                editClientDealValue.value
            ),

        status:
            editClientStatus.value
    };

    if (
        !validateEditClient(
            updatedData
        )
    ) {
        return;
    }

    client.name =
        updatedData.name;

    client.email =
        updatedData.email;

    client.phone =
        updatedData.phone;

    client.company =
        updatedData.company ||
        "No company";

    client.dealValue =
        updatedData.dealValue;

    client.status =
        updatedData.status;

    /* Update generated avatar when name changes */

    if (
        !client.image ||
        client.image.includes(
            "ui-avatars.com"
        )
    ) {
        client.image =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                updatedData.name
            )}`;
    }

    saveClients(
        clients
    );

    renderClients();

    editClientModal.classList.add(
        "hidden"
    );

    showToast(
        "Client updated ✓",
        "success"
    );

    openClientDetails(
        client.id
    );
}


/* =========================
   FILTER EVENTS
========================= */

clientSearch.addEventListener(
    "input",
    renderClients
);

clientSort.addEventListener(
    "change",
    renderClients
);


statusFilters.addEventListener(
    "click",
    function (event) {
        const button =
            event.target.closest(
                ".filter-button"
            );

        if (!button) {
            return;
        }

        selectedStatus =
            button.dataset.status;

        syncFilterButtons();

        renderClients();
    }
);


if (clientsSummary) {
    clientsSummary.addEventListener(
        "click",
        function (event) {
            const summaryCard =
                event.target.closest(
                    ".client-summary-card"
                );

            if (!summaryCard) {
                return;
            }

            selectedStatus =
                summaryCard.dataset.summaryStatus;

            syncFilterButtons();

            renderClients();
        }
    );
}


/* =========================
   CLIENT CARD EVENTS
========================= */

clientsList.addEventListener(
    "click",
    function (event) {
        const deleteButton =
            event.target.closest(
                ".delete-client-button"
            );

        if (deleteButton) {
            event.stopPropagation();

            deleteClient(
                deleteButton.dataset.clientId
            );

            return;
        }

        const statusSelect =
            event.target.closest(
                ".client-status-select"
            );

        if (statusSelect) {
            return;
        }

        const card =
            event.target.closest(
                ".client-card"
            );

        if (card) {
            openClientDetails(
                card.dataset.clientId
            );
        }
    }
);


clientsList.addEventListener(
    "change",
    function (event) {
        const statusSelect =
            event.target.closest(
                ".client-status-select"
            );

        if (!statusSelect) {
            return;
        }

        updateClientStatus(
            statusSelect.dataset.clientId,
            statusSelect.value
        );
    }
);


/* =========================
   MODAL EVENTS
========================= */

openAddClientButton.addEventListener(
    "click",
    openAddClientModal
);

closeAddClientButton.addEventListener(
    "click",
    closeAddClientModal
);

cancelAddClientButton.addEventListener(
    "click",
    closeAddClientModal
);

addClientForm.addEventListener(
    "submit",
    handleAddClient
);


closeClientDetailsButton.addEventListener(
    "click",
    closeClientDetailsModal
);


noteForm.addEventListener(
    "submit",
    handleAddNote
);


reminderButton.addEventListener(
    "click",
    setClientReminder
);


/* EDIT EVENTS */

if (editClientButton) {
    editClientButton.addEventListener(
        "click",
        openEditClientModal
    );
}

if (closeEditClientButton) {
    closeEditClientButton.addEventListener(
        "click",
        function () {
            closeEditClientModal(true);
        }
    );
}

if (cancelEditClientButton) {
    cancelEditClientButton.addEventListener(
        "click",
        function () {
            closeEditClientModal(true);
        }
    );
}

if (editClientForm) {
    editClientForm.addEventListener(
        "submit",
        handleEditClient
    );
}


retryClientsButton.addEventListener(
    "click",
    initializeClients
);


/* MODAL OVERLAY */

document
    .querySelectorAll(".modal-overlay")
    .forEach(function (overlay) {
        overlay.addEventListener(
            "click",
            function () {
                const modal =
                    overlay.closest(
                        ".modal"
                    );

                if (
                    modal ===
                    editClientModal
                ) {
                    closeEditClientModal(
                        true
                    );

                    return;
                }

                if (
                    modal ===
                    clientDetailsModal
                ) {
                    closeClientDetailsModal();

                    return;
                }

                if (
                    modal ===
                    addClientModal
                ) {
                    closeAddClientModal();
                }
            }
        );
    });


/* ESCAPE */

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key !== "Escape"
        ) {
            return;
        }

        if (
            editClientModal &&
            !editClientModal.classList.contains(
                "hidden"
            )
        ) {
            closeEditClientModal(true);

            return;
        }

        if (
            !clientDetailsModal.classList.contains(
                "hidden"
            )
        ) {
            closeClientDetailsModal();

            return;
        }

        if (
            !addClientModal.classList.contains(
                "hidden"
            )
        ) {
            closeAddClientModal();
        }
    }
);


/* =========================
   START
========================= */

initializeClients();