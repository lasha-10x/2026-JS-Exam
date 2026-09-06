/**
 * guard.js
 * P0 — global rules shared by every page:
 *   - Auth guard
 *   - Shared sidebar navigation 
 *   - Theme (dark/light)
 */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
  { key: 'clients', label: 'Clients', href: 'clients.html' },
  { key: 'profile', label: 'Profile', href: 'profile.html' },
];

// --- Theme ---

function applyTheme() {
  const theme = storageGet(STORAGE_KEYS.THEME, 'dark');
  document.body.classList.toggle('theme-light', theme === 'light');
  return theme;
}

function toggleTheme() {
  const current = storageGet(STORAGE_KEYS.THEME, 'dark');
  const next = current === 'dark' ? 'light' : 'dark';
  storageSet(STORAGE_KEYS.THEME, next);
  applyTheme();
  const label = document.getElementById('theme-toggle-label');
  if (label) label.textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
}

// -- Auth guard --


function requireSession() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}


function redirectIfLoggedIn() {
  const session = getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}

// -- Navigation --

function buildSidebar(activeKey) {
  const links = NAV_ITEMS.map((item) => {
    const activeClass = item.key === activeKey ? ' active' : '';
    return `<a class="nav-link${activeClass}" href="${item.href}">
        <span class="dot"></span>${item.label}
      </a>`;
  }).join('');

  const theme = storageGet(STORAGE_KEYS.THEME, 'dark');
  const themeLabel = theme === 'dark' ? 'Dark mode' : 'Light mode';

  return `
    <div class="sidebar-brand">
      <div class="mark">10X</div>
      <div class="name">10X CRM</div>
    </div>
    <nav class="nav-links">${links}</nav>
    <div class="sidebar-bottom">
      <button class="theme-toggle" id="theme-toggle-btn" type="button">
        <span id="theme-toggle-label">${themeLabel}</span>
        <span aria-hidden="true">&#9788;</span>
      </button>
      <button class="btn btn-ghost btn-block" id="logout-btn" type="button">Logout</button>
    </div>
  `;
}

function mountSidebar(activeKey) {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;
  mount.innerHTML = buildSidebar(activeKey);

  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
  document.getElementById('logout-btn').addEventListener('click', logout);
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// -- Page inits --


function initProtectedPage(activeKey) {
  applyTheme();
  const session = requireSession();
  if (!session) return null;
  mountSidebar(activeKey);
  return session;
}


function initPublicPage() {
  applyTheme();
  redirectIfLoggedIn();
}