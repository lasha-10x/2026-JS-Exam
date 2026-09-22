// P0.1 - Auth Guard: controls access to protected vs public pages.
// Must run before the page renders anything meaningful, so it is loaded
// right after storage.js on every page.
(function checkAuthGuard() {
  const session = Storage.getSession();
  let currentPath = window.location.pathname.split('/').pop();
  if (!currentPath) currentPath = 'index.html'; // root "/" behaves like index.html

  const publicPages = ['index.html', 'signup.html'];

  if (publicPages.includes(currentPath)) {
    // Already logged in? No need to see the login/signup page again.
    if (session) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // Protected page (dashboard, clients, profile): no session -> kick to login.
    if (!session) {
      window.location.href = 'index.html';
    }
  }
})();
