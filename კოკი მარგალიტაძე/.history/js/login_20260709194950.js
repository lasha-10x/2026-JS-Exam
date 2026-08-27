// login.js
// Handles login form validation and session creation for index.html
//
// Depends on: storage.js (Storage.get/set/remove), toast.js (Toast.show)
// If your actual API names differ, this file only needs those calls swapped.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (!form) return; // safety: don't blow up if this script loads elsewhere
  
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorEl = document.getElementById('login-error'); // single generic error slot
  
    form.addEventListener('submit', handleSubmit);
  
    function handleSubmit(e) {
      e.preventDefault();
      clearError();
  
      const email = emailInput.value.trim();
      const password = passwordInput.value; // don't trim passwords
  
      // --- Rule 1: email format ---
      // --- Rule 2: password not empty ---
      // Per PRD: these are surfaced as ONE generic message, not per-field,
      // so a bad actor can't use the form to enumerate which part failed.
      if (!isValidEmail(email) || password.length === 0) {
        showError('Invalid email or password');
        return;
      }
  
      attemptLogin(email, password);
    }
  
    function attemptLogin(email, password) {
      const users = Storage.get('crm_users') || [];
  
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
  
      if (!matchedUser) {
        // Same generic message here too — never reveal whether the
        // email exists or the password was wrong.
        showError('Invalid email or password');
        return;
      }
  
      createSession(matchedUser);
    }
  
    function createSession(user) {
      const session = {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        company: user.company,
        loginAt: new Date().toISOString(),
      };
  
      Storage.set('crm_session', session);
  
      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show(`Welcome back, ${user.fullName.split(' ')[0]}!`, 'success');
      }
  
      window.location.href = 'dashboard.html';
    }
  
    function isValidEmail(email) {
      // Simple, PRD-agnostic pattern — swap for your exact signup regex
      // if the PRD specifies one, so login/signup validation stay consistent.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    function showError(message) {
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      } else if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show(message, 'error');
      } else {
        alert(message); // last-resort fallback, shouldn't normally hit this
      }
    }
  
    function clearError() {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }
  });