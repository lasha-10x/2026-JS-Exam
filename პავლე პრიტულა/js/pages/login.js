// Login form controller: validates credentials and creates the active local session.
import { redirectIfAuthenticated, SESSION_DURATION_MS } from "../core/guard.js";
import { STORAGE_KEYS, readStorage, writeSession } from "../core/storage.js";
import { applyTranslations, t } from "../core/i18n.js";
import { showToast } from "../ui/toast.js";

const form = document.querySelector("#login-form");
const fields = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  remember: document.querySelector("#remember-me")
};

redirectIfAuthenticated();
applyTranslations();

const pageParameters = new URLSearchParams(window.location.search);
if (pageParameters.get("reason") === "session-expired") {
  showToast(t("sessionExpired"), "error");
  window.history.replaceState({}, "", "index.html");
}

/** Updates one login field's validation message and ARIA state. */
function setFieldError(fieldName, message = "") {
  const field = fields[fieldName];
  const error = document.querySelector(`#${field.id}-error`);

  field.classList.toggle("input-error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

/** Returns field errors without mutating the form, keeping validation easy to test. */
function validateForm(email, password) {
  const errors = {};

  if (!email) {
    errors.email = t("emailRequired");
  }

  if (!password) {
    errors.password = t("passwordRequired");
  }

  return errors;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = fields.email.value.trim().toLowerCase();
  const password = fields.password.value;
  const errors = validateForm(email, password);

  setFieldError("email", errors.email);
  setFieldError("password", errors.password);

  if (Object.keys(errors).length > 0) {
    return;
  }

  const users = readStorage(STORAGE_KEYS.users, []);
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    setFieldError("password", t("invalidCredentials"));
    return;
  }

  const loginTime = Date.now();
  writeSession({
    userId: user.id,
    email: user.email,
    loginAt: new Date(loginTime).toISOString(),
    expiresAt: new Date(loginTime + SESSION_DURATION_MS).toISOString()
  }, fields.remember.checked);

  window.location.href = "dashboard.html";
});
