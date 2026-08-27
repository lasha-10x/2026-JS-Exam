/**
 * Auth guard — controls access to public and protected pages.
 * Must run on every page before other scripts initialize UI.
 */

const PUBLIC_PAGES = ['index.html', 'signup.html'];
const PROTECTED_PAGES = ['dashboard.html', 'clients.html', 'profile.html'];

/**
 * Returns the current page filename (e.g. "index.html").
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  return filename || 'index.html';
}

/**
 * Redirect to login if session is missing on a protected page.
 * Redirect to dashboard if session exists on a public page.
 */
function runAuthGuard() {
  const currentPage = getCurrentPage();
  const session = getSession();
  const isProtected = PROTECTED_PAGES.includes(currentPage);
  const isPublic = PUBLIC_PAGES.includes(currentPage);

  if (isProtected && !session) {
    window.location.href = 'index.html';
    return false;
  }

  if (isPublic && session) {
    window.location.href = 'dashboard.html';
    return false;
  }

  return true;
}

runAuthGuard();
