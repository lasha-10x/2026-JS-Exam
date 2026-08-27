document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme on load
    const savedTheme = CRMStorage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    // Highlight the active nav link based on current file name
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-item').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            CRMStorage.setTheme(next);
            updateThemeIcon(next);
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            CRMStorage.clearSession();
            window.location.href = 'index.html';
        });
    }
});

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.innerText = theme === 'dark' ? '☀️' : '🌙';
    }
}