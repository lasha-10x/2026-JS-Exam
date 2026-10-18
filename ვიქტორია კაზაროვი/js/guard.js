// Protects private pages, redirects signed-in users, and handles shared logout.

// A protected page can only remain open when its session belongs to a user.
function protectPage() {
  const session = getSession();
  const currentUser = getUserForSession(session, getUsers());

  if (!currentUser) {
    // No matching account means this visitor is not allowed on this page.
    // A stale or malformed session should not grant access to private pages.
    clearSession();
    window.location.href = "index.html";
  }
}

// Signed-in users do not need to see Login or Sign Up again.
function redirectAuthenticatedUser() {
  const session = getSession();
  const currentUser = getUserForSession(session, getUsers());

  if (currentUser) {
    // Already logged-in visitors skip Login and Sign Up.
    // Rebuild the session to keep its stored user ID and email current.
    const completeSession = createSessionForUser(
      currentUser,
      session.loginAt
    );
    saveSession(completeSession);
    window.location.href = "dashboard.html";
  } else if (session) {
    // Remove a session that no longer matches any saved user.
    clearSession();
  }
}

// Logout removes only the session; users, clients, and theme stay saved.
function logoutUser() {
  // Clear login data first, then return to the public page.
  clearSession();
  window.location.href = "index.html";
}

// The body data attribute tells this shared file which guard the page needs.
document.addEventListener("DOMContentLoaded", function () {
  const pageAccess = document.body.dataset.pageAccess;
  // Each HTML page declares whether it is public or protected.
  const logoutButton = document.getElementById("logout-button");

  if (pageAccess === "protected") {
    protectPage();
  }

  if (pageAccess === "public") {
    redirectAuthenticatedUser();
  }

  if (logoutButton) {
    // Connect Logout only on pages that display the button.
    logoutButton.addEventListener("click", logoutUser);
  }
});
