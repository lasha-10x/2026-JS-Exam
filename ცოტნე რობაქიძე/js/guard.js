function requireAuth() {
  // Get the saved login session from localStorage
  const savedSession = localStorage.getItem("crm_session");
  // If there is no active session open login page
  if (!savedSession) {
    window.location.href = "../index.html";
  }
}

function redirectIfAuthenticated() {
  // Get the saved login session from localStorage
  const savedSession = localStorage.getItem("crm_session");
  // If the user is already logged in open dashboard page
  if (savedSession) {
    window.location.href = "../html/dashboard.html";
  }
}

const logoutButton = document.getElementById("logoutButton");
// Only add the click event if the logout button exists
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    // Remove the active login session from localStorage
    localStorage.removeItem("crm_session");
    // Redirect the user to the login page
    window.location.href = "../index.html";
  });
}
