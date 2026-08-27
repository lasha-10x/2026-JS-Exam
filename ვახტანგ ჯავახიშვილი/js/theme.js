function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const themeBtn = document.querySelector('.theme-toggle-btn');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('crm_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

// Initial theme check on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('crm_theme');
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);
});