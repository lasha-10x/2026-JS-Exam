(function() {
    // Read the current active session state directly from browser memory
    // tests if there is crm_session
    const session = localStorage.getItem('crm_session');
    const currentPath = window.location.pathname;
    
    // if the page is available to everyone with or without logging in
    const isPublicPage = currentPath.endsWith('index.html') || currentPath.endsWith('signup.html') || currentPath === '/' || currentPath.endsWith('index');

    if (!session && !isPublicPage) {
        // Attack Vector Block: No session token found -> boot hacker out to login screen
        window.location.href = 'index.html';
    } else if (session && isPublicPage) {
        // Quality of Life Guard: Active session found -> bypass auth forms, skip straight to application
        window.location.href = 'dashboard.html';
    }
})();