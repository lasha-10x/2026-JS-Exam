//form validation requirements;

function setError(inputName, message) {
  const input = document.querySelector(`[name="${inputName}"]`);
  const errorSpan = document.getElementById(`${inputName}-error`);

  input.classList.add("input-error");
  input.classList.remove("input-valid");
  errorSpan.textContent = message;
}

function setValid(inputName) {
  const input = document.querySelector(`[name="${inputName}"]`);
  const errorSpan = document.getElementById(`${inputName}-error`);

  input.classList.remove("input-error");
  input.classList.add("input-valid");
  errorSpan.textContent = "";
}

function clearAllValidation(form) {
  form
    .querySelectorAll(".error-message")
    .forEach((span) => (span.textContent = ""));
  form.querySelectorAll("input").forEach((input) => {
    input.classList.remove("input-error", "input-valid");
  });
}

function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}


//setError, setValid, showToast used in profile.js