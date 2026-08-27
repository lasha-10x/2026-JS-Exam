// ===== USERS =====

function getUsers() {
  const raw = localStorage.getItem('crm_users');
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem('crm_users', JSON.stringify(users));
}

// ===== SESSION =====

function getSession() {
  const raw = localStorage.getItem('crm_session');
  return raw ? JSON.parse(raw) : null;
}

function saveSession(session) {
  localStorage.setItem('crm_session', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('crm_session');
}

// ===== CLIENTS =====

function getClients() {
  const raw = localStorage.getItem('crm_clients');
  return raw ? JSON.parse(raw) : [];
}

function saveClients(clients) {
  localStorage.setItem('crm_clients', JSON.stringify(clients));
}

// ===== THEME =====

function getTheme() {
  return localStorage.getItem('crm_theme') || 'light';
}

function saveTheme(theme) {
  localStorage.setItem('crm_theme', theme);
}
