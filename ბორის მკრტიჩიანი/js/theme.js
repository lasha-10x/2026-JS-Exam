const THEME_KEY = "crm_theme";
// Toggle between light and dark themes, and store the preference in localStorage.
const btn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const logoLight = document.querySelector(".logo-light");
const logoDark = document.querySelector(".logo-dark");
// Update the icon and logo based on the current theme
function updateIcon(isLight) {
  icon.classList.remove("fa-sun", "fa-moon");
  icon.classList.add(isLight ? "fa-sun" : "fa-moon");
  if (logoLight && logoDark) {
    logoLight.style.display = isLight ? "none" : "block";
    logoDark.style.display = isLight ? "block" : "none";
  }
}
// Load the theme from localStorage and apply it to the body class
function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "dark";
  const isLight = theme === "light";

  document.body.classList.toggle("light", isLight);
  updateIcon(isLight);
}
// Add an event listener to the theme toggle button to switch themes and update localStorage
btn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");

  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  updateIcon(isLight);
});

loadTheme();
