// toast.js — green/red notifications, disappear after 3 seconds or via the X button.

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type === 'error' ? 'error' : 'success');

  const text = document.createElement('span');
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00D7';

  toast.appendChild(text);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  const remove = () => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  };
  closeBtn.addEventListener('click', remove);
  setTimeout(remove, 3000);
}
