function requireAuth() {
  if (!getSession() || !getCurrentUser()) {
    clearSession();
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function redirectIfAuthenticated() {
  if (getSession() && getCurrentUser()) {
    window.location.href = 'dashboard.html';
    return true;
  }

  if (getSession()) {
    clearSession();
  }

  return false;
}

function applyTheme(theme) {
  const active = theme || getTheme();

  document.body.classList.toggle('theme-dark', active === 'dark');
  document.body.classList.toggle('theme-light', active !== 'dark');
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';

  saveTheme(next);
  applyTheme(next);
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

function initNav(currentPage) {
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.classList.toggle('active', link.dataset.nav === currentPage);
  });

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  document.getElementById('logoutBtn')?.addEventListener('click', logout);

  document.querySelectorAll('.sidebar-foot a[href="index.html"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      logout();
    });
  });

  showCurrentUser();
}

function showCurrentUser() {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const nameSlot = document.getElementById('userName');
  if (nameSlot) {
    nameSlot.textContent = user.fullName;
  }

  const initialsSlot = document.getElementById('userInitials');
  if (initialsSlot) {
    initialsSlot.textContent = user.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) {
        return word[0];
      })
      .join('')
      .toUpperCase();
  }
}

function initProtectedPage(currentPage) {
  applyTheme();
  if (!requireAuth()) {
    return false;
  }
  initNav(currentPage);
  return true;
}

function initPublicPage() {
  applyTheme();
  return !redirectIfAuthenticated();
}
