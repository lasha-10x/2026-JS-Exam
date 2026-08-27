import {getStorageData,saveStorageData} from "./storage.js";

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

const emailError = document.getElementById("loginEmailError");
const passwordError = document.getElementById("loginPasswordError");
const loginError = document.getElementById("loginFormError");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  emailError.textContent = "";
  passwordError.textContent = "";
  loginError.textContent = "";

  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  let hasError = false;

  // Check email
  if (email === "") {
    emailError.textContent = "Email is required";
    emailInput.classList.add("input-error");

    hasError = true;
  }

  // Check password
  if (password === "") {
    passwordError.textContent = "Password is required";
    passwordInput.classList.add("input-error");

    hasError = true;
  }

  if (hasError) {
    return;
  }

  // Load users from localStorage
 const users = getStorageData("crm_users", []);

  // Find user by email
  const user = users.find(function (currentUser) {
    return currentUser.email === email;
  });

  // Check login credentials
  if (!user || user.password !== password) {
    loginError.textContent = "Invalid email or password";
    return;
  }

  // Create user session
  const session = {
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString()
  };

  // Save session
 saveStorageData("crm_session", session);

  window.location.href = "dashboard.html";
});