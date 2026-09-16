// storage.js — the single source of truth for all localStorage access.
// Every page reads/writes data through these functions; nothing touches localStorage directly.

const STORAGE_KEYS = {
  USERS: 'crm_users',
  SESSION: 'crm_session',
  CLIENTS: 'crm_clients',
  THEME: 'crm_theme'
};

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// The session normally lives in localStorage; when "Remember me" is unchecked (bonus)
// it's stored in sessionStorage instead and disappears when the tab closes. We check both on read.
// Bonus: sessions also carry an expiresAt timestamp — if it has passed, the session is treated as gone.
function getSession() {
  const fromLocal = localStorage.getItem(STORAGE_KEYS.SESSION);
  const fromSession = sessionStorage.getItem(STORAGE_KEYS.SESSION);
  const raw = fromLocal || fromSession;
  if (!raw) return null;

  const session = JSON.parse(raw);
  if (session.expiresAt && Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }
  return session;
}

function saveSession(session) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
}

// null means "not loaded from the API yet", [] means "loaded and empty"
function getClients() {
  const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return raw ? JSON.parse(raw) : null;
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.id === session.userId) || null;
}

// Converts one record from DummyJSON's /users response into our Client model
function mapApiUserToClient(u) {
  return {
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone || '',
    company: u.company && u.company.name ? u.company.name : '',
    image: u.image || '',
    status: 'Lead',
    dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
    notes: [],
    createdAt: new Date().toISOString()
  };
}

async function fetchInitialClients() {
  const res = await fetch('https://dummyjson.com/users?limit=30');
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data.users.map(mapApiUserToClient);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
