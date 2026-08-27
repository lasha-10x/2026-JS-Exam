// Main entry point — initialize page-specific scripts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    new Auth();

    const page = AuthGuard.getCurrentPage();

    if (page === 'dashboard.html') new DashboardPage();
    if (page === 'clients.html') new ClientsPage();
    if (page === 'profile.html') new ProfilePage();

    if (document.getElementById('themeToggle')) new Theme();
});

// Global event listener for toggling password field visibility
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-password-btn');
    if (!btn) return;
    
    e.preventDefault();
    const targetId = btn.getAttribute('data-target');
    const input = targetId ? document.getElementById(targetId) : btn.previousElementSibling;
    if (!input) return;

    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    
    const eyeOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeClosedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    if (isPassword) {
        btn.innerHTML = eyeClosedSvg;
        btn.setAttribute('aria-label', 'Hide password');
    } else {
        btn.innerHTML = eyeOpenSvg;
        btn.setAttribute('aria-label', 'Show password');
    }
});

