/**
 * Authentication Logic (Sign Up & Log In)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Demo User if no users exist in localStorage
  const users = getUsers();
  if (users.length === 0) {
    saveUsers([{
      fullName: "Demo User",
      email: "demo@test.com",
      password: "Demo1234!",
      company: "10X Solutions",
      createdAt: new Date().toISOString()
    }]);
  }

  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignUp);
    attachDynamicErrorClearing(signupForm);

    // Live filter for name input (allow only letters, spaces, hyphens, apostrophes)
    if (signupForm.fullName) {
      signupForm.fullName.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\p{L}\s\-']/gu, '');
      });
    }

    // Live filter for email input (allow only Latin letters, numbers, and standard email symbols)
    if (signupForm.email) {
      signupForm.email.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9._%+-@]/g, '');
      });
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    attachDynamicErrorClearing(loginForm);
  }

});

function handleSignUp(event) {
  event.preventDefault();

  //Get form values
  const form = event.target;
  const submitBtn = form.querySelector('.auth-form__submit-btn');

  // Disable button to prevent double-submit
  if (submitBtn) submitBtn.disabled = true;

  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const company = form.company.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  //Clear previous errors
  clearFieldErrors(form);

  let isValid = true;
  const users = getUsers();

  // Full Name: Required, min 3 characters (after trim)
  if (fullName.length < 3) {
    showFieldError('fullName', 'Full name must be at least 3 characters');
    isValid = false;
  }

  // Email: Required, must have @ and . 
  if (!email || !isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  } else {
    // Check if email already exists
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      showFieldError('email', 'An account with this email already exists');
      isValid = false;
    }
  }

  // Password: Min 8 chars, 1 letter, 1 number
  if (!isValidPassword(password)) {
    showFieldError('password', 'Password must be at least 8 characters and contain a letter and a number');
    isValid = false;
  }

  // Confirm Password: Must match Password
  if (confirmPassword !== password || confirmPassword === '') {
    showFieldError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }

  // Re-enable button if validation failed
  if (!isValid) {
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  //If valid, create user and save
  const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    password: password,
    company: company,
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  users.push(newUser);
  saveUsers(users);

  // Show success toast
  showToast('Account created successfully! Please log in.', 'success');

  // Redirect to login page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('.auth-form__submit-btn');

  // Disable button to prevent double-submit
  if (submitBtn) submitBtn.disabled = true;

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  clearFieldErrors(form);

  let isValid = true;

  // Basic empty checks
  if (!email) {
    showFieldError('login-email', 'Email is required');
    isValid = false;
  }
  if (!password) {
    showFieldError('login-password', 'Password is required');
    isValid = false;
  }

  if (!isValid) {
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  const users = getUsers();
  const user = users.find(user => user.email === email);

  if (!user || user.password !== password) {
    showFieldError('login-email', '');
    showFieldError('login-password', 'Invalid email or password');
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  // Login successful -> Create session
  saveSession({
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString()
  });

  showToast('Logged in successfully!', 'success');

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

