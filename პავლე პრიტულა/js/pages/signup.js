// Registration controller: validates input before saving a browser-only account.
import { STORAGE_KEYS, readStorage, writeStorage } from "../core/storage.js";
import { redirectIfAuthenticated } from "../core/guard.js";
import { getPasswordStrength, isValidEmail, isValidPassword } from "../core/utils.js";
import { showToast } from "../ui/toast.js";
import { applyTranslations, t } from "../core/i18n.js";

const form = document.querySelector("#signup-form");
const fields = {
  fullName: document.querySelector("#full-name"),
  email: document.querySelector("#email"),
  company: document.querySelector("#company"),
  password: document.querySelector("#password"),
  confirmPassword: document.querySelector("#confirm-password")
};

redirectIfAuthenticated();
applyTranslations();

const passwordStrength = {
  meter: document.querySelector("#password-strength"),
  bar: document.querySelector("#password-strength-bar"),
  text: document.querySelector("#password-strength-text")
};

/** Updates the live password-quality meter without changing validation rules. */
function updatePasswordStrength() {
  const strength = getPasswordStrength(fields.password.value);
  const translationKey = strength.level === "empty" ? "passwordStrengthEmpty" : `passwordStrength${strength.level[0].toUpperCase()}${strength.level.slice(1)}`;

  passwordStrength.meter.dataset.level = strength.level;
  passwordStrength.meter.setAttribute("aria-valuenow", String(strength.score));
  passwordStrength.bar.style.width = `${(strength.score / 6) * 100}%`;
  passwordStrength.text.textContent = t(translationKey);
}

fields.password.addEventListener("input", updatePasswordStrength);
updatePasswordStrength();

/** Updates one sign-up field's validation message and ARIA state. */
function setFieldError(fieldName, message = "") {
  const field = fields[fieldName];
  const error = document.querySelector(`#${field.id}-error`);

  field.classList.toggle("input-error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

/** Validates registration values, including duplicate-email detection. */
function validateForm(values, users) {
  const errors = {};

  if (values.fullName.length < 3) {
    errors.fullName = t("fullNameRule");
  }

  if (!isValidEmail(values.email)) {
    errors.email = t("validEmailRule");
  } else if (users.some((user) => user.email === values.email)) {
    errors.email = t("accountExists");
  }

  if (!isValidPassword(values.password)) {
    errors.password = t("passwordRule");
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t("passwordsMatch");
  }

  return errors;
}

/** Applies all current validation errors in one pass after submit. */
function displayErrors(errors) {
  Object.keys(fields).forEach((fieldName) => setFieldError(fieldName, errors[fieldName]));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const users = readStorage(STORAGE_KEYS.users, []);
  const values = {
    fullName: fields.fullName.value.trim(),
    email: fields.email.value.trim().toLowerCase(),
    company: fields.company.value.trim(),
    password: fields.password.value,
    confirmPassword: fields.confirmPassword.value
  };
  const errors = validateForm(values, users);

  displayErrors(errors);

  if (Object.keys(errors).length > 0) {
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName: values.fullName,
    email: values.email,
    password: values.password,
    company: values.company,
    createdAt: new Date().toISOString()
  };

  writeStorage(STORAGE_KEYS.users, [...users, newUser]);
  form.reset();
  updatePasswordStrength();
  showToast(t("accountCreated"));
  window.setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
