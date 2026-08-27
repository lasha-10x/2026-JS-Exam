function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}

function redirectIfAuthenticated() {
  const session = getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}
