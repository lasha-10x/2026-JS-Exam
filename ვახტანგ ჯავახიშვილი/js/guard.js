// Authorization checking function
function checkAuthGuard() {
    //get session info from localstorage
    const session = localStorage.getItem('crm_session');
    //get session info from sessionstorage, if we want log out after tab is closed 
    // const session = sessionStorage.getItem('crm_session');
    
    // Extract filename safely without query params or hashes
    const currentPath = window.location.pathname.split('/').pop().split('?')[0].split('#')[0].toLowerCase();
    

    // Public pages list
    const publicPages = ['index.html', 'login.html', 'signup.html', ''];

    const isPublicPage = publicPages.includes(currentPath);
    const isAuthenticated = session && session !== 'null' && session !== 'undefined';

    if (!isAuthenticated && !isPublicPage) {
        window.location.href = 'index.html';
    } else if (isAuthenticated && isPublicPage) {
        window.location.href = 'dashboard.html';
    }
}

checkAuthGuard();