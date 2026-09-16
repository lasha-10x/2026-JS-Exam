// auth.js — P1 Sign Up and P2 Login logic.

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  ['fullName', 'email', 'password', 'confirmPassword'].forEach(attachLiveClear);
  bindPasswordStrengthMeter();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(form);

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const company = document.getElementById('company').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const users = getUsers();
    let hasError = false;

    if (fullName.length < 3) {
      showFieldError('fullName', 'Full name must be at least 3 characters');
      hasError = true;
    }

    if (!isValidEmail(email)) {
      showFieldError('email', 'Please enter a valid email address');
      hasError = true;
    } else if (users.some(u => u.email === email)) {
      showFieldError('email', 'An account with this email already exists');
      hasError = true;
    }

    if (password.length < 8 || !hasLetterAndNumber(password)) {
      showFieldError('password', 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    }

    if (confirmPassword !== password) {
      showFieldError('confirmPassword', 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password,
      company,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    showToast('Account created successfully! Please log in.', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}

// Bonus: live password strength meter (weak / medium / strong) on the Sign Up form
function bindPasswordStrengthMeter() {
  const passwordField = document.getElementById('password');
  const meter = document.getElementById('password-strength-meter');
  const label = document.getElementById('password-strength-label');
  if (!passwordField || !meter || !label) return;

  const segments = meter.querySelectorAll('span');

  passwordField.addEventListener('input', function () {
    const value = passwordField.value;

    if (!value) {
      segments.forEach(s => { s.className = ''; });
      label.textContent = '';
      label.className = 'strength-label';
      return;
    }

    const level = getPasswordStrength(value);
    const fillCount = level === 'weak' ? 1 : level === 'medium' ? 2 : 3;

    segments.forEach((s, i) => {
      s.className = i < fillCount ? 'strength-' + level : '';
    });

    label.textContent = level.charAt(0).toUpperCase() + level.slice(1) + ' password';
    label.className = 'strength-label strength-' + level;
  });
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  ['email', 'password'].forEach(attachLiveClear);

  const rememberCheckbox = document.getElementById('remember-me');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(form);
    showFormError('');

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    let hasError = false;
    if (!email) {
      showFieldError('email', 'Email is required');
      hasError = true;
    }
    if (!password) {
      showFieldError('password', 'Password is required');
      hasError = true;
    }
    if (hasError) return;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      showFormError('Invalid email or password');
      return;
    }

    const session = {
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString(),
      // Bonus: session expiry — 7 days if "Remember me" is checked, 2 hours otherwise
      expiresAt: Date.now() + (rememberCheckbox && rememberCheckbox.checked ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000)
    };

    // Bonus: "Remember me" — when unchecked, session goes in sessionStorage (clears on tab close)
    if (rememberCheckbox && !rememberCheckbox.checked) {
      sessionStorage.setItem('crm_session', JSON.stringify(session));
    } else {
      saveSession(session);
    }

    window.location.href = 'dashboard.html';
  });
}

function showFormError(message) {
  const el = document.getElementById('form-error');
  if (el) el.textContent = message;
}
