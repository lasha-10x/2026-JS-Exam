// Runs before CSS loads so the saved light theme appears on the first paint.
(function () {
  // This self-running function must remain small because it executes in the
  // page head, before the main JavaScript and styles have finished loading.
  try {
    const savedTheme = JSON.parse(
      // Read the raw saved text before the storage helper script is available.
      localStorage.getItem("crm_theme")
    );

    if (savedTheme === "light") {
      // Add this class early so the first visible paint is light too.
      document.documentElement.classList.add("light-theme");
    }
  } catch (error) {
    // If saved data is broken, fall back to the normal dark theme.
    document.documentElement.classList.remove("light-theme");
  }
})();
