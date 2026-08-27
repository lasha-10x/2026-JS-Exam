// theme.js — reads/writes the "crm_theme" key so light/dark mode
// survives page navigation and refreshes.

function applyStoredTheme() {
    const theme = localStorage.getItem("crm_theme") || "light";
    document.body.setAttribute("data-theme", theme);
    return theme;
}

function toggleTheme() {
    const current = localStorage.getItem("crm_theme") || "light";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("crm_theme", next);
    document.body.setAttribute("data-theme", next);
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.textContent = next === "light" ? "🌙" : "☀️";
}

// apply immediately so there is no flash of the wrong theme
applyStoredTheme();

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.textContent = applyStoredTheme() === "light" ? "🌙" : "☀️";
});
