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
        clientsState = data.users.map((user) =>