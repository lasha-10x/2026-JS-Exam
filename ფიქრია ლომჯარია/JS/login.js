//Login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = this;
  const email = form.elements['email'].value.trim();
  const password = form.elements['password'].value;

  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError('email', 'Email is required');
    isValid = false;
  } else {
    setValid('email');
  }

  if (password.length === 0) {
    setError('password', 'Password is required');
    isValid = false;
  } else {
    setValid('password');
  }

  if (!isValid) {
    showToast('Please fix the errors above', 'error');
    return;
  }

  // --- The actual "does this user exist" check ---
  const users = loadUsers();
  const match = users.find(u => u.email === email && u.password === password);

  if (!match) {
    setError('email', ' '); // trigger red border without duplicate text
    setError('password', 'Invalid email or password');
    showToast('Login failed', 'error');
    return;
  }

  // --- Success ---
  //localStorage.setItem('currentUser', JSON.stringify(match));
  setSession(match);
  showToast('Welcome back!', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 3000);
});