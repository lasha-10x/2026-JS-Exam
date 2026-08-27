// Get reference to the theme toggle button
const themeButton = document.getElementById("themeToggle");

// Check localStorage for a previously saved theme preference
const savedTheme = localStorage.getItem("crm_theme");

// If the saved theme is "dark", apply dark mode on page load
if (savedTheme === "dark") {
    document.body.classList.add("dark");

    // Update button text to reflect current mode (offer to switch to light)
    if (themeButton) {
        themeButton.textContent = "☀️ Light Mode";
    }
}


// Only attach the click listener if the button exists on the page
if (themeButton) {
    themeButton.addEventListener("click", function () {

         // Toggle the "dark" class on the body element
        document.body.classList.toggle("dark");


         // Check the new state after toggling and update storage + button text accordingly
        if (document.body.classList.contains("dark")) {
            // Dark mode is now active
            localStorage.setItem("crm_theme", "dark");
            themeButton.textContent = "☀️ Light Mode";
        } else {
            // Light mode is now active
            localStorage.setItem("crm_theme", "light");
            themeButton.textContent = "🌙 Dark Mode";
        }
    });
}