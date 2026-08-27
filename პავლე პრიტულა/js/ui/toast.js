// Reusable toast UI. Passing a duration of 0 creates a persistent reminder toast.
const TOAST_DURATION = 3000;

/** Creates the shared live-region container on first toast use. */
function getToastContainer() {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.append(container);
  }

  return container;
}

/** Shows temporary feedback or a persistent toast when duration is zero. */
export function showToast(message, type = "success", duration = TOAST_DURATION, onClose) {
  const toast = document.createElement("div");
  const closeButton = document.createElement("button");

  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;

  closeButton.className = "toast-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close notification");
  closeButton.textContent = "×";
  /** Removes this toast and notifies persistent-reminder callers about manual closure. */
  function removeToast() {
    toast.remove();
    onClose?.();
  }

  closeButton.addEventListener("click", removeToast);

  toast.append(closeButton);
  getToastContainer().append(toast);

  if (duration > 0) window.setTimeout(removeToast, duration);
}
