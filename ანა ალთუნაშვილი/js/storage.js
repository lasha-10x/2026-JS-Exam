/**
 * storage.js
 * ---------------------------------------------------------------------------
 * Single place that knows about our localStorage keys (crm_users, crm_session,
 * crm_clients, crm_theme). Every other file talks to localStorage THROUGH
 * these functions instead of calling localStorage.getItem/setItem directly.
 *
 * Why centralize this? Two reasons:
 * 1. If we ever changed *how* we store data (e.g. added error handling,
 *    or moved to IndexedDB), we'd only edit this one file.
 * 2. It keeps the exact key names in exactly one place, so a typo like
 *    "crm_user" vs "crm_users" can't happen in five different files.
 *
 * This file defines a global `Storage10X` object (an object literal used as
 * a namespace) so it can be used from any page without ES module imports —
 * we're keeping things plain <script src="..."> files, no bundler.
 * ---------------------------------------------------------------------------
 */

const Storage10X = {
  KEYS: {
    USERS: 'crm_users',
    SESSION: 'crm_session',
    CLIENTS: 'crm_clients',
    THEME: 'crm_theme',
  },

  // ---- Users ----------------------------------------------------------
  getUsers() {
    const raw = localStorage.getItem(this.KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  },
  saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  // ---- Session ----------------------------------------------------------
  getSession() {
    const raw = localStorage.getItem(this.KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },
  saveSession(session) {
    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
  },
  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  // ---- Clients ----------------------------------------------------------
  getClients() {
    const raw = localStorage.getItem(this.KEYS.CLIENTS);
    return raw ? JSON.parse(raw) : null; // null = "never loaded yet"
  },
  saveClients(clients) {
    localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));
  },

  // ---- Theme ----------------------------------------------------------
  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'dark'; // dark is default
  },
  saveTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  // ---- Helper: currently logged-in user's full record ------------------
  // Combines session + users so pages don't repeat this lookup themselves.
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    const users = this.getUsers();
    return users.find(u => u.id === session.userId) || null;
  },
};
