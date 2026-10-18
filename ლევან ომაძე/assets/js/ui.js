function showToast(message, timeout = 2800) {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), timeout);
}

function setFieldError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);
  if (!field || !error) return;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  field.setAttribute("aria-describedby", `${fieldId}-error`);
  error.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach((node) => {
    node.textContent = "";
  });
  form.querySelectorAll("[aria-invalid]").forEach((node) => {
    node.setAttribute("aria-invalid", "false");
  });
  const formError = form.querySelector(".form-error");
  if (formError) formError.textContent = "";
}

function focusFirstError(form) {
  const firstError = form.querySelector(".error:not(:empty)");
  if (!firstError) return;
  const input = form.querySelector(`[aria-describedby="${firstError.id}"]`);
  input?.focus();
}

function initTheme() {
  const savedTheme = localStorage.getItem(CRM_KEYS.theme) || "light";
  localStorage.setItem(CRM_KEYS.theme, savedTheme);
  document.documentElement.dataset.theme = savedTheme;
  document.querySelectorAll("#theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(CRM_KEYS.theme, nextTheme);
      showToast(`${nextTheme === "dark" ? "Dark" : "Light"} theme enabled`);
    });
  });
}

function closeDialogOnBackdrop(dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

document.addEventListener("DOMContentLoaded", initTheme);
