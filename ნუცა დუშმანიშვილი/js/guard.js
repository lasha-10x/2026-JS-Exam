/* Authentication guard for private pages */

// Immediately checks whether the visitor has a valid session
(function protectPrivatePage() {
    const session = getSession();

    if (session === null) {
        window.location.replace("index.html");
        return;
    }

    const users = getUsers();

    const sessionUserExists = users.some(function (user) {
        return user.id === session.userId;
    });

    if (!sessionUserExists) {
        removeSession();
        window.location.replace("index.html");
    }
})();