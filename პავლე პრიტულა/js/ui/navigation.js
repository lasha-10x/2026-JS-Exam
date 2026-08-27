// Shared protected-page UI: language, theme, mobile navigation, logout, and reminders.
import { STORAGE_KEYS, clearSession, readStorage, writeStorage } from "../core/storage.js";
import { applyTranslations, t } from "../core/i18n.js";
import { activateDueNotifications, expireMissedNotifications, getActiveNotifications, markNotificationDone } from "../core/notifications.js";
import { showToast } from "./toast.js";
import { getSessionRemainingMs } from "../core/guard.js";

/** Reads the saved display theme, defaulting to dark mode. */
function getTheme() {
  return readStorage(STORAGE_KEYS.theme, "dark");
}

/** Adds or removes the root class that drives CSS custom-property themes. */
function applyTheme(theme) {
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
}

/** Synchronizes the compact theme button with the current root theme. */
function initializeThemeToggle() {
  const button = document.querySelector("#theme-toggle");
  const sunIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.3A8.5 8.5 0 0 1 8.7 3.6 8.5 8.5 0 1 0 20.4 15.3Z"></path></svg>`;

  /** Updates the SVG icon and accessible labels after each theme change. */
  function updateButton() {
    const isDark = document.documentElement.classList.contains("theme-dark");
    const label = isDark ? t("switchToLight") : t("switchToDark");
    button.innerHTML = isDark ? sunIcon : moonIcon;
    button.dataset.theme = isDark ? "dark" : "light";
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  updateButton();
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(nextTheme);
    writeStorage(STORAGE_KEYS.theme, nextTheme);
    updateButton();
  });
}

/** Clears only the active session and returns the user to Login. */
function initializeLogout() {
  document.querySelector("#logout-button").addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

/** Ends the current session exactly when its 30-minute deadline is reached. */
function initializeSessionExpiration() {
  const remainingTime = getSessionRemainingMs();
  if (remainingTime <= 0) return;

  window.setTimeout(() => {
    clearSession();
    window.location.replace("index.html?reason=session-expired");
  }, remainingTime);
}

/** Controls the burger-menu state on narrow protected-page layouts. */
function initializeMobileNavigation() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector("#nav-toggle");

  /** Restores the closed menu state after navigation or a larger viewport resize. */
  function closeMenu() {
    sidebar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  document.querySelectorAll(".sidebar-nav a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) closeMenu();
  });
}

/** Restores active reminder toasts and activates newly due reminders once per second. */
function initializeReminderWatcher() {
  /** Shows one persistent reminder and marks it Done only after manual closure. */
  function showReminder(notification) {
    showToast(`⏰ ${notification.clientName} · ${notification.clientEmail}`, "success", 0, () => markNotificationDone(notification.id));
  }

  /** Activates any pending reminders whose due time has just been reached. */
  function showDueReminders() {
    activateDueNotifications().forEach((notification) => {
      showReminder(notification);
    });
  }

  expireMissedNotifications();
  getActiveNotifications().forEach(showReminder);
  showDueReminders();
  window.setInterval(showDueReminders, 1000);
}

/** Starts all shared protected-page behavior in a consistent order. */
export function initializeProtectedLayout() {
  applyTranslations();
  applyTheme(getTheme());
  initializeMobileNavigation();
  initializeThemeToggle();
  initializeLogout();
  initializeSessionExpiration();
  initializeReminderWatcher();
}
