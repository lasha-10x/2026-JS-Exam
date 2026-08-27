const toggleButton = document.getElementById("themeToggle");

// Load saved theme
const theme = localStorage.getItem("crm_theme");

if (theme === "dark") {
  document.body.classList.add("dark");
}

// Toggle theme
toggleButton.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    localStorage.setItem("crm_theme", "dark");
  } else {
    localStorage.setItem("crm_theme", "light");
  }
});


