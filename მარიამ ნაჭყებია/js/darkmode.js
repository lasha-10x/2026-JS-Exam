let theme = localStorage.getItem('crm_theme');
const darkmodeToggle = document.getElementById('theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('crm__theme');
    localStorage.setItem('crm_theme', 'dark');
};

const disableDarkmode = () => {
    document.body.classList.remove('crm__theme');
    localStorage.setItem('crm_theme', 'light');
};

if (theme === 'dark') {
    enableDarkmode();
}

if (darkmodeToggle) {
    darkmodeToggle.addEventListener('click', () => {
        theme = localStorage.getItem('crm_theme');
        theme !== 'dark' ? enableDarkmode() : disableDarkmode();
    });
}