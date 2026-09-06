// data.js
// Shared between dashboard.js and clients.js so both pages load client
// data the EXACT same way: "if we already have clients saved, use those;
// otherwise fetch a starter list from the DummyJSON API."

// Turns one raw "user" object from https://dummyjson.com/users into our
// own Client shape. We do this in one place so both callers get identical
// objects, and so the API's field names (firstName/lastName/etc.) are
// only referenced here, not scattered across the app.
function mapApiUserToClient(apiUser) {
  const statuses = ["New", "Contacted", "Negotiation", "Won", "Lost"];
  // Pick a semi-random starting status just so the pipeline isn't empty.
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: apiUser.id,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    email: apiUser.email,
    phone: apiUser.phone,
    company: (apiUser.company && apiUser.company.name) || "—",
    status: randomStatus,
    dealValue: Math.floor(Math.random() * 9000) + 1000, // placeholder $1000-$9999
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

// Fetches straight from the API and OVERWRITES whatever is saved.
// Used the first time the app ever runs, and by the "Reset CRM Data"
// button on the Profile page.
async function loadClientsFromApi() {
  const response = await fetch("https://dummyjson.com/users?limit=20");
  const data = await response.json(); // data.users is the array we want
  const clients = data.users.map(mapApiUserToClient);
  saveClients(clients);
  return clients;
}

// The function both pages actually call. localStorage-first, API as a
// fallback - so the API is only hit ONCE per browser, ever (until reset).
async function getOrLoadClients() {
  const existing = getClients(); // from storage.js
  if (existing.length > 0) {
    return existing;
  }
  return loadClientsFromApi();
}
