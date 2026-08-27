const CRMStorage = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    // get-s don't have parameter because we are just saying go grab those !
    getUsers() { return this.get('crm_users') || []; },
    // set-s have parameter because we say we saving the state of this specific element!
    setUsers(users) { this.set('crm_users', users); },
    getSession() { return this.get('crm_session'); },
    setSession(session) { this.set('crm_session', session); },
    clearSession() { this.remove('crm_session'); },
    getClients() { return this.get('crm_clients') || []; },
    setClients(clients) { this.set('crm_clients', clients); },
    getTheme() { return localStorage.getItem('crm_theme') || 'light'; },
    setTheme(theme) { localStorage.setItem('crm_theme', theme); }
};
// get is for getting items 
// set is for remembering the state they are in after refreash or an update

// This line registers it so signup.js can find it!
window.CRMStorage = CRMStorage;
