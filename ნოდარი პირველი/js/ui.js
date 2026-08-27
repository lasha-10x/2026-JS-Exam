function showToast(message, type) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function showFieldError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "-error");
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add("input-error");
}

function clearFieldError(fieldId) {
  const errorEl = document.getElementById(fieldId + "-error");
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = "";
  if (inputEl) inputEl.classList.remove("input-error");
}

function clearFieldErrors(fieldIds) {
  fieldIds.forEach(clearFieldError);
}

const EYE_OPEN_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

const EYE_OFF_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

function initPasswordToggles() {
  document.querySelectorAll(".toggle-password-btn").forEach(function (btn) {
    btn.innerHTML = EYE_OPEN_SVG;

    btn.addEventListener("click", function () {
      const input = document.getElementById(btn.getAttribute("data-target"));
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.innerHTML = isHidden ? EYE_OFF_SVG : EYE_OPEN_SVG;
    });
  });
}

document.addEventListener("DOMContentLoaded", initPasswordToggles);
