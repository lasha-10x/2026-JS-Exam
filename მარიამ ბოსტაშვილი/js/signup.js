// signup.js

const signupForm = document.getElementById('signupForm');

initPublicPage();
clearErrorOnInput(signupForm);

function isValidPassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= MIN_PASSWORD_LENGTH && hasLetter && hasNumber;
}

// ---------- submit ----------
signupForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // read the values (INSIDE the function!)
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  clearErrors();
  let isValid = true;

  // Full Name
  if (fullName.length < 3) {
    showError('fullName', 'Full name must be at least 3 characters');
    isValid = false;
  }

  // Email
  const emailLower = email.toLowerCase();
  if (!isValidEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  } else if (getUsers().some((u) => u.email === emailLower)) {
    showError('email', 'An account with this email already exists');
    isValid = false;
  }

  // Password
  if (!isValidPassword(password)) {
    showError(
      'password',
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain a letter and a number`,
    );
    isValid = false;
  }

  // Confirm Password
  if (confirm !== password) {
    showError('confirm', 'Passwords do not match');
    isValid = false;
  }

  if (!isValid) return;

  const newUser = {
    id: Date.now(),
    fullName,
    email: emailLower,
    password,
    company,
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(newUser);

  if (!saveUsers(users)) {
    showToast('Could not create the account. Check browser storage and try again.', 'error');
    return;
  }

  showToast('Account created successfully! Please log in.', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
});
