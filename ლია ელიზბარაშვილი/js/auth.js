function isValidEmail(email) {
  const atIndex = email.indexOf('@');
  return atIndex > 0 && email.indexOf('.', atIndex) > atIndex + 1;
}

function isValidPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function getStoredUsers() {
  return JSON.parse(localStorage.getItem('crm_users')) || [];
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors(signupForm);

    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const companyInput = document.getElementById('signup-company');
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm');

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const users = getStoredUsers();

    let hasErrors = false;

    if (fullName.length < 3) {
      setError(nameInput, 'Full name must be at least 3 characters');
      hasErrors = true;
    }

    if (!isValidEmail(email)) {
      setError(emailInput, 'Please enter a valid email address');
      hasErrors = true;
    } else if (users.some(function (user) { return user.email === email; })) {
      setError(emailInput, 'An account with this email already exists');
      hasErrors = true;
    }

    if (!isValidPassword(password)) {
      setError(passwordInput, 'Password must be at least 8 characters and contain a letter and a number');
      hasErrors = true;
    }

    if (confirmInput.value !== password) {
      setError(confirmInput, 'Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) return;

    const newUser = {
      id: Date.now(),
      fullName: fullName,
      email: email,
      password: password,
      company: companyInput.value.trim(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('crm_users', JSON.stringify(users));

    showToast('Account created successfully! Please log in.');

    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1500);
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors(loginForm);

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let hasErrors = false;

    if (email === '') {
      setError(emailInput, 'Email is required');
      hasErrors = true;
    }

    if (password === '') {
      setError(passwordInput, 'Password is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    const user = getStoredUsers().find(function (u) {
      return u.email === email && u.password === password;
    });

    if (!user) {
      showToast('Invalid email or password', 'error');
      return;
    }

    const session = {
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem('crm_session', JSON.stringify(session));

    window.location.href = 'dashboard.html';
  });
}
