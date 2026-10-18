// Applies and toggles the saved theme after the document is ready.

// Dark is the default; light mode is represented by the light-theme class.
function applyTheme(theme) {
  // Keep the class on both elements: page-specific CSS may target either one.
  const isLightTheme = theme === "light";
  // A true/false value makes class toggling straightforward.
  document.documentElement.classList.toggle(
    "light-theme",
    isLightTheme
  );
  document.body.classList.toggle("light-theme", isLightTheme);

  const themeButton = document.getElementById("theme-toggle");
  // This button may not exist on a page without navigation.

  if (themeButton) {
    const themeLabel = themeButton.querySelector(".nav-label");
    const buttonText = isLightTheme ? "Dark Mode" : "Light Mode";
    // The button describes the theme it will switch to next.

    if (themeLabel) {
      // Some layouts have a text label inside the button.
      themeLabel.textContent = buttonText;
    } else {
      themeButton.textContent = buttonText;
    }

    themeButton.title = buttonText;
    themeButton.setAttribute("aria-label", buttonText);
  }
}

// Saves the opposite theme and immediately applies it.
function toggleTheme() {
  const currentTheme = getTheme();
  // Flip between the app's only two supported themes.
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Persist first so a refresh keeps the newly selected appearance.
  saveTheme(newTheme);
  applyTheme(newTheme);
}

// Restores the saved theme and connects the shared navigation button.
document.addEventListener("DOMContentLoaded", function () {
  // Wait until the button exists before connecting its click event.
  const savedTheme = getTheme();
  applyTheme(savedTheme);

  const themeButton = document.getElementById("theme-toggle");

  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
  }
});
