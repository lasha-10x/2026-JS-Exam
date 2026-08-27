// P0.3 — Dark/Light Theme Switcher
class Theme {
    constructor() {
        const saved = localStorage.getItem(Storage.KEYS.THEME) || 'dark';
        this.apply(saved);

        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', () => this.toggle());
        }
    }

    apply(theme) {
        document.body.classList.toggle('light-theme', theme === 'light');
        localStorage.setItem(Storage.KEYS.THEME, theme);

        const btn = document.getElementById('themeToggle');
        if (btn) btn.innerText = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    toggle() {
        const isLight = document.body.classList.contains('light-theme');
        this.apply(isLight ? 'dark' : 'light');
    }
}
