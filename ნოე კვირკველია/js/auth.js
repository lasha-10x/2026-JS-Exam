// auth.js
//
// Form logic for signup.html (Sign Up) and index.html (Login).
// main.js decides which of these two functions to call, based on
// which page is currently loaded.

import { Storage } from "./storage.js";
import { UI } from "./ui.js";

function isValidEmailFormat(email) {
  // Very simple check: something, then @, then something, then a dot,
  // then something. Good enough for this project — we are not trying
  // to fully validate every real-world email address.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPasswordFormat(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  return password.length >= 8 && hasUpperCase && hasNumber && hasSymbol;
}

// Turns a password into "weak", "medium", "strong", or null (null means
// the field is empty, so we don't show a meter at all).
//
// - weak: doesn't even meet the minimum rule above (8+ chars, a capital
//   letter, a number, and a symbol).
// - medium: meets the minimum rule.
// - strong: meets the minimum rule AND is nice and long (12+ chars).
function getPasswordStrength(password) {
  if (!password) {
    return null;
  }

  if (!isValidPasswordFormat(password)) {
    return "weak";
  }

  return password.length >= 12 ? "strong" : "medium";
}

export function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) {
    return;
  }

  // Update the weak/medium/strong meter every time the user types in
  // the password field.
  form.password.addEventListener("input", function () {
    UI.showPasswordStrength("password", getPasswordStrength(form.password.value));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    UI.clearFieldErrors(form);

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const company = form.company.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const existingUsers = Storage.getUsers();

    // We check every field and collect all the errors at once,
    // instead of stopping at the first one.
    let formIsValid = true;

    if (fullName.length < 3) {
      UI.showFieldError("fullName", "Full name must be at least 3 characters");
      formIsValid = false;
    }

    if (!isValidEmailFormat(email)) {
      UI.showFieldError("email", "Please enter a valid email address");
      formIsValid = false;
    } else {
      const emailAlreadyUsed = existingUsers.some((user) => user.email === email);
      if (emailAlreadyUsed) {
        UI.showFieldError("email", "An account with this email already exists");
        formIsValid = false;
      }
    }

    if (!isValidPasswordFormat(password)) {
      UI.showFieldError("password", "Password must be at least 8 characters and include a capital letter, a number, and a symbol");
      formIsValid = false;
    }

    if (confirmPassword !== password) {
      UI.showFieldError("confirmPassword", "Passwords do not match");
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName,
      email: email,
      password: password,
      company: company,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    Storage.saveUsers(existingUsers);

    UI.showToast("Account created successfully! Please log in.", "success");

    // Give the user a moment to read the toast before sending them to
    // the login page.
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1500);
  });
}

export function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    UI.clearFieldErrors(form);

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    let formIsValid = true;

    if (!email) {
      UI.showFieldError("email", "Email is required");
      formIsValid = false;
    }

    if (!password) {
      UI.showFieldError("password", "Password is required");
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    const matchingUser = Storage.getUsers().find((user) => user.email === email && user.password === password);

    if (!matchingUser) {
      // On purpose, we don't say whether the email or the password was
      // wrong — that's a common security practice so an attacker can't
      // use the error message to figure out which emails are registered.
      UI.showFieldError("password", "Invalid email or password");
      return;
    }

    Storage.saveSession({
      userId: matchingUser.id,
      email: matchingUser.email,
      loginAt: new Date().toISOString(),
    });

    window.location.href = "dashboard.html";
  });
}
