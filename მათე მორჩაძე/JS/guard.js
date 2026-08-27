
function requireAuth() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    if (!session)
        window.location.href = "index.html";
}

function redirectIfLoggedIn() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    if (session)
        window.location.href = "dashboard.html";
}