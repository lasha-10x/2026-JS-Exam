const CRM_KEYS = {
  users: "crm_users",
  session: "crm_session",
  clients: "crm_clients",
  theme: "crm_theme",
};

const CRM_STORAGE = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn(`Could not read ${key}`, error);
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

function getUsers() {
  return CRM_STORAGE.get(CRM_KEYS.users, []);
}

function saveUsers(users) {
  CRM_STORAGE.set(CRM_KEYS.users, users);
}

function getSession() {
  return CRM_STORAGE.get(CRM_KEYS.session, null);
}

function saveSession(session) {
  CRM_STORAGE.set(CRM_KEYS.session, session);
}

function clearSession() {
  CRM_STORAGE.remove(CRM_KEYS.session);
}

function getClients() {
  return CRM_STORAGE.get(CRM_KEYS.clients, []);
}

function saveClients(clients) {
  CRM_STORAGE.set(CRM_KEYS.clients, clients);
}

function clearClients() {
  CRM_STORAGE.remove(CRM_KEYS.clients);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((user) => user.id === session.userId) || null;
}

function updateCurrentUser(updates) {
  const session = getSession();
  const users = getUsers();
  const index = users.findIndex((user) => user.id === session?.userId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}

function isStrongPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "C") + (parts[1]?.[0] || "");
}
