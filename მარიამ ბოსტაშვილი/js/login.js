// Check required fields
function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}

// Find the user and create a session
function attemptLogin({ email, password }) {
  const errors = validateLogin({ email, password });

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = getUsers().find(function (candidate) {
    return candidate.email === normalizedEmail;
  });

  if (!user || user.password !== password) {
    return {
      formError: 'Invalid email or password',
    };
  }

  // Save the current session
  const sessionSaved = saveSession({
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString(),
  });

  if (!sessionSaved) {
    return {
      formError: 'Could not save your session. Check browser storage and try again.',
    };
  }

  return { user };
}

// Initialize the login page
document.addEventListener('DOMContentLoaded', function () {
  if (!initPublicPage()) {
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginErr');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    clearErrors();

    if (loginError) {
      loginError.textContent = '';
      loginError.classList.remove('show');
    }

    const result = attemptLogin({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    });

    // Show required field errors
    if (result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        showError(field, message);
      }

      return;
    }

    // Show a generic authentication error
    if (result.formError) {
      if (loginError) {
        loginError.textContent = result.formError;
        loginError.classList.add('show');
      } else {
        showError('password', result.formError);
      }

      return;
    }

    // Open the dashboard after successful login
    window.location.href = 'dashboard.html';
  });

  clearErrorOnInput(loginForm);
});
