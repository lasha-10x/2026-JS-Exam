/**
 * localStorage wrapper for 10X CRM.
 * All keys are defined here to keep storage access consistent.
 */

const STORAGE_KEYS = {
  USERS: 'crm_users',
  SESSION: 'crm_session',
  CLIENTS: 'crm_clients',
  THEME: 'crm_theme',
};

/**
 * Read and parse JSON from localStorage.
 * Returns defaultValue when key is missing or JSON is invalid.
 */
function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Stringify and save value to localStorage.
 */
function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a key from localStorage.
 */
function removeItem(key) {
  localStorage.removeItem(key);
}

// --- Users ---

function getUsers() {
  return getItem(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
  setItem(STORAGE_KEYS.USERS, users);
}

function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return getUsers().find((user) => user.email === normalizedEmail) || null;
}

function findUserById(userId) {
  return getUsers().find((user) => user.id === userId) || null;
}

// --- Session ---

function getSession() {
  return getItem(STORAGE_KEYS.SESSION, null);
}

function saveSession(session) {
  setItem(STORAGE_KEYS.SESSION, session);
}

function clearSession() {
  removeItem(STORAGE_KEYS.SESSION);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return findUserById(session.userId);
}

// --- Clients ---

function getClients() {
  return getItem(STORAGE_KEYS.CLIENTS, null);
}

function saveClients(clients) {
  setItem(STORAGE_KEYS.CLIENTS, clients);
}

function clearClients() {
  removeItem(STORAGE_KEYS.CLIENTS);
}

// --- Theme ---

function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Initialize default storage values on first app load.
 */
function initStorage() {
  if (getItem(STORAGE_KEYS.USERS, null) === null) {
    saveUsers([]);
  }
}

initStorage();
