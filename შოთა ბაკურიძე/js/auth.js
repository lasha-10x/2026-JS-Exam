// auth.js
// Handles the Sign Up form: validation (P1.2) and the success flow (P1.3).
// Login logic will be appended to this same file in the next step.

// Grab the form once - querying the DOM is relatively slow, so we do it
// once at the top and reuse the reference everywhere below.
const signupForm = document.getElementById("signup-form");

// Only attach the listener if this page actually has a signup form.
// (auth.js will later be shared/loaded by index.html too for login, so
// this guard stops it from crashing on pages without #signup-form.)
if (signupForm) {
  signupForm.addEventListener("submit", handleSignupSubmit);
}

function handleSignupSubmit(event) {
  // Stops the browser's default behavior, which is to reload the page
  // and send the form data to a server. We want to handle it ourselves.
  event.preventDefault();

  // Read the raw values straight from the inputs.
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Run every validation rule and collect ALL errors before deciding
  // anything. The PRD requires showing every problem at once, not
  // stopping at the first one.
  const errors = validateSignupForm({ fullName, email, password, confirmPassword });

  // Always clear old error messages first, then re-render whatever
  // errors exist now. This makes fixed fields' errors disappear on
  // the next submit, per P0.4.
  clearFieldErrors(["fullName", "email", "password", "confirmPassword"]);

  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    errorKeys.forEach((field) => showFieldError(field, errors[field]));
    return; // Stop here - do NOT create the account.
  }

  // --- All valid: create the account (P1.3, exact order) ---

  const newUser = {
    id: Date.now(), // unique-enough id: current timestamp in ms
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(), // stored lowercase, per the PRD
    password: password, // plaintext - see the security note below
    company: company.trim(),
    createdAt: new Date().toISOString(),
  };

  const users = getUsers(); // from storage.js
  users.push(newUser);
  saveUsers(users); // writes the updated array back to localStorage

  showToast("Account created successfully! Please log in.", "success");

  // Wait 1.5s so the user actually sees the toast, then send them to login.
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// Runs all 4 checked fields' rules and returns an object like
// { email: "Please enter a valid email address" } containing only the
// fields that actually failed - an empty object means "fully valid".
function validateSignupForm({ fullName, email, password, confirmPassword }) {
  const errors = {};

  if (fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  }

  // A minimal but PRD-compliant email shape check: has "@", and a "."
  // somewhere after that "@". We don't need a full RFC-grade regex here -
  // the PRD only asks for this simple rule.
  const atIndex = email.indexOf("@");
  const hasDotAfterAt = atIndex !== -1 && email.indexOf(".", atIndex) !== -1;
  if (!email.trim() || !hasDotAfterAt) {
    errors.email = "Please enter a valid email address";
  } else {
    // Only check for duplicates if the email is at least well-formed -
    // no point searching for a malformed address.
    const users = getUsers();
    const emailLower = email.trim().toLowerCase();
    const alreadyExists = users.some((u) => u.email === emailLower);
    if (alreadyExists) {
      errors.email = "An account with this email already exists";
    }
  }

  // Password: at least 8 chars, containing at least one letter AND one digit.
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (password.length < 8 || !hasLetter || !hasDigit) {
    errors.password =
      "Password must be at least 8 characters and contain a letter and a number";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

// ============================================================
// LOGIN (index.html)
// ============================================================

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", handleLoginSubmit);
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  clearFieldErrors(["email", "password"]);

  // Step 1: basic "did you type anything" checks.
  let hasError = false;
  if (!email.trim()) {
    showFieldError("email", "Email is required");
    hasError = true;
  }
  if (!password) {
    showFieldError("password", "Password is required");
    hasError = true;
  }
  if (hasError) return;

  // Step 2: look for a user whose email AND password both match.
  // find() returns the first matching object, or undefined if none match.
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();
  const matchedUser = users.find(
    (u) => u.email === emailLower && u.password === password
  );

  if (!matchedUser) {
    // Deliberately vague on purpose - the PRD does NOT want us revealing
    // whether the email exists or the password was wrong. Showing that
    // detail would let an attacker discover which emails are registered.
    showFieldError("password", "Invalid email or password");
    return;
  }

  // Step 3: success - create the session and go to the dashboard.
  const session = {
    userId: matchedUser.id,
    email: matchedUser.email,
    loginAt: new Date().toISOString(),
  };
  saveSession(session);

  window.location.href = "dashboard.html";
}
