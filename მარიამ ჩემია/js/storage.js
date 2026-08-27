const USERS_KEY = "crm_users";
const SESSION_KEY = "crm_session";
const THEME_KEY = "crm_theme";
const CLIENTS_KEY = "crm_clients";
const CLIENTS_INITIALIZED_KEY = "crm_clients_initialized";


export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getClients() {
  const clients = localStorage.getItem(CLIENTS_KEY);
  return clients ? JSON.parse(clients) : [];
}

export function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function areClientsInitialized() {
  return localStorage.getItem(CLIENTS_INITIALIZED_KEY) === "true";
}

export function markClientsInitialized() {
  localStorage.setItem(CLIENTS_INITIALIZED_KEY, "true");
}

export function resetClientData() {
  localStorage.removeItem(CLIENTS_KEY);
  localStorage.removeItem(CLIENTS_INITIALIZED_KEY);
}

const DEMO_USER = {
    id: "demo-user",
    createdAt: "2026-07-23T00:00:00.000Z",
    fullName: "Demo User",
    email: "demo@10xcrm.com",
    password: "Demo1234",
    company: "10x"
};

export function addDemoUser() {
  const users = getUsers();

  const demoUserExists = users.some(user => {
    return user.email.toLowerCase() ===
      DEMO_USER.email.toLowerCase();
  });

  if (!demoUserExists) {
    users.push(DEMO_USER);
    saveUsers(users);
  }
}