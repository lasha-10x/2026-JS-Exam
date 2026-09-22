// Global Toast Notifications, Field Error Helpers, and Theme (P0.3, P0.4)
const UI = {
  showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const text = document.createElement('span');
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => toast.remove());

    toast.appendChild(text);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, duration);
  },

  // Show an error message under a field and mark the input
  showFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);

    if (input) input.classList.add('input-error');
    if (errorSpan) errorSpan.textContent = message;
  },

  clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);

    if (input) input.classList.remove('input-error');
    if (errorSpan) errorSpan.textContent = '';
  },

  // Clear every field error inside a given form element
  clearAllErrors(form) {
    form.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
    form.querySelectorAll('.error-msg').forEach(span => (span.textContent = ''));
  },

  showGlobalError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
  },

  hideGlobalError(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = 'none';
  },

  // ---- Theme (P0.3) ----
  // Default theme is 'dark' as required by the PRD.
  applyTheme(theme) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'light'
        ? '🌙 <span>Dark</span>'
        : '☀️ <span>Light</span>';
    }
  },

  initTheme() {
    const theme = Storage.getTheme();
    this.applyTheme(theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  },

  toggleTheme() {
    const current = Storage.getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    Storage.setTheme(next);
    this.applyTheme(next);
  }
};

document.addEventListener('DOMContentLoaded', () => UI.initTheme());
