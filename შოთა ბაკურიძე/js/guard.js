// guard.js
// Shared logic used by every page: access control (who can see what),
// dark/light theme, and logout. Written once here so dashboard.html,
// clients.html and profile.html all call the SAME functions instead of
// each having their own copy (the PRD explicitly asks for this).

// --- Access control -------------------------------------------------

// Call this at the top of a PROTECTED page (dashboard/clients/profile).
// If nobody is logged in, it immediately sends them to the login page.
function requireAuth() {
  const session = getSession(); // from storage.js
  if (session === null) {
    window.location.href = "index.html";
  }
}

// Call this at the top of a PUBLIC page (index.html/signup.html).
// If someone is ALREADY logged in, there's no reason to show them the
// login/signup form again - send them straight to the dashboard.
function redirectIfLoggedIn() {
  const session = getSession();
  if (session !== null) {
    window.location.href = "dashboard.html";
  }
}

// --- Theme (dark/light) ----------------------------------------------

function applyTheme() {
  const theme = getTheme(); // "light" or "dark", from storage.js
  // We toggle a single class on <body>. The actual colors live in CSS
  // under a ".dark" selector - JS only decides WHICH set of colors applies.
  document.body.classList.toggle("dark", theme === "dark");
}

function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  saveTheme(next);
  applyTheme();
}

// --- Logout -------------------------------------------------------------

function logout() {
  // Only the session is deleted. Per the PRD, crm_users and crm_clients
  // must NOT be touched - logging out just closes this login, it doesn't
  // erase the CRM's data.
  clearSession();
  window.location.href = "index.html";
}

// --- Nav wiring (shared by dashboard/clients/profile) -------------------

// pageName is one of "dashboard" | "clients" | "profile" - used to
// highlight the correct link in the sidebar.
function setActiveNavLink(pageName) {
  const link = document.getElementById(`nav-${pageName}`);
  if (link) link.classList.add("active");
}

// One function each protected page calls once, at the very top of its
// own script, to get all the shared behavior "for free".
function initProtectedPage(pageName) {
  requireAuth(); // if this redirects away, the code below never runs
  applyTheme();
  setActiveNavLink(pageName);

  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

// --- Shared form-error helpers -------------------------------------
// Used by every form in the app: Sign Up, Log In, Add Client, Edit
// Profile, Change Password. One implementation, one set of CSS classes.

function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);
  if (input) input.classList.add("input-error");
  if (errorEl) errorEl.textContent = message;
}

function clearFieldErrors(fieldNames) {
  fieldNames.forEach((fieldName) => {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (input) input.classList.remove("input-error");
    if (errorEl) errorEl.textContent = "";
  });
}
