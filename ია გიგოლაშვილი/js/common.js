function showToast(message, type = "success") {
  const toastContainer = document.querySelector("#toastContainer");

  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
function logout() {
  removeStorageItem("crm_session");
  window.location.href = "index.html";
}

const logoutButton = document.querySelector("#logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
const themeButton = document.querySelector("#themeButton");

if (themeButton) {
  themeButton.addEventListener("click", toggleTheme);
}

function toggleTheme() {
  const body = document.body;

  body.classList.toggle("light-theme");

  const currentTheme = body.classList.contains("light-theme")
    ? "light"
    : "dark";

  setStorageItem("crm_theme", currentTheme);
}

function loadTheme() {
  const savedTheme = getStorageItem("crm_theme", "dark");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}

loadTheme();