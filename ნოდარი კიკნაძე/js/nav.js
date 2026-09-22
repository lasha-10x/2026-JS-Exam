// P0.2 - Shared navigation behaviour on protected pages: active link + logout.
document.addEventListener('DOMContentLoaded', () => {
  // 1. Highlight the current page's nav link.
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  const navLinks = document.querySelectorAll('.sidebar-nav a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Logout: only clear the session. Users and clients must survive logout.
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Storage.clearSession();
      window.location.href = 'index.html';
    });
  }
});
