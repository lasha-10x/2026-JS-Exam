/**
 * clients.js — P4
 */

let clientsState = [];
let activeStatusFilter = 'All';
let activeSort = 'newest';
let activeSearchTerm = '';
let activeDetailClientId = null;

const STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];

// -- Loading ---

async function initClientsPage() {
  const listEl = document.getElementById('client-list');
  listEl.innerHTML = `<div class="state-msg">Loading clients...</div>`;

  try {
    clientsState = await loadClients();
    renderClients(getVisibleClients());
  } catch (err) {
    console.error('Failed to load clients:', err);
    listEl.innerHTML = `
      <div class="state-msg">
        <div class="icon">&#9888;</div>
        Could not load clients. Check your connection and try again.
        <div class="mt-16"><button class="btn btn-primary btn-sm" id="retry-load-btn">Retry</button></div>
      </div>`;
    const retryBtn = document.getElementById('retry-load-btn');
    if (retryBtn) retryBtn.addEventListener('click', initClientsPage);
  }
}

function persistClients() {
  saveClients(clientsState);
}

// --- Filter/search/sort ---

function getVisibleClients() {
  let list = clientsState;

  if (activeStatusFilter !== 'All') {
    list = list.filter((c) => c.status === activeStatusFilter);
  }

  if (activeSearchTerm.trim() !== '') {
    const term = activeSearchTerm.trim().toLowerCase();
    list = list.filter(
      (c) => c.name.toLowerCase().includes(term) || (c.company || '').toLowerCase().includes(term)
    );
  }

  // Sorted 
  const sorted = [...list];
  if (activeSort === 'newest') {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (activeSort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeSort === 'value') {
    sorted.sort((a, b) => b.dealValue - a.dealValue);
  }

  return sorted;
}

function refreshList() {
  renderClients(getVisibleClients());
}

// --- Rendering ---

function statusBadgeClass(status) {
  return `badge-${status.toLowerCase()}`;
}

function renderClients(list) {
  const container = document.getElementById('client-list');

  if (list.length === 0) {
    container.innerHTML = `<div class="state-msg"><div class="icon">&#128269;</div>No clients found.</div>`;
    return;
  }

  container.innerHTML = list
    .map((client) => {
      const statusOptions = STATUSES.map(
        (s) => `<option value="${s}" ${s === client.status ? 'selected' : ''}>${s}</option>`
      ).join('');

      return `
        <div class="client-card" data-id="${client.id}">
          <div class="client-card-top">
            <img class="avatar" src="${client.image}" alt="" onerror="this.style.display='none'">
            <div>
              <div class="name">${client.name}</div>
              <div class="company">${client.company || '—'}</div>
            </div>
          </div>
          <div class="email">${client.email}</div>
          <span class="badge ${statusBadgeClass(client.status)}">${client.status}</span>
          <div class="client-card-foot">
            <span class="deal-value">${formatCurrency(client.dealValue)}</span>
            <select class="status-select" data-id="${client.id}" aria-label="Change status">
              ${statusOptions}
            </select>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${client.id}" type="button">Delete</button>
          </div>
        </div>`;
    })
    .join('');

  wireCardEvents();
}

function wireCardEvents() {
  document.querySelectorAll('.client-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.status-select') || e.target.closest('.delete-btn')) return;
      openDetailModal(Number(card.dataset.id));
    });
  });

  document.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', (e) => {
      updateClientStatus(Number(e.target.dataset.id), e.target.value);
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteClient(Number(btn.dataset.id));
    });
  });
}

// --- Status change ---

function updateClientStatus(clientId, newStatus) {
  const client = clientsState.find((c) => c.id === clientId);
  if (!client) return;
  client.status = newStatus;
  persistClients();
  refreshList();
}

// --- Delete ---

async function handleDeleteClient(clientId) {
  const confirmed = window.confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteClientViaApi(clientId);
    clientsState = clientsState.filter((c) => c.id !== clientId);
    persistClients();
    refreshList();
    showToast('Client deleted', 'success');
  } catch (err) {
    console.error('Delete failed:', err);
    showToast('Could not delete client. Please try again.', 'error');
  }
}

// --- Add Client ---

function setupAddClientModal() {
  const openBtn = document.getElementById('add-client-btn');
  const overlay = document.getElementById('add-client-overlay');
  const closeBtn = document.getElementById('add-client-close');
  const form = document.getElementById('add-client-form');

  const fields = {
    name: document.getElementById('field-client-name'),
    email: document.getElementById('field-client-email'),
    phone: document.getElementById('field-client-phone'),
    company: document.getElementById('field-client-company'),
    dealValue: document.getElementById('field-client-deal-value'),
  };

  const openModal = () => {
    form.reset();
    clearAllErrors(form);
    overlay.classList.add('open');
  };
  const closeModal = () => overlay.classList.remove('open');

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(); // click-outside-to-close (bonus)
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const name = fields.name.querySelector('input').value.trim();
    const email = fields.email.querySelector('input').value.trim().toLowerCase();
    const phone = fields.phone.querySelector('input').value.trim();
    const company = fields.company.querySelector('input').value.trim();
    const dealValueRaw = fields.dealValue.querySelector('input').value;
    const status = document.getElementById('field-client-status').value;

    let hasError = false;

    if (name.length < 3) {
      showFieldError(fields.name, 'Name must be at least 3 characters');
      hasError = true;
    }
    if (!isValidEmailShape(email)) {
      showFieldError(fields.email, 'Please enter a valid email address');
      hasError = true;
    } else if (clientsState.some((c) => c.email.toLowerCase() === email)) {
      showFieldError(fields.email, 'A client with this email already exists');
      hasError = true;
    }
    if (phone.length > 0 && phone.length < 6) {
      showFieldError(fields.phone, 'Phone number looks too short');
      hasError = true;
    }
    const dealValue = Number(dealValueRaw);
    if (dealValueRaw.trim() === '' || Number.isNaN(dealValue) || dealValue <= 0) {
      showFieldError(fields.dealValue, 'Deal value must be a positive number');
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const newClient = await addClientViaApi({
        name,
        email,
        phone,
        company,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        status,
        dealValue,
      });
      clientsState.unshift(newClient);
      persistClients();
      refreshList();
      closeModal();
      showToast('Client added \u2713', 'success');
    } catch (err) {
      console.error('Add client failed:', err);
      showToast('Could not add client. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// -- Search/filter UI --

function setupToolbar() {
  const searchInput = document.getElementById('client-search');
  const sortSelect = document.getElementById('client-sort');
  const chips = document.querySelectorAll('.chip[data-status]');

  searchInput.addEventListener('input', (e) => {
    activeSearchTerm = e.target.value;
    refreshList();
  });

  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    refreshList();
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeStatusFilter = chip.dataset.status;
      refreshList();
    });
  });
}

// -- Detail modal --

function openDetailModal(clientId) {
  const client = clientsState.find((c) => c.id === clientId);
  if (!client) return;
  activeDetailClientId = clientId;

  document.getElementById('detail-avatar-fallback').textContent = initialsFromName(client.name);
  document.getElementById('detail-name').textContent = client.name;
  document.getElementById('detail-company').textContent = client.company || '—';
  document.getElementById('detail-email').textContent = client.email;
  document.getElementById('detail-phone').textContent = client.phone || '—';
  document.getElementById('detail-status').innerHTML =
    `<span class="badge ${statusBadgeClass(client.status)}">${client.status}</span>`;
  document.getElementById('detail-value').textContent = formatCurrency(client.dealValue);
  document.getElementById('detail-since').textContent = new Date(client.createdAt).toLocaleDateString();

  renderNotes(client);

  document.getElementById('detail-overlay').classList.add('open');
}

function renderNotes(client) {
  const notesList = document.getElementById('notes-list');
  if (!client.notes || client.notes.length === 0) {
    notesList.innerHTML = `<div class="text-muted" style="font-size:13px;">No notes yet.</div>`;
    return;
  }
  notesList.innerHTML = client.notes
    .map((n) => `<div class="note-item">${n.text}<span class="date">${n.date}</span></div>`)
    .join('');
}

function setupDetailModal() {
  const overlay = document.getElementById('detail-overlay');
  const closeBtn = document.getElementById('detail-close');
  const noteForm = document.getElementById('add-note-form');
  const remindBtn = document.getElementById('remind-btn');

  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('note-input');
    const text = input.value.trim();
    if (text === '') return;

    const client = clientsState.find((c) => c.id === activeDetailClientId);
    if (!client) return;

    if (!client.notes) client.notes = [];
    client.notes.push({ text, date: new Date().toLocaleString() });
    persistClients();
    renderNotes(client);
    input.value = '';
  });

  remindBtn.addEventListener('click', () => {
    const client = clientsState.find((c) => c.id === activeDetailClientId);
    if (!client) return;
    const clientName = client.name;

    showToast('Reminder set \u2713', 'success');
    setTimeout(() => {
      showToast(`\u23F0 Follow up: ${clientName}`, 'success');
    }, 60000);
  });
}

// -- Bootstrap --

document.addEventListener('DOMContentLoaded', () => {
  const session = initProtectedPage('clients');
  if (!session) return;

  setupToolbar();
  setupAddClientModal();
  setupDetailModal();
  initClientsPage();
});