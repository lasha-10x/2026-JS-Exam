

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sidebar Toggle Logic
  const sidebarToggle = document.getElementById("sidebar-toggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const isCollapsed = html.getAttribute("data-sidebar") === "collapsed";

      if (isCollapsed) {
        html.removeAttribute("data-sidebar");
        saveSidebarState(false);
      } else {
        html.setAttribute("data-sidebar", "collapsed");
        saveSidebarState(true);
      }
    });
  }
  // 1.5 Theme Toggle Logic
  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle) {
    const sunIcon = themeToggle.querySelector(".icon-sun");
    const moonIcon = themeToggle.querySelector(".icon-moon");
    const themeText = themeToggle.querySelector(".theme-text");

    const updateThemeUI = (isDark) => {
      if (sunIcon) sunIcon.style.display = isDark ? "" : "none";
      if (moonIcon) moonIcon.style.display = isDark ? "none" : "";
      if (themeText) themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
    };

    // Initialize UI
    const isDark = document.documentElement.classList.contains("dark-theme");
    updateThemeUI(isDark);

    // Toggle event
    let themeTimeout;
    themeToggle.addEventListener("click", () => {
      // Clear any existing timeout if user clicks rapidly
      clearTimeout(themeTimeout);

      // Temporarily add a global transition class to root
      document.documentElement.classList.add("theme-transition");

      const isCurrentlyDark = document.documentElement.classList.contains("dark-theme");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark-theme");
        saveTheme("light");
        updateThemeUI(false);
      } else {
        document.documentElement.classList.add("dark-theme");
        saveTheme("dark");
        updateThemeUI(true);
      }

      // Remove the global transition class after animation completes (300ms)
      themeTimeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 500);


      // Close the profile dropdown menu
      const profileMenu = document.querySelector(".profile-menu");
      if (profileMenu) {
        profileMenu.classList.remove("open");
      }
    });
  }

  // 2. Profile Dropdown Logic
  const profileTrigger = document.getElementById("profile-trigger");
  const profileMenu = document.querySelector(".profile-menu");

  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener("click", (e) => {
      profileMenu.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("open");
      }
    });
  }

  // 3. User Data Integration (Welcome text, avatar)
  const session = getSession();
  const users = getUsers();

  if (session) {
    const currentUser = users.find(user => user.email === session.email);
    if (currentUser) {
      const welcomeText = document.getElementById("welcome-text");
      const profileAvatar = document.getElementById("profile-avatar");

      if (welcomeText) {
        const firstName = currentUser.fullName.split(" ")[0];
        welcomeText.textContent = `Welcome back, ${firstName}`;
      }

      if (profileAvatar) {
        // Extract initials
        const initials = currentUser.fullName.split(" ").map(name => name[0]).join("").substring(0, 2).toUpperCase();
        profileAvatar.textContent = initials;
      }
    }
  }

  // 4. Logout Logic
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.replace("index.html");
    });
  }
});

