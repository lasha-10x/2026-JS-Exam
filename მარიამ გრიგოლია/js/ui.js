//UI helpers: toasts + form field errors!

const toastContainer = document.querySelector(".toast-container");

export function showToast(message, type = "success") {
  if (!toastContainer) return;

  //building toast element styles
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  //class name toast--success or toast--error from down

  const text = document.createElement("span");
  text.textContent = message;

  //X button
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "toast__close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Close notification");

  toast.append(text, closeBtn);
  toastContainer.append(toast);

  //remove it after 3 sec. PRD rule:)
  const timerId = setTimeout(() => toast.remove(), 3000);

  //OR remove when clicked on X btn (plus cancel the timeout-MUST)
  closeBtn.addEventListener("click", () => {
    clearTimeout(timerId);
    toast.remove();
  });
}

//RED ERROR message under field + red border on input

export function showFieldError(fieldId, message) {
  const input = document.querySelector(`#${fieldId}`);
  const errorBox = document.querySelector(`#${fieldId}-error`);

  if (input) input.classList.add("input-error");
  if (errorBox) errorBox.textContent = message;
}

//Clear error function that is called each time form is submitted
//so old errors disappear when field becomes valid
export function clearErrors(form) {
  form.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
  form.querySelectorAll(".form__error").forEach((errorBox) => {
    errorBox.textContent = "";
  });
}

//rececives as an argument whole html form

//Bonus: clear filed errors when user starts fixing it
export function clearErrorOnInput(form) {
  form.querySelectorAll(".form__input").forEach((input) => {
    input.addEventListener("input", () => {
      // remove red border
      input.classList.remove("input-error");

      // clear this field's own error message
      const errorBox = document.querySelector(`#${input.id}-error`);
      if (errorBox) errorBox.textContent = "";

      // also clear the form-level error
      const globalError = form.querySelector(".form__error--global");
      if (globalError) globalError.textContent = "";
    });
  });
}

//Form-level error (e.g invalid email) 
//writes into <p class="form__error form__error--global"

export function showFormError(form, message){
  const globalError = form.querySelector(".form__error--global");
  if(globalError) globalError.textContent = message;
}
//this message will be given from login 


//=== MODAL helpers 
export function openModal(modal){
  modal.hidden = false;
}
//i use html hidden attribute here, so when modal.hidden = false 
//modal appears, and when it is true, it hides :) 

export function closeModal(modal){
  modal.hidden = true;
}

//coz i use hidden attribute(open/hide is a single boolean)
//.modal[hiddne] display none makes it work here

/**
 * Split an element's text into <span> letters so each can animate separately.
 * @param {HTMLElement} element
 * @param {number} step - delay between letters, in seconds
 */
export function animateLetters(element, step = 0.06) {
  if (!element) return;

  const text = element.textContent;

  // Keep the full text for screen readers, hide the letter spans from them
  element.setAttribute("aria-label", text);
  element.textContent = "";

  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = char === " " ? "\u00A0" : char;   // keep spaces visible
    span.style.animationDelay = `${index * step}s`;       // the stagger
    span.setAttribute("aria-hidden", "true");
    element.append(span);
  });
}
