// P0.1 — AuthGuard (Protected routes access control)
class AuthGuard {
    static PUBLIC_PAGES = ['index.html', 'signup.html', ''];

    static getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    static check() {
        const session = Storage.getSession();
        const page = AuthGuard.getCurrentPage();
        const isPublic = AuthGuard.PUBLIC_PAGES.includes(page);

        if (!isPublic && !session) {
            window.location.href = 'index.html';
            return;
        }

        if (isPublic && session) {
            window.location.href = 'dashboard.html';
        }
    }
}

AuthGuard.check();
