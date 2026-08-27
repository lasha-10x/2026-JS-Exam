"use strict";

/* --- Global Destructive Action Confirmation --- */
(function initDestructiveConfirm() {
  /* --- Modal references support one shared confirmation UI for delete actions. --- */
  const modal = document.querySelector(".js-destructive-confirm");
  const confirmButton = modal?.querySelector(".js-global-delete-confirm");
  const cancelButtons = modal?.querySelectorAll(".js-global-delete-cancel");
  const confirmedTargets = new WeakSet();
  let pendingTarget = null;

  if (!modal || !confirmButton) return;

  /* --- Detects destructive buttons while excluding custom delete flows. --- */
  /* --- Determines if an interactive element represents a standard delete control based on dataset attributes, text, or class patterns. --- */
  const isDeleteControl = (element) => {
    if (!element || element.dataset.skipDeleteConfirm !== undefined) return false;
    if (element.dataset.modalTarget === "#delete-account-modal") return false;
    if (element.closest("[data-skip-delete-confirm]")) return false;
    if (element.closest("#global-delete-confirm-modal")) return false;
    if (element.closest("#delete-client-modal")) return false;
    if (element.closest("#delete-task-modal")) return false;
    if (element.closest("#delete-note-modal")) return false;
    if (element.dataset.taskAction === "delete") return false;

    const text = element.textContent || "";
    const label = element.getAttribute("aria-label") || "";
    const action = element.dataset.taskAction || element.dataset.clientAction || "";
    const classes = element.className || "";

    return /delete|remove/i.test(`${text} ${label} ${action} ${classes}`);
  };

  /* --- Opens the shared confirmation before the original delete click continues. --- */
  /* --- Displays the global confirmation modal, updates visibility attributes, and focuses the confirm button. --- */
  const openModal = () => {
    modal.hidden = false;
    modal.dataset.modalState = "open";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => confirmButton.focus({ preventScroll: true }));
  };

  /* --- Resets pending delete state after confirm or cancel. --- */
  /* --- Hides the confirmation modal, cleans up body scroll states, and clears the stored pending target reference. --- */
  const closeModal = () => {
    modal.hidden = true;
    modal.dataset.modalState = "closed";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    pendingTarget = null;
  };
  /* --- Captures global click events in the capture phase to intercept and delay delete actions until user confirmation. --- */
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest("button, a");

      if (!isDeleteControl(target)) return;

      if (confirmedTargets.has(target)) {
        confirmedTargets.delete(target);
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      pendingTarget = target;
      openModal();
    },
    true,
  );
  /* --- Handles confirmation clicks by closing the modal, marking the target as verified, and re-triggering its click action. --- */
  confirmButton.addEventListener("click", () => {
    const target = pendingTarget;
    closeModal();

    if (!target) return;

    confirmedTargets.add(target);
    target.click();
  });
  /* --- Attaches click event listeners to all cancel buttons to dismiss the confirmation modal. --- */
  cancelButtons.forEach((button) => button.addEventListener("click", closeModal));
  /* --- Listens for keyboard events to close the active confirmation modal when the Escape key is pressed. --- */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      event.preventDefault();
      closeModal();
    }
  });
})();
