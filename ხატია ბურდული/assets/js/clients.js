// =========================
// DOM Elements
// =========================

const openBtn = document.getElementById("openClientModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("clientModal");
const clientForm = document.getElementById("clientForm");
const tableBody = document.getElementById("clientsTableBody");



let editingClientId = null;



// =========================
// Load Clients
// =========================

async function loadClients() {

    const savedClients = JSON.parse(localStorage.getItem("crm_clients"));

    if (savedClients && savedClients.length > 0) {

        renderClients(savedClients);

        return;

    }

    await fetchClients();

}


// =========================
// Fetch Clients From API
// =========================

async function fetchClients() {

    tableBody.innerHTML =
        `<tr><td colspan="4">Loading clients...</td></tr>`;

    try {

        const response = await fetch(
            "https://dummyjson.com/users?limit=30"
        );

        if (!response.ok) {

            throw new Error("Failed to load clients.");

        }

        const data = await response.json();

        const clients = data.users.map(function (user) {

            return {

                id: user.id,

                name: user.firstName + " " + user.lastName,

                email: user.email,

                company: user.company.name,

                phone: user.phone,

                image: user.image,

                status: "Lead",

                dealValue: 1000,

                notes: [],

                createdAt: new Date().toISOString()

            };

        });

        localStorage.setItem(
            "crm_clients",
            JSON.stringify(clients)
        );

        renderClients(clients);

    } catch (error) {

        console.error(error);

        tableBody.innerHTML =

        `<tr>
            <td colspan="4">
                Could not load clients.
                Check your connection and try again.
                <br><br>
                <button id="retryBtn">
                    Retry
                </button>
            </td>
        </tr>`;

    }

}
// =========================
// Modal
// =========================

openBtn.addEventListener("click", function () {

    editingClientId = null;

    clientForm.reset();

    document.getElementById("clientStatus").value = "Lead";

    clearFieldError("clientName");
    clearFieldError("clientEmail");
    clearFieldError("clientPhone");
    clearFieldError("clientDealValue");
    clearFieldError("clientCompany");

    modal.classList.remove("hidden");

});

closeBtn.addEventListener("click", function () {

    modal.classList.add("hidden");

});


// =========================
// Add / Update Client
// =========================

clientForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const clientName = document
        .getElementById("clientName")
        .value
        .trim();

    const clientEmail = document
        .getElementById("clientEmail")
        .value
        .trim()
        .toLowerCase();

    const clientCompany = document
        .getElementById("clientCompany")
        .value
        .trim();


        const clientPhone =
    document.getElementById("clientPhone").value.trim();

const clientDealValue =
    document.getElementById("clientDealValue").value.trim();

const clientStatus =
    document.getElementById("clientStatus").value;


    clearFieldError("clientName");
    clearFieldError("clientEmail");
    clearFieldError("clientCompany");


    if (clientName.length < 3) {

        showFieldError(
            "clientName",
            "Client name must contain at least 3 characters."
        );

        return;

    }

    if (clientEmail === "") {

        showFieldError(
            "clientEmail",
            "Email is required."
        );

        return;

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(clientEmail)) {

    showFieldError(
        "clientEmail",
        "Please enter a valid email address"
    );

    return;

}

 
    const clients =
        JSON.parse(localStorage.getItem("crm_clients")) || [];

         if (editingClientId === null) {

    const existingClient = clients.find(function (client) {
        return client.email === clientEmail;
    });

    if (existingClient) {

        showFieldError(
            "clientEmail",
            "A client with this email already exists"
        );

        return;
    }

}



   if (editingClientId === null) {

    const newClient = {

        firstName: clientName,

        email: clientEmail,

        company: {
            name: clientCompany
        }

    };

    try {

        const response = await fetch(
            "https://dummyjson.com/users/add",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(newClient)

            }
        );
        if (!response.ok) {

    throw new Error("Could not add client.");

}


        const data = await response.json();

        const client = {

            id: data.id,

            name: clientName,

            email: clientEmail,

            company: clientCompany,

            phone: clientPhone,

            image: "",

            status: "Lead",

            dealValue: 1000,

            notes: [],

            createdAt: new Date().toISOString()

        };

        clients.push(client);

        localStorage.setItem(
            "crm_clients",
            JSON.stringify(clients)
        );

        showToast("Client added successfully!");

    } catch (error) {

        showToast("Could not add client.");

        return;

    }

}
    
    else {

         const updatedClient = {

        firstName: clientName,

        email: clientEmail,

        company: {

            name: clientCompany

        }

    };

    try {

        const response = await fetch(

            `https://dummyjson.com/users/${editingClientId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(updatedClient)

            }

        );

        if (!response.ok) {

            throw new Error("Update failed");

        }

        const client = clients.find(function (item) {

            return item.id === editingClientId;

        });

        if (client) {

            client.name = clientName;
            client.email = clientEmail;
            client.company = clientCompany;
            client.phone = clientPhone;
            client.dealValue = Number(clientDealValue);
            client.status = clientStatus;

        }

        localStorage.setItem(

            "crm_clients",

            JSON.stringify(clients)

        );

        showToast("Client updated successfully!");

        editingClientId = null;

    } catch (error) {

        showToast("Could not update client.");

        return;

    }
    }


    localStorage.setItem(
        "crm_clients",
        JSON.stringify(clients)
    );

    clientForm.reset();
    editingClientId = null;

document.getElementById("clientStatus").value = "Lead";

    modal.classList.add("hidden");

    renderClients();

   

});
// =========================
// Render Clients
// =========================

function renderClients(clients) {

    if (!clients) {

        clients =
            JSON.parse(localStorage.getItem("crm_clients")) || [];

    }

    tableBody.innerHTML = "";

    clients.forEach(function (client) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
            <img
            src="${client.image}"
            alt="${client.name}"
            class="client-avatar">
            ${client.name}
            </td>
            <td>${client.email}</td>
            <td>${client.company}</td>
            <td>${client.phone}</td>
            <td>$${client.dealValue.toLocaleString()}</td>
             <td>${client.status}</td>

            <td>
                <button
                    class="edit-btn"
                    data-id="${client.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${client.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}


// =========================
// Delete Client
// =========================

async function deleteClient(clientId) {

      try {

        const response = await fetch(
            `https://dummyjson.com/users/${clientId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok && response.status !== 404) {
    throw new Error("Delete failed.");
}

        let clients =
            JSON.parse(localStorage.getItem("crm_clients")) || [];

        clients = clients.filter(function (client) {

            return client.id !== clientId;

        });

        localStorage.setItem(
            "crm_clients",
            JSON.stringify(clients)
        );

        
        renderClients();
        showToast("Client deleted successfully!");

    } catch (error) {

        console.error(error);

        showToast("Could not delete client.");

    }

    

}


// =========================
// Edit Client
// =========================

function editClient(clientId) {

    const clients =
        JSON.parse(localStorage.getItem("crm_clients")) || [];

    const client = clients.find(function (item) {

        return item.id === clientId;

    });

    if (!client) return;

    document.getElementById("clientName").value = client.name;
    document.getElementById("clientEmail").value = client.email;
    document.getElementById("clientCompany").value = client.company;
    document.getElementById("clientPhone").value = client.phone || "";
document.getElementById("clientDealValue").value = client.dealValue || "";
document.getElementById("clientStatus").value = client.status || "Lead";

    editingClientId = client.id;

    modal.classList.remove("hidden");

}


// =========================
// Event Delegation
// =========================

document.addEventListener("click", async function (event) {

    if (event.target.classList.contains("delete-btn")) {

        const clientId = Number(event.target.dataset.id);

        const isConfirmed = confirm(
            "Are you sure you want to delete this client?"
        );

        if (!isConfirmed) {

            return;

        }

       await deleteClient(clientId);

    }

    if (event.target.classList.contains("edit-btn")) {

        const clientId = Number(event.target.dataset.id);

        editClient(clientId);

    }

});


// =========================
// Start App
// =========================

loadClients();


