/**
 * Global Validation UI Helpers
 * Used across different forms (auth, clients) to display and clear errors.
 */

/**
 * Displays an error message under a specific input field and highlights the input.
 * @param {string} inputId - The ID of the input element.
 * @param {string} message - The error message to display.
 */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}-error`);
  if (input && errorSpan) {
    input.classList.add('input-error');
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
}

/**
 * Clears all error states from a specific form.
 * @param {HTMLFormElement} form - The form element to clear errors from.
 */
function clearFieldErrors(form) {
  if (!form) return;
  form.querySelectorAll('.form-group__input').forEach(input => {
    input.classList.remove('input-error');
  });
  form.querySelectorAll('.form-group__error-message').forEach(span => {
    span.textContent = '';
  });
}

// --- Pure Validation Helpers ---

function isValidEmail(email) {
  // Strict pattern allowing only Latin letters, numbers, and standard email symbols
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

function isValidPhone(phone) {
  const pattern = /^\+?[0-9\s\-]{7,20}$/;
  return pattern.test(phone);
}

function isValidPassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= 8 && hasLetter && hasNumber;
}

function isValidDealValue(value) {
  return value !== '' && !isNaN(value) && Number(value) > 0;
}

/**
 * Attaches dynamic error clearing to all inputs in a form.
 * When the user types, the error class and error message are cleared.
 * @param {HTMLFormElement} form - The form element to attach listeners to.
 */
function attachDynamicErrorClearing(form) {
  if (!form) return;
  const inputs = form.querySelectorAll('.form-group__input');
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      this.classList.remove('input-error');
      const errorSpan = document.getElementById(`${this.id}-error`);
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    });
  });
}
