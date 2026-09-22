/* ==========================================================================
   clients.js — Clients page (PRD P4): the heart of the product.
   Golden cycle used everywhere below: state changes -> save -> re-render.
   ========================================================================== */

const CLIENT_STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];

/* Current toolbar state (search / status filter / sort). The source array
   is never mutated by these — getVisibleClients() always works on a copy. */
const viewState = {
search: '',
status: 'All',
sort: 'newest'
};

/* ---- P4.2 Loading with loading / error states ----------------------------- */

async function initialLoad() {
  const listEl = document.getElementById('clients-list');
  listEl.innerHTML = '<p class="list-message">Loading clients...</p>';

  try {
    await loadClients();
    rerender();
  } catch (err) {
    console.error('Failed to load clients:', err);
    // Error UI with a Retry button that repeats the load (P4.2 FULL).
    listEl.innerHTML = '';

    const message = document.createElement('div');
    message.className = 'list-message';

    const text = document.createElement('p');
    text.textContent = 'Could not load clients. Check your connection and try again.';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-primary btn-sm';
    retryBtn.style.marginTop = '12px';
    retryBtn.textContent = 'Retry';
    retryBtn.addEventListener('click', initialLoad);

    message.appendChild(text);
    message.appendChild(retryBtn);
    listEl.appendChild(message);
  }
}

/* ---- P4.7 Search + filter + sort -------------------------------------------
   One function applies, in order: status filter -> search -> sort.
   It always works on a copy, so clientsState itself is never damaged. */

function getVisibleClients() {
  let list = clientsState.slice();

  // 1. Status filter (chips).
  if (viewState.status !== 'All') {
    list = list.filter(function (c) { return c.status === viewState.status; });  //
  }

  // 2. Search by name or company (case-insensitive).
  const query = viewState.search.trim().toLowerCase();
  if (query !== '') {
    list = list.filter(function (c) {
      return c.name.toLowerCase().includes(query) ||
          (c.company || '').toLowerCase().includes(query);
    });
  }

  // 3. Sort.
  if (viewState.sort === 'newest') {
    list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  } else if (viewState.sort === 'name') {
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (viewState.sort === 'deal') {
    list.sort(function (a, b) { return b.dealValue - a.dealValue; });
  }

  return list;
}

/** Shorthand: recompute the visible list and paint it. */
function rerender() {
  renderClients(getVisibleClients());
}

/* ---- P4.3 Rendering ---------------------------------------------------------
   One function clears the container and rebuilds every card. Every other
   action ends by calling this (through rerender). Cards carry data-id so
   button handlers know which client they act on. */

function renderClients(list) {
  const container = document.getElementById('clients-list');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p class="list-message">No clients found.</p>';
    return;
  }

  list.forEach(function (client) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.dataset.id = client.id;

    /* Top row: avatar + name + company */
    const top = document.createElement('div');
    top.className = 'client-card-top';

    if (client.image) {
      const avatar = document.createElement('img');
      avatar.className = 'client-avatar';
      avatar.src = client.image;
      avatar.alt = client.name;
      top.appendChild(avatar);
    } else {
      // Clients added by hand have no photo — show initials instead.
      const initials = document.createElement('div');
      initials.className = 'client-avatar-initials';
      initials.textContent = getInitials(client.name);
      top.appendChild(initials);
    }

    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'client-name';
    name.textContent = client.name;
    const company = document.createElement('div');
    company.className = 'client-company';
    company.textContent = client.company || '—';
    info.appendChild(name);
    info.appendChild(company);
    top.appendChild(info);

    /* Email */
    const email = document.createElement('div');
    email.className = 'client-email';
    email.textContent = client.email;

    /* Bottom row: badge + deal value + status select + delete */
    const bottom = document.createElement('div');
    bottom.className = 'client-card-bottom';

    const badge = document.createElement('span');
    badge.className = 'badge ' + getStatusBadgeClass(client.status);
    badge.textContent = client.status;

    const deal = document.createElement('span');
    deal.className = 'deal-value';
    deal.textContent = formatMoney(client.dealValue);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // P4.6 — status select changes the deal stage in place.
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    CLIENT_STATUSES.forEach(function (status) {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.selected = status === client.status;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener('change', function (event) {
      handleStatusChange(client.id, event.target.value);
    });
    // Clicking the select must not open the details modal.
    statusSelect.addEventListener('click', function (event) { event.stopPropagation(); });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      handleDelete(client.id);
    });

    actions.appendChild(statusSelect);
    actions.appendChild(deleteBtn);
    bottom.appendChild(badge);
    bottom.appendChild(deal);
    bottom.appendChild(actions);

    card.appendChild(top);
    card.appendChild(email);
    card.appendChild(bottom);

    // P4.8 — clicking the card (anywhere except the buttons) opens details.
    card.addEventListener('click', function () { openDetailsModal(client.id); });

    container.appendChild(card);
  });
}

/** Badge class per status — a lookup object instead of a switch. */
function getStatusBadgeClass(status) {
  const classMap = {
    Lead: 'badge-lead',
    Contacted: 'badge-contacted',
    Won: 'badge-won',
    Lost: 'badge-lost'
  };
  return classMap[status] || 'badge-lead';
}

/** "Emily Johnson" -> "EJ" for default avatars. */
function getInitials(name) {
  return name
      .split(' ')
      .filter(function (word) { return word !== ''; })
      .slice(0, 2)
      .map(function (word) { return word[0].toUpperCase(); })
      .join('');
}

/* ---- P4.6 Status change ------------------------------------------------------ */

function handleStatusChange(clientId, newStatus) {
  const client = clientsState.find(function (c) { return c.id === clientId; });
  if (!client) return;

  client.status = newStatus; // state changes ->
  saveClients();             // -> is saved ->
  rerender();                // -> screen is repainted.
}

/* ---- P4.5 Delete -------------------------------------------------------------- */

async function handleDelete(clientId) {
  // confirm() is the one allowed native dialog (delete confirmation only).
  const confirmed = confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  try {
    // DummyJSON simulates the delete. For clients we added ourselves it may
    // answer 404 (it never really stored them) — expected, so we delete from
    // state either way.
    await fetch(API_BASE + '/users/' + clientId, { method: 'DELETE' });
  } catch (err) {
    console.error('DELETE request failed:', err);
  }

  clientsState = clientsState.filter(function (c) { return c.id !== clientId; });
  saveClients();
  rerender();
  showToast('Client deleted', 'success');
}

/* ---- P4.4 Add Client modal ------------------------------------------------------ */

function openAddModal() {
  const overlay = document.getElementById('add-modal');
  const form = document.getElementById('add-form');
  form.reset(); // reset the form to clear previous values
  clearFieldErrors(form);
  overlay.classList.add('open');
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('open');
}

async function handleAddSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearFieldErrors(form);

  const nameInput = document.getElementById('add-name');
  const emailInput = document.getElementById('add-email');
  const phoneInput = document.getElementById('add-phone');
  const companyInput = document.getElementById('add-company');
  const dealInput = document.getElementById('add-deal');
  const statusInput = document.getElementById('add-status');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const phone = phoneInput.value.trim();
  const company = companyInput.value.trim();
  const dealValue = Number(dealInput.value);

  let hasErrors = false;

  if (name.length < 3) {
    setFieldError(nameInput, 'Name must be at least 3 characters');
    hasErrors = true;
  }

  if (!isValidEmail(email)) {
    setFieldError(emailInput, 'Please enter a valid email address');
    hasErrors = true;
  } else if (clientsState.some(function (c) { return c.email.toLowerCase() === email; })) {
    setFieldError(emailInput, 'A client with this email already exists');
    hasErrors = true;
  }

  // Phone is optional, but if filled it must be at least 6 characters.
  if (phone !== '' && phone.length < 6) {
    setFieldError(phoneInput, 'Phone number looks too short');
    hasErrors = true;
  }

  if (dealInput.value.trim() === '' || isNaN(dealValue) || dealValue <= 0) {
    setFieldError(dealInput, 'Deal value must be a positive number');
    hasErrors = true;
  }

  if (hasErrors) return;

  const newClient = {
    name: name,
    email: email,
    phone: phone,
    company: company,
    image: '', // no photo upload — the card shows initials instead
    status: statusInput.value,
    dealValue: dealValue,
    notes: [],
    createdAt: new Date().toISOString()
  };

  try {
    // POST to the API — it simulates the write and returns an id.
    const response = await fetch(API_BASE + '/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
    if (!response.ok) throw new Error('HTTP error ' + response.status);

    const created = await response.json();
    newClient.id = created.id; // server-assigned id
  } catch (err) {
    console.error('POST request failed:', err);
    showToast('Could not add client. Try again.', 'error');
    return;
  }

  // New client goes to the top of the list (unshift), then save + render.
  clientsState.unshift(newClient);
  saveClients();
  rerender();
  closeAddModal();
  showToast('Client added ✓', 'success');
}

/* ---- P4.8 Details modal: info + notes + reminder ---------------------------------- */

/** Id of the client currently open in the details modal. */
let detailsClientId = null;

function openDetailsModal(clientId) {
  const client = clientsState.find(function (c) { return c.id === clientId; });
  if (!client) return;

  detailsClientId = clientId;

  // Head: avatar + name + company.
  const head = document.getElementById('details-head');
  head.innerHTML = '';
  if (client.image) {
    const avatar = document.createElement('img');
    avatar.className = 'client-avatar';
    avatar.src = client.image;
    avatar.alt = client.name;
    head.appendChild(avatar);
  } else {
    const initials = document.createElement('div');
    initials.className = 'client-avatar-initials';
    initials.textContent = getInitials(client.name);
    head.appendChild(initials);
  }
  const headInfo = document.createElement('div');
  const headName = document.createElement('div');
  headName.className = 'client-name';
  headName.textContent = client.name;
  const headCompany = document.createElement('div');
  headCompany.className = 'client-company';
  headCompany.textContent = client.company || '—';
  headInfo.appendChild(headName);
  headInfo.appendChild(headCompany);
  head.appendChild(headInfo);

  // Meta rows.
  const meta = document.getElementById('details-meta');
  meta.innerHTML = '';
  const rows = [
    ['Email', client.email],
    ['Phone', client.phone || '—'],
    ['Status', client.status],
    ['Deal value', formatMoney(client.dealValue)],
    ['Client since', new Date(client.createdAt).toLocaleDateString()]
  ];
  rows.forEach(function (pair) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = pair[0] + ': ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(pair[1]));
    meta.appendChild(p);
  });

  renderNotes(client);
  document.getElementById('details-modal').classList.add('open');
}

function closeDetailsModal() {
  document.getElementById('details-modal').classList.remove('open');
  detailsClientId = null;
}

/** Notes list, oldest first (they are pushed in chronological order). */
function renderNotes(client) {
  const list = document.getElementById('notes-list');
  list.innerHTML = '';

  if (client.notes.length === 0) {
    list.innerHTML = '<p class="list-message" style="padding:16px">No notes yet. Add the first one below.</p>';
    return;
  }

  client.notes.forEach(function (note) {
    const item = document.createElement('div');
    item.className = 'note-item';
    const text = document.createElement('span');
    text.textContent = note.text;
    const date = document.createElement('span');
    date.className = 'note-date';
    date.textContent = note.date;
    item.appendChild(text);
    item.appendChild(date);
    list.appendChild(item);
  });
}

function handleAddNote() {
  const input = document.getElementById('note-input');
  const text = input.value.trim();
  if (text === '') return; // empty notes are not added

  const client = clientsState.find(function (c) { return c.id === detailsClientId; });
  if (!client) return;

  client.notes.push({ text: text, date: new Date().toLocaleString() });
  saveClients();
  renderNotes(client);
  input.value = '';
}

/** P4.8 — "Remind me in 1 min": fires even if the modal is closed. */
function handleReminder() {
  const client = clientsState.find(function (c) { return c.id === detailsClientId; });
  if (!client) return;

  const clientName = client.name; // captured so the toast works after close
  showToast('Reminder set ✓', 'success');

  setTimeout(function () {
    showToast('⏰ Follow up: ' + clientName, 'info');
  }, 60000);
}

/* ---- Page init ---------------------------------------------------------------------- */

function initClientsPage() {
  // Toolbar: search (input event — no API calls, just re-filtering).
  document.getElementById('search-input').addEventListener('input', function (event) {
    viewState.search = event.target.value;
    rerender();
  });

  // Filter chips.
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      viewState.status = chip.dataset.status;
      rerender();
    });
  });

  // Sort select.
  document.getElementById('sort-select').addEventListener('change', function (event) {
    viewState.sort = event.target.value;
    rerender();
  });

  // Add Client modal wiring.
  document.getElementById('add-client-btn').addEventListener('click', openAddModal);
  document.getElementById('add-modal-close').addEventListener('click', closeAddModal);
  document.getElementById('add-form').addEventListener('submit', handleAddSubmit);
  // Bonus: clicking the dark backdrop also closes the modal.
  document.getElementById('add-modal').addEventListener('click', function (event) {
    if (event.target === event.currentTarget) closeAddModal();
  });

  // Details modal wiring.
  document.getElementById('details-modal-close').addEventListener('click', closeDetailsModal);
  document.getElementById('details-modal').addEventListener('click', function (event) {
    if (event.target === event.currentTarget) closeDetailsModal();
  });
  document.getElementById('add-note-btn').addEventListener('click', handleAddNote);
  document.getElementById('note-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') handleAddNote();
  });
  document.getElementById('remind-btn').addEventListener('click', handleReminder);

  initialLoad();
}

document.addEventListener('DOMContentLoaded', initClientsPage);
