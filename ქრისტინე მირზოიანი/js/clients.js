// P4 — Clients Page (Data loading, CRUD, Filtering, Sorting, Details modal P4.8)
class ClientsPage {
    constructor() {
        this.clients = [];
        this.filter = 'All';
        this.search = '';
        this.sort = 'newest';
        this.activeClient = null;

        this.container = document.getElementById('clientsContainer');
        if (!this.container) return;

        this.bindEvents();
        this.load();
    }

    bindEvents() {
        // Add Client Modal events
        document.getElementById('addClientBtn')?.addEventListener('click', () => this.openAddModal());
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.closeAddModal());
        document.getElementById('addClientModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'addClientModal') this.closeAddModal();
        });
        document.getElementById('addClientForm')?.addEventListener('submit', (e) => this.handleAdd(e));

        // Search event
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.search = e.target.value.toLowerCase();
            this.render();
        });

        // Filter chips events
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.filter = chip.dataset.filter;
                this.render();
            });
        });

        // Sort select event
        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.sort = e.target.value;
            this.render();
        });

        // Container event delegation: Card Click (P4.8), Delete Button, Status Change
        this.container.addEventListener('click', (e) => {
            // Delete button
            if (e.target.classList.contains('btn-delete')) {
                e.stopPropagation();
                this.delete(Number(e.target.dataset.id));
                return;
            }

            // Edit button
            if (e.target.classList.contains('btn-card-edit')) {
                e.stopPropagation();
                this.openDetailsModal(Number(e.target.dataset.id));
                return;
            }

            // Status select dropdown on card
            if (e.target.classList.contains('card-status-select')) {
                e.stopPropagation();
                return;
            }

            // P4.8: Card Click -> Open Details Modal
            const card = e.target.closest('.client-card');
            if (card && card.dataset.id) {
                this.openDetailsModal(Number(card.dataset.id));
            }
        });

        // Card status change handler
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('card-status-select')) {
                const id = Number(e.target.dataset.id);
                const newStatus = e.target.value;
                this.updateClientStatus(id, newStatus);
            }
        });

        // P4.8 Details Modal events
        document.getElementById('closeDetailsModalBtn')?.addEventListener('click', () => this.closeDetailsModal());
        document.getElementById('detailsModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'detailsModal') this.closeDetailsModal();
        });
        document.getElementById('addNoteForm')?.addEventListener('submit', (e) => this.handleAddNote(e));
        document.getElementById('remindBtn')?.addEventListener('click', () => this.handleRemindMe());
    }

    async load() {
        const stored = Storage.getClients();
        if (stored) {
            this.clients = stored;
            this.render();
            return;
        }

        const loading = document.getElementById('loadingIndicator');
        if (loading) loading.style.display = 'block';

        try {
            const response = await fetch('https://dummyjson.com/users?limit=30');
            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            this.clients = data.users.map(user => this.mapApiUser(user));
            this.save();
            this.render();
        } catch (error) {
            this.container.innerHTML = '<div class="empty-state">Could not load clients. Check your connection and try again. <br><button onclick="window.location.reload()" class="btn-secondary" style="margin-top:10px;">Retry</button></div>';
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    mapApiUser(user) {
        return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            company: user.company?.name || 'Acme Corp',
            image: user.image,
            status: 'Lead',
            dealValue: Math.floor(Math.random() * 9500) + 500,
            notes: [],
            createdAt: new Date().toISOString()
        };
    }

    save() {
        Storage.saveClients(this.clients);
    }

    updateClientStatus(id, newStatus) {
        const client = this.clients.find(c => c.id === id);
        if (client) {
            client.status = newStatus;
            this.save();
            this.render();
            Toast.show('Status updated ✓', 'success');
        }
    }

    getVisibleClients() {
        let list = [...this.clients];

        if (this.filter !== 'All') {
            list = list.filter(c => c.status === this.filter);
        }

        if (this.search) {
            list = list.filter(c =>
                c.name.toLowerCase().includes(this.search) ||
                (c.company && c.company.toLowerCase().includes(this.search))
            );
        }

        if (this.sort === 'name') {
            list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sort === 'deal-high') {
            list.sort((a, b) => b.dealValue - a.dealValue);
        } else {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return list;
    }

    render() {
        const list = this.getVisibleClients();
        this.container.innerHTML = '';

        if (list.length === 0) {
            this.container.innerHTML = '<div class="empty-state">No clients found.</div>';
            return;
        }

        list.forEach(client => {
            const price = new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0
            }).format(client.dealValue);

            const card = document.createElement('div');
            card.className = 'client-card';
            card.dataset.id = client.id;

            card.innerHTML = `
                <div class="client-header">
                    <img src="${client.image || 'https://dummyjson.com/icon/newuser/128'}" alt="${client.name}" class="client-avatar">
                    <div class="client-info">
                        <h3>${client.name}</h3>
                        <p class="client-company-text">${client.company || 'Company'}</p>
                    </div>
                </div>
                <div class="client-details">
                    <div class="detail-field">
                        <span class="field-label">EMAIL</span>
                        <span class="field-value" title="${client.email}">${client.email}</span>
                    </div>
                    <div class="detail-row-group">
                        <div class="detail-field">
                            <span class="field-label">PHONE</span>
                            <span class="field-value">${client.phone || 'N/A'}</span>
                        </div>
                        <div class="detail-field">
                            <span class="field-label">VALUE</span>
                            <span class="field-value deal-value">${price}</span>
                        </div>
                    </div>
                    <div class="detail-field" style="margin-top: 4px;">
                        <span class="field-label">STATUS</span>
                        <select class="card-status-select badge badge-${client.status.toLowerCase()}" data-id="${client.id}">
                            <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
                            <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                            <option value="Proposal" ${client.status === 'Proposal' ? 'selected' : ''}>Proposal</option>
                            <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
                            <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
                        </select>
                    </div>
                </div>
                <div class="card-footer-row">
                    <button type="button" class="btn-card-edit" data-id="${client.id}">✏️ Edit</button>
                    <button type="button" class="btn-delete" data-id="${client.id}">🗑️ Delete</button>
                </div>
            `;
            this.container.appendChild(card);
        });
    }

    // Add Client Modal
    openAddModal() {
        document.getElementById('addClientModal')?.classList.add('active');
    }

    closeAddModal() {
        document.getElementById('addClientModal')?.classList.remove('active');
        document.getElementById('addClientForm')?.reset();
        FormErrors.clear();
    }

    async handleAdd(e) {
        e.preventDefault();
        FormErrors.clear();

        const name = document.getElementById('newClientName').value.trim();
        const email = document.getElementById('newClientEmail').value.trim().toLowerCase();
        const phone = document.getElementById('newClientPhone').value.trim();
        const company = document.getElementById('newClientCompany').value.trim();
        const dealValue = parseFloat(document.getElementById('newClientDeal').value);
        const status = document.getElementById('newClientStatus').value;

        if (!this.validateAdd({ name, email, phone, dealValue })) return;

        try {
            const response = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ')[1] || '',
                    email, phone,
                    company: { name: company }
                })
            });

            const data = await response.json();

            this.clients.unshift({
                id: data.id || Date.now(),
                name, email, phone, company,
                image: 'https://dummyjson.com/icon/newuser/128',
                status, dealValue,
                notes: [],
                createdAt: new Date().toISOString()
            });

            this.save();
            this.render();
            this.closeAddModal();
            Toast.show('Client added ✓', 'success');
        } catch (error) {
            Toast.show('Failed to add client', 'error');
        }
    }

    validateAdd({ name, email, phone, dealValue }) {
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.length < 3) {
            FormErrors.show('newClientName', 'errName', 'Name must be at least 3 characters');
            valid = false;
        }

        if (!emailRegex.test(email) || this.clients.some(c => c.email === email)) {
            FormErrors.show('newClientEmail', 'errEmail', 'Please enter a valid email address / A client with this email already exists');
            valid = false;
        }

        if (phone && phone.length < 6) {
            FormErrors.show('newClientPhone', 'errPhone', 'Phone number looks too short');
            valid = false;
        }

        if (isNaN(dealValue) || dealValue <= 0) {
            FormErrors.show('newClientDeal', 'errDeal', 'Deal value must be a positive number');
            valid = false;
        }

        return valid;
    }

    async delete(id) {
        if (!confirm('Delete this client? This cannot be undone.')) return;

        try {
            await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
        } catch (error) {
            // DummyJSON may return 404 for custom IDs — still filter and remove from localStorage
        }

        this.clients = this.clients.filter(c => c.id !== id);
        this.save();
        this.render();
        Toast.show('Client deleted', 'success');
    }

    // =========================================
    // P4.8 — Client Details Modal, Notes & Reminders
    // =========================================
    openDetailsModal(id) {
        const client = this.clients.find(c => c.id === id);
        if (!client) return;

        this.activeClient = client;

        const formattedDate = new Date(client.createdAt).toLocaleDateString();
        const price = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        }).format(client.dealValue);

        // Populate modal element fields with client object data
        document.getElementById('detailsAvatar').src = client.image || 'https://dummyjson.com/icon/newuser/128';
        document.getElementById('detailsName').innerText = client.name;
        document.getElementById('detailsCompany').innerText = client.company || 'N/A';
        document.getElementById('detailsEmail').innerText = client.email;
        document.getElementById('detailsPhone').innerText = client.phone || 'N/A';
        document.getElementById('detailsStatus').innerText = client.status;
        document.getElementById('detailsStatus').className = `badge badge-${client.status.toLowerCase()}`;
        document.getElementById('detailsDeal').innerText = price;
        document.getElementById('detailsCreated').innerText = `Client since ${formattedDate}`;

        this.renderNotes();

        document.getElementById('detailsModal')?.classList.add('active');
    }

    closeDetailsModal() {
        document.getElementById('detailsModal')?.classList.remove('active');
        this.activeClient = null;
    }

    renderNotes() {
        const notesContainer = document.getElementById('notesList');
        if (!notesContainer || !this.activeClient) return;

        notesContainer.innerHTML = '';
        const notes = this.activeClient.notes || [];

        if (notes.length === 0) {
            notesContainer.innerHTML = '<p style="color: #94a3b8; font-size: 0.85rem;">No notes yet.</p>';
            return;
        }

        notes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';
            item.innerHTML = `
                <p class="note-text">• ${note.text}</p>
                <span class="note-date">${note.date}</span>
            `;
            notesContainer.appendChild(item);
        });
    }

    handleAddNote(e) {
        e.preventDefault();
        if (!this.activeClient) return;

        const noteInput = document.getElementById('noteInput');
        const text = noteInput.value.trim();
        if (!text) return;

        const newNote = {
            text,
            date: new Date().toLocaleString()
        };

        if (!this.activeClient.notes) {
            this.activeClient.notes = [];
        }

        this.activeClient.notes.push(newNote);

        // Save to localStorage and render notes
        this.save();
        this.renderNotes();
        noteInput.value = '';
        Toast.show('Note added ✓', 'success');
    }

    handleRemindMe() {
        if (!this.activeClient) return;
        const clientName = this.activeClient.name;

        // 1. Immediate Toast confirmation
        Toast.show('Reminder set ✓', 'success');

        // 2. Timed reminder toast after 60 seconds (60,000 ms)
        setTimeout(() => {
            Toast.show(`⏰ Follow up: ${clientName}`, 'info');
        }, 60000);
    }
}
