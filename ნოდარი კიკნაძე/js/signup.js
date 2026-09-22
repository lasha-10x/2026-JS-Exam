// P1 - Sign Up page logic.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.clearAllErrors(form);

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const company = document.getElementById('company').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;
    const users = Storage.getUsers();

    // Full Name - min 3 chars
    if (fullName.length < 3) {
      UI.showFieldError('fullName', 'err-fullName', 'Full name must be at least 3 characters');
      isValid = false;
    }

    // Email - format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      UI.showFieldError('email', 'err-email', 'Please enter a valid email address');
      isValid = false;
    } else if (users.some(u => u.email.toLowerCase() === email)) {
      // Email - uniqueness
      UI.showFieldError('email', 'err-email', 'An account with this email already exists');
      isValid = false;
    }

    // Password - min 8, letter + digit
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    if (password.length < 8 || !hasLetter || !hasDigit) {
      UI.showFieldError('password', 'err-password', 'Password must be at least 8 characters and contain a letter and a number');
      isValid = false;
    }

    // Confirm Password - must match
    if (password !== confirmPassword) {
      UI.showFieldError('confirmPassword', 'err-confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    // P1.3 - Successful registration sequence
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password,
      company,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.saveUsers(users);

    UI.showToast('Account created successfully! Please log in.', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
});