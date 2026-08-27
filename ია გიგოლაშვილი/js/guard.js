function getCurrentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function runAuthGuard() {
  const session = getStorageItem("crm_session", null);
  const currentPage = getCurrentPage();

  const publicPages = ["index.html", "signup.html"];

  const protectedPages = [
    "dashboard.html",
    "clients.html",
    "profile.html"
  ];

  const isPublicPage = publicPages.includes(currentPage);
  const isProtectedPage = protectedPages.includes(currentPage);

  if (isProtectedPage && !session) {
    window.location.href = "index.html";
    return;
  }

  if (isPublicPage && session) {
    window.location.href = "dashboard.html";
  }
}

runAuthGuard();