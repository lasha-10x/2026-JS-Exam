const STORAGE_KEYS = {
    users: 'crm_users',
    session: 'crm_session',
    clients: 'crm_clients',
    theme: 'crm_theme'
};

/**
 * Read a value from localStorage and parse it as JSON.
 * Returns `fallback` when the key is missing or the JSON is broken.
 */
function loadFromStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try {
        return JSON.parse(raw);
    } catch (err) {
        // Corrupted data should never crash the app — fall back to default.
        console.error('Could not parse localStorage key:', key, err);
        return fallback;
    }
}

/** Serialize a value as JSON and write it to localStorage. */
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ---- Users (crm_users) -------------------------------------------------- */

function getUsers() {
    return loadFromStorage(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
    saveToStorage(STORAGE_KEYS.users, users);
}

/* ---- Session (crm_session) ---------------------------------------------- */

function getSession() {
    return loadFromStorage(STORAGE_KEYS.session, null);
}

function setSession(session) {
    saveToStorage(STORAGE_KEYS.session, session);
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

/** Find the full User object for the currently logged-in session. */
function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    return getUsers().find(function (user) { return user.id === session.userId; }) || null;
}

/* ---- Theme (crm_theme) --------------------------------------------------- */

function getTheme() {
    // Default theme is dark (PRD P0.3).
    return loadFromStorage(STORAGE_KEYS.theme, 'dark');
}

function saveTheme(theme) {
    saveToStorage(STORAGE_KEYS.theme, theme);
}
