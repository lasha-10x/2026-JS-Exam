// Retrieve the current logged-in user from localStorage session
const currentUser = JSON.parse(localStorage.getItem("crm_session"));

// If there is no active session, redirect to the login page
if (!currentUser) {
    window.location.href = "index.html";
}

// Get reference to the logout button
const logoutBtn = document.getElementById("logoutBtn");

// Attach click handler to log the user out, if the button exists
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        // Clear the session from localStorage
        localStorage.removeItem("crm_session");
        // Redirect back to the login page
        window.location.href = "index.html";
    });
}


