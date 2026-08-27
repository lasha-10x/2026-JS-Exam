/**
 * guard.js
 * ---------------------------------------------------------------------------
 * P0.1 — Auth Guard. Two small functions, each called from exactly the pages
 * that need it. Nothing here is copy-pasted per page — every page just calls
 * one of these two functions at the top of its own script.
 *
 * Protected pages (dashboard.html, clients.html, profile.html) call:
 *   requireAuth();
 *   -> if there's no session, they get bounced to index.html immediately.
 *
 * Public pages (index.html, signup.html) call:
 *   redirectIfAuthed();
 *   -> if a session already exists, there's no reason to show a login/signup
 *      form, so we send the user straight to their dashboard.
 *
 * IMPORTANT: these checks run synchronously at the very top of the page's
 * script (before anything gets rendered), so an unauthenticated visitor
 * never sees a flash of protected content.
 * ---------------------------------------------------------------------------
 */

function requireAuth() {
  const session = Storage10X.getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}

function redirectIfAuthed() {
  const session = Storage10X.getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}
