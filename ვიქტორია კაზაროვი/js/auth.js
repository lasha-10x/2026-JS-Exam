// Handles validation and submission for the public Login and Sign Up forms.

// These references are null on the other authentication page, so each form
// listener is attached only when its matching form exists.
const signupForm = document.getElementById("signup-form");
// This is null on the Login page because that page has no sign-up form.
const loginForm = document.getElementById("login-form");
// This is null on the Sign Up page for the same reason.
let authMessageTimeoutId = null;

// Shared field and form-message helpers.
function showFieldError(input, message) {
  // Add red styling to this input.
  input.classList.add("input-error");

  const formGroup = input.closest(".form-group");
  const errorElement = formGroup.querySelector(".field-error");
  errorElement.textContent = message;
}

function clearFieldError(input) {
  // Remove any old error message for this input.
  input.classList.remove("input-error");

  const formGroup = input.closest(".form-group");
  const errorElement = formGroup.querySelector(".field-error");
  errorElement.textContent = "";
}

// Small validation helpers used by the Sign Up form.
function isValidEmail(email) {
  // Find the two main parts of a basic email address.
  const atIndex = email.indexOf("@");
  const dotIndex = email.indexOf(".", atIndex + 1);

  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
}

function isValidPassword(password) {
  // Test for at least one letter and one number.
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return password.length >= 8 && hasLetter && hasNumber;
}

function showAuthMessage(form, message, type, autoHide) {
  const formMessage = form.querySelector(".form-message");

  if (!formMessage) {
    return;
  }

  if (authMessageTimeoutId !== null) {
    // Avoid an old timer clearing a newer message too soon.
    clearTimeout(authMessageTimeoutId);
    authMessageTimeoutId = null;
  }

  formMessage.textContent = message;
  formMessage.classList.remove("success", "error");

  if (message !== "" && type) {
    formMessage.classList.add(type);
  }

  if (message !== "" && autoHide) {
    authMessageTimeoutId = setTimeout(function () {
      formMessage.textContent = "";
      formMessage.classList.remove("success", "error");
      authMessageTimeoutId = null;
    }, 3000);
  }
}

// Checks every Sign Up field and displays all current errors at once.
function validateSignupForm() {
  const signupInputs = signupForm.querySelectorAll("input");
  signupInputs.forEach(function (input) {
    clearFieldError(input);
  });

  const fullNameInput = document.getElementById("signup-full-name");
  const emailInput = document.getElementById("signup-email");
  const companyInput = document.getElementById("signup-company");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById("signup-confirm-password");

  const fullName = fullNameInput.value.trim();
  // trim() removes accidental spaces around typed text.
  const email = emailInput.value.trim().toLowerCase();
  const company = companyInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  let isValid = true;

  if (fullName.length < 3) {
    showFieldError(fullNameInput, "Full name must be at least 3 characters");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showFieldError(emailInput, "Please enter a valid email address");
    isValid = false;
  } else {
    const users = getUsers();
    // Check saved accounts before allowing a duplicate email.
    const emailExists = users.some(function (user) {
      return user.email === email;
    });

    if (emailExists) {
      showFieldError(emailInput, "An account with this email already exists");
      isValid = false;
    }
  }

  if (!isValidPassword(password)) {
    showFieldError(
      passwordInput,
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  }

  if (confirmPassword !== password) {
    showFieldError(confirmPasswordInput, "Passwords do not match");
    isValid = false;
  }

  return isValid;
}

// Creates a registered user only after the Sign Up form is valid.
if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    // Prevent the browser's normal form post; this demo stores users locally.
    event.preventDefault();

    if (!validateSignupForm()) {
      return;
    }

    const fullName = document.getElementById("signup-full-name").value.trim();
    const email = document
      .getElementById("signup-email")
      .value.trim()
      .toLowerCase();
    const company = document.getElementById("signup-company").value.trim();
    const password = document.getElementById("signup-password").value;

    // Dates and numeric IDs give each local account a stable identity.
    const newUser = {
      id: Date.now(),
      fullName: fullName,
      email: email,
      password: password,
      company: company,
      createdAt: new Date().toISOString()
    };

    const users = getUsers();
    // Add the new account to the list already saved in the browser.
    users.push(newUser);
    saveUsers(users);

    showAuthMessage(
      signupForm,
      "Account created successfully! Please log in.",
      "success",
      false
    );

    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Account Created";

    signupForm.reset();
    // Clear the fields before moving back to Login.

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1500);
  });
}

// Validates credentials, creates the session, and opens the Dashboard.
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    clearFieldError(emailInput);
    clearFieldError(passwordInput);
    showAuthMessage(loginForm, "", "", false);

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    let isValid = true;

    if (email === "") {
      showFieldError(emailInput, "Email is required");
      isValid = false;
    }

    if (password === "") {
      showFieldError(passwordInput, "Password is required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const users = getUsers();
    // find returns the first matching account, or undefined when credentials fail.
    const matchedUser = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!matchedUser) {
      showAuthMessage(
        loginForm,
        "Invalid email or password",
        "error",
        true
      );
      return;
    }

    const session = createSessionForUser(matchedUser);

    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    saveSession(session);
    window.location.href = "dashboard.html";
  });
}
