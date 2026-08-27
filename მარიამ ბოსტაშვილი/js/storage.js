const MIN_PASSWORD_LENGTH = 10;

const STORAGE_KEYS = {
  users: 'crm_users',
  session: 'crm_session',
  clients: 'crm_clients',
  theme: 'crm_theme',
  notifications: 'crm_notifications',
  reminders: 'crm_reminders',
};

const DEMO_USER = {
  id: 'demo-user',
  fullName: 'Demo User',
  email: 'demo@crm.com',
  password: 'Demo123!',
  company: '10X CRM',
  createdAt: '2026-07-21T00:00:00.000Z',
};

function saveToStorage(key, value) {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

function getFromStorage(key, fallbackValue = null) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error('Error parsing from storage:', error);
    return fallbackValue;
  }
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

//  Users
function getUsers() {
  return getFromStorage(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  return saveToStorage(STORAGE_KEYS.users, users);
}

function ensureDemoUser() {
  const users = getUsers();
  const demoUserExists = users.some(function (user) {
    return user.email === DEMO_USER.email;
  });

  if (!demoUserExists) {
    users.push({ ...DEMO_USER });
    saveUsers(users);
  }
}

//  Session
function getSession() {
  return getFromStorage(STORAGE_KEYS.session, null);
}

function saveSession(session) {
  return saveToStorage(STORAGE_KEYS.session, session);
}

function clearSession() {
  removeFromStorage(STORAGE_KEYS.session);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  return (
    getUsers().find(function (user) {
      return user.id === session.userId;
    }) || null
  );
}

//  Clients
function getClients() {
  return getFromStorage(STORAGE_KEYS.clients, null);
}

function saveClients(clients) {
  return saveToStorage(STORAGE_KEYS.clients, clients);
}

function clearClients() {
  removeFromStorage(STORAGE_KEYS.clients);
}

// Notifications
function getNotifications() {
  return getFromStorage(STORAGE_KEYS.notifications, []);
}

function saveNotifications(notifications) {
  return saveToStorage(STORAGE_KEYS.notifications, notifications);
}

function getReminders() {
  return getFromStorage(STORAGE_KEYS.reminders, []);
}

function saveReminders(reminders) {
  return saveToStorage(STORAGE_KEYS.reminders, reminders);
}

//  Theme
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

ensureDemoUser();
