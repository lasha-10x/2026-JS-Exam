// guard.js — shared logic for every page: auth guard, theme, navigation, logout.
// Written once here and called by every page (not copy-pasted 5 times).

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}

function redirectIfLoggedIn() {
  const session = getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}

function applyTheme() {
  const theme = getTheme();
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme();
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// Shared sidebar navigation for all three protected pages
function renderNav(activePage) {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  const links = [
    { href: 'dashboard.html', key: 'dashboard', label: 'Dashboard' },
    { href: 'clients.html', key: 'clients', label: 'Clients' },
    { href: 'profile.html', key: 'profile', label: 'Profile' }
  ];

  nav.innerHTML = `
    <a href="dashboard.html" class="nav-brand">
      <span class="nav-brand-mark">10X</span>
      <span class="nav-brand-name">CRM</span>
    </a>
    <nav class="nav-links">
      ${links.map(l => `<a href="${l.href}" class="nav-link${l.key === activePage ? ' active' : ''}">${l.label}</a>`).join('')}
    </nav>
    <div class="nav-actions">
      <button id="theme-toggle-btn" class="btn-icon" type="button" title="Toggle dark / light theme">
        <span class="theme-icon">&#9789;</span>
      </button>
      <button id="logout-btn" class="btn-outline" type="button">Logout</button>
    </div>
  `;

  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
  document.getElementById('logout-btn').addEventListener('click', logout);
}
