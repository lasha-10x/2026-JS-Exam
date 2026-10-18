const SUN_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';

const MOON_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path></svg>';

function applySavedTheme() {
  const theme = localStorage.getItem("crm_theme") || "dark";
  document.body.classList.toggle("light", theme === "light");
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("crm_theme", isLight ? "light" : "dark");
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.innerHTML = document.body.classList.contains("light")
      ? MOON_ICON
      : SUN_ICON;
  }
}

function showToast(message, type) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className =
    "toast " + (type === "error" ? "toast-error" : "toast-success");

  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", function () {
    toast.remove();
  });
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function setError(input, message) {
  input.classList.add("input-error");
  const error = document.createElement("p");
  error.className = "field-error";
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach(function (el) {
    el.remove();
  });
  form.querySelectorAll(".input-error").forEach(function (el) {
    el.classList.remove("input-error");
  });
}
function formatMoney(value) {
  return "$" + Number(value).toLocaleString("en-US");
}

function logout() {
  localStorage.removeItem("crm_session");
  window.location.href = "index.html";
}

applySavedTheme();
updateThemeButton();

const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

const menuToggleBtn = document.getElementById('menu-toggle');
const sidebarEl = document.querySelector('.sidebar');
if (menuToggleBtn && sidebarEl) {
  menuToggleBtn.addEventListener('click', function () {
    const isOpen = sidebarEl.classList.toggle('open');
    menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}