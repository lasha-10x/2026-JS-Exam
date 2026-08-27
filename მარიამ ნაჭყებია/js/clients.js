const API_URL = "https://dummyjson.com/users";

const pageLimit = window.location.pathname.includes('dashboard') ? 5 : null;

const modalOverlay = document.getElementById('addClientModal');
const addClientBtn = document.querySelector('.add-client-btn');
const closeBtn = document.querySelector('.modal-close-btn');
const addClientForm = document.getElementById('addClientForm');


function loadClientsOnStartup(limit = null) {
    filterAndRenderClients(limit);
}

function renderListMessage(html) {
    const tbody = document.getElementById("clientsTableBody");
    if (!tbody) return;
    tbody.innerHTML = html;
}

async function loadUsersFromApi() {
    renderListMessage(`<tr><td colspan="3" class="empty-message">Loading clients...</td></tr>`);

    try {
        const response = await fetch('https://dummyjson.com/users?limit=30');

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        const apiClients = data.users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || '+995 500 000 000',
            company: user.company ? user.company.name : 'N/A',
            image: user.image || '',
            dealValue: Math.floor(Math.random() * 9500) + 500,
            status: 'Lead',
            notes: [],
            createdAt: new Date().toISOString()
        }));

        localStorage.setItem('crm_clients', JSON.stringify(apiClients));
        loadClientsOnStartup(pageLimit);
    } catch (error) {
        console.log("Failed to load clients from API", error);
        renderListMessage(`
            <tr><td colspan="3" class="empty-message">
                Could not load clients. Check your connection and try again.
                <button id="retryLoadClients" class="retry-btn">Retry</button>
            </td></tr>
        `);
        const retryBtn = document.getElementById('retryLoadClients');
        if (retryBtn) retryBtn.addEventListener('click', loadUsersFromApi);
    }
}

//this is async function for deleting client
async function deleteClient(clientId) {
    if (!clientId) return;
    if (!confirm("Delete this client? This cannot be undone.")) return;

    try {
        await fetch(`https://dummyjson.com/users/${clientId}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.log("Server delete skipped");
    }

    let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
    savedClients = savedClients.filter(client => String(client.id) !== String(clientId));
    localStorage.setItem('crm_clients', JSON.stringify(savedClients));

    loadClientsOnStartup(pageLimit);
    showToast("Client deleted");
}

document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const clientId = deleteBtn.getAttribute('data-id');
        deleteClient(clientId);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedClients = localStorage.getItem('crm_clients');
    if (!savedClients) {
        loadUsersFromApi();
    } else {
        loadClientsOnStartup(pageLimit);
    }
});

if (addClientBtn) {
    addClientBtn.addEventListener('click', () => {
        if (modalOverlay) modalOverlay.style.display = 'flex';
    });
}

const closeModal = () => {
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (addClientForm) addClientForm.reset();
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

if (addClientForm) {
    addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const company = document.getElementById('clientCompany').value.trim();
        const dealValue = document.getElementById('clientDealValue').value;
        const status = document.getElementById('clientStatus').value;

        if (name.length < 3) {
            showToast("Name must be at least 3 characters");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showToast("Please enter a valid email address");
            return;
        }

        const existingClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        if (existingClients.some(client => client.email && client.email.toLowerCase() === email.toLowerCase())) {
            showToast("A client with this email already exists");
            return;
        }
        if (phone !== '' && phone.length < 6) {
            showToast("Phone number looks too short");
            return;
        }
        if (isNaN(dealValue) || Number(dealValue) <= 0) {
            showToast("Deal value must be a positive number");
            return;
        }

        const newClientData = {
            name,
            email,
            phone,
            company: company || '-',
            dealValue: Number(dealValue),
            status,
            notes: [],
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClientData)
            });

            if (response.ok) {
                await response.json();
                newClientData.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

                existingClients.unshift(newClientData);
                localStorage.setItem('crm_clients', JSON.stringify(existingClients));

                closeModal();
                loadClientsOnStartup(pageLimit);
                showToast("Client added successfully!");
            } else {
                newClientData.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                existingClients.unshift(newClientData);
                localStorage.setItem('crm_clients', JSON.stringify(existingClients));

                closeModal();
                loadClientsOnStartup(pageLimit);
                showToast("Client added locally (server rejected request).");
            }
        } catch (error) {
            console.error("Error:", error);
            newClientData.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            existingClients.unshift(newClientData);
            localStorage.setItem('crm_clients', JSON.stringify(existingClients));

            closeModal();
            loadClientsOnStartup(pageLimit);
            showToast("Client added locally (Connection error).");
        }
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('details-btn')) {
        const clientId = e.target.getAttribute('data-id');

        const savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        const client = savedClients.find(c => String(c.id) === String(clientId));

        if (client) {
            document.getElementById('detailName').textContent = client.name || 'N/A';
            document.getElementById('detailEmail').textContent = client.email || 'N/A';
            document.getElementById('detailPhone').textContent = client.phone || 'N/A';
            document.getElementById('detailCompany').textContent = client.company || '-';
            document.getElementById('detailStatus').textContent = client.status || 'Lead';
            document.getElementById('detailDealValue').textContent = client.dealValue ? `$${client.dealValue}` : 'N/A';

            const formattedDate = client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'N/A';
            document.getElementById('detailCreatedAt').textContent = formattedDate;

            const modal = document.getElementById('clientDetailsModal');
            if (modal) {
                modal.setAttribute('data-current-id', client.id);
                fillNotes(client.notes || []);
                modal.style.display = 'flex';
            }
        }
    }
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('clientDetailsModal');
    if (!modal) return;

    if (e.target.id === 'closeDetailsModal' || e.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-note-btn')) {
        const modal = document.getElementById('clientDetailsModal');
        const clientId = modal.getAttribute('data-current-id');
        const textarea = document.getElementById('noteInput');
        const noteText = textarea.value.trim();

        if (!noteText) return;
        const newNote = {
            text: noteText,
            date: new Date().toLocaleString('en-US')
        };

        let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        savedClients = savedClients.map(client => {
            if (String(client.id) === String(clientId)) {
                if (!client.notes) client.notes = [];
                client.notes.unshift(newNote);
            }
            return client;
        });
        localStorage.setItem('crm_clients', JSON.stringify(savedClients));

        const updatedClient = savedClients.find(c => String(c.id) === String(clientId));
        fillNotes(updatedClient.notes);
        textarea.value = '';
    }
});

function fillNotes(notes) {
    const container = document.getElementById('notesListContainer');
    if (!container) return;
    container.innerHTML = '';

    notes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'note-item';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'note-date';
        dateDiv.textContent = note.date;

        const textP = document.createElement('p');
        textP.className = 'note-text';
        textP.textContent = note.text;

        item.appendChild(dateDiv);
        item.appendChild(textP);
        container.appendChild(item);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('reminder-btn')) {
        const modal = document.getElementById('clientDetailsModal');
        const clientId = modal.getAttribute('data-current-id');

        let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        const client = savedClients.find(c => String(c.id) === String(clientId));
        const clientName = client ? client.name : 'Client';

        showToast("Reminder set");
        setTimeout(() => {
            showToast(`Follow up: ${clientName}`);
        }, 60000);
    }
});


//function for filter and search
let currentFilter = 'All';
let currentSearch = '';

const filterChips = document.querySelectorAll('.filter-chips .chip');
const searchInput = document.querySelector('.filters-panel .search-box input');
const sortSelect = document.querySelector('.sort-box select');


filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
        filterChips.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.textContent.trim();
        filterAndRenderClients(pageLimit);
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndRenderClients(pageLimit);
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        filterAndRenderClients(pageLimit);
    });
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('table-status-select')) {
        const clientId = e.target.getAttribute('data-id');
        const newStatus = e.target.value;

        let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        savedClients = savedClients.map(client => {
            if (String(client.id) === String(clientId)) {
                client.status = newStatus;
            }
            return client;
        });
        localStorage.setItem('crm_clients', JSON.stringify(savedClients));

        showToast('Status updated');
        filterAndRenderClients(pageLimit);
    }
});

function getVisibleClients() {
    let clients = JSON.parse(localStorage.getItem('crm_clients')) || [];

    if (currentFilter !== 'All') {
        clients = clients.filter(client => client.status && client.status.toLowerCase() === currentFilter.toLowerCase());
    }

    if (currentSearch.trim() !== '') {
        const searchText = currentSearch.toLowerCase();
        clients = clients.filter(client =>
            (client.name && client.name.toLowerCase().includes(searchText)) ||
            (client.company && client.company.toLowerCase().includes(searchText))
        );
    }

    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === 'newest') {
            clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortValue === 'oldest') {
            clients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortValue === 'name') {
            clients.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
    }

    return clients;
}

function filterAndRenderClients(limit = null) {
    let visibleClients = getVisibleClients();

    if (limit) {
        visibleClients = visibleClients.slice(0, limit);
    }

    showClients(visibleClients);
}


function createClientRow(client, initials) {
    const tr = document.createElement('tr');

    const infoTd = document.createElement('td');

    const infoCell = document.createElement('div');
    infoCell.className = 'client-info-cell';

    const avatar = document.createElement('div');
    avatar.className = 'client-avatar';
    avatar.textContent = initials;

    const detailsText = document.createElement('div');
    detailsText.className = 'client-details-text';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'client-name';
    nameSpan.textContent = client.name;

    const subtextSpan = document.createElement('span');
    subtextSpan.className = 'client-subtext';
    subtextSpan.textContent = `${client.company || 'N/A'} · ${client.email}`;

    const dealSpan = document.createElement('span');
    dealSpan.className = 'client-deal';
    dealSpan.textContent = `$${Number(client.dealValue || 0).toLocaleString()}`;

    detailsText.appendChild(nameSpan);
    detailsText.appendChild(subtextSpan);
    detailsText.appendChild(dealSpan);

    infoCell.appendChild(avatar);
    infoCell.appendChild(detailsText);
    infoTd.appendChild(infoCell);

    if (pageLimit !== null) {
        const statusTd = document.createElement('td');
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'badge';
        badgeSpan.textContent = client.status || '';
        statusTd.appendChild(badgeSpan);

        tr.appendChild(infoTd);
        tr.appendChild(statusTd);

        return tr;
    }

    const statusTd = document.createElement('td');
    const select = document.createElement('select');
    select.className = 'table-status-select';
    select.setAttribute('data-id', client.id);

    ['Lead', 'Contacted', 'Won', 'Lost'].forEach(statusOption => {
        const option = document.createElement('option');
        option.value = statusOption;
        option.textContent = statusOption;
        if (client.status === statusOption) option.selected = true;
        select.appendChild(option);
    });

    statusTd.appendChild(select);

    const actionsTd = document.createElement('td');
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'table-actions';

    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'details-btn';
    detailsBtn.setAttribute('data-id', client.id);
    detailsBtn.textContent = 'Details';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('data-id', client.id);
    deleteBtn.textContent = 'Delete';

    actionsDiv.appendChild(detailsBtn);
    actionsDiv.appendChild(deleteBtn);
    actionsTd.appendChild(actionsDiv);

    tr.appendChild(infoTd);
    tr.appendChild(statusTd);
    tr.appendChild(actionsTd);

    return tr;
}

function showClients(list) {
    const tbody = document.getElementById("clientsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (list.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 3;
        td.className = 'empty-message';
        td.textContent = 'No clients found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    list.forEach((client) => {
        const initials = client.name ? client.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "CL";
        tbody.appendChild(createClientRow(client, initials));
    });
}