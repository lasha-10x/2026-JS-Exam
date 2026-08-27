/**
 * Toast notification system.
 * Success toasts are green, error toasts are red. Auto-dismiss after 3 seconds.
 */

const TOAST_DURATION = 3000;

/**
 * Show a toast message.
 * @param {string} message - Text to display
 * @param {'success' | 'error'} type - Toast style
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, TOAST_DURATION);
}
