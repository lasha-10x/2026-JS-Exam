/**
 * storage.js
 */

const STORAGE_KEYS = {
  USERS: 'crm_users',
  SESSION: 'crm_session',
  CLIENTS: 'crm_clients',
  THEME: 'crm_theme',
};


function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`storageGet failed for "${key}":`, err);
    return fallback;
  }
}


function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Remove a key entirely. */
function storageRemove(key) {
  localStorage.removeItem(key);
}

// accessors used across pages 

function getUsers() {
  return storageGet(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
  storageSet(STORAGE_KEYS.USERS, users);
}

function getSession() {
  return storageGet(STORAGE_KEYS.SESSION, null);
}

function saveSession(session) {
  storageSet(STORAGE_KEYS.SESSION, session);
}

function clearSession() {
  storageRemove(STORAGE_KEYS.SESSION);
}

function getClients() {
  return storageGet(STORAGE_KEYS.CLIENTS, null); 
}

function saveClients(clients) {
  storageSet(STORAGE_KEYS.CLIENTS, clients);
}


function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
}