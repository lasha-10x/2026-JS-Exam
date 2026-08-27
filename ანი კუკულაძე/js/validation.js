export function isValidEmail(email) {
  const atIndex = email.indexOf("@");
  const dotIndex = email.indexOf(".", atIndex + 1);

  return atIndex > 0 && dotIndex > atIndex + 1;
}

export function showError(
  input,
  errorElement,
  message
) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

export function clearError(
  input,
  errorElement
) {
  input.classList.remove("input-error");
  errorElement.textContent = "";
}