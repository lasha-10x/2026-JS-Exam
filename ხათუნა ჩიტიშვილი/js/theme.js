// js/theme.js
// This script runs synchronously in the <head> to prevent FOUC (Flash of Unstyled Content)

(function () {
  // 1. Sidebar State
  // Read directly from localStorage to avoid dependency on storage.js in <head>
  const sidebarState = localStorage.getItem('crm_sidebar_collapsed');
  if (sidebarState === 'true') {
    document.documentElement.setAttribute("data-sidebar", "collapsed");
  }

  // 2. Theme State
  const theme = localStorage.getItem('crm_theme');
  if (theme !== 'light') {
    document.documentElement.classList.add('dark-theme');
  }
})();
