//this is a function to check authorization
function checkAuth() {
    let session = localStorage.getItem("crm_session") || sessionStorage.getItem("crm_session");
    const currentPage = window.location.pathname;

    if (session) {
        let parsedSession;
        try {
            parsedSession = JSON.parse(session);
        } catch (e) {
            parsedSession = null;
        }

        const users = JSON.parse(localStorage.getItem("crm_users")) || [];
        const userExists = parsedSession && users.some(u =>
            (parsedSession.userId !== undefined && String(u.id) === String(parsedSession.userId)) ||
            (parsedSession.email && u.email === parsedSession.email)
        );

        if (!userExists) {
            localStorage.removeItem("crm_session");
            sessionStorage.removeItem("crm_session");
            session = null;
        }
    }

    const isPublicPage = currentPage.includes("index.html") || currentPage.endsWith("/") || currentPage.includes("signup.html");

    const isProtectedPage =
        currentPage.includes("dashboard.html") ||
        currentPage.includes("clients.html") ||
        currentPage.includes("profile.html");

    if (isPublicPage && session) {
        window.location.href = "dashboard.html";
    }

    if (isProtectedPage && !session) {
        window.location.href = "index.html";
    }
}

checkAuth();


//logout
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("crm_session");
        sessionStorage.removeItem("crm_session");
        window.location.href = "index.html";
    });
}