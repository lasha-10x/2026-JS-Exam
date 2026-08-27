// === ვალიდაციის ფუნქცია ===
function validateSignupForm(fullName, email, password, confirmPassword) {
  const errors = {};

  const trimmedName = fullName.trim();
  if (trimmedName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }

  const emailLower = email.trim().toLowerCase();
  const atIndex = emailLower.indexOf('@');
  const dotIndex = emailLower.indexOf('.', atIndex);
  const emailFormatValid = atIndex > 0 && dotIndex > atIndex;

  if (!emailFormatValid) {
    errors.email = 'Please enter a valid email address';
  } else {
    const users = getUsers();
    const alreadyExists = users.some(function (u) {
      return u.email === emailLower;
    });
    if (alreadyExists) {
      errors.email = 'An account with this email already exists';
    }
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (password.length < 8 || !hasLetter || !hasDigit) {
    errors.password = 'Password must be at least 8 characters and contain a letter and a number';
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

// === გვერდის ჩატვირთვისას ===
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    clearFieldErrors(['fullName', 'email', 'password', 'confirmPassword']);

    const errors = validateSignupForm(fullName, email, password, confirmPassword);

    if (Object.keys(errors).length > 0) {
      for (const fieldId in errors) {
        showFieldError(fieldId, errors[fieldId]);
      }
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: trimmedOrEmpty(fullName),
      email: email.trim().toLowerCase(),
      password: password,
      company: trimmedOrEmpty(company),
      createdAt: new Date().toISOString()
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    showToast('Account created successfully! Please log in.', 'success');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1500);
  });
});

function trimmedOrEmpty(value) {
  return value ? value.trim() : '';
}

// === LOGIN (P2) ===
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    clearFieldErrors(['email', 'password']);
    document.getElementById('login-error').textContent = '';

    let hasFieldError = false;
    if (email.trim() === '') {
      showFieldError('email', 'Email is required');
      hasFieldError = true;
    }
    if (password === '') {
      showFieldError('password', 'Password is required');
      hasFieldError = true;
    }
    if (hasFieldError) return;

    const emailLower = email.trim().toLowerCase();
    const users = getUsers();
    const foundUser = users.find(function (u) {
      return u.email === emailLower && u.password === password;
    });

    if (!foundUser) {
      document.getElementById('login-error').textContent = 'Invalid email or password';
      return;
    }

    const session = {
      userId: foundUser.id,
      email: foundUser.email,
      loginAt: new Date().toISOString()
    };
    saveSession(session);

    window.location.href = 'dashboard.html';
  });
});
