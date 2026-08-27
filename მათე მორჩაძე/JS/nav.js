function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('crm_session');
        window.location.href = 'index.html';
    });
}


// theme toggle dark-light
function getTheme() {
    return localStorage.getItem('crm_theme') || 'dark';
}

function saveTheme(theme) {
    localStorage.setItem('crm_theme', theme);
}

function applyStoredTheme() {
    const theme = getTheme();
    document.body.classList.toggle('light-theme', theme === 'light');
}

function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        saveTheme(isLight ? 'light' : 'dark');
    });
}


// nav buttons color
function changeNavLinkColor() {
    const currentPage = window.location.pathname.split('/').pop();
    
    document.querySelectorAll('.nav-link').forEach((link) => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage)
            link.classList.add('active');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    setupLogout();
    setupThemeToggle();
    changeNavLinkColor();
});


