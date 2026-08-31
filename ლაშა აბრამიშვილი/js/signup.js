const signupForm = document.querySelector("form");
const fullNameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const companyInput = document.querySelector("#company");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

// The page now uses JavaScript validation instead of browser validation.
signupForm.noValidate = true;

// Validation helpers clear old feedback and mark every invalid field together.
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  const formInputs = document.querySelectorAll(".form-input");

  errorMessages.forEach(function (errorMessage) {
    errorMessage.textContent = "";
  });

  formInputs.forEach(function (input) {
    input.classList.remove("input-error");
  });
}

function showError(input, message) {
  const errorMessage = input.parentElement.querySelector(".error-message");

  errorMessage.textContent = message;
  input.classList.add("input-error");
}

function validateForm() {
  let isValid = true;
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (fullName.length < 3) {
    showError(fullNameInput, "Full name must be at least 3 characters");
    isValid = false;
  }

  const atPosition = email.indexOf("@");
  const dotPosition = email.indexOf(".", atPosition + 1);

  if (email === "" || atPosition === -1 || dotPosition === -1) {
    showError(emailInput, "Please enter a valid email address");
    isValid = false;
  }

  const containsLetter = /[a-zA-Z]/.test(password);
  const containsNumber = /[0-9]/.test(password);

  if (password.length < 8 || !containsLetter || !containsNumber) {
    showError(
      passwordInput,
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  }

  if (confirmPassword !== password) {
    showError(confirmPasswordInput, "Passwords do not match");
    isValid = false;
  }

  return isValid;
}

// A valid submission checks duplicates before creating and saving the user.
signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  if (!validateForm()) {
    return;
  }

  const users = getUsers();
  const email = emailInput.value.trim().toLowerCase();
  const emailAlreadyExists =
    email === "demo@test.com" ||
    users.some(function (user) {
      return (user.email || "").toLowerCase() === email;
    });

  if (emailAlreadyExists) {
    showError(emailInput, "An account with this email already exists");
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value,
    company: companyInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  signupForm.reset();
  showMessage("Account created successfully! Please log in.", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
