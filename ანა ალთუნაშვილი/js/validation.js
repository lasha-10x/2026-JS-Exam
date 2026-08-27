/**
 * validation.js
 * ---------------------------------------------------------------------------
 * Shared field-level validation helpers (P0.4 "field error" standard).
 * Originally these lived inside auth.js, but the Add Client form on the
 * Clients page needs the exact same pattern, so they moved here — one place,
 * used by signup.html, index.html, and clients.html.
 * ---------------------------------------------------------------------------
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // contains @ and a dot after it
const HAS_LETTER_RE = /[a-zA-Z]/;
const HAS_DIGIT_RE = /[0-9]/;

function setFieldError(name, message) {
  const wrapper = document.getElementById(`field-${name}`);
  const errorEl = document.getElementById(`error-${name}`);
  if (!wrapper || !errorEl) return;
  wrapper.classList.add('input-error');
  errorEl.textContent = message;
  errorEl.classList.toggle('has-message', message !== '');
}

function clearFieldError(name) {
  const wrapper = document.getElementById(`field-${name}`);
  const errorEl = document.getElementById(`error-${name}`);
  if (!wrapper || !errorEl) return;
  wrapper.classList.remove('input-error');
  errorEl.textContent = '';
  errorEl.classList.remove('has-message');
}

function clearAllFieldErrors(names) {
  names.forEach(clearFieldError);
}

// A field clears its own error as soon as the user edits it again, instead
// of making them wait for the next submit (small UX bonus from the PRD).
function liveClearOnInput(names) {
  names.forEach((name) => {
    const el = document.getElementById(name);
    if (el) el.addEventListener('input', () => clearFieldError(name));
  });
}
