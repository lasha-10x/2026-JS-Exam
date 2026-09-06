/**
 * validate.js
 */

function showFieldError(fieldWrapperEl, message) {
  fieldWrapperEl.classList.add('has-error');
  const errorEl = fieldWrapperEl.querySelector('.error-text');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldWrapperEl) {
  fieldWrapperEl.classList.remove('has-error');
  const errorEl = fieldWrapperEl.querySelector('.error-text');
  if (errorEl) errorEl.textContent = '';
}

function clearAllErrors(formEl) {
  formEl.querySelectorAll('.field').forEach((el) => clearFieldError(el));
}


function isValidEmailShape(email) {
  const at = email.indexOf('@');
  if (at <= 0) return false;
  const domainPart = email.slice(at + 1);
  return domainPart.includes('.') && domainPart.indexOf('.') > 0 && !domainPart.endsWith('.');
}


function isValidPasswordShape(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}


function wireLiveClear(inputEl, fieldWrapperEl, validatorFn) {
  inputEl.addEventListener('input', () => {
    if (fieldWrapperEl.classList.contains('has-error') && validatorFn(inputEl.value)) {
      clearFieldError(fieldWrapperEl);
    }
  });
}