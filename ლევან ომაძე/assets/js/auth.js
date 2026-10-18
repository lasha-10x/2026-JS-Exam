const PROTECTED_PAGES = ["dashboard", "clients", "profile"];
const DEMO_USER = {
  id: 1001,
  fullName: "Demo Manager",
  email: "demo@test.com",
  password: "demo1234",
  company: "10X Sales",
  createdAt: "2026-07-01T10:00:00.000Z",
};

function ensureDemoUser() {
  const users = getUsers();
  if (users.some((user) => user.email === DEMO_USER.email)) return;
  saveUsers([DEMO_USER, ...users]);
}

function requireGuest() {
  if (getSession()) {
    window.location.href = "dashboard.html";
  }
}

function requireAuth() {
  const session = getSession();
  const currentUser = getCurrentUser();
  if (!session || !currentUser) {
    clearSession();
    window.location.href = "index.html";
    return null;
  }
  return currentUser;
}

function loginUser(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const user = getUsers().find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === password,
  );
  if (!user) return null;
  const session = {
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString(),
  };
  saveSession(session);
  return session;
}

function logoutUser() {
  clearSession();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  ensureDemoUser();
  const page = document.body.dataset.page;
  if (PROTECTED_PAGES.includes(page)) {
    requireAuth();
  }
  if (page === "login" || page === "signup") {
    requireGuest();
  }
  document.querySelector("#logout-button")?.addEventListener("click", logoutUser);
});
