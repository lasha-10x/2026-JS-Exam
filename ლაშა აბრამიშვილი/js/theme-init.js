// This runs in the document head to prevent a light flash before CSS loads.
(function initializePageAppearance() {
  let theme = "dark";
  let tenXModeIsActive = false;

  try {
    const savedTheme = localStorage.getItem("crm_theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    }

    tenXModeIsActive =
      localStorage.getItem("crm_ten_x_mode") === "true";
  } catch (error) {
    // Keep the default appearance when browser storage is unavailable.
  }

  document.documentElement.setAttribute("data-theme", theme);

  if (tenXModeIsActive) {
    document.documentElement.setAttribute("data-ten-x-mode", "true");
  }
})();
