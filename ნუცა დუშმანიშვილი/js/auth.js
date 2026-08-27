/* Shared authentication functions */

// Converts an email to the format used throughout the application
function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
}

// Finds a user whose email and password match the supplied credentials
function findUserByCredentials(email, password) {
    const normalizedEmail = normalizeEmail(email);
    const users = getUsers();

    return users.find(function (user) {
        const savedEmail = normalizeEmail(user.email);

        return savedEmail === normalizedEmail &&
            user.password === password;
    }) || null;
}

// Creates and saves a session for a successfully authenticated user
function createUserSession(user) {
    const session = {
        userId: user.id,
        email: user.email,
        loginAt: new Date().toISOString()
    };

    saveSession(session);
}

// Returns the currently logged-in user
function getCurrentUser() {
    const session = getSession();

    if (session === null) {
        return null;
    }

    const users = getUsers();

    return users.find(function (user) {
        return user.id === session.userId;
    }) || null;
}

// Ends the current session and returns to the login page
function logout() {
    removeSession();
    window.location.href = "index.html";
}

// Connects shared authentication controls after the page loads
document.addEventListener(
    "DOMContentLoaded",
    initializeAuthenticationControls
);

// Connects the sidebar logout button when one exists
function initializeAuthenticationControls() {
    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton === null) {
        return;
    }

    logoutButton.addEventListener(
        "click",
        handleLogoutClick
    );
}

// Logs the user out when the sidebar button is clicked
function handleLogoutClick() {
    logout();
}