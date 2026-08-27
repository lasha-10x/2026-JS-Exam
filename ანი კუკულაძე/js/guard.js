const logoutButton = document.getElementById("logoutButton");

// Logout user
function logout() {
  localStorage.removeItem("crm_session");
  window.location.href = "index.html";
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

// Protect pages that require login
function checkAuth() {
  const savedSession = localStorage.getItem("crm_session");

  if (!savedSession) {
    window.location.href = "index.html";
  }
}

// Redirect logged in users to dashboard
function redirectIfLoggedIn() {
  const savedSession = localStorage.getItem("crm_session");

  if (savedSession) {
    window.location.href = "dashboard.html";
  }
}