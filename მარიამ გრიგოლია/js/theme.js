// //THEME toggle dark/light mode
// const THEME_KEY = "crm_theme"; //the localStorage key[required]
// const themeToggleBtn = document.querySelector("#theme-toggle");

// function setTheme(theme) {
//   const isLight = theme === "light";
//   document.body.classList.toggle("light", isLight);
//   if (themeToggleBtn) {
//     themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
//   }
// }

// //on page load, check localStorage for saved theme and apply it
// const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
// setTheme(savedTheme);

// //on button click, toggle theme and save to localStorage
// if (themeToggleBtn) {
//   themeToggleBtn.addEventListener("click", () => {
//     const newTheme = document.body.classList.contains("light")
//       ? "dark"
//       : "light";
//     localStorage.setItem(THEME_KEY, newTheme);
//     setTheme(newTheme);
//   });
// }
//DOWN is used js chain for if block checking if themeToggleBtn exists before adding event listener

import { KEYS } from "./storage.js";
const themeToggleBtn = document.querySelector("#theme-toggle");

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light", isLight);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  }
}
// Initialize theme on page load
export function initTheme() {
  const savedTheme = localStorage.getItem(KEYS.theme) || "dark";
  setTheme(savedTheme);

  themeToggleBtn?.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("light")
      ? "dark"
      : "light";
    localStorage.setItem(KEYS.theme, newTheme);
    setTheme(newTheme);
  });
}
