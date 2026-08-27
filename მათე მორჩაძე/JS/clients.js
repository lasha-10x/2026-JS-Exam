// which client is open in modal
let currentDetailClientId = null;

// Render Clients P4.3
const formatCurrency = amount => '$' + amount.toLocaleString('en-US');

function buildClientCard(client) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.setAttribute('data-id', client.id);

    card.innerHTML = `
        <img class="avatar" src="${client.image}" alt="${client.name}" />
        <div class="client-info">
            <h3>${client.name}</h3>
            <p class="client-company">${client.company}</p>
            <p class="client-email">${client.email}</p>
        </div>
        <div class="client-meta">
            <select class="status-select" data-id="${client.id}">
                <option value="Lead" ${client.status === "Lead" ? "selected" : ""}>Lead</option>
                <option value="Contacted" ${client.status === "Contacted" ? "selected" : ""}>Contacted</option>
                <option value="Won" ${client.status === "Won" ? "selected" : ""}>Won</option>
                <option value="Lost" ${client.status === "Lost" ? "selected" : ""}>Lost</option>
            </select>
            <span class="deal-value">${formatCurrency(client.dealValue)}</span>
            <button class="btn btn-danger btn-small delete-btn" data-id="${client.id}">Delete</button>
        </div>
    `;

    return card;
}

function renderClients(clients) {
    const container = document.getElementById('clients-list');
    if (!container) return;

    container.innerHTML = "";

    if (clients.length === 0) {
        container.innerHTML = `<p class="empty-state">No clients found.</p>`;
        return;
    }

    clients.forEach(c => container.appendChild(buildClientCard(c)));
}


// this function doing averything if you call it: filter, search, sort.
function getVisibleClients(clients) {
    let result = [...clients];

    const activeChip = document.querySelector('.filter-chip.active');
    const status = activeChip ? activeChip.dataset.status : 'All';
    if (status !== 'All') {
        result = result.filter(c => c.status === status);
    }

    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query !== '') {
        result = result.filter(c =>
            c.name.toLowerCase().includes(query) || c.company.toLowerCase().includes(query)
        );
    }

    const sortSelect = document.getElementById('sort-select');
    const sortType = sortSelect ? sortSelect.value : 'newest-first';

    if (sortType === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'deal-desc') {
        result.sort((a, b) => b.dealValue - a.dealValue);
    } else {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
}


// ====================
// client modal (panel)
// ====================

function renderNotes(notes) {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;

    if (!notes || notes.length === 0) {
        notesList.innerHTML = `<p class="empty-state">No notes yet.</p>`;
        notesList.classList.add('notes-list-empty');
        return;
    }

    notesList.classList.remove('notes-list-empty');
    notesList.innerHTML = notes.map(note => `
        <div class="note-row">
            <p>${note.text}</p>
            <span>${note.date}</span>
        </div>
    `).join('');
}

function addNoteForm(clients) {
    const noteForm = document.getElementById('add-note-form');
    if (!noteForm) return;

    noteForm.addEventListener('submit', e => {
        e.preventDefault();

        const noteInput = document.getElementById('note-text-input');
        const text = noteInput.value.trim();
        if (text === '') return;

        const client = clients.find(c => c.id === currentDetailClientId);
        if (!client) return;

        client.notes.push({ text, date: new Date().toLocaleString() });
        localStorage.setItem('crm_clients', JSON.stringify(clients));

        renderNotes(client.notes);
        noteForm.reset();
    });
}

function setupClientModal(clients) {
    const container = document.querySelector('.clients-list');
    const modal = document.querySelector('#client-detail-modal');

    if (!container || !modal) return;

    // open modal
    container.addEventListener('click', e => {
        if (e.target.closest('.status-select') || e.target.closest('.delete-btn')) return;

        const clickedCard = e.target.closest('.client-card');
        if (!clickedCard) return;

        const clientId = Number(clickedCard.getAttribute('data-id'));
        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        currentDetailClientId = clientId;
        modal.classList.add('open');

        modal.querySelector('#detail-avatar').src = client.image;
        modal.querySelector('#detail-name').textContent = client.name;
        modal.querySelector('#detail-company').textContent = client.company;
        modal.querySelector('#detail-email').textContent = client.email;
        modal.querySelector('#detail-phone').textContent = client.phone;
        modal.querySelector('#detail-status').textContent = client.status;
        modal.querySelector('#detail-deal-value').textContent = formatCurrency(client.dealValue);
        modal.querySelector('#detail-since').textContent = new Date(client.createdAt).toLocaleDateString("en-US");

        renderNotes(client.notes);
    });

    // remind in 1 minute
    const remindBtn = document.getElementById('remind-btn');
    remindBtn.addEventListener('click', () => {
        const client = clients.find(c => c.id === currentDetailClientId);
        if (!client) return;

        showToast("Reminder set ✓", "success");

        setTimeout(() => {
            showToast(`⏰ Follow up: ${client.name}`, "success");
        }, 60000);
    });

    // close modal
    const closeModal = modal.querySelector('.modal-close');
    modal.addEventListener('click', e => {
        if (e.target === closeModal || !e.target.closest('.modal-box'))
            modal.classList.remove('open');
    });
}


// ====================
// add status changing
// ====================

function changeStatus(clients) {
    const container = document.querySelector('.clients-list');
    if (!container) return;

    container.addEventListener('change', e => {
        let currentSelect = e.target;
        if (!currentSelect.matches(".status-select")) return;

        const clientId = Number(currentSelect.getAttribute('data-id'));
        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        client.status = currentSelect.value;

        localStorage.setItem('crm_clients', JSON.stringify(clients));
        renderClients(getVisibleClients(clients));
    });
}


// ============================
// add Delete button functional
// ============================

function deleteClient(clients) {
    const container = document.querySelector('.clients-list');
    if (!container) return;

    container.addEventListener('click', async e => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (!deleteBtn) return;

        const card = deleteBtn.closest('.client-card');
        const clientId = Number(card.getAttribute('data-id'));

        const confirmed = confirm("Delete this client? This cannot be undone.");
        if (!confirmed) return;

        try {
            const response = await fetch(`https://dummyjson.com/users/${clientId}`, {
                method: 'DELETE'
            });
            if (!response.ok && response.status !== 404) {
                throw new Error('Delete request failed');
            }
        } catch (err) {
            console.error(err);
            // მაინც ვაგრძელებთ ლოკალურ წაშლას - localStorage-ია ჩვენი ნამდვილი წყარო
        }

        const index = clients.findIndex(client => client.id === clientId);
        if (index !== -1) clients.splice(index, 1);

        localStorage.setItem("crm_clients", JSON.stringify(clients));

        renderClients(getVisibleClients(clients));
        showToast("Client deleted", "success");
    });
}


// ======================
// add clients functional
// ======================

function addClient(clients) {
    const modal = document.querySelector('#add-client-modal');
    const clientBtn = document.getElementById('add-client-btn');
    if (!modal || !clientBtn) return;

    clientBtn.addEventListener('click', () => {
        modal.classList.add('open');
    });

    const newUser = {
        name: document.getElementById('new-name'),
        email: document.getElementById('new-email'),
        phone: document.getElementById('new-phone'),
        company: document.getElementById('new-company'),
        deal: document.getElementById('new-deal-value'),
        status: document.getElementById('new-status')
    };

    const addForm = document.getElementById('add-client-form');

    addForm.addEventListener('submit', e => {
        e.preventDefault();
        resetFieldErrors(newUser);

        let isError = false;

        // CHECK name
        if (newUser.name.value.trim().length < 3) {
            showFieldError(newUser.name, "Name must be at least 3 characters");
            isError = true;
        }

        // CHECK Email
        const email = newUser.email.value.trim().toLowerCase();
        const atIndex = email.indexOf('@');

        if (atIndex === -1 || !email.slice(atIndex + 1).includes('.')) {
            showFieldError(newUser.email, "Please enter a valid email address");
            isError = true;
        } else if (clients.some(c => c.email === email)) {
            showFieldError(newUser.email, "An account with this email already exists");
            isError = true;
        }

        // CHECK Deal Value
        let dealValue = newUser.deal.value;
        let isPositiveNumber = dealValue !== "";

        for (let char of dealValue) {
            if (char >= '0' && char <= '9') continue;
            isPositiveNumber = false;
            break;
        }

        if (!isPositiveNumber) {
            showFieldError(newUser.deal, "Deal value must be a positive number");
            isError = true;
        }

        if (isError) return;

        let addNewUser = {
            id: Date.now(),
            name: newUser.name.value.trim(),
            email: email,
            phone: newUser.phone.value.trim(),
            company: newUser.company.value.trim(),
            image: "https://ui-avatars.com/api/?name=" + encodeURIComponent(newUser.name.value.trim()) + "&background=4f8cff&color=fff",
            status: newUser.status.value,
            dealValue: Number(newUser.deal.value),
            notes: [],
            createdAt: new Date().toISOString()
        };

        clients.unshift(addNewUser);
        localStorage.setItem("crm_clients", JSON.stringify(clients));

        renderClients(getVisibleClients(clients));

        addForm.reset();
        modal.classList.remove('open');

        showToast("Client added ✓", "success");
    });

    // close add-client modal
    const closeModal = modal.querySelector('.modal-close');
    modal.addEventListener('click', e => {
        if (e.target === closeModal || !e.target.closest('.modal-box')) {
            resetFieldErrors(newUser);
            modal.classList.remove('open');
        }
    });
}


// ===================================
//      search by name or company
// ===================================

function searchByNameOrCompany(clients) {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        renderClients(getVisibleClients(clients));
    });
}


// =====================
// Add filter functional
// =====================

function filterCards(clients) {
    const filter = document.querySelector('.filter-chips');
    if (!filter) return;

    filter.addEventListener('click', e => {
        if (!e.target.classList.contains('filter-chip')) return;

        const chips = filter.querySelectorAll('.filter-chip');
        chips.forEach(chip => chip.classList.remove('active'));
        e.target.classList.add('active');

        renderClients(getVisibleClients(clients));
    });
}


// ==================================
//           S  O  R  T  S
// ==================================

function sorts(clients) {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
        renderClients(getVisibleClients(clients));
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    // theme toggle
    applyStoredTheme();
    
    let clients = await loadClients();

    renderClients(getVisibleClients(clients));

    // client cards functional
    setupClientModal(clients);
    addNoteForm(clients);
    changeStatus(clients);
    deleteClient(clients);

    addClient(clients);

    // search functional
    searchByNameOrCompany(clients);
    filterCards(clients);

    sorts(clients);
});