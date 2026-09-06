// toast.js
// Shows a small dismissible banner in the corner of the screen. The PRD
// forbids using the browser's alert() for messages (confirm() is still
// allowed, only for delete confirmations). This is the one function every
// page calls instead: showToast("Client added", "success").

function showToast(message, type = "success") {
  // type is either "success" (green) or "error" (red) - it just becomes
  // a CSS class name, so the stylesheet decides the actual color.

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // textContent (not innerHTML) because message could theoretically contain
  // user-typed text (e.g. a client's name) - textContent never executes
  // HTML/script tags, so this is safe by default.
  const text = document.createElement("span");
  text.textContent = message;

  // The manual "X" close button the PRD asks for, alongside auto-dismiss.
  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.textContent = "×";
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(text);
  toast.appendChild(closeBtn);

  // There's one shared <div id="toast-container"> in every page's HTML
  // (bottom-right corner, fixed position). We just drop new toasts into it.
  document.getElementById("toast-container").appendChild(toast);

  // Auto-dismiss after 3 seconds, exactly as the PRD specifies.
  setTimeout(() => {
    // toast might already be removed by the X button - .remove() on an
    // element not in the DOM is safe (does nothing), so no extra check needed.
    toast.remove();
  }, 3000);
}
