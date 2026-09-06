// storage.js
// Single place that touches localStorage. Every other file (auth.js, guard.js,
// clients.js, dashboard.js, profile.js) calls these functions instead of
// calling localStorage directly. This is required by the PRD (P0) so the
// four key names are guaranteed correct everywhere, and so we only have to
// fix bugs in ONE place.

// The exact key names the PRD requires. Written as constants (not typed as
// raw strings everywhere) so a typo like "crm_client" instead of "crm_clients"
// becomes a JS error (undefined variable) instead of a silent bug.
const STORAGE_KEYS = {
  USERS: "crm_users",
  SESSION: "crm_session",
  CLIENTS: "crm_clients",
  THEME: "crm_theme",
};

// --- Generic helpers ---------------------------------------------------
// localStorage can only store strings. These two functions hide the
// JSON.stringify / JSON.parse conversion so the rest of the app just
// passes and receives normal JS objects/arrays.

function saveToStorage(key, value) {
  // JSON.stringify turns an object/array into a string. That string is what
  // actually gets written to disk by the browser.
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key, fallback) {
  // getItem returns null if the key was never set.
  const raw = localStorage.getItem(key);
  if (raw === null) {
    // Nothing saved yet -> return the caller's default (e.g. [] or null)
    // instead of crashing on JSON.parse(null).
    return fallback;
  }
  return JSON.parse(raw);
}

// --- Users --------------------------------------------------------------

function getUsers() {
  // Default to an empty array: "no users registered yet".
  return loadFromStorage(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
  saveToStorage(STORAGE_KEYS.USERS, users);
}

// --- Session (who is currently logged in) --------------------------------

function getSession() {
  // Default to null: "nobody is logged in".
  return loadFromStorage(STORAGE_KEYS.SESSION, null);
}

function saveSession(session) {
  saveToStorage(STORAGE_KEYS.SESSION, session);
}

function clearSession() {
  // removeItem, not saveToStorage(null) — the PRD says logout must DELETE
  // the key, not store an empty value. getSession() will then correctly
  // fall back to null on the next check.
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// --- Clients (the CRM data itself) ---------------------------------------

function getClients() {
  return loadFromStorage(STORAGE_KEYS.CLIENTS, []);
}

function saveClients(clients) {
  saveToStorage(STORAGE_KEYS.CLIENTS, clients);
}

// --- Theme ----------------------------------------------------------------

function getTheme() {
  // Default "light" per the PRD's suggested default.
  return loadFromStorage(STORAGE_KEYS.THEME, "light");
}

function saveTheme(theme) {
  saveToStorage(STORAGE_KEYS.THEME, theme);
}
