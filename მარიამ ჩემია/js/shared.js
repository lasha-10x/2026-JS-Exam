import {redirectIfNotAuthenticated} from "./guard.js";
import { clearSession, getTheme, saveTheme } from "./storage.js";

export const session = redirectIfNotAuthenticated();

//toggle between light and dark themes
const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = getTheme();

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleBtn?.classList.add("active");
}

toggleBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");

    toggleBtn.classList.toggle("active", isDark);
    saveTheme(isDark ? "dark" : "light");
})

//logout and clear session
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener('click', () => {
    clearSession();
    window.location.href = './index.html';
});