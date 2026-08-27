let clients = [];
let activeStatusFilter = "All";
let currentSort = "newest";
let searchTerm = "";
let currentDetailsClientId = null;

const clientListEl = document.getElementById("client-list");
const loadingEl = document.getElementById("loading-state");
const errorEl = document.getElementById("error-state");
const emptyEl = document.getElementById("empty-state");
const retryBtn = document.getElementById("retry-btn");

const addClientBtn = document.getElementById("add-client-btn");
const addClientModal = document.getElementById("add-client-modal");
const addClientForm = document.getElementById("add-client-form");

const detailsModal = document.getElementById("client-details-modal");
const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const remindBtn = document.getElementById("remind-btn");

const searchInput = document.getElementById("search-input");
const filterChips = document.getElementById("filter-chips");
const sortSelect = document.getElementById("sort-select");

const toastContainer = document.getElementById("toast-container");


document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadAndRender();

    //opens client add modal on click
    addClientBtn.addEventListener("click", openAddClientModal);
    //submits the modal
    addClientForm.addEventListener("submit", handleAddClientSubmit);

    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", closeModals);
    });
    document.querySelectorAll(".modal-backdrop").forEach(bg => {
        bg.addEventListener("click", closeModals);
    });

    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        render();
    });

    filterChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        activeStatusFilter = chip.dataset.status;
        [...filterChips.children].forEach(c =>
            c.classList.toggle("active", c === chip)
        );
        render();
    });

    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        render();
    });

    retryBtn.addEventListener("click", loadAndRender);

    addNoteBtn.addEventListener("click", handleAddNote);
    remindBtn.addEventListener("click", handleRemind);
}

async function loadAndRender() {
    loadingEl.hidden = false; // show loading state
    errorEl.hidden = true; // side error state
    clientListEl.hidden = true; // side client list

    try {
        clients = await loadClients(); // fetch clients 
        loadingEl.hidden = true; // hide loading
        clientListEl.hidden = false; // show client list
        render(); // render the list
    } catch (err) {
        loadingEl.hidden = true; // hide loading
        errorEl.hidden = false; // show error
    }
}

function save() {
    localStorage.setItem("crm_clients", JSON.stringify(clients));
}

function getVisibleClients() {
    let list = [...clients]; //copy of client array
    //filters with status
    if (activeStatusFilter !== "All") {
        list = list.filter(c => c.status === activeStatusFilter);
    }
    //search filter by name or company name
    if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        list = list.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.company.toLowerCase().includes(term)
        );
    }
    //sort switch
    switch (currentSort) {
        case "name":
            list.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "deal":
            list.sort((a, b) => b.dealValue - a.dealValue);
            break;
        case "newest":
        default:
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    return list;
}

function render() {
    const visible = getVisibleClients(); //gets filtered or sorted array
    //clears the previous array
    clientListEl.innerHTML = "";

    emptyEl.hidden = visible.length !== 0;

    visible.forEach(client => {
        clientListEl.appendChild(createClientCard(client));
    });
}

function statusBadgeClass(status) {
    //maps statuses to css classes for styling
    const map = {
        Lead: "badge-lead",
        Contacted: "badge-contacted",
        Won: "badge-won",
        Lost: "badge-lost"
    };
    return map[status] || "badge-lead";
}

function formatMoney(value) {
    return "$" + Number(value).toLocaleString("en-US");
}

function createClientCard(client) {
    const card = document.createElement("article");
    card.className = "client-card";
    card.dataset.id = client.id;

    card.innerHTML = `
        <img class="avatar" src="${client.image || ""}" alt="${client.name}">
        <div class="client-info">
            <h3 class="client-name">${client.name}</h3>
            <p class="client-company">${client.company || ""}</p>
            <p class="client-email">${client.email}</p>
            <span class="status-badge ${statusBadgeClass(client.status)}">${client.status}</span>
            <p class="deal-value">${formatMoney(client.dealValue)}</p>
        </div>
        <div class="card-actions">
            <select class="status-select">
                <option value="Lead">Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
            </select>
            <button type="button" class="delete-btn">Delete</button>
        </div>
    `;
    //ipdate client status if changed from dropdown
    card.querySelector(".status-select").value = client.status;


    card.querySelector(".status-select").addEventListener("change", (e) => {
        handleStatusChange(client.id, e.target.value);
    });

    card.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // prevent card click from triggering
        handleDelete(client.id);
    });

    // Open details modal on card click (unless clicking a button/select)
    card.addEventListener("click", (e) => {
        if (e.target.closest("select") || e.target.closest("button")) return;
        openDetailsModal(client.id);
    });

    return card;
}

function openAddClientModal() {
    addClientForm.reset();//resets the form
    clearFormErrors();//clear the errors
    addClientModal.hidden = false;//shows the form
}

function clearFormErrors() {
    document.querySelectorAll(".field-error").forEach(el => (el.textContent = ""));
}

function setFieldError(fieldId, message) {
    const el = document.querySelector(`.field-error[data-for="${fieldId}"]`);
    if (el) el.textContent = message;
}

function validateAddClientForm(data) {
    let valid = true;
    clearFormErrors();

    if (!data.name || data.name.trim().length < 3) {
        setFieldError("field-name", "Name must be at least 3 characters");
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        setFieldError("field-email", "Please enter a valid email address");
        valid = false;
    } else if (clients.some(c => c.email.toLowerCase() === data.email.toLowerCase())) {
        setFieldError("field-email", "A client with this email already exists");
        valid = false;
    }

    if (data.phone && data.phone.trim().length > 0 && data.phone.trim().length < 6) {
        setFieldError("field-phone", "Phone number looks too short");
        valid = false;
    }

    const dealValue = Number(data.dealValue);
    if (!data.dealValue || isNaN(dealValue) || dealValue <= 0) {
        setFieldError("field-deal-value", "Deal value must be a positive number");
        valid = false;
    }

    return valid;
}

async function handleAddClientSubmit(e) {
    e.preventDefault();

    // Disable the submit button to prevent multiple submissions
    const submitBtn = addClientForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const formData = new FormData(addClientForm);
    const data = Object.fromEntries(formData.entries());

    if (!validateAddClientForm(data)){
        submitBtn.disabled = false;
        return; //validate form
    }

    const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone ? data.phone.trim() : "",
        company: data.company ? data.company.trim() : "",
        dealValue: Number(data.dealValue),
        status: data.status
    };

    try {
        const response = await fetch("https://dummyjson.com/users/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        const newClient = {
            //make sure ids are unique
            id: result.id + Date.now().toString() + Math.floor(Math.random() * 10000),
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            company: payload.company,
            image: "https://dummyjson.com/icon/jamesd/128",
            status: payload.status,
            dealValue: payload.dealValue,
            notes: [],
            createdAt: new Date().toISOString()
        };

        clients.unshift(newClient);//add at the beggining of the array
        save();//save to local storage
        render();// re-render the list
        closeModals();// close modals
        showToast("Client added ✓");//show success toast
    } catch (err) {
        console.log(err);
        showToast("Could not add client. Try again.");//error toast
    }finally {
        // Re-enable the submit button after submission 
        submitBtn.disabled = false;
    }
}

function handleStatusChange(id, newStatus) {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    client.status = newStatus;
    save();
    render();
}

async function handleDelete(id) {
    //confirm delete
    const confirmed = confirm("Delete this client? This cannot be undone.");
    if (!confirmed) return;

    try {
        await fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" });
    } catch (err) {
        console.log(err);
    }

    clients = clients.filter(c => c.id !== id);
    save();
    render();
    showToast("Client deleted");
}

function openDetailsModal(id) {
    currentDetailsClientId = id;
    const client = clients.find(c => c.id === id);
    if (!client){
        return;
    }

    detailsModal.querySelector(".avatar").src = client.image || "";
    detailsModal.querySelector(".details-name").textContent = client.name;
    detailsModal.querySelector(".details-company").textContent = client.company || "";
    detailsModal.querySelector(".details-email").textContent = client.email;
    detailsModal.querySelector(".details-phone").textContent = client.phone || "";
    detailsModal.querySelector(".details-status").textContent = client.status;
    detailsModal.querySelector(".details-deal-value").textContent = formatMoney(client.dealValue);
    detailsModal.querySelector(".details-since").textContent =
        "Client since " + new Date(client.createdAt).toLocaleDateString();

    renderNotes(client);
    noteInput.value = "";
    detailsModal.hidden = false;
}

function renderNotes(client) {
    notesList.innerHTML = "";

    if (client.notes.length === 0) {
        const li = document.createElement("li");
        li.className = "no-notes";
        li.textContent = "No notes yet";
        notesList.appendChild(li);
        return;
    }
    client.notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = `${note.text} — ${note.date}`;
        notesList.appendChild(li);
    });
}

// Add note
function handleAddNote() {
    const text = noteInput.value.trim();
    if (text === "") return;
    //finds the client to add notes
    const client = clients.find(c => c.id === currentDetailsClientId);
    if (!client) return;

    client.notes.push({
        text,
        date: new Date().toLocaleString()
    });

    save();
    renderNotes(client);
    noteInput.value = "";
}


function handleRemind() {
    const client = clients.find(c => c.id === currentDetailsClientId);
    if (!client) return;

    const clientName = client.name;
    showToast("Reminder set ✓");

    setTimeout(() => {
        showToast(`⏰ Follow up: ${clientName}`);
    }, 60000);
}

function closeModals() {
    addClientModal.hidden = true;
    detailsModal.hidden = true;
    currentDetailsClientId = null;
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}