/* ==========================================================================
   data.js — the clients state and its single loading rule (PRD P4.2 / P3.5):
   if crm_clients exists in localStorage -> use it (no API call);
   otherwise -> GET the initial 30 users from DummyJSON, transform them
   into Client objects, and save immediately.
   Both the Dashboard and the Clients page import this same logic.
   ========================================================================== */

const API_BASE = 'https://dummyjson.com';

/** In-memory application state: the array of Client objects. */
let clientsState = [];

/** Persist the current state into localStorage (key: crm_clients). */
function saveClients() {
  saveToStorage(STORAGE_KEYS.clients, clientsState);
}

/**
 * Transform one DummyJSON user into our Client object (PRD 5.4).
 * dealValue is a random value between 500 and 10000.
 */
function transformApiUser(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.firstName + ' ' + apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone,
    company: apiUser.company && apiUser.company.name ? apiUser.company.name : '',
    image: apiUser.image,
    status: 'Lead',
    dealValue: Math.floor(Math.random() * 9500) + 500,
    notes: [],
    createdAt: new Date().toISOString()
  };
}

/**
 * Load clients into `clientsState`.
 * Throws on network/HTTP errors so the caller can show the error UI.
 */
async function loadClients() {
  const stored = loadFromStorage(STORAGE_KEYS.clients, null);

  if (stored !== null) {
    // Data already cached — the API is not called again.
    clientsState = stored;
    return clientsState;
  }

  // First visit: fetch the seed data from the API.
  const response = await fetch(API_BASE + '/users?limit=30');
  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }

  const data = await response.json();
  // The API puts the array inside data.users (PRD 5.5).
  clientsState = data.users.map(transformApiUser);
  saveClients();
  return clientsState;
}
