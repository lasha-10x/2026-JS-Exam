/**
 * clients.js
 * ---------------------------------------------------------------------------
 * The Clients page — the heart of the app. Everything here follows the
 * golden cycle: mutate `clients` -> Storage10X.saveClients(clients) ->
 * re-render.
 *
 * `clients`        — the full, unfiltered state (mirrors crm_clients).
 * getVisibleClients() — computes a FILTERED/SEARCHED/SORTED VIEW on a copy
 *                        of `clients`, every time. It never touches the
 *                        original array, so switching sort order or typing
 *                        in search can never corrupt the real data.
 * ---------------------------------------------------------------------------
 */

let clients = [];
let searchQuery = '';
let activeStatusFilter = 'All';
let sortOption = 'newest'; // 'newest' | 'name' | 'deal'
let activeDetailsClientId = null;

// ============================================================================
// P4.2 — Loading (localStorage first, else API; try/catch + Retry on failure)
// ============================================================================

async function loadAndRenderClients() {
  const listEl = document.getElementById('clients-list');
  listEl.innerHTML = `<div class="loading-state"><div class="spinner"></div>Loading clients...</div>`;

  try {
    clients = await loadClients(); // js/data.js — localStorage first, else API
    renderClients(getVisibleClients());
  } catch (err) {
    console.error('Failed to load clients:', err);
    listEl.innerHTML = `
      <div class="error-state">
        <p>Could not load clients. Check your connection and try again.</p>
        <button class="btn btn-secondary btn-sm" id="retry-load-btn" type="button">Retry</button>
      </div>
    `;
    document.getElementById('retry-load-btn').addEventListener('click', loadAndRenderClients);
  }
}

// ============================================================================
// P4.7 — Search, filter, sort (combinable, non-destructive)
// ============================================================================

function getVisibleClients() {
  let result = [...clients]; // work on a copy — `clients` itself is untouched

  if (activeStatusFilter !== 'All') {
    result = result.filter((c) => c.status === activeStatusFilter);
  }

  const q = searchQuery.trim().toLowerCase();
  if (q !== '') {
    result = result.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q)
    );
  }

  switch (sortOption) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'deal':
      result.sort((a, b) => b.dealValue - a.dealValue);
      break;
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return result;
}

function initToolbar() {
  document.getElementById('client-search').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderClients(getVisibleClients());
  });

  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeStatusFilter = chip.dataset.status;
      renderClients(getVisibleClients());
    });
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortOption = e.target.value;
    renderClients(getVisibleClients());
  });
}

// ============================================================================
// P4.3 — Rendering
// ============================================================================

function renderClients(list) {
  const listEl = document.getElementById('clients-list');

  if (list.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No clients found.</div>`;
    return;
  }

  listEl.innerHTML = list.map(clientCardHtml).join('');
}

function statusOptionsHtml(current) {
  return STATUSES.map((s) => `<option value="${s}" ${s === current ? 'selected' : ''}>${s}</option>`).join('');
}

function clientCardHtml(client) {
  const avatar = avatarHtml(client.name, client.image);
  const statusSelectClass = `sel-${client.status.toLowerCase()}`;
  const safeName = escapeHtml(client.name);
  const safeCompany = escapeHtml(client.company || '—');
  const safeEmail = escapeHtml(client.email);

  return `
    <div class="client-card" data-id="${client.id}">
      <div class="client-card-top">
        ${avatar}
        <div>
          <div class="client-card-name">${safeName}</div>
          <div class="client-card-company">${safeCompany}</div>
        </div>
      </div>
      <div class="client-card-meta">
        <span>${safeEmail}</span>
      </div>
      <div class="client-card-meta">
        <select class="status-select ${statusSelectClass}" data-action="status-select" data-id="${client.id}">
          ${statusOptionsHtml(client.status)}
        </select>
        <span class="client-card-deal">${formatMoney(client.dealValue)}</span>
      </div>
      <div class="client-card-footer">
        <span class="client-card-hint">Click card for details</span>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${client.id}" type="button">Delete</button>
      </div>
    </div>
  `;
}

// One click listener + one change listener on the container (event
// delegation), since cards are fully re-created on every render — per-card
// listeners would just pile up on elements that no longer exist.
function initListHandlers() {
  const listEl = document.getElementById('clients-list');

  listEl.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      e.stopPropagation();
      handleDelete(Number(deleteBtn.dataset.id));
      return;
    }
    if (e.target.closest('.status-select')) {
      return; // opening/using the dropdown shouldn't also open the modal
    }
    const card = e.target.closest('.client-card');
    if (card) {
      openDetailsModal(Number(card.dataset.id));
    }
  });

  listEl.addEventListener('change', (e) => {
    const select = e.target.closest('[data-action="status-select"]');
    if (select) {
      handleStatusChange(Number(select.dataset.id), select.value);
    }
  });
}

// ============================================================================
// P4.6 — Status change
// ============================================================================

function handleStatusChange(id, newStatus) {
  const client = clients.find((c) => c.id === id);
  if (!client) return;

  client.status = newStatus;
  Storage10X.saveClients(clients);
  renderClients(getVisibleClients());
}

// ============================================================================
// P4.5 — Delete
// ============================================================================

async function handleDelete(id) {
  const client = clients.find((c) => c.id === id);
  if (!client) return;

  const confirmed = confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteClientFromAPI(id); // never throws on 404 — see data.js
  } catch (err) {
    console.warn('DELETE request failed, removing locally anyway:', err);
  }

  clients = clients.filter((c) => c.id !== id);
  Storage10X.saveClients(clients);
  renderClients(getVisibleClients());
  showToast('Client deleted', 'success');
}

// ============================================================================
// P4.4 — Add Client modal
// ============================================================================

function openAddModal() {
  document.getElementById('add-client-form').reset();
  clearAllFieldErrors(['clientName', 'clientEmail', 'clientPhone', 'clientDealValue']);
  document.getElementById('add-client-backdrop').classList.remove('hidden');
  document.getElementById('clientName').focus();
}

function closeAddModal() {
  document.getElementById('add-client-backdrop').classList.add('hidden');
}

async function handleAddSubmit(e) {
  e.preventDefault();
  const fieldNames = ['clientName', 'clientEmail', 'clientPhone', 'clientDealValue'];
  clearAllFieldErrors(fieldNames);

  const name = document.getElementById('clientName').value.trim();
  const email = document.getElementById('clientEmail').value.trim().toLowerCase();
  const phone = document.getElementById('clientPhone').value.trim();
  const company = document.getElementById('clientCompany').value.trim();
  const dealValueRaw = document.getElementById('clientDealValue').value.trim();
  const status = document.getElementById('clientStatus').value;

  let hasError = false;

  if (name.length < 3) {
    setFieldError('clientName', 'Name must be at least 3 characters');
    hasError = true;
  }

  if (!EMAIL_RE.test(email)) {
    setFieldError('clientEmail', 'Please enter a valid email address');
    hasError = true;
  } else if (clients.some((c) => c.email.toLowerCase() === email)) {
    setFieldError('clientEmail', 'A client with this email already exists');
    hasError = true;
  }

  if (phone.length > 0 && phone.length < 6) {
    setFieldError('clientPhone', 'Phone number looks too short');
    hasError = true;
  }

  const dealValue = Number(dealValueRaw);
  if (dealValueRaw === '' || isNaN(dealValue) || dealValue <= 0) {
    setFieldError('clientDealValue', 'Deal value must be a positive number');
    hasError = true;
  }

  if (hasError) return;

  const submitBtn = document.getElementById('add-client-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  try {
  await addClientToAPI({ firstName: name, email, phone, company });

  const newClient = {
      id: Date.now(), // temporary ID until API returns a real one
      name,
      email,
      phone,
      company,
      image: '', // manually-added clients get an initials avatar instead
      status,
      dealValue,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    clients.unshift(newClient); // new client appears at the top
    Storage10X.saveClients(clients);
    renderClients(getVisibleClients());
    closeAddModal();
    showToast('Client added ✓', 'success');
  } catch (err) {
    console.error('Failed to add client:', err);
    showToast('Could not add client. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Client';
  }
}

function initAddClientModal() {
  document.getElementById('add-client-btn').addEventListener('click', openAddModal);
  document.getElementById('add-client-close').addEventListener('click', closeAddModal);
  document.getElementById('add-client-cancel').addEventListener('click', closeAddModal);

  document.getElementById('add-client-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'add-client-backdrop') closeAddModal();
  });

  document.getElementById('add-client-form').addEventListener('submit', handleAddSubmit);

  liveClearOnInput(['clientName', 'clientEmail', 'clientPhone', 'clientDealValue']);
}

// ============================================================================
// P4.8 — Client details modal, notes, follow-up reminder
// ============================================================================

function openDetailsModal(id) {
  const client = clients.find((c) => c.id === id);
  if (!client) return;
  activeDetailsClientId = id;

  document.getElementById('details-avatar-wrap').innerHTML = avatarHtml(client.name, client.image, 'avatar-lg');
  document.getElementById('details-name').textContent = client.name;
  document.getElementById('details-company').textContent = client.company || '—';
  document.getElementById('details-email').textContent = client.email;
  document.getElementById('details-phone').textContent = client.phone || '—';
  document.getElementById('details-status').innerHTML = statusBadgeHtml(client.status);
  document.getElementById('details-deal').textContent = formatMoney(client.dealValue);
  document.getElementById('details-since').textContent =
    `Client since ${new Date(client.createdAt).toLocaleDateString()}`;

  document.getElementById('note-input').value = '';
  renderNotesList(client);

  document.getElementById('details-backdrop').classList.remove('hidden');
}

function closeDetailsModal() {
  document.getElementById('details-backdrop').classList.add('hidden');
  activeDetailsClientId = null;
}

function renderNotesList(client) {
  const listEl = document.getElementById('notes-list');
  if (client.notes.length === 0) {
    listEl.innerHTML = `<div class="empty-state" style="padding:16px 0;">No notes yet.</div>`;
    return;
  }
  // Oldest first, newest last — a running log of the relationship.
  listEl.innerHTML = client.notes
    .map((n) => `
      <div class="note-item">
        <div class="note-text">${escapeHtml(n.text)}</div>
        <div class="note-date">${escapeHtml(n.date)}</div>
      </div>
    `)
    .join('');
}

function handleAddNote() {
  const client = clients.find((c) => c.id === activeDetailsClientId);
  if (!client) return;

  const input = document.getElementById('note-input');
  const text = input.value.trim();
  if (text === '') return; // empty/whitespace-only notes are not added

  client.notes.push({ text, date: new Date().toLocaleString() });
  Storage10X.saveClients(clients);
  input.value = '';
  renderNotesList(client);
}

function handleRemindMe() {
  const client = clients.find((c) => c.id === activeDetailsClientId);
  if (!client) return;

  const name = client.name;
  const select = document.getElementById('remind-time-select');
  const minutes = Number(select.value);
  const label = select.options[select.selectedIndex].text; // e.g. "5 minutes", reuses the option's own text
  const delayMs = minutes * 60 * 1000;

  showToast(`Reminder set for ${label} ✓`, 'success');

  // Fires even if the modal (or the whole page's focus) has moved on —
  // the timer lives independently of the modal's open/closed state.
  setTimeout(() => {
    // Longer duration (10s vs. the usual 3s default) — this is the one
    // toast a user genuinely needs time to notice and react to.
    showToast(`⏰ Follow up: ${name}`, 'success', 10000);
  }, delayMs);
}

function initDetailsModal() {
  document.getElementById('details-close').addEventListener('click', closeDetailsModal);
  document.getElementById('details-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'details-backdrop') closeDetailsModal();
  });
  document.getElementById('add-note-btn').addEventListener('click', handleAddNote);
  document.getElementById('remind-btn').addEventListener('click', handleRemindMe);
}

// ============================================================================
// Page init
// ============================================================================

function initClientsPage() {
  initNav();
  initToolbar();
  initListHandlers();
  initAddClientModal();
  initDetailsModal();
  loadAndRenderClients();
}
