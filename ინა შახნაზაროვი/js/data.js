/* ============================================
   data.js — Clients state management + API
   ============================================ */

const API_BASE = 'https://dummyjson.com';

let clientsState = [];

function getClients() {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!data) return [];

  try {
    const clients = JSON.parse(data);
    return Array.isArray(clients) ? clients : [];
  } catch (error) {
    console.error('Could not parse saved clients:', error);
    return [];
  }
}

function saveClients(clients) {
  clientsState = clients;
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

async function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (stored) {
    clientsState = getClients();
    return clientsState;
  }

  try {
    const res = await fetch(`${API_BASE}/users?limit=30`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    clientsState = data.users.map((u, i) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone,
      company: u.company?.name || '',
      image: u.image,
      status: 'Lead',
      dealValue: Math.floor(Math.random() * 9500) + 500,
      notes: [],
      createdAt: new Date(Date.now() - i * 86400000 * Math.random() * 30).toISOString()
    }));

    saveClients(clientsState);
    return clientsState;
  } catch (err) {
    console.error('Failed to load clients:', err);
    throw err;
  }
}

function addClient(clientData) {
  const newClient = {
    id: Number(clientData.id) || Date.now(),
    name: clientData.name.trim(),
    email: clientData.email.trim().toLowerCase(),
    phone: clientData.phone ? clientData.phone.trim() : '',
    company: clientData.company ? clientData.company.trim() : '',
    image: '',
    status: clientData.status || 'Lead',
    dealValue: Number(clientData.dealValue),
    notes: [],
    createdAt: new Date().toISOString()
  };

  clientsState.unshift(newClient);
  saveClients(clientsState);
  return newClient;
}

function deleteClient(id) {
  clientsState = clientsState.filter(c => c.id !== id);
  saveClients(clientsState);
}

function updateClientStatus(id, status) {
  const client = clientsState.find(c => c.id === id);
  if (client && ['Lead', 'Contacted', 'Won', 'Lost'].includes(status)) {
    client.status = status;
    saveClients(clientsState);
  }
}
function updateClient(id, updates) {
  const index = clientsState.findIndex(client => client.id === id);

  if (index === -1) return null;

  const currentClient = clientsState[index];
  const allowedStatuses = ['Lead', 'Contacted', 'Won', 'Lost'];

  clientsState[index] = {
    ...currentClient,
    name: updates.name.trim(),
    email: updates.email.trim().toLowerCase(),
    phone: updates.phone ? updates.phone.trim() : '',
    company: updates.company ? updates.company.trim() : '',
    dealValue: Number(updates.dealValue),
    status: allowedStatuses.includes(updates.status)
      ? updates.status
      : currentClient.status
  };

  saveClients(clientsState);
  return clientsState[index];
}
function addNoteToClient(id, text) {
  const client = clientsState.find(c => c.id === id);
  if (client) {
    if (!Array.isArray(client.notes)) client.notes = [];
    client.notes.push({
      text: text.trim(),
      date: new Date().toLocaleString()
    });
    saveClients(clientsState);
  }
}

function getClientById(id) {
  return clientsState.find(c => c.id === id);
}

async function postClientToAPI(clientData) {
  const res = await fetch(`${API_BASE}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: clientData.name.trim().split(/\s+/)[0],
      lastName: clientData.name.trim().split(/\s+/).slice(1).join(' ') || '',
      email: clientData.email.trim().toLowerCase(),
      phone: clientData.phone?.trim() || '',
      company: { name: clientData.company?.trim() || '' }
    })
  });

  if (!res.ok) throw new Error(`Could not add client (${res.status})`);
  return res.json();
}
async function putClientToAPI(id, clientData) {
  const nameParts = clientData.name.trim().split(/\s+/);

  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: clientData.email.trim().toLowerCase(),
      phone: clientData.phone ? clientData.phone.trim() : '',
      company: {
        name: clientData.company ? clientData.company.trim() : ''
      }
    })
  });

  // DummyJSON does not preserve newly added users, so they can return 404.
  if (!res.ok && res.status !== 404) {
    throw new Error(`Could not update client (${res.status})`);
  }

  if (res.status === 404) return clientData;

  return res.json();
}
async function deleteClientFromAPI(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });

  // DummyJSON does not persist POSTed users, so deleting one can return 404.
  if (!res.ok && res.status !== 404) {
    throw new Error(`Could not delete client (${res.status})`);
  }

  return true;
}

function getVisibleClients({ status = 'All', search = '', sort = 'newest' } = {}) {
  let list = [...clientsState];

  // Status filter
  if (status !== 'All') {
    list = list.filter(c => c.status === status);
  }

  // Search
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(c =>
      String(c.name || '').toLowerCase().includes(q) ||
      String(c.company || '').toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'name') {
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  } else if (sort === 'deal') {
    list.sort((a, b) => b.dealValue - a.dealValue);
  }

  return list;
}
