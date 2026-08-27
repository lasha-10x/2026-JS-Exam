// clients.js
// Handles loading clients (from storage or API), transforming API data,
// and rendering the client list on clients.html
//
// Depends on: storage.js (window.CRMStorage), toast.js (window.showToast)

let clientsState = [];
// switch is off for catogory filtering
let currentStatusFilter = 'All';
let currentSearchTerm = '';
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    loadClients();
});

async function loadClients() {
    const container = document.getElementById('clients-list-container');

    // 1. Check localStorage first
    const stored = CRMStorage.getClients();
    if (stored && stored.length > 0) {
        clientsState = stored;
        renderClients(clientsState);
        return;
    }

    // 2. No stored clients — fetch from API
    // container.innerHTML = '<p id="clients-loading-msg">Loading clients...</p>';

    try {
        const response = await fetch('https://dummyjson.com/users?limit=30');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // 3. Transform API users into our Client object shape
        clientsState = data.users.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            company: user.company.name,
            image: user.image,
            status: 'Lead',
            dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
            notes: [],
            createdAt: new Date().toISOString(),
        }));

        // 4. Save to localStorage immediately
        CRMStorage.setClients(clientsState);
        renderClients(clientsState);

    } catch (err) {
        container.innerHTML = `
            <p>Could not load clients. Check your connection and try again.</p>
            <button id="retry-load-btn" class="btn btn-primary" style="width:auto;">Retry</button>
        `;
        document.getElementById('retry-load-btn').addEventListener('click', loadClients);
    }
}

function renderClients(list) {
    const container = document.getElementById('clients-list-container');
    
    // this is here to provide constant refresh
    // everytime we update the clients list - this code says : we start from scratch
    container.innerHTML = '';


    // essential code in every function where there is a posibility of the abcens of the very thing the function summons!
    if (list.length === 0) {
        container.innerHTML = '<p>No clients found.</p>';
        return;
    }

    
    const grid = document.createElement('div');
    grid.className = 'clients-grid';

    list.forEach((client) => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.dataset.id = client.id;
        card.innerHTML = `
            <div class="client-card-header">
                <img src="${client.image}" alt="${client.name}" class="client-card-avatar">
                <div>
                    <div class="client-card-name">${client.name}</div>
                    <div class="client-card-company">${client.company}</div>
                </div>
            </div>
            <div>${client.email}</div>
            <select class="client-status-select" data-id="${client.id}">
                <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
                <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
                <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
            </select>
            <div class="client-card-footer">
                <span class="client-card-deal-value">$${client.dealValue.toLocaleString()}</span>
                <button class="btn-logout delete-client-btn" data-id="${client.id}">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function getVisibleClients() {
    let visibleClients = [...clientsState];

    // if we turn on category filtering then we will only see those categories we selected
    if (currentStatusFilter !== 'All') {
        visibleClients = visibleClients.filter(client => client.status === currentStatusFilter);
    }
    
    if (currentSearchTerm) {
        const search = currentSearchTerm.toLowerCase();
        visibleClients = visibleClients.filter(client =>
            client.name.toLowerCase().includes(search) ||
            client.company.toLowerCase().includes(search)
        );
    }

    if (currentSort === 'name') {
        visibleClients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'value') {
        visibleClients.sort((a, b) => b.dealValue - a.dealValue);
    } else if (currentSort === 'newest') {
        visibleClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return visibleClients;
}

// ===== SHARED PAGE ELEMENTS =====
const addClientModal = document.getElementById('add-client-modal');
const clientDetailModal = document.getElementById('client-detail-modal');
const clientDetailContent = document.getElementById('client-detail-content');
const addClientBtn = document.getElementById('add-client-btn');
const searchInput = document.getElementById('client-search');
const filterChips = document.querySelectorAll('.chip');
const sortSelect = document.getElementById('sort-select');
const addClientForm = document.getElementById('add-client-form');
const addClientErrorBox = document.getElementById('add-client-error-box');
const addClientErrorList = document.getElementById('add-client-error-list');

// Cache the Add Client form's fields once, instead of re-querying each one
// every time we validate or clear errors.
const addClientFields = {
    name: document.getElementById('client-name'),
    email: document.getElementById('client-email'),
    phone: document.getElementById('client-phone'),
    company: document.getElementById('client-company'),
    dealValue: document.getElementById('client-deal-value'),
    status: document.getElementById('client-status'),
};

addClientBtn.addEventListener('click', () => {
    addClientModal.style.display = 'flex';
});

addClientModal.addEventListener('click', (e) => {
    if (e.target === addClientModal) closeAddClientModal();
});

document.addEventListener('click', function (e) {
    const card = e.target.closest('.client-card');
    if (!card) return;
    if (e.target.classList.contains('delete-client-btn') || e.target.classList.contains('client-status-select')) {
        return;
    }
    openClientDetail(Number(card.dataset.id));
});

clientDetailModal.addEventListener('click', (e) => {
    if (e.target === clientDetailModal) closeClientDetailModal();  
});


function closeAddClientModal() {
    addClientModal.style.display = 'none';
    addClientForm.reset();
    addClientErrorList.innerHTML = '';
    addClientErrorBox.style.display = 'none';
    clearAddClientFieldErrors();
}

function closeClientDetailModal() {
    clientDetailModal.style.display = 'none';
    clientDetailContent.reset();
}


function clearAddClientFieldErrors() {
    Object.values(addClientFields).forEach(field => field.classList.remove('input-error'));
}

addClientForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = addClientFields.name.value.trim();
    const email = addClientFields.email.value.trim().toLowerCase();
    const phone = addClientFields.phone.value.trim();
    const company = addClientFields.company.value.trim();
    const dealValueRaw = addClientFields.dealValue.value.trim();
    const status = addClientFields.status.value;

    addClientErrorList.innerHTML = '';
    addClientErrorBox.style.display = 'none';
    clearAddClientFieldErrors();

    const errors = [];

    if (!name || name.length < 3) {
        errors.push('Name must be at least 3 characters');
        addClientFields.name.classList.add('input-error');
    }

    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
        errors.push('Please enter a valid email address');
        addClientFields.email.classList.add('input-error');
    } else if (clientsState.some(c => c.email.toLowerCase() === email)) {
        errors.push('A client with this email already exists');
        addClientFields.email.classList.add('input-error');
    }

    if (phone && phone.length < 6) {
        errors.push('Phone number looks too short');
        addClientFields.phone.classList.add('input-error');
    }

    const dealValue = Number(dealValueRaw);
    if (!dealValueRaw || isNaN(dealValue) || dealValue <= 0) {
        errors.push('Deal value must be a positive number');
        addClientFields.dealValue.classList.add('input-error');
    }

    if (errors.length > 0) {
        errors.forEach(err => {
            const li = document.createElement('li');
            li.innerText = err;
            addClientErrorList.appendChild(li);
        });
        addClientErrorBox.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
            }),
        });

        if (!response.ok) throw new Error('Failed to create client');

        const result = await response.json();
        const newClient = {
            id: result.id,
            name, email, phone, company, status, dealValue,
            image: 'https://dummyjson.com/icon/user/128',
            notes: [],
            createdAt: new Date().toISOString(),
        };

        clientsState.unshift(newClient);
        CRMStorage.setClients(clientsState);
        renderClients(getVisibleClients());
        closeAddClientModal();
        window.showToast('Client added ✓', 'success');

    } catch (err) {
        window.showToast('Could not add client. Please try again.', 'error');
    }
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-client-btn')) {
        deleteClient(Number(e.target.dataset.id));
    }
});

async function deleteClient(clientId) {
    const confirmed = confirm('Delete this client? This cannot be undone.');
    if (!confirmed) return;

    try {
        // DummyJSON may 404 on IDs it never actually stored (e.g. ones you added)
        // — that's expected, so we remove locally regardless of the response.
        await fetch(`https://dummyjson.com/users/${clientId}`, { method: 'DELETE' });

        clientsState = clientsState.filter(client => client.id !== clientId);
        CRMStorage.setClients(clientsState);
        renderClients(getVisibleClients());
        window.showToast('Client deleted', 'success');
    } catch (err) {
        window.showToast('Could not delete client. Please try again.', 'error');
    }
}

document.addEventListener('change', function (e) {
    if (e.target.classList.contains('client-status-select')) {
        const client = clientsState.find(c => c.id === Number(e.target.dataset.id));
        if (client) {
            client.status = e.target.value;
            CRMStorage.setClients(clientsState);
            renderClients(getVisibleClients());
            window.showToast('Client status updated ✓', 'success');
        }
    }
});

searchInput.addEventListener('input', function (e) {
    currentSearchTerm = e.target.value.trim();
    renderClients(getVisibleClients());
});

filterChips.forEach(chip => {
    chip.addEventListener('click', function () {
        filterChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        console.log(this.dataset);
        currentStatusFilter = this.dataset.status;
        renderClients(getVisibleClients());
    });
});

sortSelect.addEventListener('change', function (e) {
    currentSort = e.target.value;
    renderClients(getVisibleClients());
});

function openClientDetail(clientId) {
    const client = clientsState.find(c => c.id === clientId);
    if (!client) return;

    clientDetailContent.innerHTML = `
        <h2>${client.name}</h2>
        <div class="client-detail-body">
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone:</strong> ${client.phone || 'No phone'}</p>
            <p><strong>Company:</strong> ${client.company}</p>
            <p><strong>Status:</strong> ${client.status}</p>
            <p><strong>Deal Value:</strong> $${client.dealValue.toLocaleString()}</p>
            <h3>Notes</h3>
            <ul id="client-notes-list">
                ${client.notes.length > 0
                    ? client.notes.map(note => `<li>${note.text} <small>(${note.date})</small></li>`).join('')
                    : '<li>No notes yet</li>'}
            </ul>
            <input id="client-note-input" class="form-control" placeholder="Add a note...">
            <button id="add-note-btn" class="btn btn-primary">Add Note</button>
            <button id="reminder-btn" class="btn btn-primary">Remind me in 1 min</button>
            <button id="close-detail-btn" class="btn-logout">Close</button>
        </div>
    `;

    clientDetailModal.style.display = 'flex';

    document.getElementById('close-detail-btn').addEventListener('click', () => {
        clientDetailModal.style.display = 'none';
    });

    document.getElementById('add-note-btn').addEventListener('click', () => {
        const input = document.getElementById('client-note-input');
        const text = input.value.trim();
        if (!text) return;

        client.notes.push({ text, date: new Date().toLocaleString() });
        CRMStorage.setClients(clientsState);
        openClientDetail(clientId);
        window.showToast('Note added ✓', 'success');
    });

    document.getElementById('reminder-btn').addEventListener('click', () => {
        window.showToast('Reminder set for 1 minute', 'success');
        setTimeout(() => {
            window.showToast(`Reminder: Follow up with ${client.name}`, 'success');
        }, 60000);
    });
}