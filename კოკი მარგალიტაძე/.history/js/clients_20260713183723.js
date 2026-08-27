// clients.js
// Handles loading clients (from storage or API), transforming API data,
// and rendering the client list on clients.html
//
// Depends on: storage.js (window.CRMStorage), toast.js (window.showToast)

let clientsState = [];

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
    container.innerHTML = '<p id="clients-loading-msg">Loading clients...</p>';

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
    container.innerHTML = '';

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


    // 1. Status filter
    if (currentStatusFilter !== 'All') {
        visibleClients = visibleClients.filter(client =>
            client.status === currentStatusFilter
        );
    }


    // 2. Search filter
    if (currentSearchTerm) {

        const search = currentSearchTerm.toLowerCase();

        visibleClients = visibleClients.filter(client =>
            client.name.toLowerCase().includes(search) ||
            client.company.toLowerCase().includes(search)
        );
    }


    // 3. Sorting
    if (currentSort === 'name') {

        visibleClients.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (currentSort === 'value') {

        visibleClients.sort((a, b) =>
            b.dealValue - a.dealValue
        );

    } else if (currentSort === 'newest') {

        visibleClients.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

    }


    return visibleClients;
}

// ===== ADD CLIENT MODAL =====

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

addClientBtn.addEventListener('click', () => {
    addClientModal.style.display = 'flex';
});

addClientModal.addEventListener('click', (e) => {
    if (e.target === addClientModal) {
        closeAddClientModal();
    }
});


document.addEventListener('click', function(e) {

    const card = e.target.closest('.client-card');

    if (!card) return;


    // Ignore clicks on buttons/selects inside the card
    if (
        e.target.classList.contains('delete-client-btn') ||
        e.target.classList.contains('client-status-select')
    ) {
        return;
    }


    const clientId = Number(card.dataset.id);

    openClientDetail(clientId);

});

function closeAddClientModal() {
    addClientModal.style.display = 'none';
    addClientForm.reset();
    addClientErrorList.innerHTML = '';
    addClientErrorBox.style.display = 'none';
    clearAddClientFieldErrors();
}

function clearAddClientFieldErrors() {
    ['client-name', 'client-email', 'client-phone', 'client-deal-value'].forEach(id => {
        document.getElementById(id).classList.remove('input-error');
    });
}

addClientForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim().toLowerCase();
    const phone = document.getElementById('client-phone').value.trim();
    const company = document.getElementById('client-company').value.trim();
    const dealValueRaw = document.getElementById('client-deal-value').value.trim();
    const status = document.getElementById('client-status').value;

    addClientErrorList.innerHTML = '';
    addClientErrorBox.style.display = 'none';
    clearAddClientFieldErrors();

    const errors = [];

    if (!name || name.length < 3) {
        errors.push('Name must be at least 3 characters');
        document.getElementById('client-name').classList.add('input-error');
    }

    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
        errors.push('Please enter a valid email address');
        document.getElementById('client-email').classList.add('input-error');
    } else if (clientsState.some(c => c.email.toLowerCase() === email)) {
        errors.push('A client with this email already exists');
        document.getElementById('client-email').classList.add('input-error');
    }

    if (phone && phone.length < 6) {
        errors.push('Phone number looks too short');
        document.getElementById('client-phone').classList.add('input-error');
    }

    const dealValue = Number(dealValueRaw);
    if (!dealValueRaw || isNaN(dealValue) || dealValue <= 0) {
        errors.push('Deal value must be a positive number');
        document.getElementById('client-deal-value').classList.add('input-error');
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
            body: JSON.stringify({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') })
        });

        const result = await response.json();

        const newClient = {
            id: result.id,
            name: name,
            email: email,
            phone: phone,
            company: company,
            image: 'https://dummyjson.com/icon/user/128',
            status: status,
            dealValue: dealValue,
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


document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-client-btn')) {
        const clientId = Number(e.target.dataset.id);

        deleteClient(clientId);
    }
});

async function deleteClient(clientId) {

    const confirmed = confirm("Are you sure you want to delete this client?");

    if (!confirmed) return;

    try {

        await fetch(`https://dummyjson.com/users/${clientId}`, {
            method: 'DELETE'
        });


        clientsState = clientsState.filter(client => client.id !== clientId);


        CRMStorage.setClients(clientsState);


        renderClients(getVisibleClients());


        window.showToast('Client deleted ✓', 'success');


    } catch (err) {

        window.showToast('Could not delete client. Please try again.', 'error');

    }
}

document.addEventListener('change', function(e) {

    if (e.target.classList.contains('client-status-select')) {

        const clientId = Number(e.target.dataset.id);
        const newStatus = e.target.value;

        const client = clientsState.find(c => c.id === clientId);

        if (client) {
            client.status = newStatus;

            CRMStorage.setClients(clientsState);

            renderClients(getVisibleClients());

            window.showToast('Client status updated ✓', 'success');
        }
    }

});

searchInput.addEventListener('input', function(e) {

    currentSearchTerm = e.target.value.trim();

    renderClients(getVisibleClients());

});

filterChips.forEach(chip => {

    chip.addEventListener('click', function() {

        filterChips.forEach(c => c.classList.remove('active'));

        this.classList.add('active');


        currentStatusFilter = this.dataset.status;


        renderClients(getVisibleClients());

    });

});


sortSelect.addEventListener('change', function(e) {

    currentSort = e.target.value;

    renderClients(getVisibleClients());

});

function openClientDetail(clientId) {

    const client = clientsState.find(c => c.id === clientId);


    if (!client) return;


    clientDetailContent.innerHTML = `

        <h2>${client.name}</h2>

        <p><strong>Email:</strong> ${client.email}</p>

        <p><strong>Phone:</strong> ${client.phone || 'No phone'}</p>

        <p><strong>Company:</strong> ${client.company}</p>

        <p><strong>Status:</strong> ${client.status}</p>

        <p><strong>Deal Value:</strong> $${client.dealValue.toLocaleString()}</p>


        <h3>Notes</h3>

        <ul id="client-notes-list">
            ${
                client.notes.length > 0
                ? client.notes.map(note => `<li>${note}</li>`).join('')
                : '<li>No notes yet</li>'
            }
        </ul>


        <input 
            id="client-note-input"
            class="form-control"
            placeholder="Add a note..."
        >


        <button id="add-note-btn" class="btn btn-primary">
            Add Note
        </button>


        <button id="reminder-btn" class="btn btn-primary">
            Remind me in 1 min
        </button>


        <button id="close-detail-btn" class="btn-logout">
            Close
        </button>

    `;


    clientDetailModal.style.display = 'flex';



    document.getElementById('close-detail-btn')
        .addEventListener('click', () => {
            clientDetailModal.style.display = 'none';
        });



    document.getElementById('add-note-btn')
        .addEventListener('click', () => {

            const input = document.getElementById('client-note-input');

            const note = input.value.trim();


            if (!note) return;


            client.notes.push(note);


            CRMStorage.setClients(clientsState);


            openClientDetail(clientId);


            window.showToast('Note added ✓', 'success');

        });



    document.getElementById('reminder-btn')
        .addEventListener('click', () => {


            window.showToast(
                'Reminder set for 1 minute',
                'success'
            );


            setTimeout(() => {

                window.showToast(
                    `Reminder: Follow up with ${client.name}`,
                    'success'
                );

            }, 60000);


        });

}