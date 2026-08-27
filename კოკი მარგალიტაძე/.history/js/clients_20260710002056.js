// clients.js
// Handles loading clients (from storage or API), transforming API data,
// and rendering the client list on clients.html
//
// Depends on: storage.js (window.CRMStorage), toast.js (window.showToast)

let clientsState = []; // in-memory copy of the clients array, source of truth for this page

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
            <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
            <div class="client-card-footer">
                <span class="client-card-deal-value">$${client.dealValue.toLocaleString()}</span>
                <button class="btn-logout delete-client-btn" data-id="${client.id}">Delete</button>
            </div>
        `;

        grid.appendChild(card);
    });

    container.appendChild(grid);
}