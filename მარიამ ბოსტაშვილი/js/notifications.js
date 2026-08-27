const reminderTimers = new Set();

function currentUserNotifications() {
  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  return getNotifications()
    .filter(function (notification) {
      return notification.userId === user.id;
    })
    .sort(function (first, second) {
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
}

function notificationTime(createdAt) {
  const date = new Date(createdAt);
  const elapsedMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (elapsedMinutes < 1) return 'Now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m`;

  return date.toLocaleDateString();
}

function createReminderIcon() {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const circle = document.createElementNS(namespace, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '13');
  circle.setAttribute('r', '8');

  const hands = document.createElementNS(namespace, 'path');
  hands.setAttribute('d', 'M12 9v4l2 2');

  const bells = document.createElementNS(namespace, 'path');
  bells.setAttribute('d', 'M5 3 2 6m17-3 3 3M6.4 19.6 5 21m12.6-1.4L19 21');

  svg.append(circle, hands, bells);
  return svg;
}

function createNotificationRow(notification) {
  const row = document.createElement('div');
  row.className = `notif-item${notification.read ? '' : ' is-unread'}`;
  row.dataset.id = notification.id;
  row.setAttribute('role', 'menuitem');
  row.tabIndex = 0;

  const icon = document.createElement('span');
  icon.className = 'notif-item__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.append(createReminderIcon());

  const body = document.createElement('div');
  body.className = 'notif-item__body';

  const title = document.createElement('div');
  title.className = 'notif-item__title';
  title.textContent = notification.title;

  const text = document.createElement('div');
  text.className = 'notif-item__text';
  text.textContent = notification.message;

  const time = document.createElement('time');
  time.className = 'notif-item__time';
  time.dateTime = notification.createdAt;
  time.textContent = notificationTime(notification.createdAt);

  const dot = document.createElement('span');
  dot.className = 'notif-item__dot';
  dot.setAttribute('aria-hidden', 'true');

  body.append(title, text);
  row.append(icon, body, time, dot);
  return row;
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');

  if (!list || !badge) {
    return;
  }

  const notifications = currentUserNotifications();
  const unreadCount = notifications.filter(function (notification) {
    return !notification.read;
  }).length;

  badge.textContent = unreadCount;
  badge.hidden = unreadCount === 0;
  list.replaceChildren();

  if (notifications.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'notif-empty';
    empty.innerHTML = '<div class="notif-empty__icon" aria-hidden="true">&#9203;</div>No notifications yet.';
    list.append(empty);
    return;
  }

  list.append(...notifications.map(createNotificationRow));
}

function addNotification(message, title = 'Reminder') {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const notification = {
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    userId: user.id,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const notifications = getNotifications();
  notifications.push(notification);

  if (!saveNotifications(notifications)) {
    return null;
  }

  renderNotifications();

  const button = document.getElementById('notifBtn');
  if (button) {
    button.classList.remove('is-new');
    void button.offsetWidth;
    button.classList.add('is-new');
  }

  return notification;
}

function markNotificationRead(id) {
  const user = getCurrentUser();
  const notifications = getNotifications();
  const notification = notifications.find(function (item) {
    return item.id === id && item.userId === user?.id;
  });

  if (notification && !notification.read) {
    notification.read = true;

    if (saveNotifications(notifications)) {
      renderNotifications();
    }
  }
}

function markAllNotificationsRead() {
  const user = getCurrentUser();
  const notifications = getNotifications();

  for (const notification of notifications) {
    if (notification.userId === user?.id) {
      notification.read = true;
    }
  }

  if (saveNotifications(notifications)) {
    renderNotifications();
  }
}

function scheduleReminderProcessing(delay) {
  const timer = setTimeout(function () {
    reminderTimers.delete(timer);
    processDueReminders();
  }, Math.max(0, delay));
  reminderTimers.add(timer);
}

function scheduleReminder(client) {
  const user = getCurrentUser();

  if (!user || !client) {
    return false;
  }

  const reminders = getReminders();
  reminders.push({
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    userId: user.id,
    clientId: client.id,
    clientName: client.name,
    dueAt: new Date(Date.now() + 60000).toISOString(),
  });
  if (!saveReminders(reminders)) {
    return false;
  }

  scheduleReminderProcessing(60000);
  return true;
}

function removeClientReminders(clientId) {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const reminders = getReminders();
  const nextReminders = reminders.filter(function (reminder) {
    return !(
      reminder.userId === user.id && String(reminder.clientId) === String(clientId)
    );
  });

  if (nextReminders.length !== reminders.length) {
    saveReminders(nextReminders);
  }
}

function clearCurrentUserReminders() {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const reminders = getReminders().filter(function (reminder) {
    return reminder.userId !== user.id;
  });
  saveReminders(reminders);
  reminderTimers.forEach(clearTimeout);
  reminderTimers.clear();
}

function processDueReminders() {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const reminders = getReminders();
  const now = Date.now();
  const due = reminders.filter(function (reminder) {
    return reminder.userId === user.id && new Date(reminder.dueAt).getTime() <= now;
  });

  if (due.length === 0) {
    return;
  }

  const completedIds = new Set();

  for (const reminder of due) {
    const message = `Follow up: ${reminder.clientName}`;

    if (addNotification(message)) {
      completedIds.add(reminder.id);
      showToast(`\u23f0 ${message}`, 'success');
    }
  }

  if (completedIds.size > 0) {
    saveReminders(
      reminders.filter(function (reminder) {
        return !completedIds.has(reminder.id);
      }),
    );
  }
}

function setNotificationMenuOpen(open) {
  const menu = document.getElementById('notifMenu');
  const button = document.getElementById('notifBtn');

  if (!menu || !button) {
    return;
  }

  menu.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
}

function initNotifications() {
  const menu = document.getElementById('notifMenu');
  const button = document.getElementById('notifBtn');
  const list = document.getElementById('notifList');
  const clearButton = document.getElementById('notifClearBtn');

  if (!menu || !button || !list || !clearButton) {
    return;
  }

  renderNotifications();
  processDueReminders();

  const user = getCurrentUser();
  const now = Date.now();
  getReminders()
    .filter(function (reminder) {
      return reminder.userId === user?.id;
    })
    .forEach(function (reminder) {
      scheduleReminderProcessing(new Date(reminder.dueAt).getTime() - now);
    });

  button.addEventListener('click', function () {
    setNotificationMenuOpen(!menu.classList.contains('is-open'));
  });

  clearButton.addEventListener('click', markAllNotificationsRead);

  list.addEventListener('click', function (event) {
    const row = event.target.closest('.notif-item');
    if (row) markNotificationRead(row.dataset.id);
  });

  list.addEventListener('keydown', function (event) {
    const row = event.target.closest('.notif-item');
    if (row && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      markNotificationRead(row.dataset.id);
    }
  });

  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target)) setNotificationMenuOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setNotificationMenuOpen(false);
  });
}

document.addEventListener('DOMContentLoaded', initNotifications);

window.addEventListener('beforeunload', function () {
  reminderTimers.forEach(clearTimeout);
  reminderTimers.clear();
});
