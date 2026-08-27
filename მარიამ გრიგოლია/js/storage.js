// the ONE place for localStorage

// The exact keys (spec requires). Written once, used everywhere.
export const KEYS = {
  users: "crm_users",
  session: "crm_session",
  clients: "crm_clients",
  theme: "crm_theme",
};

// Private helpers (not exported, only this file uses them) ====

// Read a value and turn the JSON string back into an object/array.
// Returns `fallback` if nothing is saved OR the data is corrupted.
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Could not read "${key}" from localStorage:`, error);
    return fallback;
  }
}

// Turn an object/array into a JSON string and save it.
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// == Users ==
export function getUsers() {
  return readJSON(KEYS.users, []); // no users yet,SO empty array
}
export function saveUsers(users) {
  writeJSON(KEYS.users, users);
}

// == Session ==
export function getSession() {
  return readJSON(KEYS.session, null); // nobody logged in -> null
}
export function saveSession(session) {
  writeJSON(KEYS.session, session);
}
export function clearSession() {
  localStorage.removeItem(KEYS.session); // logout
}

// == Clients ==
export function getClients() {
  return readJSON(KEYS.clients, []);
}
export function saveClients(clients) {
  writeJSON(KEYS.clients, clients);
}

//has client EVER been saved?? (different from is it empty)

export function hasClients(){
  return localStorage.getItem(KEYS.clients) !== null;
}

//if checking getClients().length>0 user who would delete them 
//all those clients would re-fetch, so deletions would come back from dead
//checking if the key exists correctly distinguishes-never loaded from loaded but empty[]
