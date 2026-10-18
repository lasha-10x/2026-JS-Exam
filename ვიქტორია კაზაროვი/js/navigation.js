// Controls the collapsible desktop sidebar and responsive mobile burger menu.

const sidebarMediaQuery = window.matchMedia("(max-width: 48rem)");
// The same breakpoint is used to decide whether controls behave as desktop or mobile UI.

// Desktop navigation stays visible but can collapse to its compact icon state.
function setDesktopSidebarState(isCollapsed) {
  const layout = document.querySelector(".app-layout");
  const sidebar = document.getElementById("app-sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");

  if (!layout || !sidebar || !sidebarToggle) {
    // Leave early if this page does not use the app sidebar.
    return;
  }

  layout.classList.toggle("sidebar-collapsed", isCollapsed);
  // aria-expanded describes the visible state for keyboard and screen-reader users.
  sidebar.classList.toggle("is-collapsed", isCollapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));

  const actionText = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
  // Keep the button label in sync with its next action.
  const toggleIcon = sidebarToggle.querySelector(".sidebar-toggle-icon");

  sidebarToggle.setAttribute("aria-label", actionText);
  sidebarToggle.title = actionText;

  if (toggleIcon) {
    // Change the arrow to show which direction the sidebar will move.
    toggleIcon.textContent = isCollapsed ? "\u203A" : "\u2039";
  }

}

// Mobile navigation opens over the page and updates accessibility attributes.
function setMobileSidebarState(isOpen) {
  const sidebar = document.getElementById("app-sidebar");
  const menuToggle = document.querySelector(".nav-menu-toggle");
  const overlay = document.querySelector(".sidebar-overlay");

  if (!sidebar || !menuToggle || !overlay) {
    // All three elements are needed for a usable mobile menu.
    return;
  }

  sidebar.classList.toggle("open", isOpen);
  // The overlay blocks accidental interaction with page content while the menu is open.
  overlay.classList.toggle("show", isOpen);
  document.body.classList.toggle("sidebar-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

// Toggle helpers read the current class and request the opposite state.
function toggleDesktopSidebar() {
  const sidebarToggle = document.querySelector(".sidebar-toggle");

  if (!sidebarToggle) {
    return;
  }

  const isExpanded =
    // aria-expanded is stored as text, so compare it with "true".
    sidebarToggle.getAttribute("aria-expanded") === "true";
  setDesktopSidebarState(isExpanded);
}

function toggleMobileSidebar() {
  const menuToggle = document.querySelector(".nav-menu-toggle");

  if (!menuToggle) {
    return;
  }

  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  // Request the opposite state when the burger button is clicked.
  setMobileSidebarState(!isOpen);
}

// Connects navigation controls and keeps state correct when the viewport changes.
document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const menuToggle = document.querySelector(".nav-menu-toggle");
  const overlay = document.querySelector(".sidebar-overlay");
  const sidebar = document.getElementById("app-sidebar");

  if (!sidebarToggle || !menuToggle || !overlay || !sidebar) {
    return;
  }

  setDesktopSidebarState(false);
  setMobileSidebarState(false);

  sidebarToggle.addEventListener("click", function () {
    if (sidebarMediaQuery.matches) {
      // On a small screen this control only closes the open drawer; the burger
      // button is the control that opens it.
      setMobileSidebarState(false);
      menuToggle.focus();
      return;
    }

    toggleDesktopSidebar();
  });

  menuToggle.addEventListener("click", toggleMobileSidebar);
  overlay.addEventListener("click", function () {
    setMobileSidebarState(false);
    menuToggle.focus();
  });

  sidebar.querySelectorAll("a").forEach(function (link) {
    // Selecting a page link closes the mobile drawer.
    link.addEventListener("click", function () {
      if (sidebarMediaQuery.matches) {
        setMobileSidebarState(false);
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    // Escape is a common keyboard way to close an open menu.
    const menuIsOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && menuIsOpen) {
      setMobileSidebarState(false);
      menuToggle.focus();
    }
  });

  sidebarMediaQuery.addEventListener("change", function () {
    // Reset menu classes when crossing between desktop and mobile layouts.
    setMobileSidebarState(false);
    setDesktopSidebarState(false);
  });
});
