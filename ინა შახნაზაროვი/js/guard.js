/* ============================================
   guard.js — Auth Guard, Navigation, Theme init
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  applyTheme(getTheme());

  const path = window.location.pathname.split('/').pop() || 'index.html';
  const protectedPages = ['dashboard.html', 'clients.html', 'profile.html'];
  const publicPages = ['index.html', 'signup.html'];

  const isProtected = protectedPages.includes(path);
  const isPublic = publicPages.includes(path);

  const session = getSession();

  if (isProtected && (!session || !getCurrentUser())) {
    destroySession();
    window.location.href = 'index.html';
    return;
  }

  if (isPublic && session && getCurrentUser()) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (isPublic && session && !getCurrentUser()) {
    destroySession();
  }

  // Setup navigation for protected pages
  if (isProtected) {
    setupNavigation(path);
    setupThemeToggle();
    setupLogout();
  }
});

function setupNavigation(currentPage) {
  const links = document.querySelectorAll('.sidebar-nav a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const current = getTheme();
  btn.textContent = current === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

  btn.addEventListener('click', () => {
    const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    btn.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

function setupLogout() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    destroySession();
    window.location.href = 'index.html';
  });
}
