// P2 - Login page logic.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.clearAllErrors(form);
    UI.hideGlobalError('login-error');

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    let isValid = true;

    // P2.2 - required-field checks
    if (!email) {
      UI.showFieldError('email', 'err-email', 'Email is required');
      isValid = false;
    }
    if (!password) {
      UI.showFieldError('password', 'err-password', 'Password is required');
      isValid = false;
    }
    if (!isValid) return;

    // P2.2 - credential check. Deliberately generic on failure: never reveal
    // whether the email exists or the password was wrong (security practice).
    const users = Storage.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (!user) {
      UI.showGlobalError('login-error', 'Invalid email or password');
      return;
    }

    // P2.3 - successful login
    const session = {
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString()
    };
    Storage.setSession(session);

    window.location.href = 'dashboard.html';
  });
});
