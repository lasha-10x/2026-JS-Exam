/**
 * Shared validation helpers used across auth and profile forms.
 */

function isValidEmail(email) {
  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.indexOf('@');
  if (atIndex === -1) return false;
  const afterAt = normalized.slice(atIndex + 1);
  return afterAt.includes('.');
}

function isValidPassword(password) {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return hasLetter && hasDigit;
}

function showFieldError(form, fieldName, message) {
  const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
  const inputEl = form.querySelector(`[name="${fieldName}"]`);

  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('input-error');
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach((el) => {
    el.textContent = '';
  });
  form.querySelectorAll('.input-error').forEach((el) => {
    el.classList.remove('input-error');
  });
}

/**
 * Escape HTML to prevent XSS when rendering user content.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
