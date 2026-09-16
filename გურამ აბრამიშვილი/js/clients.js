// clients.js — P4 Clients: loading, search, filter, sort, add/edit, delete, details, notes, reminders,
// plus bonus features: PUT edit, debounced server search, call timer, Kanban + drag&drop,
// CSV export, pagination, keyboard shortcuts, undo-delete.

const PAGE_SIZE = 10;

let allClients = [];
let searchTerm = '';
let statusFilter = 'All';
let sortOption = 'newest';
let currentDetailsId = null;
let editingClientId = null;   // null = "Add" mode, otherwise "Edit" mode (PUT)
let currentView = 'list';     // 'list' | 'board'
let currentPage = 1;
let searchDebounceTimer = null;
let draggedClientId = null;
let callTimerInterval = null;
let callSeconds = 0;

document.addEventListener('DOMContentLoaded', async function () {
  requireAuth();
  applyTheme();
  renderNav('clients');

  bindToolbar();
  bindAddClientModal();
  bindDetailsModal();
  bindCallTimer();
  bindKeyboardShortcuts();

  await initClients();
});

async function initClients() {
  const listEl = document.getElementById('clients-list');
  const cached = getClients();

  if (cached) {
    allClients = cached;
    renderCurrentView();
    return;
  }

  listEl.innerHTML = '<p class="loading-text">Loading clients...</p>';
  try {
    allClients = await fetchInitialClients();
    saveClients(allClients);
    renderCurrentView();
  } catch (err) {
    listEl.innerHTML = `
      <p class="error-text">Could not load clients. Check your connection and try again.</p>
      <button id="retry-btn" class="btn-primary" type="button">Retry</button>
    `;
    document.getElementById('retry-btn').addEventListener('click', initClients);
  }
}

// One function: status filter -> search -> sort, always on a copy (state stays unchanged)
function getVisibleClients() {
  let result = allClients.slice();

  if (statusFilter !== 'All') {
    result = result.filter(c => c.status === statusFilter);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(term) || c.company.toLowerCase().includes(term)
    );
  }

  if (sortOption === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'value') {
    result.sort((a, b) => b.dealValue - a.dealValue);
  }

  return result;
}

// Dispatches to the list or the Kanban board, whichever is active
function renderCurrentView() {
  const list = getVisibleClients();
  if (currentView === 'board') {
    renderKanban(list);
  } else {
    renderClients(list);
  }
}

function cardHtml(c) {
  return `
    <div class="client-card" data-id="${c.id}">
      <div class="client-avatar">${c.image
        ? `<img src="${c.image}" alt="${escapeHtml(c.name)}" onerror="this.parentElement.textContent='${initialsOf(c.name)}'">`
        : initialsOf(c.name)}</div>
      <div class="client-info">
        <strong class="client-name">${escapeHtml(c.name)}</strong>
        <span class="client-meta">${escapeHtml(c.company)} &middot; ${escapeHtml(c.email)}</span>
      </div>
      <span class="client-value">$${c.dealValue.toLocaleString()}</span>
      <select class="status-select status-bg-${c.status.toLowerCase()}" data-id="${c.id}">
        ${['Lead', 'Contacted', 'Won', 'Lost'].map(s => `<option value="${s}" ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
      <button class="btn-outline edit-btn" data-id="${c.id}" type="button">Edit</button>
      <button class="btn-danger delete-btn" data-id="${c.id}" type="button">Delete</button>
    </div>
  `;
}

function renderClients(list) {
  const container = document.getElementById('clients-list');
  const visibleSlice = list.slice(0, currentPage * PAGE_SIZE);

  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found.</p>';
    updateLoadMoreButton(0, 0);
    return;
  }

  container.innerHTML = visibleSlice.map(cardHtml).join('');
  bindCardEvents(container);
  updateLoadMoreButton(visibleSlice.length, list.length);
}

function bindCardEvents(container) {
  container.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('click', e => e.stopPropagation());
    sel.addEventListener('change', handleStatusChange);
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); handleDelete(e); });
  });

  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(e.target.dataset.id);
      const client = allClients.find(c => c.id === id);
      if (client) openClientModal(client);
    });
  });

  container.querySelectorAll('.client-card').forEach(card => {
    card.addEventListener('click', () => openDetailsModal(Number(card.dataset.id)));
  });
}

function updateLoadMoreButton(shown, total) {
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;
  if (currentView === 'list' && shown < total) {
    btn.style.display = 'inline-block';
    btn.textContent = `Load More (${total - shown} remaining)`;
  } else {
    btn.style.display = 'none';
  }
}

function initialsOf(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

// --- Bonus: Kanban board with drag & drop ---

function renderKanban(list) {
  const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];
  const board = document.getElementById('kanban-board');
  if (!board) return;

  board.innerHTML = statuses.map(status => {
    const items = list.filter(c => c.status === status);
    return `
      <div class="kanban-column">
        <div class="kanban-column-header status-bg-${status.toLowerCase()}">${status} <span>${items.length}</span></div>
        <div class="kanban-column-body" data-status="${status}">
          ${items.map(c => `
            <div class="kanban-card" draggable="true" data-id="${c.id}">
              <strong>${escapeHtml(c.name)}</strong>
              <span class="kanban-card-company">${escapeHtml(c.company)}</span>
              <span class="kanban-card-value">$${c.dealValue.toLocaleString()}</span>
            </div>
          `).join('') || '<p class="kanban-empty">No clients</p>'}
        </div>
      </div>
    `;
  }).join('');

  board.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('click', () => openDetailsModal(Number(card.dataset.id)));
  });

  board.querySelectorAll('.kanban-column-body').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', handleDrop);
  });

  updateLoadMoreButton(0, 0); // Load More only applies to the list view
}

function handleDragStart(e) {
  draggedClientId = Number(e.currentTarget.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(draggedClientId));
}

function handleDrop(e) {
  e.preventDefault();
  const column = e.currentTarget;
  column.classList.remove('drag-over');

  const newStatus = column.dataset.status;
  const id = draggedClientId !== null ? draggedClientId : Number(e.dataTransfer.getData('text/plain'));
  const client = allClients.find(c => c.id === id);
  if (!client) return;

  client.status = newStatus;
  saveClients(allClients);
  renderCurrentView();
  draggedClientId = null;
}

function switchView(view) {
  currentView = view;
  document.getElementById('view-list-btn').classList.toggle('active', view === 'list');
  document.getElementById('view-board-btn').classList.toggle('active', view === 'board');
  document.getElementById('clients-list').style.display = view === 'list' ? 'flex' : 'none';
  document.getElementById('kanban-board').style.display = view === 'board' ? 'grid' : 'none';
  renderCurrentView();
}

// --- Toolbar: search (debounced + server preview), filters, sort, view toggle, CSV, load more ---

function bindToolbar() {
  document.getElementById('search-input').addEventListener('input', handleSearchInput);

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      statusFilter = chip.dataset.status;
      currentPage = 1;
      renderCurrentView();
    });
  });

  document.getElementById('sort-select').addEventListener('change', function (e) {
    sortOption = e.target.value;
    renderCurrentView();
  });

  document.getElementById('view-list-btn').addEventListener('click', () => switchView('list'));
  document.getElementById('view-board-btn').addEventListener('click', () => switchView('board'));

  document.getElementById('load-more-btn').addEventListener('click', function () {
    currentPage++;
    renderClients(getVisibleClients());
  });

  document.getElementById('export-csv-btn').addEventListener('click', exportClientsToCSV);
}

// Bonus: debounce the search input, then (a) re-filter locally and (b) demonstrate a real
// server-side search call to DummyJSON's /users/search endpoint.
function handleSearchInput(e) {
  const value = e.target.value;
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    searchTerm = value;
    currentPage = 1;
    renderCurrentView();
    fetchServerSearchPreview(value);
  }, 300);
}

async function fetchServerSearchPreview(term) {
  const hint = document.getElementById('server-search-hint');
  if (!hint) return;

  if (!term) {
    hint.textContent = '';
    return;
  }

  try {
    const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(term)}`);
    if (!res.ok) throw new Error('Server search failed');
    const data = await res.json();
    const count = typeof data.total === 'number' ? data.total : (data.users || []).length;
    hint.textContent = `Server search (demo API): ${count} match${count === 1 ? '' : 'es'} for "${term}"`;
  } catch (err) {
    hint.textContent = '';
  }
}

function handleStatusChange(e) {
  const id = Number(e.target.dataset.id);
  const client = allClients.find(c => c.id === id);
  if (!client) return;
  client.status = e.target.value;
  saveClients(allClients);
  renderCurrentView();
}

// --- Delete with Undo (own bonus idea) ---

async function handleDelete(e) {
  const id = Number(e.target.dataset.id);
  const confirmed = confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  try {
    // Note: DummyJSON doesn't actually persist a client id we added ourselves,
    // so DELETE may return a 404 — this is expected, and we still remove it from state either way.
    await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
  } catch (err) {
    // A network error doesn't block the local delete either, since our "source of truth" is localStorage
  }

  const removedIndex = allClients.findIndex(c => c.id === id);
  const removedClient = allClients[removedIndex];
  allClients = allClients.filter(c => c.id !== id);
  saveClients(allClients);
  renderCurrentView();
  showUndoToast('Client deleted', removedClient, removedIndex);
}

// A toast with its own "Undo" button — restores the deleted client if clicked within 5 seconds.
function showUndoToast(message, removedClient, removedIndex) {
  const container = document.getElementById('toast-container');
  if (!container || !removedClient) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';

  const text = document.createElement('span');
  text.textContent = message;

  const undoBtn = document.createElement('button');
  undoBtn.className = 'toast-undo';
  undoBtn.type = 'button';
  undoBtn.textContent = 'Undo';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '\u00D7';

  toast.appendChild(text);
  toast.appendChild(undoBtn);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  const remove = () => { if (toast.parentNode) toast.parentNode.removeChild(toast); };

  undoBtn.addEventListener('click', () => {
    const insertAt = Math.min(removedIndex, allClients.length);
    allClients.splice(insertAt, 0, removedClient);
    saveClients(allClients);
    renderCurrentView();
    remove();
    showToast('Client restored \u2713', 'success');
  });

  closeBtn.addEventListener('click', remove);
  setTimeout(remove, 5000);
}

// --- Bonus: CSV export ---

function exportClientsToCSV() {
  const list = getVisibleClients();
  if (list.length === 0) {
    showToast('Nothing to export', 'error');
    return;
  }

  const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Deal Value', 'Created At'];
  const rows = list.map(c => [c.name, c.email, c.phone, c.company, c.status, c.dealValue, c.createdAt]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field == null ? '' : field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clients.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('CSV exported \u2713', 'success');
}

// --- Add / Edit Client modal (Add = POST, Edit = PUT — covers all four request methods) ---

function openClientModal(client) {
  const modal = document.getElementById('add-client-modal');
  const form = document.getElementById('add-client-form');
  const title = document.getElementById('add-client-title');
  const submitBtn = document.getElementById('add-client-submit');

  clearErrors(form);

  if (client) {
    editingClientId = client.id;
    title.textContent = 'Edit Client';
    submitBtn.textContent = 'Save Changes';
    document.getElementById('new-name').value = client.name;
    document.getElementById('new-email').value = client.email;
    document.getElementById('new-phone').value = client.phone || '';
    document.getElementById('new-company').value = client.company || '';
    document.getElementById('new-dealvalue').value = client.dealValue;
    document.getElementById('new-status').value = client.status;
  } else {
    editingClientId = null;
    title.textContent = 'Add Client';
    submitBtn.textContent = 'Add Client';
    form.reset();
  }

  modal.classList.add('open');
}

function bindAddClientModal() {
  const openBtn = document.getElementById('add-client-btn');
  const modal = document.getElementById('add-client-modal');
  const closeBtn = document.getElementById('add-client-close');
  const form = document.getElementById('add-client-form');

  ['new-name', 'new-email', 'new-phone', 'new-dealvalue'].forEach(attachLiveClear);

  openBtn.addEventListener('click', () => openClientModal(null));
  closeBtn.addEventListener('click', () => closeClientModal());
  modal.addEventListener('click', e => { if (e.target === modal) closeClientModal(); });

  function closeClientModal() {
    modal.classList.remove('open');
    form.reset();
    clearErrors(form);
    editingClientId = null;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors(form);

    const name = document.getElementById('new-name').value.trim();
    const email = document.getElementById('new-email').value.trim().toLowerCase();
    const phone = document.getElementById('new-phone').value.trim();
    const company = document.getElementById('new-company').value.trim();
    const dealValueRaw = document.getElementById('new-dealvalue').value;
    const status = document.getElementById('new-status').value;

    let hasError = false;

    if (name.length < 3) {
      showFieldError('new-name', 'Name must be at least 3 characters');
      hasError = true;
    }

    if (!isValidEmail(email)) {
      showFieldError('new-email', 'Please enter a valid email address');
      hasError = true;
    } else if (allClients.some(c => c.email.toLowerCase() === email && c.id !== editingClientId)) {
      showFieldError('new-email', 'A client with this email already exists');
      hasError = true;
    }

    if (phone) {
      const phonePattern = /^[0-9+\-\s()]+$/;
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phonePattern.test(phone)) {
        showFieldError('new-phone', 'Phone number can only contain digits, spaces, and + - ( )');
        hasError = true;
      } else if (digitsOnly.length < 6) {
        showFieldError('new-phone', 'Phone number looks too short');
        hasError = true;
      }
    }

    const dealValue = Number(dealValueRaw);
    if (!dealValueRaw || isNaN(dealValue) || dealValue <= 0) {
      showFieldError('new-dealvalue', 'Deal value must be a positive number');
      hasError = true;
    }

    if (hasError) return;

    if (editingClientId) {
      // --- Edit mode: PUT ---
      try {
        await fetch(`https://dummyjson.com/users/${editingClientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ')
          })
        });
      } catch (err) {
        // DummyJSON doesn't persist this either — localStorage stays the source of truth
      }

      const client = allClients.find(c => c.id === editingClientId);
      if (client) {
        client.name = name;
        client.email = email;
        client.phone = phone;
        client.company = company;
        client.dealValue = dealValue;
        client.status = status;
      }
      saveClients(allClients);
      renderCurrentView();
      closeClientModal();
      showToast('Client updated \u2713', 'success');
    } else {
      // --- Add mode: POST ---
      let newId = Date.now();
      try {
        const res = await fetch('https://dummyjson.com/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ')
          })
        });
        const data = await res.json();
        if (data && data.id) newId = data.id;
      } catch (err) {
        // Couldn't reach the API — still add it locally, generating the id with Date.now()
      }

      const newClient = {
        id: newId,
        name,
        email,
        phone,
        company,
        image: '',
        status,
        dealValue,
        notes: [],
        createdAt: new Date().toISOString()
      };

      allClients.unshift(newClient);
      saveClients(allClients);
      renderCurrentView();
      closeClientModal();
      showToast('Client added \u2713', 'success');
    }
  });
}

// --- Details modal (notes, reminders, call timer) ---

function openDetailsModal(id) {
  const client = allClients.find(c => c.id === id);
  if (!client) return;

  resetCallTimerUI();
  currentDetailsId = id;
  document.getElementById('details-name').textContent = client.name;
  document.getElementById('details-meta').textContent =
    `${client.status} \u00B7 $${client.dealValue.toLocaleString()} \u00B7 Client since ${new Date(client.createdAt).toLocaleDateString()}`;
  document.getElementById('details-company').textContent = client.company || '\u2014';
  document.getElementById('details-email').textContent = client.email;
  document.getElementById('details-phone').textContent = client.phone || '\u2014';

  renderNotes(client);
  document.getElementById('details-modal').classList.add('open');
}

function renderNotes(client) {
  const list = document.getElementById('notes-list');
  if (client.notes.length === 0) {
    list.innerHTML = '<p class="empty-state">No notes yet.</p>';
    return;
  }
  list.innerHTML = client.notes.map(n =>
    `<div class="note-item"><span>${escapeHtml(n.text)}</span><span class="note-date">${n.date}</span></div>`
  ).join('');
}

function bindDetailsModal() {
  const modal = document.getElementById('details-modal');

  document.getElementById('details-close').addEventListener('click', () => {
    resetCallTimerUI();
    modal.classList.remove('open');
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      resetCallTimerUI();
      modal.classList.remove('open');
    }
  });

  document.getElementById('details-edit-btn').addEventListener('click', function () {
    const client = allClients.find(c => c.id === currentDetailsId);
    if (!client) return;
    resetCallTimerUI();
    modal.classList.remove('open');
    openClientModal(client);
  });

  document.getElementById('add-note-btn').addEventListener('click', function () {
    const input = document.getElementById('note-input');
    const text = input.value.trim();
    if (!text) return;

    const client = allClients.find(c => c.id === currentDetailsId);
    if (!client) return;

    client.notes.push({ text, date: new Date().toLocaleString() });
    saveClients(allClients);
    renderNotes(client);
    input.value = '';
  });

  document.getElementById('remind-btn').addEventListener('click', function () {
    const client = allClients.find(c => c.id === currentDetailsId);
    if (!client) return;

    showToast('Reminder set \u2713', 'success');
    setTimeout(() => {
      showToast(`\uD83D\uDD14 Follow up: ${client.name}`, 'success');
    }, 60000);
  });
}

// --- Bonus: call timer (Start/End Call stopwatch, duration saved as a note) ---

function bindCallTimer() {
  document.getElementById('call-timer-btn').addEventListener('click', function () {
    if (callTimerInterval) {
      stopCallTimer();
    } else {
      startCallTimer();
    }
  });
}

function startCallTimer() {
  callSeconds = 0;
  updateCallTimerDisplay();
  callTimerInterval = setInterval(() => {
    callSeconds++;
    updateCallTimerDisplay();
  }, 1000);
  document.getElementById('call-timer-btn').textContent = 'End Call';
  document.getElementById('call-timer-btn').classList.add('active-call');
}

function stopCallTimer() {
  clearInterval(callTimerInterval);
  callTimerInterval = null;

  const mm = String(Math.floor(callSeconds / 60)).padStart(2, '0');
  const ss = String(callSeconds % 60).padStart(2, '0');

  const client = allClients.find(c => c.id === currentDetailsId);
  if (client && callSeconds > 0) {
    client.notes.push({ text: `Call duration: ${mm}:${ss}`, date: new Date().toLocaleString() });
    saveClients(allClients);
    renderNotes(client);
  }

  resetCallTimerUI();
}

function resetCallTimerUI() {
  clearInterval(callTimerInterval);
  callTimerInterval = null;
  callSeconds = 0;
  const btn = document.getElementById('call-timer-btn');
  const display = document.getElementById('call-timer-display');
  if (btn) {
    btn.textContent = 'Start Call';
    btn.classList.remove('active-call');
  }
  if (display) display.textContent = '00:00';
}

function updateCallTimerDisplay() {
  const mm = String(Math.floor(callSeconds / 60)).padStart(2, '0');
  const ss = String(callSeconds % 60).padStart(2, '0');
  const display = document.getElementById('call-timer-display');
  if (display) display.textContent = `${mm}:${ss}`;
}

// --- Bonus: keyboard shortcuts ---

function bindKeyboardShortcuts() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      resetCallTimerUI();
      return;
    }

    const tag = (e.target.tagName || '').toLowerCase();
    const isTyping = tag === 'input' || tag === 'select' || tag === 'textarea';
    if (isTyping) return;

    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('search-input').focus();
    } else if (e.key.toLowerCase() === 'n') {
      openClientModal(null);
    } else if (e.key.toLowerCase() === 'b') {
      switchView(currentView === 'list' ? 'board' : 'list');
    }
  });
}
