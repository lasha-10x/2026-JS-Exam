// login.js
// Handles login form validation and session creation for index.html
//
// Depends on: storage.js (window.CRMStorage), toast.js (window.showToast)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return; // safety: don't blow up if this script loads elsewhere

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error-box');
  const errorList = document.getElementById('login-error-list');

  form.addEventListener('submit', handleSubmit);

  function handleSubmit(e) {
      e.preventDefault();
      clearErrors();

      const email = emailInput.value.trim();
      const password = passwordInput.value; // don't trim passwords

      const errors = [];

      // Rule 1: email required
      if (!email) {
          errors.push('Email is required');
          markFieldError(emailInput);
      }

      // Rule 2: password required
      if (!password) {
          errors.push('Password is required');
          markFieldError(passwordInput);
      }

      // If either required field is empty, stop here — don't attempt login yet
      if (errors.length > 0) {
          showErrors(errors);
          return;
      }

      attemptLogin(email, password);
  }

  function attemptLogin(email, password) {
      const users = CRMStorage.getUsers();

      const matchedUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matchedUser) {
          // Generic message on purpose — never reveal whether the
          // email exists or the password was wrong.
          markFieldError(emailInput);
          markFieldError(passwordInput);
          showErrors(['Invalid email or password']);
          return;
      }

      createSession(matchedUser);
  }

  function createSession(user) {
      const session = {
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
          loginAt: new Date().toISOString(),
      };

      CRMStorage.setSession(session);

      window.showToast(`Welcome back, ${user.fullName.split(' ')[0]}!`, 'success');

      // Small delay so the toast is visible before the page navigates away,
      // consistent with the 1.5s pattern used in the signup success flow.
      setTimeout(() => {
          window.location.href = 'dashboard.html';
      }, 1500);
  }

  function markFieldError(inputEl) {
      inputEl.classList.add('input-error');
  }

  function showErrors(messages) {
      messages.forEach((msg) => {
          const li = document.createElement('li');
          li.innerText = msg;
          errorList.appendChild(li);
      });
      errorBox.style.display = 'block';
  }

  function clearErrors() {
      errorList.innerHTML = '';
      errorBox.style.display = 'none';
      emailInput.classList.remove('input-error');
      passwordInput.classList.remove('input-error');
  }
});