/**
 * data.js
 * ---------------------------------------------------------------------------
 * Everything about talking to the DummyJSON API and shaping its responses
 * into our own Client model. This is shared between clients.html and
 * dashboard.html (P3.5 — "dashboard gets its data the same way Clients
 * does"), which is exactly why it lives in its own file instead of being
 * written twice.
 * ---------------------------------------------------------------------------
 */

const API_BASE = 'https://dummyjson.com';

// Turns one DummyJSON user record into our Client shape (see PRD 5.4).
function mapApiUserToClient(u) {
  return {
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone,
    company: (u.company && u.company.name) ? u.company.name : '',
    image: u.image,
    status: 'Lead', // every client starts at the first pipeline stage
    dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500, // 500–10000
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

// GET https://dummyjson.com/users?limit=30 — the 30-client starter dataset.
async function fetchClientsFromAPI() {
  const res = await fetch(`${API_BASE}/users?limit=30`);
  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }
  const data = await res.json();
  return data.users.map(mapApiUserToClient);
}

/**
 * The "load clients" rule used by both Clients and Dashboard pages:
 * localStorage first (if we've already loaded once), API only if we haven't.
 * This is the CORE loading logic (P4.2) — no try/catch here, the caller
 * decides how to handle a failed fetch (see clients.js loadAndRenderClients
 * for the try/catch + Retry UI, which is the FULL-tier error handling).
 */
async function loadClients() {
  const cached = Storage10X.getClients();
  if (cached) return cached;

  const fetched = await fetchClientsFromAPI();
  Storage10X.saveClients(fetched);
  return fetched;
}

// POST https://dummyjson.com/users/add — DummyJSON echoes back the payload
// with a new mock `id`, which becomes our new Client's id.
async function addClientToAPI(payload) {
  const res = await fetch(`${API_BASE}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }
  return res.json();
}

// DELETE https://dummyjson.com/users/{id}
// NOTE: DummyJSON never actually persisted the clients we POST-ed
// ourselves, so deleting one of those often comes back 404. We deliberately
// do NOT throw on a non-ok status here — the PRD calls this out explicitly:
// even a 404 should still result in the client being removed from our
// local state, because localStorage (not the mock API) is our real
// source of truth in this project.
async function deleteClientFromAPI(id) {
  return fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
}
