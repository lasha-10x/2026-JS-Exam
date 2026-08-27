const API_URL = 'https://dummyjson.com/users';
let clients = [];
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await initializeClients();
    setupEventListeners();
    renderClients();
    updateWelcomeUser();
});

async function initializeClients() {
    const localData = localStorage.getItem('crm_clients');
    
    if (localData) {
        clients = JSON.parse(localData);
        
    } else {
        try {
            const response = await fetch(`${API_URL}?limit=30`);
            const data = await response.json();

            const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];
            
            clients = data.users.map((u, index) => ({
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone || '+1 555-0199',
                gender: u.gender || (index % 2 === 0 ? 'male' : 'female'),
                status: statuses[index % statuses.length],
                note: 'Imported from DummyJSON API'
            }));
            saveToLocalStorage();
        } catch (error) {
            console.error('Error fetching clients:', error);
            clients = [];
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
}

function updateWelcomeUser() {
    const welcomeSpan = document.getElementById('welcome_user');
    const session = JSON.parse(localStorage.getItem('crm_session'));
    if (welcomeSpan && session) {
        const firstName = session.firstName || session.first_name || '';
        const lastName = session.lastName || session.last_name || '';
        let fullName = `${firstName} ${lastName}`.trim();
        
        if (!fullName) {
            fullName = session.fullName || session.name || '';
        }
        
        if (!fullName && session.email) {
            fullName = session.email.split('@')[0];
        }
        
        const nameToShow = fullName || 'User';
        welcomeSpan.innerHTML = `<br><span style="white-space: nowrap;">${nameToShow}</span>`;
    }
}

function renderClients() {
    const container = document.getElementById('clients_cards_container');
    const searchTerm = document.getElementById('search_input').value.toLowerCase();
    const activeChip = document.querySelector('.status-chips .chip.active');
    const activeStatus = activeChip ? activeChip.getAttribute('data-status') : 'All';
    const selectedGender = document.getElementById('genderSelect').value;
    const sortValue = document.getElementById('sortSelect').value;

    let filtered = clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        const email = client.email.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm) || email.includes(searchTerm);
        const matchesStatus = activeStatus === 'All' || client.status === activeStatus;
        const matchesGender = selectedGender === 'All' || client.gender === selectedGender;
        return matchesSearch && matchesStatus && matchesGender;
    });

    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortValue === 'name-desc') {
        filtered.sort((a, b) => b.firstName.localeCompare(a.firstName));
    } else if (sortValue === 'email-asc') {
        filtered.sort((a, b) => a.email.localeCompare(b.email));
    }

    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = '<p>No clients found.</p>';
        return;
    }

    filtered.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        
        const initials = `${client.firstName[0] || ''}${client.lastName[0] || ''}`.toUpperCase();

        card.innerHTML = `
            <div class="client-card-top">
                <div class="client-avatar">${initials}</div>
                <div class="client-title-area">
                    <h3>${client.firstName} ${client.lastName}</h3>
                    <p>${client.email}</p>
                </div>
            </div>
            <div class="client-info-body">
                <p><strong>Phone:</strong> ${client.phone}</p>
                <p><strong>Gender:</strong> ${client.gender}</p>
            </div>
            <div class="client-card-footer">
                <span class="badge status-${client.status.toLowerCase()}">${client.status}</span>
                <button class="btn-danger" onclick="event.stopPropagation(); deleteClient(${client.id})">Delete</button>
            </div>
        `;

        let clickTimer = null;
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-danger')) return;

            if (clickTimer === null) {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    openDetailsModal(client.id);
                }, 250);
            } else {
                clearTimeout(clickTimer);
                clickTimer = null;
                openDetailsModal(client.id);
                setTimeout(() => {
                    document.getElementById('modal_preview_mode').style.display = 'none';
                    document.getElementById('editClientForm').style.display = 'block';

                    const c = clients.find(item => item.id === client.id);
                    if (c) {
                        document.getElementById('edit_firstName').value = c.firstName;
                        document.getElementById('edit_lastName').value = c.lastName;
                        document.getElementById('edit_email').value = c.email;
                        document.getElementById('edit_phone').value = c.phone || '';
                        document.getElementById('edit_gender').value = c.gender;
                        document.getElementById('edit_status').value = c.status;
                        document.getElementById('edit_note').value = c.note || '';
                    }
                }, 50);
            }
        });

        container.appendChild(card);
    });
}

function setupEventListeners() {
    document.getElementById('search_input').addEventListener('input', renderClients);

    const chips = document.querySelectorAll('.status-chips .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            chips.forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            renderClients();
        });
    });

    document.getElementById('genderSelect').addEventListener('change', renderClients);
    document.getElementById('sortSelect').addEventListener('change', renderClients);

    const addModal = document.getElementById('addClientModal');
    document.getElementById('addClientBtn').addEventListener('click', () => {
        addModal.style.display = 'block';
    });
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        addModal.style.display = 'none';
    });
    document.getElementById('cancelModalBtn').addEventListener('click', () => {
        addModal.style.display = 'none';
    });

    document.getElementById('addClientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newClient = {
            id: Date.now(),
            firstName: document.getElementById('new_firstName').value,
            lastName: document.getElementById('new_lastName').value,
            email: document.getElementById('new_email').value,
            phone: '+1 555-0199',
            gender: document.getElementById('new_gender').value,
            status: document.getElementById('new_status').value,
            note: 'Manually added client'
        };

        try {
            await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });
        } catch (err) {
            console.error('API Error on add:', err);
        }

        clients.unshift(newClient);
        saveToLocalStorage();
        renderClients();
        e.target.reset();
        addModal.style.display = 'none';
    });

    const detailsModal = document.getElementById('clientDetailsModal');
    document.getElementById('closeDetailsModalBtn').addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        document.getElementById('modal_preview_mode').style.display = 'block';
        document.getElementById('editClientForm').style.display = 'none';
    });
    document.getElementById('switchToEditBtn').addEventListener('click', () => {
        document.getElementById('modal_preview_mode').style.display = 'none';
        document.getElementById('editClientForm').style.display = 'block';

        const client = clients.find(c => c.id === currentEditingId);
        if (client) {
            document.getElementById('edit_firstName').value = client.firstName;
            document.getElementById('edit_lastName').value = client.lastName;
            document.getElementById('edit_email').value = client.email;
            document.getElementById('edit_phone').value = client.phone || '';
            document.getElementById('edit_gender').value = client.gender;
            document.getElementById('edit_status').value = client.status;
            document.getElementById('edit_note').value = client.note || '';
        }
    });

    document.getElementById('editClientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const index = clients.findIndex(c => c.id === currentEditingId);
        if (index !== -1) {
            clients[index] = {
                ...clients[index],
                firstName: document.getElementById('edit_firstName').value,
                lastName: document.getElementById('edit_lastName').value,
                email: document.getElementById('edit_email').value,
                phone: document.getElementById('edit_phone').value,
                gender: document.getElementById('edit_gender').value,
                status: document.getElementById('edit_status').value,
                note: document.getElementById('edit_note').value
            };

            try {
                await fetch(`${API_URL}/${currentEditingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clients[index])
                });
            } catch (err) {
                console.error('API Error on update:', err);
            }

            saveToLocalStorage();
            renderClients();
            detailsModal.style.display = 'none';
        }
    });

    const logoutBtn = document.getElementById('logout_butt');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('crm_session');
            window.location.href = 'index.html';
        });
    }
}

async function openDetailsModal(id) {
    currentEditingId = id;
    const client = clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('modal_client_name').textContent = `${client.firstName} ${client.lastName}`;
    document.getElementById('view_email').textContent = client.email;
    document.getElementById('view_phone').textContent = client.phone;
    document.getElementById('view_gender').textContent = client.gender;
    document.getElementById('view_status').textContent = client.status;
    document.getElementById('view_note').textContent = client.note || '-';

    document.getElementById('modal_preview_mode').style.display = 'block';
    document.getElementById('editClientForm').style.display = 'none';
    document.getElementById('clientDetailsModal').style.display = 'block';
}

async function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
    } catch (err) {
        console.error('API Error on delete:', err);
    }

    clients = clients.filter(c => c.id !== id);
    saveToLocalStorage();
    renderClients();
}