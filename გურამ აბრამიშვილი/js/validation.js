// validation.js — shared validation helpers, used by every form.

function isValidEmail(email) {
  const at = email.indexOf('@');
  if (at < 1) return false;
  const afterAt = email.slice(at + 1);
  const dot = afterAt.indexOf('.');
  return dot > 0 && dot < afterAt.length - 1;
}

function hasLetterAndNumber(password) {
  return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.add('input-error');
  const errorEl = document.getElementById(fieldId + '-error');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.remove('input-error');
  const errorEl = document.getElementById(fieldId + '-error');
  if (errorEl) errorEl.textContent = '';
}

function clearErrors(form) {
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

// Bonus: password strength scoring for the signup form's live meter
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}
// Bonus: "live" validation — the error clears as soon as the user starts typing in the field
function attachLiveClear(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.addEventListener('input', () => clearFieldError(fieldId));
}
