/*
    This file contains all localStorage functions used by the project.
*/

const STORAGE_KEYS = {
    users: "crm_users",
    session: "crm_session",
    clients: "crm_clients",
    theme: "crm_theme"
};

// Reads JSON data safely. If the data is missing or broken, it returns fallbackValue.
function readJSON(key, fallbackValue) {
    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return fallbackValue;
        }

        return JSON.parse(storedValue);
    } catch (error) {
        console.error("Could not read localStorage key:", key, error);
        return fallbackValue;
    }
}

// Returns all registered users
function getUsers() {
    return readJSON(STORAGE_KEYS.users, []);
}

// Saves the users array to localStorage
function saveUsers(users) {
    const usersJSON = JSON.stringify(users);
    localStorage.setItem(STORAGE_KEYS.users, usersJSON);
}

// Returns the current logged-in user session
function getSession() {
    return readJSON(STORAGE_KEYS.session, null);
}

// Saves the current user session
function saveSession(session) {
    const sessionJSON = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEYS.session, sessionJSON);
}

// Removes the current user session (logout)
function removeSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

// Returns all stored clients
function getClients() {
    return readJSON(STORAGE_KEYS.clients, []);
}

// Saves the clients array to localStorage
function saveClients(clients) {
    const clientsJSON = JSON.stringify(clients);
    localStorage.setItem(STORAGE_KEYS.clients, clientsJSON);
}

// Removes all stored clients
function removeClients() {
    localStorage.removeItem(STORAGE_KEYS.clients);
}

// Checks whether any clients are stored
function hasStoredClients() {
    const storedClients = localStorage.getItem(STORAGE_KEYS.clients);
    return storedClients !== null;
}

// Returns the saved application theme
function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme);
}

// Saves the selected application theme
function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
}