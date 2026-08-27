/**
 * Clients page logic: load, render, CRUD, search, filter, sort,
 * add-client modal, details modal with notes and reminders.
 */

let clientsState = [];
let currentFilter = 'All';
let currentSearch = '';
let currentSort = 'newest';
let activeClientId = null;

/**
 * Return filtered, searched, and sorted client list (non-destructive).
 */
function getVisibleClients() {
  let result = [...clientsState];

  if (currentFilter !== 'All') {
    result = result.filter((c) => c.status === currentFilter);
  }

  if (currentSearch) {
    const query = currentSearch.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query)
    );
  }

  switch (currentSort) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'dealValue':
      result.sort((a, b) => b.dealValue - a.dealValue);
      break;
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return result;
}

/**
 * Render client cards into the list container.
 */
function renderClients(list) {
  const container = document.getElementById('clients-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p class="clients-empty">No clients found.</p>';
    return;
  }

  container.innerHTML = list
    .map(
      (client) => `
      <article class="client-card" data-id="${client.id}">
        <div class="client-card__header">
          <img class="client-card__avatar" src="${escapeHtml(client.image)}" alt="${escapeHtml(client.name)}" onerror="this.style.display='none'">
          <div>
            <div class="client-card__name">${escapeHtml(client.name)}</div>
            <div class="client-card__company">${escapeHtml(client.company)}</div>
          </div>
          <span class="badge ${getStatusBadgeClass(client.status)}">${client.status}</span>
        </div>
        <div class="client-card__email">${escapeHtml(client.email)}</div>
        <div class="client-card__footer">
          <span class="client-card__deal">${formatCurrency(client.dealValue)}</span>
          <div class="client-card__actions">
            <select class="client-card__status-select" data-id="${client.id}" data-action="status">
              ${['Lead', 'Contacted', 'Won', 'Lost']
                .map(
                  (s) =>
                    `<option value="${s}" ${client.status === s ? 'selected' : ''}>${s}</option>`
                )
                .join('')}
            </select>
            <button type="button" class="btn btn--danger btn--small" data-id="${client.id}" data-action="delete">Delete</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

function setLoadingState(isLoading) {
  const loadingEl = document.getElementById('clients-loading');
  const listEl = document.getElementById('clients-list');
  if (loadingEl) loadingEl.hidden = !isLoading;
  if (listEl) listEl.hidden = isLoading;
}

function setErrorState(show) {
  const errorEl = document.getElementById('clients-error');
  if (errorEl) errorEl.hidden = !show;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.hidden = false;
}

function closeModal(modal) {
  if (modal) modal.hidden = true;
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.hidden = true;
  });
}

async function loadAndRenderClients() {
  setLoadingState(true);
  setErrorState(false);

  try {
    clientsState = await loadClients();
    setLoadingState(false);
    renderClients(getVisibleClients());
  } catch (error) {
    console.error('Failed to load clients:', error);
    setLoadingState(false);
    setErrorState(true);
  }
}

function handleStatusChange(clientId, newStatus) {
  const client = clientsState.find((c) => c.id === clientId);
  if (!client) return;

  client.status = newStatus;
  saveClients(clientsState);
  renderClients(getVisibleClients());
}

async function handleDeleteClient(clientId) {
  const confirmed = confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteClientFromApi(clientId);
  } catch (error) {
    console.error('Delete API error:', error);
    showToast('Could not delete client. Check your connection.', 'error');
    return;
  }

  clientsState = removeClientFromState(clientId);
  renderClients(getVisibleClients());
  showToast('Client deleted', 'success');
}

/**
 * Validate the Add Client form per PRD rules.
 */
function validateAddClientForm(form) {
  clearFormErrors(form);

  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const phone = form.phone.value.trim();
  const dealValue = form.dealValue.value.trim();
  const status = form.status.value;

  let hasErrors = false;

  if (name.length < 3) {
    showFieldError(form, 'name', 'Name must be at least 3 characters');
    hasErrors = true;
  }

  if (!isValidEmail(email)) {
    showFieldError(form, 'email', 'Please enter a valid email address');
    hasErrors = true;
  } else if (isClientEmailTaken(email)) {
    showFieldError(form, 'email', 'A client with this email already exists');
    hasErrors = true;
  }

  if (phone && phone.length < 6) {
    showFieldError(form, 'phone', 'Phone number looks too short');
    hasErrors = true;
  }

  const dealNum = Number(dealValue);
  if (!dealValue || isNaN(dealNum) || dealNum <= 0) {
    showFieldError(form, 'dealValue', 'Deal value must be a positive number');
    hasErrors = true;
  }

  if (!['Lead', 'Contacted', 'Won', 'Lost'].includes(status)) {
    hasErrors = true;
  }

  if (hasErrors) return null;

  return { name, email, phone, company: form.company.value.trim(), dealValue: dealNum, status };
}

/**
 * Submit Add Client form: validate → POST → save → render.
 */
async function handleAddClientSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = validateAddClientForm(form);
  if (!formData) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;

  try {
    const apiResponse = await postClientToApi(formData);
    const newClient = buildClientFromForm(formData, apiResponse);

    clientsState = addClientToState(newClient);
    form.reset();
    closeModal(document.getElementById('add-client-modal'));
    renderClients(getVisibleClients());
    showToast('Client added ✓', 'success');
  } catch (error) {
    console.error('Failed to add client:', error);
    showToast('Could not add client. Check your connection.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

/**
 * Render notes list inside the details modal (oldest first).
 */
function renderNotesList(notes) {
  if (!notes || notes.length === 0) {
    return '<p class="clients-empty">No notes yet.</p>';
  }

  return `
    <div class="notes-list">
      ${notes
        .map(
          (note) => `
        <div class="note-item">
          ${escapeHtml(note.text)}
          <span class="note-item__date">${escapeHtml(note.date)}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Open client details modal with full info and notes.
 */
function openClientDetails(clientId) {
  const client = clientsState.find((c) => c.id === clientId);
  if (!client) return;

  activeClientId = clientId;
  const container = document.getElementById('client-details-content');
  if (!container) return;

  container.innerHTML = `
    <div class="client-details">
      <div class="client-details__header">
        <img class="client-card__avatar" src="${escapeHtml(client.image)}" alt="${escapeHtml(client.name)}" onerror="this.style.display='none'">
        <div>
          <h2>${escapeHtml(client.name)}</h2>
          <p>${escapeHtml(client.company)}</p>
          <span class="badge ${getStatusBadgeClass(client.status)}">${client.status}</span>
        </div>
      </div>
      <dl class="client-details__info">
        <dt>Email</dt><dd>${escapeHtml(client.email)}</dd>
        <dt>Phone</dt><dd>${escapeHtml(client.phone || '—')}</dd>
        <dt>Deal Value</dt><dd>${formatCurrency(client.dealValue)}</dd>
        <dt>Client since</dt><dd>${new Date(client.createdAt).toLocaleDateString()}</dd>
      </dl>
      <h3>Notes</h3>
      <div id="notes-container">${renderNotesList(client.notes)}</div>
      <div class="client-details__note-form">
        <input type="text" id="note-input" placeholder="Add a note..." class="search-input">
        <button type="button" id="add-note-btn" class="btn btn--primary btn--small">Add note</button>
      </div>
      <button type="button" id="remind-btn" class="btn btn--ghost">Remind me in 1 min</button>
    </div>
  `;

  document.getElementById('add-note-btn').addEventListener('click', handleAddNote);
  document.getElementById('remind-btn').addEventListener('click', () => handleReminder(client));
  openModal('client-details-modal');
}

/**
 * Add a note to the active client.
 */
function handleAddNote() {
  const noteInput = document.getElementById('note-input');
  const text = noteInput.value.trim();
  if (!text) return;

  const client = clientsState.find((c) => c.id === activeClientId);
  if (!client) return;

  client.notes.push({
    text,
    date: new Date().toLocaleString(),
  });

  saveClients(clientsState);

  const notesContainer = document.getElementById('notes-container');
  if (notesContainer) {
    notesContainer.innerHTML = renderNotesList(client.notes);
  }

  noteInput.value = '';
}

/**
 * Set a follow-up reminder toast after 60 seconds.
 */
function handleReminder(client) {
  showToast('Reminder set ✓', 'success');

  setTimeout(() => {
    showToast(`⏰ Follow up: ${client.name}`, 'success');
  }, 60000);
}

function initClientsPageEvents() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const filterChips = document.getElementById('filter-chips');
  const clientsList = document.getElementById('clients-list');
  const retryBtn = document.getElementById('retry-btn');
  const addClientBtn = document.getElementById('add-client-btn');
  const addClientForm = document.getElementById('add-client-form');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderClients(getVisibleClients());
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderClients(getVisibleClients());
    });
  }

  if (filterChips) {
    filterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      currentFilter = chip.dataset.status;
      filterChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
      renderClients(getVisibleClients());
    });
  }

  if (clientsList) {
    clientsList.addEventListener('change', (e) => {
      if (e.target.dataset.action === 'status') {
        e.stopPropagation();
        handleStatusChange(Number(e.target.dataset.id), e.target.value);
      }
    });

    clientsList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.stopPropagation();
        handleDeleteClient(Number(deleteBtn.dataset.id));
        return;
      }

      const card = e.target.closest('.client-card');
      if (card && !e.target.closest('.client-card__actions')) {
        openClientDetails(Number(card.dataset.id));
      }
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', loadAndRenderClients);
  }

  if (addClientBtn) {
    addClientBtn.addEventListener('click', () => {
      const form = document.getElementById('add-client-form');
      if (form) clearFormErrors(form);
      openModal('add-client-modal');
    });
  }

  if (addClientForm) {
    addClientForm.addEventListener('submit', handleAddClientSubmit);
  }

  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      closeModal(el.closest('.modal'));
    });
  });
}

initClientsPageEvents();
loadAndRenderClients();
