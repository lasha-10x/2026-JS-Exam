const Storage = {

    getUsers() {
        return JSON.parse(localStorage.getItem("crm_users")) || [];
    },
	
    saveUsers(users) {
        localStorage.setItem("crm_users", JSON.stringify(users));
    },

    getSession() {
        return JSON.parse(localStorage.getItem("crm_session"));
    },

    saveSession(session) {
        localStorage.setItem("crm_session", JSON.stringify(session));
    },

    clearSession() {
        localStorage.removeItem("crm_session");
    },

    getClients() {
        return JSON.parse(localStorage.getItem("crm_clients")) || [];
    },

    saveClients(clients) {
        localStorage.setItem("crm_clients", JSON.stringify(clients));
    },

    getTheme() {
        return localStorage.getItem("crm_theme") || "light";
    },

    saveTheme(theme) {
        localStorage.setItem("crm_theme", theme);
    }

};


