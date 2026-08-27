const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  // Add the dark theme class when the theme is dark.
  // Remove it when the theme is light.
  document.body.classList.toggle("dark-theme", theme === "dark");
  // Check if the theme button exists on the current page
  if (themeToggle) {
    // Show a sun icon in dark mode and a moon icon in light mode
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}
// Get the saved theme from localStorage
// if there is no saved theme use light mode as the default
const savedTheme = localStorage.getItem("crm_theme") || "light";
// Apply the saved or default theme when the page opens
applyTheme(savedTheme);
// Add the click event only if the theme button exists
if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    // Check if the page is currently using dark mode
    const isDarkTheme = document.body.classList.contains("dark-theme");
    // If dark mode is active switch to light mode
    // Otherwise switch to dark mode
    const nextTheme = isDarkTheme ? "light" : "dark";
    // Save the selected theme in localStorage
    localStorage.setItem("crm_theme", nextTheme);
    // Apply the new theme immediately
    applyTheme(nextTheme);
  });
}
