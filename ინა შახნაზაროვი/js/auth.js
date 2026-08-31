/* ============================================
   auth.js — localStorage helpers for users & session
   ============================================ */

const STORAGE_KEYS = {
  USERS: 'crm_users',
  SESSION: 'crm_session',
  CLIENTS: 'crm_clients',
  THEME: 'crm_theme'
};

const DEMO_USER = {
  id: 1000000000001,
  fullName: 'Demo User',
  email: 'demo@test.com',
  password: 'demo1234',
  company: '10X CRM Demo',
  createdAt: '2026-07-05T10:30:00.000Z'
};

// ---------- Users ----------
function getUsers() {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) return [];

  try {
    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Could not parse saved users:', error);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function ensureDemoUser() {
  const users = getUsers();
  const demoExists = users.some(user => user.email.toLowerCase() === DEMO_USER.email);

  if (!demoExists) {
    users.push({ ...DEMO_USER });
    saveUsers(users);
  }
}

function findUserByEmail(email) {
  const lower = email.toLowerCase().trim();
  return getUsers().find(u => u.email.toLowerCase() === lower);
}

function createUser(fullName, email, password, company) {
  const user = {
    id: Date.now(),
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    company: company ? company.trim() : '',
    createdAt: new Date().toISOString()
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return users[idx];
  }
  return null;
}

// ---------- Session ----------
function getSession() {
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Could not parse the saved session:', error);
    return null;
  }
}

function createSession(user) {
  const session = {
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
}

function destroySession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find(u => u.id === session.userId) || null;
}

// ---------- Theme ----------
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
}

// ---------- Toast ----------
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const text = document.createElement('span');
  text.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'toast-close';
  closeButton.setAttribute('aria-label', 'Close notification');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => toast.remove());

  toast.append(text, closeButton);
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3000);
}

// ---------- Validation helpers ----------
function isValidEmail(email) {
  const e = email.trim().toLowerCase();
  const atIndex = e.indexOf('@');
  const dotAfterAt = e.indexOf('.', atIndex + 2);
  return atIndex > 0 && dotAfterAt > atIndex + 1 && dotAfterAt < e.length - 1;
}

function isValidPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function clearErrors(formEl) {
  formEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  formEl.querySelectorAll('.error-text').forEach(el => el.classList.remove('visible'));
}

function showError(inputEl, errorEl) {
  inputEl.classList.add('input-error');
  errorEl.classList.add('visible');
}
// Clear a field's validation error when the user edits it.
function setupLiveErrorClearing() {
  function clearFieldError(event) {
    const field = event.target;

    if (!field.matches('input, textarea, select')) return;

    field.classList.remove('input-error');

    const formGroup = field.closest('.form-group');

    if (formGroup) {
      formGroup.querySelectorAll('.error-text').forEach(error => {
        error.classList.remove('visible');
      });
    }

    const form = field.closest('form');
    const loginError = form?.querySelector('#login-error');

    if (loginError) {
      loginError.classList.remove('visible');
    }
  }

  document.addEventListener('input', clearFieldError);
  document.addEventListener('change', clearFieldError);
}
// User/API values must be escaped before they are inserted with innerHTML.
// Passwords are stored as plain text only because this is a backend-free learning project.
// A real application must hash passwords securely on the server.
function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getInitials(fullName) {
  return String(fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Enable live validation error clearing on every page.
setupLiveErrorClearing();

// Seed one evaluator-friendly account in every fresh browser.
ensureDemoUser();
