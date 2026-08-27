/**
 * Client data layer: API fetch, localStorage sync, and transformations.
 */

const CLIENTS_API_URL = 'https://dummyjson.com/users?limit=30';

/**
 * Map a DummyJSON user object to our Client model.
 */
function mapApiUserToClient(user) {
  const dealValue = Math.floor(Math.random() * 9500) + 500;

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || '',
    company: user.company?.name || '',
    image: user.image || '',
    status: 'Lead',
    dealValue,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Format deal value as currency string (e.g. "$5,000").
 */
function formatCurrency(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

/**
 * Get CSS badge class for a client status.
 */
function getStatusBadgeClass(status) {
  const map = {
    Lead: 'badge--lead',
    Contacted: 'badge--contacted',
    Won: 'badge--won',
    Lost: 'badge--lost',
  };
  return map[status] || 'badge--lead';
}

/**
 * Fetch clients from DummyJSON API and save to localStorage.
 */
async function fetchClientsFromApi() {
  const response = await fetch(CLIENTS_API_URL);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const clients = data.users.map(mapApiUserToClient);
  saveClients(clients);
  return clients;
}

/**
 * Load clients: from localStorage if available, otherwise from API.
 */
async function loadClients() {
  const stored = getClients();

  if (stored && stored.length > 0) {
    return stored;
  }

  return fetchClientsFromApi();
}

/**
 * Get clients array from state (localStorage).
 */
function getClientsState() {
  return getClients() || [];
}

/**
 * Update a single client in state and persist.
 */
function updateClient(updatedClient) {
  const clients = getClientsState();
  const index = clients.findIndex((c) => c.id === updatedClient.id);

  if (index !== -1) {
    clients[index] = updatedClient;
    saveClients(clients);
  }

  return clients;
}

/**
 * Add a client to the beginning of state and persist.
 */
function addClientToState(client) {
  const clients = getClientsState();
  clients.unshift(client);
  saveClients(clients);
  return clients;
}

/**
 * Remove a client from state and persist.
 */
function removeClientFromState(clientId) {
  const clients = getClientsState().filter((c) => c.id !== clientId);
  saveClients(clients);
  return clients;
}

/**
 * Reset client data: clear storage and reload from API.
 */
async function resetClientData() {
  clearClients();
  return fetchClientsFromApi();
}

/**
 * POST a new client to DummyJSON API.
 */
async function postClientToApi(formData) {
  const nameParts = formData.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '-';

  const response = await fetch('https://dummyjson.com/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      company: { name: formData.company.trim() || '' },
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Build a Client object from form data and API response.
 */
function buildClientFromForm(formData, apiResponse) {
  return {
    id: apiResponse.id,
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim(),
    company: formData.company.trim(),
    image: apiResponse.image || '',
    status: formData.status,
    dealValue: Number(formData.dealValue),
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * DELETE a client via DummyJSON API.
 * 404 is acceptable — DummyJSON does not persist added records.
 */
async function deleteClientFromApi(clientId) {
  const response = await fetch(`https://dummyjson.com/users/${clientId}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`API error: ${response.status}`);
  }
}

/**
 * Check if a client email already exists in state.
 */
function isClientEmailTaken(email, excludeId = null) {
  const normalized = email.trim().toLowerCase();
  return getClientsState().some(
    (c) => c.email.toLowerCase() === normalized && c.id !== excludeId
  );
}
