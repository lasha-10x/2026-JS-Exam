console.log("signup.js loaded");
const signupForm = document.querySelector("#signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

function handleSignup(event) {
  event.preventDefault();

  clearSignupErrors();

  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#signupEmail").value.trim().toLowerCase();
  const company = document.querySelector("#company").value.trim();
  const password = document.querySelector("#signupPassword").value;
  const confirmPassword = document.querySelector("#confirmPassword").value;

  const users = getStorageItem("crm_users", []);

  let isValid = true;

  // Full Name
  if (fullName.length < 3) {
    showSignupError(
      "fullName",
      "fullNameError",
      "Full name must be at least 3 characters"
    );
    isValid = false;
  }

  // Email
  if (!isValidEmail(email)) {
    showSignupError(
      "signupEmail",
      "signupEmailError",
      "Please enter a valid email address"
    );
    isValid = false;
  } else {
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
      showSignupError(
        "signupEmail",
        "signupEmailError",
        "An account with this email already exists"
      );
      isValid = false;
    }
  }

  // Password
  if (!isValidPassword(password)) {
    showSignupError(
      "signupPassword",
      "signupPasswordError",
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  }

  // Confirm Password
  if (confirmPassword === "" || confirmPassword !== password) {
    showSignupError(
      "confirmPassword",
      "confirmPasswordError",
      "Passwords do not match"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    company,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  setStorageItem("crm_users", users);

  showToast(
    "Account created successfully! Please log in.",
    "success"
  );

  signupForm.reset();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

function isValidEmail(email) {
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  return atIndex > 0 && dotIndex > atIndex + 1;
}

function isValidPassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    password.length >= 8 &&
    hasLetter &&
    hasNumber
  );
}

function showSignupError(inputId, errorId, message) {
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`#${errorId}`);

  input.classList.add("input-error");
  error.textContent = message;
}

function clearSignupErrors() {
  const errors = document.querySelectorAll(".field-error");
  const inputs = document.querySelectorAll("#signupForm input");

  errors.forEach(error => {
    error.textContent = "";
  });

  inputs.forEach(input => {
    input.classList.remove("input-error");
  });
}