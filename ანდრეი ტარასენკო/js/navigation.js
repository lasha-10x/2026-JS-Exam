/**
 * Shared navigation: active link, theme toggle, logout.
 * Used on all protected pages (dashboard, clients, profile).
 */

/**
 * Apply saved theme from localStorage on page load.
 */
function initTheme() {
  const theme = getTheme();
  document.body.classList.toggle('theme-light', theme === 'light');
}

/**
 * Toggle between dark and light theme.
 */
function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  saveTheme(newTheme);
  document.body.classList.toggle('theme-light', newTheme === 'light');
}

/**
 * Highlight the current page link in the sidebar.
 */
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const pageName = currentPage.replace('.html', '');

  document.querySelectorAll('.sidebar__link').forEach((link) => {
    const linkPage = link.dataset.page;
    link.classList.toggle('active', linkPage === pageName);
  });
}

/**
 * Log out: clear session and redirect to login.
 */
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

/**
 * Wire up navigation controls on protected pages.
 */
function initNavigation() {
  initTheme();
  setActiveNavLink();

  const themeToggle = document.getElementById('theme-toggle');
  const logoutBtn = document.getElementById('logout-btn');

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

initNavigation();
