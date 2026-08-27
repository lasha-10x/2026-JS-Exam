// Centralized localStorage keys & storage manager
class Storage {
    static KEYS = {
        USERS: 'crm_users',
        SESSION: 'crm_session',
        CLIENTS: 'crm_clients',
        THEME: 'crm_theme'
    };

    static get(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static getUsers() {
        return Storage.get(Storage.KEYS.USERS) || [];
    }

    static saveUsers(users) {
        Storage.set(Storage.KEYS.USERS, users);
    }

    static getSession() {
        return Storage.get(Storage.KEYS.SESSION);
    }

    static saveSession(session) {
        Storage.set(Storage.KEYS.SESSION, session);
    }

    static getClients() {
        return Storage.get(Storage.KEYS.CLIENTS);
    }

    static saveClients(clients) {
        Storage.set(Storage.KEYS.CLIENTS, clients);
    }
}
