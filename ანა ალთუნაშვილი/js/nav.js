/**
 * nav.js
 * ---------------------------------------------------------------------------
 * Renders the sidebar (logo, Dashboard/Clients/Profile links, theme toggle,
 * Logout) on all three protected pages, from ONE place — instead of pasting
 * the same HTML into dashboard.html, clients.html and profile.html.
 *
 * How a page uses it: put an empty container in the HTML —
 *   <div id="sidebar-root"></div>
 * — and set which link should be highlighted via a data attribute on <body>:
 *   <body data-page="dashboard">
 * then call initNav() from the page's own script.
 * ---------------------------------------------------------------------------
 */

function initNav() {
  const root = document.getElementById('sidebar-root');
  if (!root) return;

  const currentPage = document.body.dataset.page; // "dashboard" | "clients" | "profile"
  const theme = Storage10X.getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  const linkClass = (page) => `${page === currentPage ? 'active' : ''}`;

  root.innerHTML = `
    <aside class="sidebar">
      <div class="logo-row" id="nav-logo">
        <div class="logo-mark">10X</div>
        <span>10X CRM</span>
      </div>
      <nav class="nav-links">
        <a href="dashboard.html" class="${linkClass('dashboard')}">Dashboard</a>
        <a href="clients.html" class="${linkClass('clients')}">Clients</a>
        <a href="profile.html" class="${linkClass('profile')}">Profile</a>
      </nav>
      <div class="sidebar-bottom">
        <button class="theme-toggle" id="theme-toggle-btn" type="button">
          <span id="theme-toggle-label">${theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          <span id="theme-toggle-icon">${theme === 'dark' ? '🌙' : '☀️'}</span>
        </button>
        <button class="logout-btn" id="logout-btn" type="button">Log out</button>
      </div>
    </aside>
  `;

  // Logo click -> dashboard (P0.2)
  document.getElementById('nav-logo').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  // Theme toggle (P0.3): flip dark/light, persist, re-render this button.
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const next = Storage10X.getTheme() === 'dark' ? 'light' : 'dark';
    Storage10X.saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.getElementById('theme-toggle-label').textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
    document.getElementById('theme-toggle-icon').textContent = next === 'dark' ? '🌙' : '☀️';
  });

  // Logout (P0.2): clear session ONLY — users & clients stay in localStorage.
  document.getElementById('logout-btn').addEventListener('click', () => {
    Storage10X.clearSession();
    window.location.href = 'index.html';
  });
}

// Apply the saved theme as early as possible, even before initNav() runs,
// so public pages (login/signup) also respect it and we avoid a flash of
// the wrong theme on page load.
(function applyThemeEarly() {
  document.documentElement.setAttribute('data-theme', Storage10X.getTheme());
})();
