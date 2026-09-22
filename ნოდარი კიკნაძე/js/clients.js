// P4 - Clients Page Logic
let clientsState = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadClients();
  setupEventListeners();
});

async function loadClients() {
  const container = document.getElementById('clientsContainer');
  container.innerHTML = '<p class="loading">Loading clients...</p>';

  // P3.5 - shared loading logic lives in data.js so Dashboard and Clients
  // stay in sync and never duplicate the fetch/transform code.
  try {
    clientsState = await Data.getOrLoadClients();
  } catch (err) {
    container.innerHTML = `
      <div class="error-box">
        <p>Could not load clients. Check your connection and try again.</p>
        <button class="btn-primary" style="width:auto;" onclick="loadClients()">Retry</button>
      </div>
    `;
    return;
  }

  renderClients();
}

// Pipeline Filter + Search + Sort
function getVisibleClients() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
  const activeChip = document.querySelector('#filterChips .chip.active').dataset.status;
  const sortValue = document.getElementById('sortSelect').value;

  let result = [...clientsState];

  if (activeChip !== 'All') {
    result = result.filter(c => c.status === activeChip);
  }

  if (searchQuery) {
    result = result.filter(c => 
      c.name.toLowerCase().includes(searchQuery) || 
      c.company.toLowerCase().includes(searchQuery)
    );
  }

  if (sortValue === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortValue === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === 'deal') {
    result.sort((a, b) => b.dealValue - a.dealValue);
  }

  return result;
}

function renderClients() {
  const container = document.getElementById('clientsContainer');
  const visible = getVisibleClients();

  if (visible.length === 0) {
    container.innerHTML = '<p class="no-data">No clients found.</p>';
    return;
  }

  container.innerHTML = visible.map(c => `
    <div class="client-card" data-id="${c.id}">
      <div class="client-card-header">
        <img src="${c.image || 'https://via.placeholder.com/50'}" alt="${c.name}" class="avatar-img">
        <div>
          <h3>${c.name}</h3>
          <p>${c.company}</p>
          <small>${c.email}</small>
        </div>
      </div>
      <div class="client-card-body">
        <strong class="deal-value">$${Number(c.dealValue).toLocaleString()}</strong>
        <span class="status-badge status-${c.status}">${c.status}</span>
      </div>
      <div class="status-wrap">
        <select class="status-select" data-id="${c.id}">
          <option value="Lead" ${c.status === 'Lead' ? 'selected' : ''}>Lead</option>
          <option value="Contacted" ${c.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="Won" ${c.status === 'Won' ? 'selected' : ''}>Won</option>
          <option value="Lost" ${c.status === 'Lost' ? 'selected' : ''}>Lost</option>
        </select>
      </div>
      <div class="client-card-actions">
        <button class="btn btn-danger btn-sm delete-btn" data-id="${c.id}">Delete</button>
      </div>
    </div>
  `).join('');

  // Add listeners
  container.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      e.stopPropagation();
      const id = Number(e.target.dataset.id);
      const newStatus = e.target.value;
      updateClientStatus(id, newStatus);
    });
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(e.target.dataset.id);
      deleteClient(id);
    });
  });

  container.querySelectorAll('.client-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'OPTION') return;
      const id = Number(card.dataset.id);
      openDetailsModal(id);
    });
  });
}

function updateClientStatus(id, newStatus) {
  const client = clientsState.find(c => c.id === id);
  if (client) {
    client.status = newStatus;
    Storage.saveClients(clientsState);
    renderClients();
    UI.showToast(`Status updated to ${newStatus}`);
  }
}

async function deleteClient(id) {
  if (!confirm('Delete this client? This cannot be undone.')) return;

  try {
    await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
  } catch (e) {
    // DummyJSON returns 404 for locally added items, still remove from state
  }

  clientsState = clientsState.filter(c => c.id !== id);
  Storage.saveClients(clientsState);
  renderClients();
  UI.showToast('Client deleted', 'error');
}

function setupEventListeners() {
  // Search & Filters
  document.getElementById('searchInput').addEventListener('input', () => renderClients());
  document.getElementById('sortSelect').addEventListener('change', () => renderClients());

  document.querySelectorAll('#filterChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#filterChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderClients();
    });
  });

  // Modal Handlers
  const addModal = document.getElementById('addClientModal');
  document.getElementById('openAddModalBtn').addEventListener('click', () => addModal.classList.add('open'));
  document.getElementById('closeAddModalBtn').addEventListener('click', () => addModal.classList.remove('open'));

  const detailsModal = document.getElementById('detailsModal');
  document.getElementById('closeDetailsModalBtn').addEventListener('click', () => detailsModal.classList.remove('open'));

  // Add Client Form Submit
  document.getElementById('addClientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    UI.clearAllErrors(e.target);

    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const company = document.getElementById('clientCompany').value.trim();
    const dealValue = document.getElementById('clientDeal').value.trim();
    const status = document.getElementById('clientStatus').value;

    let isValid = true;

    if (name.length < 3) {
      UI.showFieldError('clientName', 'clientNameError', 'Name must be at least 3 characters');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      UI.showFieldError('clientEmail', 'clientEmailError', 'Please enter a valid email address');
      isValid = false;
    } else if (clientsState.some(c => c.email.toLowerCase() === email.toLowerCase())) {
      UI.showFieldError('clientEmail', 'clientEmailError', 'A client with this email already exists');
      isValid = false;
    }

    if (phone && phone.length < 6) {
      UI.showFieldError('clientPhone', 'clientPhoneError', 'Phone number looks too short');
      isValid = false;
    }

    if (!dealValue || isNaN(dealValue) || Number(dealValue) <= 0) {
      UI.showFieldError('clientDeal', 'clientDealError', 'Deal value must be a positive number');
      isValid = false;
    }

    if (!isValid) return;

    const payload = { name, email, phone, company, dealValue: Number(dealValue), status };

    try {
      const res = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const newClient = {
        id: Date.now(), // Unique local ID
        name,
        email,
        phone,
        company: company || 'N/A',
        status,
        dealValue: Number(dealValue),
        notes: [],
        createdAt: new Date().toISOString()
      };

      clientsState.unshift(newClient);
      Storage.saveClients(clientsState);
      renderClients();

      addModal.classList.remove('open');
      e.target.reset();
      UI.showToast('Client added ✓');
    } catch (err) {
      UI.showToast('Failed to add client to server', 'error');
    }
  });
}

// Client Details Modal & Notes logic
function openDetailsModal(clientId) {
  const client = clientsState.find(c => c.id === clientId);
  if (!client) return;

  document.getElementById('modalClientName').textContent = client.name;
  const modalBody = document.getElementById('detailsModalBody');

  modalBody.innerHTML = `
    <div class="client-detail-meta">
      <p><strong>Status:</strong> ${client.status} | <strong>Deal:</strong> $${Number(client.dealValue).toLocaleString()}</p>
      <p><strong>Email:</strong> ${client.email} | <strong>Phone:</strong> ${client.phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${client.company}</p>
      <small>Client since ${new Date(client.createdAt).toLocaleDateString()}</small>
    </div>
    <hr>
    <div class="notes-section">
      <h3>Notes</h3>
      <ul class="notes-list" id="notesList">
        ${client.notes.map(n => `<li><span>${n.text}</span> <small>${n.date}</small></li>`).join('')}
      </ul>
      <div class="add-note-box">
        <input type="text" id="noteInput" placeholder="Write a note...">
        <button class="btn btn-primary" id="addNoteBtn">Add note</button>
      </div>
    </div>
    <hr>
    <button class="btn btn-secondary" id="remindBtn"># Remind me in 1 min</button>
  `;

  document.getElementById('detailsModal').classList.add('open');

  // Add Note Handler
  document.getElementById('addNoteBtn').addEventListener('click', () => {
    const text = document.getElementById('noteInput').value.trim();
    if (!text) return;

    const newNote = { text, date: new Date().toLocaleString() };
    client.notes.push(newNote);
    Storage.saveClients(clientsState);

    openDetailsModal(clientId); // Refresh modal view
  });

  // Remind Me in 1 Min Handler
  document.getElementById('remindBtn').addEventListener('click', () => {
    UI.showToast('Reminder set ✓');
    setTimeout(() => {
      UI.showToast(`⏰ Follow up: ${client.name}`, 'warning', 5000);
    }, 60000);
  });
}