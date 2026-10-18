// Centralizes every localStorage key and all shared storage/session helpers.

// Keeping keys in one object prevents spelling differences between files.
const STORAGE_KEYS = {
  // These are the names used inside the browser's localStorage.
  USERS: "crm_users",
  SESSION: "crm_session",
  CLIENTS: "crm_clients",
  THEME: "crm_theme"
};

// Generic JSON storage helpers. The fallback keeps the app usable if data is
// missing or contains invalid JSON.
function getStorageItem(key, fallbackValue) {
  try {
    // localStorage only holds strings, so values are parsed back into their
    // original arrays/objects before the rest of the app uses them.
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      // Use a safe default when this key has never been saved.
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    // Bad saved JSON should not stop the rest of the app from loading.
    return fallbackValue;
  }
}

function setStorageItem(key, value) {
  // JSON.stringify is the matching operation for JSON.parse in getStorageItem.
  const storedValue = JSON.stringify(value);
  localStorage.setItem(key, storedValue);
}

function removeStorageItem(key) {
  // Delete one saved value without affecting the other keys.
  localStorage.removeItem(key);
}

// Application-specific helpers for users, the session, clients, and theme.
function getUsers() {
  const storedUsers = getStorageItem(STORAGE_KEYS.USERS, []);

  if (!Array.isArray(storedUsers)) {
    return [];
  }

  const normalizedUsers = storedUsers.map(function (user, index) {
    // Normalize on read so older saved data is upgraded automatically.
    return normalizeUser(user, index);
  });

  if (JSON.stringify(storedUsers) !== JSON.stringify(normalizedUsers)) {
    setStorageItem(STORAGE_KEYS.USERS, normalizedUsers);
  }

  return normalizedUsers;
}

function saveUsers(users) {
  const normalizedUsers = Array.isArray(users)
    ? users.map(function (user, index) {
        return normalizeUser(user, index);
      })
    : [];

  setStorageItem(STORAGE_KEYS.USERS, normalizedUsers);
}

function getSession() {
  // null means nobody is currently signed in.
  return getStorageItem(STORAGE_KEYS.SESSION, null);
}

function saveSession(session) {
  setStorageItem(STORAGE_KEYS.SESSION, session);
}

function clearSession() {
  // Logging out only removes the login record.
  removeStorageItem(STORAGE_KEYS.SESSION);
}

function getClients() {
  // Clients are read as-is here; data.js cleans them when needed.
  return getStorageItem(STORAGE_KEYS.CLIENTS, []);
}

function saveClients(clients) {
  setStorageItem(STORAGE_KEYS.CLIENTS, clients);
}

function getTheme() {
  // Treat every unexpected saved value as the default dark theme.
  const storedTheme = getStorageItem(STORAGE_KEYS.THEME, "dark");
  return storedTheme === "light" ? "light" : "dark";
}

function saveTheme(theme) {
  // Save only one of the two allowed theme names.
  setStorageItem(
    STORAGE_KEYS.THEME,
    theme === "light" ? "light" : "dark"
  );
}

// Converts old or incomplete saved users into the current user structure.
function normalizeUser(user, index) {
  const sourceUser =
    user && typeof user === "object" ? user : {};
  const savedFullName =
    typeof sourceUser.fullName === "string"
      ? sourceUser.fullName.trim()
      : "";
  const legacyFullName = [
    // Older user records may have stored names in two separate fields.
    typeof sourceUser.firstName === "string"
      ? sourceUser.firstName.trim()
      : "",
    typeof sourceUser.lastName === "string"
      ? sourceUser.lastName.trim()
      : ""
  ]
    .filter(function (namePart) {
      return namePart !== "";
    })
    .join(" ");
  const numericId = Number(sourceUser.id);
  const savedDate = Date.parse(sourceUser.createdAt);

  const normalizedUser = {
    ...sourceUser,
    id: Number.isFinite(numericId) ? numericId : Date.now() + index,
    fullName: savedFullName || legacyFullName,
    email:
      typeof sourceUser.email === "string"
        ? sourceUser.email.trim().toLowerCase()
        : "",
    password:
      typeof sourceUser.password === "string"
        ? sourceUser.password
        : "",
    company:
      typeof sourceUser.company === "string"
        ? sourceUser.company.trim()
        : "",
    createdAt: Number.isFinite(savedDate)
      ? new Date(savedDate).toISOString()
      : new Date().toISOString()
  };

  // Remove legacy fields after combining them into the current fullName field.
  delete normalizedUser.firstName;
  delete normalizedUser.lastName;

  return normalizedUser;
}

// Connects a saved session to its user, preferring the stable numeric user ID.
function getUserForSession(session, users) {
  if (!session || !Array.isArray(users)) {
    // A session needs both session data and a users list to search.
    return null;
  }

  const sessionUserId = Number(session.userId);
  // IDs are preferred because an email address can later be edited.

  if (Number.isFinite(sessionUserId)) {
    const userById = users.find(function (user) {
      return user.id === sessionUserId;
    });

    if (userById) {
      return userById;
    }
  }

  const sessionEmail =
    // Email provides a fallback for sessions saved by an older version.
    typeof session.email === "string"
      ? session.email.trim().toLowerCase()
      : "";

  if (sessionEmail === "") {
    return null;
  }

  return (
    users.find(function (user) {
      return user.email === sessionEmail;
    }) || null
  );
}

// Builds the one consistent session shape used throughout the application.
function createSessionForUser(user, loginAt) {
  const savedLoginAt = Date.parse(loginAt);

  return {
    userId: user.id,
    email: user.email,
    loginAt: Number.isFinite(savedLoginAt)
      ? new Date(savedLoginAt).toISOString()
      : new Date().toISOString()
  };
}
