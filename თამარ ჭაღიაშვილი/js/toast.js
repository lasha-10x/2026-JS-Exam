/**
 * toast.js
 */

function ensureToastStack() {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  return stack;
}

/**
 * Show a toast message.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  const stack = ensureToastStack();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Dismiss');
  closeBtn.textContent = '\u00D7';
  closeBtn.addEventListener('click', () => toast.remove());
  toast.appendChild(closeBtn);

  stack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}