function applyTheme() {
  const theme = getTheme();
  document.body.classList.toggle("dark-theme", theme === "dark");
}

function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  saveTheme(next);
  applyTheme();

  const btn = document.getElementById("theme-toggle-btn");
  if (btn) btn.textContent = next === "dark" ? "☀️" : "🌙";
}

function renderNav(activePage) {
  const container = document.getElementById("app-nav");
  if (!container) return;

  const links = [
    { id: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { id: "clients", label: "Clients", href: "clients.html" },
    { id: "profile", label: "Profile", href: "profile.html" },
  ];

  let linksHtml = "";
  links.forEach(function (link) {
    const activeClass = link.id === activePage ? " active" : "";
    linksHtml +=
      '<a href="' +
      link.href +
      '" class="nav-link' +
      activeClass +
      '">' +
      link.label +
      "</a>";
  });

  container.innerHTML =
    '<div class="nav-bar">' +
    '<a href="dashboard.html" class="nav-logo"><span class="logo-mark">10<span class="logo-x">X</span></span><span class="logo-name">CRM</span></a>' +
    '<div class="nav-links">' +
    linksHtml +
    "</div>" +
    '<div class="nav-actions">' +
    '<button id="theme-toggle-btn" class="nav-icon-btn" type="button" aria-label="Toggle theme">' +
    (getTheme() === "dark" ? "☀️" : "🌙") +
    "</button>" +
    '<button id="logout-btn" class="nav-icon-btn nav-logout" type="button">Logout</button>' +
    "</div>" +
    "</div>";

  document
    .getElementById("theme-toggle-btn")
    .addEventListener("click", toggleTheme);
  document.getElementById("logout-btn").addEventListener("click", logout);
}
