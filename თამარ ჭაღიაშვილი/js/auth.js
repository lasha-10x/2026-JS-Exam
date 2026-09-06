/**
 * auth.js
 * P1 (Sign Up) and P2 (Login) logic. 
 */

// -- P1 Sign Up --

function setupSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const fields = {
    fullName: document.getElementById('field-fullname'),
    email: document.getElementById('field-email'),
    company: document.getElementById('field-company'),
    password: document.getElementById('field-password'),
    confirmPassword: document.getElementById('field-confirm-password'),
  };

  wireLiveClear(fields.fullName.querySelector('input'), fields.fullName, (v) => v.trim().length >= 3);
  wireLiveClear(fields.email.querySelector('input'), fields.email, (v) => isValidEmailShape(v.trim()));
  wireLiveClear(fields.password.querySelector('input'), fields.password, isValidPasswordShape);
  wireLiveClear(fields.confirmPassword.querySelector('input'), fields.confirmPassword, (v) => {
    return v === fields.password.querySelector('input').value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const fullName = fields.fullName.querySelector('input').value;
    const email = fields.email.querySelector('input').value.trim().toLowerCase();
    const company = fields.company.querySelector('input').value.trim();
    const password = fields.password.querySelector('input').value;
    const confirmPassword = fields.confirmPassword.querySelector('input').value;

    let hasError = false;
    const users = getUsers();

    if (fullName.trim().length < 3) {
      showFieldError(fields.fullName, 'Full name must be at least 3 characters');
      hasError = true;
    }

    if (!isValidEmailShape(email)) {
      showFieldError(fields.email, 'Please enter a valid email address');
      hasError = true;
    } else if (users.some((u) => u.email.toLowerCase() === email)) {
      showFieldError(fields.email, 'An account with this email already exists');
      hasError = true;
    }

    if (!isValidPasswordShape(password)) {
      showFieldError(fields.password, 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    }

    if (confirmPassword !== password) {
      showFieldError(fields.confirmPassword, 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email,
      password, 
      company,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    showToast('Account created successfully! Please log in.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}


// --  P2 Login --

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const fields = {
    email: document.getElementById('field-login-email'),
    password: document.getElementById('field-login-password'),
  };

  wireLiveClear(fields.email.querySelector('input'), fields.email, (v) => v.trim().length > 0);
  wireLiveClear(fields.password.querySelector('input'), fields.password, (v) => v.length > 0);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const email = fields.email.querySelector('input').value.trim();
    const password = fields.password.querySelector('input').value;

    let hasError = false;

    if (email.length === 0) {
      showFieldError(fields.email, 'Email is required');
      hasError = true;
    }
    if (password.length === 0) {
      showFieldError(fields.password, 'Password is required');
      hasError = true;
    }
    if (hasError) return;

    const users = getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      fields.email.classList.add('has-error');
      showFieldError(fields.password, 'Invalid email or password');
      return;
    }

    const session = {
      userId: match.id,
      email: match.email,
      loginAt: new Date().toISOString(),
    };
    saveSession(session);
    window.location.href = 'dashboard.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSignupForm();
  setupLoginForm();
});