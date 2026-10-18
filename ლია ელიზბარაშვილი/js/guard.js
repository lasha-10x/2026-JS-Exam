(function runGuard() {
  const pageType = document.body.getAttribute('data-page');
  const session = localStorage.getItem('crm_session');

  if (pageType === 'protected' && !session) {
    window.location.href = 'index.html';
  }

  if (pageType === 'public' && session) {
    window.location.href = 'dashboard.html';
  }
})();
