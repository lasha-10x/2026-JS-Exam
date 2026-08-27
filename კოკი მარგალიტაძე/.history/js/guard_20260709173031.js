(function() {
    // Read the current active session state directly from browser memory
    const session = localStorage.getItem('crm_session');
    const currentPath = window.location.pathname;
    
    // Evaluate if the user is currently targeting an open public gateway screen
    const isPublicPage = currentPath.endsWith('index.html') || currentPath.endsWith('signup.html') || currentPath === '/' || currentPath.endsWith('index');

    if (!session && !isPublicPage) {
        // Attack Vector Block: No session token found -> boot hacker out to login screen
        window.location.href = 'index.html';
    } else if (session && isPublicPage) {
        // Quality of Life Guard: Active session found -> bypass auth forms, skip straight to application
        window.location.href = 'dashboard.html';
    }
})();
