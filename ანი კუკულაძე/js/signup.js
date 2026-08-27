import { showToast } from "./toast.js";

import {getStorageData,saveStorageData} from "./storage.js";

import {isValidEmail,showError,clearError}from "./validation.js";

const signupForm = document.getElementById("signupForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const companyInput = document.getElementById("company");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById(
  "confirmPassword"
);

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById(
  "confirmPasswordError"
);

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const company = companyInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  clearErrors();

  let isValid = true;

  // Full Name validation
  if (fullName.length < 3) {
    showError(
      fullNameInput,
      fullNameError,
      "Full name must be at least 3 characters"
    );

    isValid = false;
  }

  // Email validation
  if (!isValidEmail(email)) {
    showError(
      emailInput,
      emailError,
      "Please enter a valid email address"
    );

    isValid = false;
  }

  // Password validation
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (
    password.length < 8 ||
    !hasLetter ||
    !hasNumber
  ) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters and contain a letter and a number"
    );

    isValid = false;
  }

  // Confirm Password validation
  if (confirmPassword !== password) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match"
    );

    isValid = false;
  }

  // Stop if any field is invalid
  if (!isValid) {
    return;
  }

  // Load existing users
  const users = getStorageData("crm_users", []);

  // Duplicate email validation
  const emailExists = users.some(function (user) {
    return user.email.toLowerCase() === email;
  });

  if (emailExists) {
    showError(
      emailInput,
      emailError,
      "This email is already registered."
    );

    return;
  }

  // New User object
  const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    company: company,
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  saveStorageData("crm_users", users);

  showToast(
    "Account created successfully! Please log in.",
    "success"
  );

  signupForm.reset();

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);
});

function clearErrors() {
  clearError(
    fullNameInput,
    fullNameError
  );

  clearError(
    emailInput,
    emailError
  );

  clearError(
    passwordInput,
    passwordError
  );

  clearError(
    confirmPasswordInput,
    confirmPasswordError
  );
}