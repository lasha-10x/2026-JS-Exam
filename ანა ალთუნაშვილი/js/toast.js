/**
 * toast.js
 * ---------------------------------------------------------------------------
 * Global "snack message" notifications (P0.4). We never use browser alert()
 * for these — alert() blocks the whole page and looks unprofessional.
 *
 * Every page must have this in its HTML, once, near the end of <body>:
 *   <div id="toast-stack"></div>
 *
 * Usage from anywhere:
 *   showToast('Client added', 'success');
 *   showToast('Could not load clients', 'error');
 * ---------------------------------------------------------------------------
 */

function showToast(message, type = 'success', duration = 3000) {
  const stack = document.getElementById('toast-stack');
  if (!stack) {
    // Fail loudly in the console during development instead of silently
    // swallowing the message — easier to debug a missing container.
    console.warn('toast-stack element not found; add <div id="toast-stack"></div> to this page.');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' toast-error' : ''}`;

  const text = document.createElement('span');
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(text);
  toast.appendChild(closeBtn);
  stack.appendChild(toast);

  // Auto-dismiss after `duration` ms, unless the user already closed it.
  setTimeout(() => toast.remove(), duration);
}
