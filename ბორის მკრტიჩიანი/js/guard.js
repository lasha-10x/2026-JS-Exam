document.addEventListener("DOMContentLoaded", () => {
  const SESSION_KEY = "crm_session";
  const protectedPages = ["dashboard.html", "clients.html", "profile.html"];
  const publicPages = ["index.html", "signup.html"];
  const currentPath = window.location.pathname;

  // A remembered session survives browser restarts; a sessionStorage one ends with its tab.
  const session = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  const isProtectedPage = protectedPages.some((page) => currentPath.includes(page));
  const isPublicPage =
    publicPages.some((page) => currentPath.includes(page)) ||
    currentPath === "/" ||
    currentPath.endsWith("/");

  if (isProtectedPage && !session) {
    window.location.href = "index.html";
    return;
  }

  if (isPublicPage && session) {
    window.location.href = "dashboard.html";
    return;
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = "index.html";
    });
  }
});
