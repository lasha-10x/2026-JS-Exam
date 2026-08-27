// Persistent reminder records are kept separately from temporary toast notifications.
import { STORAGE_KEYS, readStorage, writeStorage } from "./storage.js";

/** Returns reminder history from localStorage. */
export function getNotifications() {
  return readStorage(STORAGE_KEYS.notifications, []);
}

/** Prepends a new reminder record and assigns a stable browser-generated ID. */
export function addNotification(notification) {
  const notifications = getNotifications();
  const savedNotification = { id: crypto.randomUUID(), ...notification };
  notifications.unshift(savedNotification);
  writeStorage(STORAGE_KEYS.notifications, notifications);
  return savedNotification;
}

/** Removes the full reminder history after the user confirms the action. */
export function clearNotifications() {
  writeStorage(STORAGE_KEYS.notifications, []);
}

/** Removes one notification without changing other reminder records. */
export function deleteNotification(notificationId) {
  writeStorage(STORAGE_KEYS.notifications, getNotifications().filter((notification) => notification.id !== notificationId));
}

/** Returns reminders whose persistent toast should be restored on page navigation. */
export function getActiveNotifications() {
  return getNotifications().filter((notification) => notification.status === "Active");
}

/** Marks an active reminder as completed when its toast is manually closed. */
export function markNotificationDone(notificationId) {
  const notifications = getNotifications().map((notification) =>
    notification.id === notificationId ? { ...notification, status: "Done" } : notification
  );
  writeStorage(STORAGE_KEYS.notifications, notifications);
}

/** Moves due pending reminders to Active and returns only the newly activated records. */
export function activateDueNotifications() {
  const now = Date.now();
  const activatedNotifications = [];
  const notifications = getNotifications().map((notification) => {
    if (notification.status === "Pending" && new Date(notification.scheduledFor).getTime() <= now) {
      const activeNotification = { ...notification, status: "Active" };
      activatedNotifications.push(activeNotification);
      return activeNotification;
    }
    return notification;
  });

  if (activatedNotifications.length) writeStorage(STORAGE_KEYS.notifications, notifications);
  return activatedNotifications;
}

/** Marks long-overdue pending reminders as Expired when the app was inactive. */
export function expireMissedNotifications() {
  const now = Date.now();
  const notifications = getNotifications().map((notification) => {
    const legacyStatus = notification.status === "Scheduled" ? "Pending" : notification.status === "Due" ? "Expired" : notification.status;
    if (legacyStatus === "Pending" && new Date(notification.scheduledFor).getTime() + 60000 <= now) {
      return { ...notification, status: "Expired" };
    }
    return legacyStatus === notification.status ? notification : { ...notification, status: legacyStatus };
  });

  writeStorage(STORAGE_KEYS.notifications, notifications);
  return notifications;
}
