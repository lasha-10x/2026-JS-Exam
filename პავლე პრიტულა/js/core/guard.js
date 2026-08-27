// Route helpers provide the module-level second layer of protected-page validation.
import { STORAGE_KEYS, clearSession, readSession, readStorage } from "./storage.js";

export const SESSION_DURATION_MS = 30 * 60 * 1000;

/** Returns the session deadline, supporting sessions created before expiresAt existed. */
function getSessionExpiresAt(session) {
  const explicitExpiration = Date.parse(session?.expiresAt || "");
  if (Number.isFinite(explicitExpiration)) return explicitExpiration;

  const loginTime = Date.parse(session?.loginAt || "");
  return Number.isFinite(loginTime) ? loginTime + SESSION_DURATION_MS : 0;
}

/** Returns the number of milliseconds until the current session expires. */
export function getSessionRemainingMs() {
  const session = readSession();
  return Math.max(0, getSessionExpiresAt(session) - Date.now());
}

/** Checks the stored session, matching user, and 30-minute deadline. */
function hasActiveSession() {
  const session = readSession();
  const users = readStorage(STORAGE_KEYS.users, []);
  const isActive = Boolean(session?.userId && users.some((user) => user.id === session.userId) && getSessionExpiresAt(session) > Date.now());

  if (session && !isActive) clearSession();
  return isActive;
}

/** Redirects an unauthenticated visitor away from a protected page. */
export function requireAuthentication() {
  const hadSession = Boolean(readSession()?.userId);
  if (!hasActiveSession()) {
    window.location.replace(hadSession ? "index.html?reason=session-expired" : "index.html");
  }
}

/** Keeps signed-in users from returning to Login or Sign Up pages. */
export function redirectIfAuthenticated() {
  if (hasActiveSession()) {
    window.location.replace("dashboard.html");
  }
}
