// Centralized localStorage keys keep browser state consistent across all pages.
export const STORAGE_KEYS = {
  users: "crm_users",
  session: "crm_session",
  tabSession: "crm_tab_session",
  clients: "crm_clients",
  notifications: "crm_notifications",
  language: "crm_language",
  theme: "crm_theme"
};

/** Reads JSON from localStorage and returns a safe fallback when the key is absent. */
export function readStorage(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

/** Serializes a value to JSON before saving it under a known CRM storage key. */
export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Reads the active session from the current tab first, then from persistent storage. */
export function readSession() {
  const value = sessionStorage.getItem(STORAGE_KEYS.tabSession) || localStorage.getItem(STORAGE_KEYS.session);
  return value ? JSON.parse(value) : null;
}

/** Saves a session for this tab or persistently when the user chooses Remember me. */
export function writeSession(session, remember = false) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  const key = remember ? STORAGE_KEYS.session : STORAGE_KEYS.tabSession;
  storage.setItem(key, JSON.stringify(session));
}

/** Removes both possible session copies during logout or expiration. */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
  sessionStorage.removeItem(STORAGE_KEYS.session);
  sessionStorage.removeItem(STORAGE_KEYS.tabSession);
}
