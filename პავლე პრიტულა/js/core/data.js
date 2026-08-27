// Client data layer: DummyJSON requests plus local persistence for this browser-only CRM.
import { STORAGE_KEYS, readStorage, writeStorage } from "./storage.js";

const CLIENTS_ENDPOINT = "https://dummyjson.com/users?limit=30";
const ADD_CLIENT_ENDPOINT = "https://dummyjson.com/users/add";
const CLIENT_ENDPOINT = "https://dummyjson.com/users";

/** Creates predictable demo deal values for users received from the public API. */
function createDealValue(index) {
  return 1000 + index * 350;
}

/** Returns the locally persisted client list or null before the first API load. */
export function getStoredClients() {
  return readStorage(STORAGE_KEYS.clients, null);
}

/** Persists the complete in-memory client state after a CRM change. */
export function saveClients(clients) {
  writeStorage(STORAGE_KEYS.clients, clients);
}

/** Identifies browser-created clients, including records saved before source was added. */
export function isLocalClient(client) {
  return client?.source === "local" || !client?.image;
}

/** Converts the DummyJSON user shape into the CRM client shape used by the UI. */
export function mapApiUserToClient(user, index) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    company: user.company?.name || "Independent",
    image: user.image,
    status: "Lead",
    dealValue: createDealValue(index),
    notes: [],
    createdAt: new Date().toISOString()
  };
}

/** Loads cached clients first; otherwise requests and stores the initial API data. */
export async function loadClients() {
  const storedClients = getStoredClients();

  if (storedClients) {
    return storedClients;
  }

  const response = await fetch(CLIENTS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Client request failed with status ${response.status}`);
  }

  const data = await response.json();
  const clients = data.users.map(mapApiUserToClient);

  saveClients(clients);
  return clients;
}

/** Sends a create request to DummyJSON; local persistence is handled by the page controller. */
export async function createClient(client) {
  const [firstName, ...lastNameParts] = client.name.split(" ");
  const response = await fetch(ADD_CLIENT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName: lastNameParts.join(" "),
      email: client.email,
      phone: client.phone,
      company: { name: client.company }
    })
  });

  if (!response.ok) {
    throw new Error(`Client creation failed with status ${response.status}`);
  }

  return response.json();
}

/** Calls the remote delete endpoint while accepting DummyJSON's non-persistent POST behavior. */
export async function deleteClientFromApi(clientId) {
  const response = await fetch(`${CLIENT_ENDPOINT}/${clientId}`, { method: "DELETE" });

  // DummyJSON does not persist POST requests, so a later DELETE can correctly return 404.
  if (!response.ok && response.status !== 404) {
    throw new Error(`Client deletion failed with status ${response.status}`);
  }
}

/** Sends edited client fields to DummyJSON before the controller saves local state. */
export async function updateClient(client) {
  const [firstName, ...lastNameParts] = client.name.split(" ");
  const response = await fetch(`${CLIENT_ENDPOINT}/${client.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName: lastNameParts.join(" "),
      email: client.email,
      phone: client.phone,
      company: { name: client.company }
    })
  });

  if (!response.ok) {
    throw new Error(`Client update failed with status ${response.status}`);
  }

  return response.json();
}
