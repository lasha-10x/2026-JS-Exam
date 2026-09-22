/**
 * @param {'protected'|'public'} pageType
 *   protected — dashboard / clients / profile: a session is required.
 *   public    — login / signup: a logged-in user is sent to the dashboard.
 */
function runAuthGuard(pageType) {
    const session = getSession(); // session is null when no user is logged in. (from storage.js)

    if (pageType === 'protected' && !session) {
        // No session — kick back to the login page immediately.
        window.location.href = 'index.html';
    }

    if (pageType === 'public' && session) {
        // Already logged in — the login/signup pages are not needed.
        window.location.href = 'dashboard.html';
    }
}
