// storage.js
//
// This file is the only place in the app that talks to localStorage
// directly. Every other file asks this module to read or write data
// instead of calling localStorage.getItem/setItem itself. That way, if
// we ever needed to change how data is stored, we would only change it
// here.
//
// We always use the same four keys in localStorage:
//   crm_users    -> array of user accounts
//   crm_session  -> the user who is currently logged in (or nothing)
//   crm_clients  -> array of clients shown on the Clients page
//   crm_theme    -> "dark" or "light"

export const Storage = {
  // Returns the array of registered users, or an empty array if there
  // are none yet.
  getUsers() {
    const usersText = localStorage.getItem("crm_users");
    if (!usersText) {
      return [];
    }
    return JSON.parse(usersText);
  },

  saveUsers(users) {
    localStorage.setItem("crm_users", JSON.stringify(users));
  },

  // Returns the logged-in session object, or null if nobody is logged in.
  getSession() {
    const sessionText = localStorage.getItem("crm_session");
    if (!sessionText) {
      return null;
    }
    return JSON.parse(sessionText);
  },

  saveSession(session) {
    localStorage.setItem("crm_session", JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem("crm_session");
  },

  // Returns the saved clients array, or null if we have never loaded
  // clients before. We use null (instead of an empty array) so the
  // Clients page knows the difference between "not loaded yet, please
  // fetch from the API" and "loaded, and there just aren't any."
  getClients() {
    const clientsText = localStorage.getItem("crm_clients");
    if (!clientsText) {
      return null;
    }
    return JSON.parse(clientsText);
  },

  saveClients(clients) {
    localStorage.setItem("crm_clients", JSON.stringify(clients));
  },

  // "dark" is the default theme if the user has never picked one.
  getTheme() {
    return localStorage.getItem("crm_theme") || "dark";
  },

  saveTheme(theme) {
    localStorage.setItem("crm_theme", theme);
  },
};
