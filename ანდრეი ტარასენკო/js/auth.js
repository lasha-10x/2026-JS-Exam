/**
 * Authentication: Sign Up and Login form handling.
 * Detects page by form ID and attaches the correct handler.
 */

/**
 * Validate and submit the Sign Up form.
 */
function handleSignupSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearFormErrors(form);

  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const company = form.company.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  let hasErrors = false;

  if (fullName.length < 3) {
    showFieldError(form, 'fullName', 'Full name must be at least 3 characters');
    hasErrors = true;
  }

  if (!isValidEmail(email)) {
    showFieldError(form, 'email', 'Please enter a valid email address');
    hasErrors = true;
  } else if (findUserByEmail(email)) {
    showFieldError(form, 'email', 'An account with this email already exists');
    hasErrors = true;
  }

  if (!isValidPassword(password)) {
    showFieldError(form, 'password', 'Password must be at least 8 characters and contain a letter and a number');
    hasErrors = true;
  }

  if (password !== confirmPassword) {
    showFieldError(form, 'confirmPassword', 'Passwords do not match');
    hasErrors = true;
  }

  if (hasErrors) return;

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password,
    company,
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  showToast('Account created successfully! Please log in.', 'success');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

/**
 * Validate and submit the Login form.
 */
function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearFormErrors(form);

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  let hasErrors = false;

  if (!email) {
    showFieldError(form, 'email', 'Email is required');
    hasErrors = true;
  }

  if (!password) {
    showFieldError(form, 'password', 'Password is required');
    hasErrors = true;
  }

  if (hasErrors) return;

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    const globalError = form.querySelector('[data-error="global"]');
    if (globalError) globalError.textContent = 'Invalid email or password';
    return;
  }

  const session = {
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString(),
  };

  saveSession(session);
  window.location.href = 'dashboard.html';
}

/**
 * Attach auth handlers based on which page is loaded.
 */
function initAuth() {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
}

initAuth();
