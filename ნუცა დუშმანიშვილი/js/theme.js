/* Shared dark and light theme behavior */

// Applies the previously selected theme
function applySavedTheme() {
    const savedTheme = getTheme();

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

// Changes the theme and saves the new selection
function toggleTheme() {
    const darkThemeIsActive =
        document.body.classList.toggle("dark");

    if (darkThemeIsActive) {
        saveTheme("dark");
    } else {
        saveTheme("light");
    }
}

// Initializes theme behavior after the page loads
function initializeTheme() {
    applySavedTheme();

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle === null) {
        return;
    }

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initializeTheme
);