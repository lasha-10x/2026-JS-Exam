// Notification-history controller: renders reminder records and handles cleanup/navigation.
import { requireAuthentication } from "../core/guard.js";
import { clearNotifications, deleteNotification, getNotifications } from "../core/notifications.js";
import { initializeProtectedLayout } from "../ui/navigation.js";
import { showToast } from "../ui/toast.js";
import { formatDateTime, t } from "../core/i18n.js";

requireAuthentication();
initializeProtectedLayout();

const content = document.querySelector("#notifications-content");
const clearButton = document.querySelector("#clear-notifications-button");

/** Draws reminder history and hides the clear button when there is nothing to clear. */
function renderNotifications() {
  const notifications = getNotifications();
  clearButton.hidden = notifications.length === 0;

  if (!notifications.length) {
    content.innerHTML = `<p class="notifications-empty">${t("noNotifications")}</p>`;
    return;
  }

  content.innerHTML = `<div class="notifications-list">${notifications.map((notification) => `<article class="notification-item" data-client-id="${notification.clientId}" data-notification-id="${notification.id}" role="link" tabindex="0"><div><span class="notification-status ${notification.status.toLowerCase()}">${t(notification.status.toLowerCase())}</span><h2>${notification.message}</h2><p>${notification.clientCompany} · ${notification.clientEmail}</p><small>${t("created")} ${formatDateTime(notification.createdAt)} · ${t("due")} ${formatDateTime(notification.scheduledFor)}</small></div><div class="notification-actions"><span class="notification-client-link">${t("openClient")}</span><button class="notification-delete-button" type="button" aria-label="Delete notification">${t("delete")}</button></div></article>`).join("")}</div>`;
}

/** Navigates to Clients with a query parameter that opens the related detail modal. */
function openClient(notificationItem) {
  window.location.href = `clients.html?clientId=${notificationItem.dataset.clientId}`;
}

content.addEventListener("click", (event) => {
  const notificationItem = event.target.closest(".notification-item");
  if (!notificationItem) return;

  if (event.target.closest(".notification-delete-button")) {
    deleteNotification(notificationItem.dataset.notificationId);
    renderNotifications();
    showToast(t("notificationDeleted"));
    return;
  }

  openClient(notificationItem);
});

content.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".notification-item")) {
    event.preventDefault();
    openClient(event.target);
  }
});

clearButton.addEventListener("click", () => {
  if (!window.confirm(t("clearConfirm"))) return;
  clearNotifications();
  renderNotifications();
  showToast(t("historyCleared"));
});

renderNotifications();
window.setInterval(renderNotifications, 15000);
