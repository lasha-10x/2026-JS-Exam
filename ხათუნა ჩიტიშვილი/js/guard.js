/**
 * Auth Guard
 * Executes immediately in the <head> to prevent page flashing.
 */
(function() {
  const session = getSession();
  const currentPath = window.location.pathname;

  const isPublicPage = 
    currentPath.endsWith('index.html') || 
    currentPath.endsWith('signup.html') || 
    currentPath.endsWith('/');

  if (!session && !isPublicPage) {    
    window.location.replace('index.html');
  } else if (session && isPublicPage) {
    window.location.replace('dashboard.html');
  }
})();
