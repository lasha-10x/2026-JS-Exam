// Storage Manager following exact PRD LocalStorage Registry keys
const Storage = {
  KEYS: {
    USERS: 'crm_users',
    SESSION: 'crm_session',
    CLIENTS: 'crm_clients',
    THEME: 'crm_theme'
  },

  getUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS)) || [];
  },

  saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  getSession() {
    return JSON.parse(localStorage.getItem(this.KEYS.SESSION)) || null;
  },

  setSession(session) {
    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  getClients() {
    return JSON.parse(localStorage.getItem(this.KEYS.CLIENTS)) || null;
  },

  saveClients(clients) {
    localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));
  },

  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  }
};