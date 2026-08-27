let statusFilter = 'All';
let searchTerm = '';
let sortMode = 'newest';
let openClientId = null;
let lastModalTrigger = null;
let xlsxLibraryPromise = null;
let searchDebounceTimer = null;

const STATUS_BADGES = {
  Lead: 'badge-lead',
  Contacted: 'badge-contacted',
  Won: 'badge-won',
  Lost: 'badge-lost',
};

// Apply the active filter, search term and sort mode without mutating state.
function getVisibleClients() {
  let result =
    statusFilter === 'All'
      ? [...clients]
      : clients.filter(function (client) {
          return client.status === statusFilter;
        });

  const term = searchTerm.trim().toLowerCase();

  if (term) {
    result = result.filter(function (client) {
      return (
        client.name.toLowerCase().includes(term) ||
        client.company.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone || '').toLowerCase().includes(term)
      );
    });
  }

  return result.sort(function (firstClient, secondClient) {
    if (sortMode === 'name') {
      return firstClient.name.localeCompare(secondClient.name);
    }

    if (sortMode === 'deal-high') {
      return secondClient.dealValue - firstClient.dealValue;
    }

    return new Date(secondClient.createdAt) - new Date(firstClient.createdAt);
  });
}

function createStatusBadge(status) {
  const badge = document.createElement('span');
  badge.className = `badge ${STATUS_BADGES[status] || 'badge-lead'}`;
  badge.textContent = status;
  return badge;
}

function createClientCard(client) {
  const card = document.createElement('article');
  card.className = 'client-card';
  card.dataset.id = client.id;
  card.tabIndex = 0;
  card.setAttribute('aria-label', `Open details for ${client.name}`);

  const top = document.createElement('div');
  top.className = 'client-card__top';

  const avatar = document.createElement('img');
  avatar.className = 'client-card__avatar';
  avatar.src = client.image;
  avatar.alt = '';
  avatar.loading = 'lazy';

  const identity = document.createElement('div');
  identity.className = 'client-card__id';

  const name = document.createElement('div');
  name.className = 'client-card__name';
  name.textContent = client.name;

  const company = document.createElement('div');
  company.className = 'client-card__company';
  company.textContent = client.company || 'No company';

  const email = document.createElement('div');
  email.className = 'client-card__email';
  email.textContent = client.email;

  identity.append(name, company, email);
  top.append(avatar, identity);

  const meta = document.createElement('div');
  meta.className = 'client-card__meta';

  const dealValue = document.createElement('span');
  dealValue.className = 'client-card__value';
  dealValue.textContent = formatMoney(client.dealValue);

  meta.append(dealValue, createStatusBadge(client.status));

  const footer = document.createElement('div');
  footer.className = 'client-card__foot';

  const statusSelect = document.createElement('select');
  statusSelect.className = `input ${STATUS_BADGES[client.status] || 'badge-lead'}`;
  statusSelect.dataset.action = 'status';
  statusSelect.setAttribute('aria-label', `Change status for ${client.name}`);

  for (const status of CLIENT_STATUSES) {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    option.selected = status === client.status;
    statusSelect.append(option);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'client-card__del';
  deleteButton.dataset.action = 'delete';
  deleteButton.setAttribute('aria-label', `Delete ${client.name}`);
  deleteButton.textContent = '\u00d7';

  footer.append(statusSelect, deleteButton);
  card.append(top, meta, footer);

  return card;
}

// Render the complete visible list from state.
function renderClients(list) {
  const host = document.getElementById('clientsArea');
  host.textContent = '';

  if (!list.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'list-state';

    const title = document.createElement('div');
    title.className = 'list-state__title';
    title.textContent = 'No clients found.';

    const hint = document.createElement('div');
    hint.textContent = 'Try a different search or filter.';

    emptyState.append(title, hint);
    host.append(emptyState);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'client-grid';

  for (const client of list) {
    grid.append(createClientCard(client));
  }

  host.append(grid);
}

function refreshClients() {
  renderClients(getVisibleClients());
}

function protectSpreadsheetValue(value, columnIndex) {
  const text = String(value ?? '');

  if (columnIndex === 2 && text.startsWith('+')) {
    return `'${text}`;
  }

  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function escapeCsvValue(value, columnIndex) {
  const protectedValue = protectSpreadsheetValue(value, columnIndex);
  return `"${protectedValue.replace(/"/g, '""')}"`;
}

function exportClientsCsv() {
  if (!clients.length) {
    showToast('There are no clients to export.', 'error');
    return;
  }

  const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Deal Value'];
  const rows = clients.map(function (client) {
    return [
      client.name,
      client.email,
      client.phone || '',
      client.company || '',
      client.status,
      client.dealValue,
    ];
  });
  const csv = [headers, ...rows]
    .map(function (row) {
      return row
        .map(function (value, columnIndex) {
          return escapeCsvValue(value, columnIndex);
        })
        .join(',');
    })
    .join('\r\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `clients-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(function () {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}

function normalizeImportRow(row) {
  const fields = {};

  for (const [key, value] of Object.entries(row)) {
    fields[
      String(key)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, '')
    ] = value;
  }

  const firstName = String(fields.firstname ?? '').trim();
  const lastName = String(fields.lastname ?? '').trim();

  return {
    name: String(fields.name ?? fields.fullname ?? `${firstName} ${lastName}`).trim(),
    email: String(fields.email ?? '').trim(),
    phone: String(fields.phone ?? fields.telephone ?? '')
      .trim()
      .replace(/^'(?=\+)/, ''),
    company: String(fields.company ?? fields.companyname ?? '').trim(),
    status: String(fields.status || 'Lead').trim(),
    dealValue: fields.dealvalue ?? fields.deal ?? fields.value ?? '',
  };
}

function parseImportedDealValue(value) {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value).replace(/[$€£₾,\s]/g, ''));
}

function importClientRows(rows) {
  const importedClients = [];
  const existingEmails = new Set(
    clients.map(function (client) {
      return client.email.trim().toLowerCase();
    }),
  );

  for (const row of rows) {
    const values = normalizeImportRow(row);
    const normalizedEmail = values.email.toLowerCase();
    const normalizedStatus = CLIENT_STATUSES.find(function (status) {
      return status.toLowerCase() === values.status.toLowerCase();
    });
    const numericDealValue = parseImportedDealValue(values.dealValue);

    if (
      values.name.length < 3 ||
      !isValidEmail(normalizedEmail) ||
      !isValidPhone(values.phone) ||
      !normalizedStatus ||
      !Number.isFinite(numericDealValue) ||
      numericDealValue <= 0 ||
      existingEmails.has(normalizedEmail)
    ) {
      continue;
    }

    existingEmails.add(normalizedEmail);
    importedClients.push({
      id: createLocalClientId(),
      apiId: null,
      name: values.name,
      email: normalizedEmail,
      phone: values.phone.trim(),
      company: values.company,
      image: `${API_BASE}/icon/${values.name.split(/\s+/)[0].toLowerCase()}/128`,
      status: normalizedStatus,
      dealValue: numericDealValue,
      notes: [],
      createdAt: new Date().toISOString(),
    });
  }

  if (!importedClients.length) {
    return 0;
  }

  const nextClients = [...importedClients, ...clients];
  persistClients(nextClients);
  clients = nextClients;
  refreshClients();
  return importedClients.length;
}

function loadXlsxLibrary() {
  if (typeof XLSX !== 'undefined') {
    return Promise.resolve(XLSX);
  }

  if (xlsxLibraryPromise) {
    return xlsxLibraryPromise;
  }

  xlsxLibraryPromise = new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.onload = function () {
      if (typeof XLSX === 'undefined') {
        reject(new Error('Excel import library could not be loaded'));
        return;
      }

      resolve(XLSX);
    };
    script.onerror = function () {
      reject(new Error('Excel import library could not be loaded'));
    };
    document.head.append(script);
  }).catch(function (error) {
    xlsxLibraryPromise = null;
    throw error;
  });

  return xlsxLibraryPromise;
}

async function importClientsFile(file) {
  const xlsx = await loadXlsxLibrary();

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('The selected file is larger than 2 MB');
  }

  const workbook = xlsx.read(await file.arrayBuffer(), { type: 'array' });

  if (!workbook.SheetNames.length) {
    throw new Error('The selected file does not contain a worksheet');
  }

  const rows = workbook.SheetNames.flatMap(function (sheetName) {
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: '',
      raw: false,
    });
  });

  if (rows.length > 5000) {
    throw new Error('The selected file contains more than 5,000 rows');
  }

  return importClientRows(rows);
}

function setClientsAreaMessage(message, withRetry = false, loading = false) {
  const host = document.getElementById('clientsArea');
  host.textContent = '';

  const state = document.createElement('div');
  state.className = 'list-state';

  if (loading) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    state.append(spinner);
  }

  const title = document.createElement('div');
  title.className = 'list-state__title';
  title.textContent = message;
  state.append(title);

  if (withRetry) {
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.className = 'btn btn-outline';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', initialLoad);
    state.append(retryButton);
  }

  host.append(state);
}

async function initialLoad() {
  setClientsAreaMessage('Loading clients...', false, true);

  try {
    await loadClients();
    refreshClients();
  } catch (error) {
    console.error(error);
    setClientsAreaMessage('Could not load clients. Check your connection and try again.', true);
  }
}

function validateClient({ name, email, phone, dealValue }, existingClients) {
  const errors = {};
  const cleanName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (cleanName.length < 3) {
    errors.cName = 'Name must be at least 3 characters';
  }

  if (!isValidEmail(normalizedEmail)) {
    errors.cEmail = 'Please enter a valid email address';
  } else if (
    existingClients.some(function (client) {
      return client.email.toLowerCase() === normalizedEmail;
    })
  ) {
    errors.cEmail = 'A client with this email already exists';
  }

  if (!isValidPhone(phone)) {
    errors.cPhone = 'Phone number looks too short';
  }

  const numericDealValue = Number(dealValue);

  if (Number.isNaN(numericDealValue)) {
    errors.cDeal = 'Deal value must be a positive number';
  }

  return {
    errors,
    cleanName,
    normalizedEmail,
    numericDealValue,
  };
}

async function addClient(values) {
  const { errors, cleanName, normalizedEmail, numericDealValue } = validateClient(values, clients);

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const nameParts = cleanName.split(' ');
  const response = await fetch(`${API_BASE}/users/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: normalizedEmail,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const createdClient = await response.json();

  const newClient = {
    id: createLocalClientId(),
    apiId: createdClient.id,
    name: cleanName,
    email: normalizedEmail,
    phone: values.phone.trim(),
    company: values.company.trim(),
    image: `${API_BASE}/icon/${nameParts[0].toLowerCase()}/128`,
    status: values.status,
    dealValue: numericDealValue,
    notes: [],
    createdAt: new Date().toISOString(),
  };

  const nextClients = [newClient, ...clients];
  persistClients(nextClients);
  clients = nextClients;
  refreshClients();
  showToast('Client added \u2713', 'success');

  return {};
}

async function deleteClient(id) {
  if (!window.confirm('Delete this client? This cannot be undone.')) {
    return;
  }

  const clientToDelete = clients.find(function (client) {
    return String(client.id) === String(id);
  });

  if (!clientToDelete) {
    return;
  }

  const apiId = clientToDelete.apiId ?? clientToDelete.id;

  try {
    const response = await fetch(`${API_BASE}/users/${encodeURIComponent(apiId)}`, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Request failed: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    showToast('Could not delete this client.', 'error');
    return;
  }

  const nextClients = clients.filter(function (client) {
    return String(client.id) !== String(id);
  });

  try {
    persistClients(nextClients);
  } catch (error) {
    console.error(error);
    showToast(error.message, 'error');
    return;
  }

  clients = nextClients;
  removeClientReminders(id);
  refreshClients();
  showToast('Client deleted', 'success');
}

function changeStatus(id, status) {
  const client = clients.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!client) {
    return;
  }

  const previousStatus = client.status;
  client.status = status;

  try {
    persistClients(clients);
  } catch (error) {
    client.status = previousStatus;
    console.error(error);
    showToast(error.message, 'error');
  }

  refreshClients();
}

function createDetailRow(label, value) {
  const row = document.createElement('div');
  row.className = 'detail-row';

  const key = document.createElement('span');
  key.className = 'detail-row__key';
  key.textContent = label;

  const rowValue = document.createElement('span');
  rowValue.className = 'detail-row__val';

  if (value instanceof Node) {
    rowValue.append(value);
  } else {
    rowValue.textContent = value;
  }

  row.append(key, rowValue);
  return row;
}

function renderNotes(client, host) {
  const notes = client.notes || [];
  const title = document.createElement('h4');
  title.className = 'card-title mb-2';
  title.textContent = 'Notes';
  host.append(title);

  if (!notes.length) {
    const empty = document.createElement('p');
    empty.className = 'notes-empty';
    empty.textContent = 'No notes yet.';
    host.append(empty);
  } else {
    const notesList = document.createElement('div');
    notesList.className = 'notes-list';

    for (const note of notes) {
      const noteElement = document.createElement('div');
      noteElement.className = 'note';

      const noteText = document.createElement('div');
      noteText.className = 'note__text';
      noteText.textContent = note.text;

      const noteDate = document.createElement('div');
      noteDate.className = 'note__date';
      noteDate.textContent = note.date;

      noteElement.append(noteText, noteDate);
      notesList.append(noteElement);
    }

    host.append(notesList);
  }

  const noteControls = document.createElement('div');
  noteControls.className = 'note-add';

  const noteInput = document.createElement('input');
  noteInput.className = 'input';
  noteInput.type = 'text';
  noteInput.placeholder = 'Add a note\u2026';

  const addNoteButton = document.createElement('button');
  addNoteButton.type = 'button';
  addNoteButton.className = 'btn btn-outline';
  addNoteButton.textContent = 'Add';
  addNoteButton.addEventListener('click', function () {
    if (addNote(openClientId, noteInput.value)) {
      openDetail(openClientId);
    }
  });

  noteControls.append(noteInput, addNoteButton);

  const reminderButton = document.createElement('button');
  reminderButton.type = 'button';
  reminderButton.className = 'btn btn-primary btn-block mt-1';
  reminderButton.textContent = 'Remind me in 1 min';
  reminderButton.addEventListener('click', function () {
    remindLater(openClientId);
  });

  host.append(noteControls, reminderButton);
}

function createIntegrationButton(label, createTask) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-outline';
  button.textContent = label;
  button.addEventListener('click', async function () {
    button.disabled = true;

    try {
      const result = await createTask();
      const url = result.url || result.task?.permalink_url || '';
      showToast('Task created ✓', 'success');

      if (url) {
        window.open(url, '_blank', 'noopener');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Could not create the task.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  return button;
}

// Buttons that push this client into Jira or Asana through our /api proxy.
function renderIntegrations(client, host) {
  if (typeof createJiraIssueForClient !== 'function') {
    return;
  }

  const title = document.createElement('h4');
  title.className = 'card-title mb-2 mt-2';
  title.textContent = 'Integrations';

  const controls = document.createElement('div');
  controls.className = 'note-add';
  controls.append(
    createIntegrationButton('Create Jira issue', function () {
      return createJiraIssueForClient(client);
    }),
    createIntegrationButton('Create Asana task', function () {
      return createAsanaTaskForClient(client);
    }),
  );

  host.append(title, controls);
}

function openDetail(id, trigger) {
  const client = clients.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!client) {
    return;
  }

  openClientId = id;
  const detailBody = document.getElementById('detailBody');
  detailBody.textContent = '';

  const header = document.createElement('div');
  header.className = 'detail-head';

  const avatar = document.createElement('img');
  avatar.className = 'detail-head__avatar';
  avatar.src = client.image;
  avatar.alt = '';

  const identity = document.createElement('div');

  const name = document.createElement('div');
  name.className = 'detail-head__name';
  name.textContent = client.name;

  const company = document.createElement('div');
  company.className = 'detail-head__company';
  company.textContent = client.company || 'No company';

  identity.append(name, company);
  header.append(avatar, identity);

  const rows = document.createElement('div');
  rows.className = 'detail-rows';
  rows.append(
    createDetailRow('Email', client.email),
    createDetailRow('Phone', client.phone || '\u2014'),
    createDetailRow('Status', createStatusBadge(client.status)),
    createDetailRow('Deal value', formatMoney(client.dealValue)),
    createDetailRow('Client since', new Date(client.createdAt).toLocaleDateString()),
  );

  detailBody.append(header, rows);
  renderNotes(client, detailBody);
  renderIntegrations(client, detailBody);
  const detailModal = document.getElementById('detailModal');

  if (!detailModal.classList.contains('open')) {
    openModal(detailModal, trigger || document.activeElement);
  }
}

function addNote(id, rawText) {
  const text = rawText.trim();

  if (!text) {
    return false;
  }

  const client = clients.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!client) {
    return false;
  }

  client.notes = client.notes || [];
  client.notes.push({
    text,
    date: new Date().toLocaleString(),
  });

  try {
    persistClients(clients);
  } catch (error) {
    client.notes.pop();
    console.error(error);
    showToast(error.message, 'error');
    return false;
  }

  return true;
}

function remindLater(id) {
  const client = clients.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!client) {
    return;
  }

  if (scheduleReminder(client)) {
    showToast('Reminder set \u2713', 'success');
  } else {
    showToast('Could not save the reminder.', 'error');
  }
}

function getFocusableElements(modal) {
  return Array.from(
    modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(function (element) {
    return !element.hidden;
  });
}

function openModal(modal, trigger) {
  lastModalTrigger = trigger || document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(function () {
    getFocusableElements(modal)[0]?.focus();
  });
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  lastModalTrigger?.focus();
  lastModalTrigger = null;
}

document.addEventListener('DOMContentLoaded', function () {
  if (!initProtectedPage('clients')) {
    return;
  }

  const clientsArea = document.getElementById('clientsArea');
  const addModal = document.getElementById('addModal');
  const detailModal = document.getElementById('detailModal');
  const addForm = document.getElementById('addForm');

  // Debounce the search: wait until the user pauses typing before re-rendering,
  // so the list is not rebuilt on every single keystroke.
  document.getElementById('searchInput').addEventListener('input', function (event) {
    const value = event.target.value;
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(function () {
      searchTerm = value;
      refreshClients();
    }, 250);
  });

  document.getElementById('filterChips').addEventListener('click', function (event) {
    const chip = event.target.closest('.chip');

    if (!chip) {
      return;
    }

    statusFilter = chip.dataset.status;

    document.querySelectorAll('#filterChips .chip').forEach(function (otherChip) {
      otherChip.classList.toggle('active', otherChip === chip);
    });

    refreshClients();
  });

  document.getElementById('sortSelect').addEventListener('change', function (event) {
    sortMode = event.target.value;
    refreshClients();
  });

  document.getElementById('exportBtn').addEventListener('click', exportClientsCsv);

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', function () {
    importFile.click();
  });

  importFile.addEventListener('change', async function () {
    const file = importFile.files[0];

    if (!file) {
      return;
    }

    try {
      const importedCount = await importClientsFile(file);

      if (importedCount > 0) {
        showToast(`${importedCount} client${importedCount === 1 ? '' : 's'} imported ✓`, 'success');
      } else {
        showToast('No valid new clients were found in this file.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Could not import this file.', 'error');
    } finally {
      importFile.value = '';
    }
  });

  clientsArea.addEventListener('click', function (event) {
    const card = event.target.closest('.client-card');

    if (!card) {
      return;
    }

    const id = card.dataset.id;

    if (event.target.dataset.action === 'delete') {
      deleteClient(id);
      return;
    }

    if (event.target.dataset.action === 'status') {
      return;
    }

    openDetail(id, card);
  });

  clientsArea.addEventListener('change', function (event) {
    if (event.target.dataset.action !== 'status') {
      return;
    }

    const card = event.target.closest('.client-card');
    changeStatus(card.dataset.id, event.target.value);
  });

  clientsArea.addEventListener('keydown', function (event) {
    const card = event.target.closest('.client-card');

    if (!card || event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    openDetail(card.dataset.id, card);
  });

  document.getElementById('addClientBtn').addEventListener('click', function () {
    addForm.reset();
    clearErrors();
    openModal(addModal, this);
  });

  document.getElementById('cPhone').addEventListener('input', function (event) {
    event.target.value = sanitizePhone(event.target.value);
  });

  for (const modal of [addModal, detailModal]) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal(modal);
      }
    });

    modal.querySelectorAll('[data-close]').forEach(function (closeButton) {
      closeButton.addEventListener('click', function () {
        closeModal(modal);
      });
    });

    modal.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusableElements(modal);

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') {
      return;
    }

    const openModalElement = document.querySelector('.modal-backdrop.open');
    if (openModalElement) {
      closeModal(openModalElement);
    }
  });

  addForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearErrors();

    const submitButton = document.getElementById('addSubmitBtn');
    submitButton.disabled = true;

    try {
      const errors = await addClient({
        name: document.getElementById('cName').value,
        email: document.getElementById('cEmail').value,
        phone: document.getElementById('cPhone').value,
        company: document.getElementById('cCompany').value,
        dealValue: document.getElementById('cDeal').value,
        status: document.getElementById('cStatus').value,
      });

      if (Object.keys(errors).length > 0) {
        for (const [field, message] of Object.entries(errors)) {
          showError(field, message);
        }
      } else {
        closeModal(addModal);
      }
    } catch (error) {
      console.error(error);
      showToast('Could not add this client.', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });

  clearErrorOnInput(addForm);
  initialLoad();
});
