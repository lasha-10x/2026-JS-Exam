/**
 * data.js
 */

const API_BASE = 'https://dummyjson.com';


/** Turn one DummyJSON user record into our Client shape. */
function transformApiUser(apiUser) {
  return {
    id: apiUser.id,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    email: apiUser.email,
    phone: apiUser.phone || '',
    company: apiUser.company && apiUser.company.name ? apiUser.company.name : '',
    image: apiUser.image || `https://dummyjson.com/icon/${apiUser.username || 'user'}/128`,
    status: 'Lead',
    dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}


async function fetchFreshClientsFromApi() {
  const res = await fetch(`${API_BASE}/users?limit=30`);
  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }
  const data = await res.json();
  return data.users.map(transformApiUser);
}

/**
 * Main entry point: (P3.5).
 */
async function loadClients() {
  const existing = getClients();
  if (existing !== null) {
    return existing;
  }
  const fresh = await fetchFreshClientsFromApi();
  saveClients(fresh);
  return fresh;
}

/** POST a new client to the API */
async function addClientViaApi(clientPayload) {
  const res = await fetch(`${API_BASE}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientPayload),
  });
  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }
  const serverResponse = await res.json();

  // return 
  return {
    ...clientPayload,
    id: serverResponse.id,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * DELETE a client via the API. 
 */
async function deleteClientViaApi(clientId) {
  const res = await fetch(`${API_BASE}/users/${clientId}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    throw new Error(`API responded with status ${res.status}`);
  }
  return true;
}