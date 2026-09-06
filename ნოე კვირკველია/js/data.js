// data.js
//
// Gets the client list from wherever it should come from: if we
// already saved clients in localStorage, use those. Otherwise, this
// is the first visit, so fetch 30 sample users from the DummyJSON API
// and turn them into our Client shape. Both the Clients page and the
// Dashboard use this so they always show the same data.

import { Storage } from "./storage.js";

const DUMMY_USERS_URL = "https://dummyjson.com/users?limit=30";

// The API gives us a "user", but our app works with a "client" object
// that has a different shape. This function converts one into the
// other.
export function mapApiUserToClient(apiUser) {
  const fullName = `${apiUser.firstName} ${apiUser.lastName}`;
  const companyName = apiUser.company ? apiUser.company.name : "";

  // The PRD says deal value can be a random number between 500 and
  // 10,000, so every seeded client looks a little different.
  const randomDealValue = Math.floor(Math.random() * (10000 - 500 + 1)) + 500;

  return {
    id: apiUser.id,
    name: fullName,
    email: apiUser.email,
    phone: apiUser.phone,
    company: companyName,
    image: apiUser.image,
    status: "Lead",
    dealValue: randomDealValue,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

async function fetchClientsFromApi() {
  const response = await fetch(DUMMY_USERS_URL);
  if (!response.ok) {
    throw new Error("DummyJSON responded with status " + response.status);
  }
  const data = await response.json();
  return data.users.map(mapApiUserToClient);
}

export const DataStore = {
  // Returns the client list, loading it from the API only if we have
  // never loaded it before.
  async loadClients() {
    const cachedClients = Storage.getClients();
    if (cachedClients) {
      return cachedClients;
    }

    const clients = await fetchClientsFromApi();
    Storage.saveClients(clients);
    return clients;
  },

  // Always fetches a fresh 30 clients from the API and overwrites
  // whatever was saved. Used by the "Reset CRM Data" button.
  async reloadClientsFromApi() {
    const clients = await fetchClientsFromApi();
    Storage.saveClients(clients);
    return clients;
  },
};
