const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function updateThemeIcon() {
    if (document.body.classList.contains("dark")) {
        themeIcon.src = "./assets/light.svg";
        themeIcon.alt = "Light mode";
    } else {
        themeIcon.src = "./assets/sleep-mode.svg";
        themeIcon.alt = "Dark mode";
    }
}

const savedTheme = localStorage.getItem("crm_theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeIcon();

themeToggle.addEventListener("click", (e) => {
    e.preventDefault();

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "crm_theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );

    updateThemeIcon();
});