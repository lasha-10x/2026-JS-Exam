let editingClientId = null;
let deletingClientId = null;


renderClients(Storage.getClients());

function renderClients(list) {
    
    const clients = [...list];

    const container = document.getElementById("clientsContainer");

    container.innerHTML = "";

    if (clients.length === 0) {

    container.innerHTML = `
        <div class="empty-state">
            <h3>No clients found</h3>
            <p>Try another search.</p>
        </div>
    `;

    return;

}


    for (const client of clients) {

        container.innerHTML += `

            <div class="client-card">

                <h3>${client.fullName}</h3>

                <p><strong>Email:</strong> ${client.email}</p>

                <p><strong>Company:</strong> ${client.company}</p>

                <p><strong>Phone:</strong> ${client.phone}</p>

                <p><strong>Status:</strong> ${client.status}</p>

                <p><strong>Deal Value: $</strong> ${client.dealValue}</p>

                <div class="client-actions">

                    <button class="view-btn" data-id="${client.id}">
                        View
                    </button>
                    <button class="edit-btn" data-id="${client.id}">
                        Edit
                    </button>
                    <button class="delete-btn" data-id="${client.id}">
                        Delete
                    </button>

                </div>

            </div>

        `;

    }

    const deleteButtons = document.querySelectorAll(".delete-btn");
    for (const button of deleteButtons) {
    button.addEventListener("click", deleteClient);
    }

    const viewButtons = document.querySelectorAll(".view-btn");
    for (const button of viewButtons) {
    button.addEventListener("click", openViewModal);
    } 

    const editButtons = document.querySelectorAll(".edit-btn");
    for (const button of editButtons) {
    button.addEventListener("click", openEditModal);

} 

}

/// delete clients for ID

function deleteClient(event) {

    const button = event.target;

    deletingClientId = Number(button.dataset.id);

    deleteModal.style.display = "flex";

}

/// end delete clients for ID

const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const clientModal = document.getElementById("clientModal");
const clientForm = document.getElementById("clientForm");
const editClientForm = document.getElementById("editClientForm");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortClients = document.getElementById("sortClients");

const viewModal = document.getElementById("viewModal");
const closeViewModalBtn = document.getElementById("closeViewModalBtn");
const editModal = document.getElementById("editModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

clientForm.addEventListener("submit", addClient);
editClientForm.addEventListener("submit", saveClientChanges);
searchInput.addEventListener("input", searchClients);
statusFilter.addEventListener("change", filterClients);
sortClients.addEventListener("change", applyFilters);

openModalBtn.addEventListener("click", openModal);
closeViewModalBtn.addEventListener("click", () => {closeModal(viewModal);});             // x button to close modal
closeEditModalBtn.addEventListener("click", () => {closeModal(editModal);});             // x button to close modal
closeModalBtn.addEventListener("click", () => {closeModal(clientModal);});             // x button to close modal


// open modal

function openModal() {
    clientModal.style.display = "flex";
}
// end open modal

// close modal
function closeModal(modal) {
    modal.style.display = "none";
}
// end close modal

// other spaces to close modal

window.addEventListener("click", (event) => {

if (
    event.target === clientModal ||
    event.target === viewModal ||
    event.target === editModal ||
    event.target === deleteModal
) {
    event.target.style.display = "none";
}

});
// end other spaces to close modal

/// assign data client for variable in modal

function addClient(event) {

    event.preventDefault();

    const fullName = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const company = document.getElementById("clientCompany").value.trim();
    const dealValue = Number(document.getElementById("clientDeal").value);
    const status = document.getElementById("clientStatus").value;

    const client = {
        id: Date.now(),
        fullName,
        email,
        phone,
        company,
        dealValue,
        status,
        createdAt: new Date().toISOString()
        };

    if (!validateClientForm(client, "add")) {
        return;
    }


/// end assign data client for variable in modal

/// add new client to local storage
    const clients = Storage.getClients();
    clients.push(client);
    Storage.saveClients(clients);
/// end add new client to local storage

    clientForm.reset();
    closeModal(clientModal);
    renderClients(clients);
}



/// view client data in modal

function openViewModal(event) {

    const clientId = Number(event.target.dataset.id);

    const clients = Storage.getClients();

    const client = clients.find(client => client.id === clientId);

    document.getElementById("viewName").textContent = client.fullName;
    document.getElementById("viewEmail").textContent = client.email;
    document.getElementById("viewPhone").textContent = client.phone;
    document.getElementById("viewCompany").textContent = client.company;
    document.getElementById("viewDeal").textContent = "$" + client.dealValue;
    document.getElementById("viewStatus").textContent = client.status;

    document.getElementById("viewCreated").textContent =
        new Date(client.createdAt).toLocaleDateString();

    viewModal.style.display = "flex";

}

/// end view client data in modal

/// Edit client data in modal

function openEditModal(event) {

    const clientId = Number(event.target.dataset.id);
    
    editingClientId = clientId;
    
    const clients = Storage.getClients();

    const client = clients.find(client => client.id === clientId);

    document.getElementById("editName").value = client.fullName;
    document.getElementById("editEmail").value = client.email;
    document.getElementById("editPhone").value = client.phone;
    document.getElementById("editCompany").value = client.company;
    document.getElementById("editDeal").value = client.dealValue;
    document.getElementById("editStatus").value = client.status;
    editModal.style.display = "flex";
}


function saveClientChanges(event) {

    event.preventDefault();
    const clients = Storage.getClients();

    const client = clients.find(client => client.id === editingClientId);

    client.fullName = document.getElementById("editName").value;
    client.email = document.getElementById("editEmail").value;
    client.phone = document.getElementById("editPhone").value;
    client.company = document.getElementById("editCompany").value;
    client.dealValue = Number(document.getElementById("editDeal").value);
    client.status = document.getElementById("editStatus").value;

    if (!validateClientForm(client, "edit")) {
        return;
    }

    Storage.saveClients(clients);
    renderClients(clients);
    closeModal(editModal);
    showToast("Client updated successfully!");
}

/// end Edit client data in modal

/// Filter client data 

function searchClients() {     //by name
    applyFilters();
}

function filterClients() {     //by status
    applyFilters();
}

/// end Filter client data 

confirmDeleteBtn.addEventListener(
    "click",
    confirmDeleteClient
);

/// confirm Delete Client
function confirmDeleteClient(){

    const clients = Storage.getClients();

    const updatedClients = clients.filter(client => client.id !== deletingClientId);

    Storage.saveClients(updatedClients);

    renderClients(updatedClients);

    closeModal(deleteModal);

    deletingClientId = null;

    showToast("Client deleted successfully!");

}
/// end confirm Delete Client

cancelDeleteBtn.addEventListener("click",() => {
    deleteModal.style.display = "none";
    deletingClientId = null;
    }
);


/// Filter client data for Name and Status

function applyFilters() {

    const searchText = searchInput.value.trim().toLowerCase();       // input type text
    const selectedStatus = statusFilter.value;                       // All , lead, won, lost
    const selectedSort = sortClients.value;                          // sort clients list
    const clients = Storage.getClients();
    let filteredClients = clients;

    if (searchText) {
        filteredClients = filteredClients.filter(client => 
            client.fullName.toLowerCase().includes(searchText)
        );
    }

    if (selectedStatus !== "All") {
        filteredClients = filteredClients.filter(client => client.status === selectedStatus);
    }

    switch (selectedSort) {

        case "az":
            filteredClients.sort((a, b) =>
                a.fullName.localeCompare(b.fullName)
            );
            break;

        case "za":
            filteredClients.sort((a, b) =>
                b.fullName.localeCompare(a.fullName)
            );
            break;

        case "dealHigh":
            filteredClients.sort((a, b) =>
                b.dealValue - a.dealValue
            );
            break;

        case "dealLow":
            filteredClients.sort((a, b) =>
                a.dealValue - b.dealValue
            );
            break;

        case "newest":
            filteredClients.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
    }

    renderClients(filteredClients);
}

/// end Filter client data for Name and Status

//// logout function
document.getElementById("logoutBtn").addEventListener("click", logout);

function logout(){
    Storage.clearSession();
    window.location.href="index.html";
}
//// end logout function