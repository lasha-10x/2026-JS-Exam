/**
 * Toast Notification System
 * Displays a temporary message on the screen (success or error).
 */

function showToast(message, type = 'success') {
  // Find or create toast container
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast--${type}`);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    // Clean up container if empty
    if (container.children.length === 0) {
      container.remove();
    }
  }, 3000);
}
