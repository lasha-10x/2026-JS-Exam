/* ==========================================================================
   profile.js — Profile page (PRD P5): user info, profile editing,
   password change, and CRM data reset.
   ========================================================================== */

/* ---- P5.1 Info block --------------------------------------------------------- */

function renderProfileInfo() {
  const user = getCurrentUser();
  if (!user) return;

  // Avatar with initials, built from the first letters of fullName.
  const initials = user.fullName
    .split(' ')
    .filter(function (word) { return word !== ''; })
    .slice(0, 2)
    .map(function (word) { return word[0].toUpperCase(); })
    .join('');

  document.getElementById('profile-avatar').textContent = initials;
  document.getElementById('profile-name').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-company').textContent = user.company || '—';
  document.getElementById('profile-since').textContent =
    'Member since ' + new Date(user.createdAt).toLocaleDateString();

  // P5.2 — the edit form is pre-filled with current values.
  document.getElementById('edit-fullname').value = user.fullName;
  document.getElementById('edit-company').value = user.company;
}

/* ---- P5.2 Edit profile --------------------------------------------------------- */

function initEditForm() {
  const form = document.getElementById('edit-form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFieldErrors(form);

    const nameInput = document.getElementById('edit-fullname');
    const companyInput = document.getElementById('edit-company');
    const fullName = nameInput.value.trim();

    if (fullName.length < 3) {
      setFieldError(nameInput, 'Full name must be at least 3 characters');
      return;
    }

    // Find the current user inside crm_users and overwrite the fields.
    const users = getUsers();
    const session = getSession();
    const user = users.find(function (u) { return u.id === session.userId; });
    if (!user) return;

    user.fullName = fullName;
    user.company = companyInput.value.trim();
    saveUsers(users);

    renderProfileInfo(); // name updates on this page immediately
    showToast('Profile updated ✓', 'success');
  });
}

/* ---- P5.3 Change password -------------------------------------------------------- */

function initPasswordForm() {
  const form = document.getElementById('password-form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFieldErrors(form);

    const currentInput = document.getElementById('pw-current');
    const newInput = document.getElementById('pw-new');
    const confirmInput = document.getElementById('pw-confirm');

    const users = getUsers();
    const session = getSession();
    const user = users.find(function (u) { return u.id === session.userId; });
    if (!user) return;

    let hasErrors = false;

    if (currentInput.value !== user.password) {
      setFieldError(currentInput, 'Current password is incorrect');
      hasErrors = true;
    }

    if (!isValidPassword(newInput.value)) {
      setFieldError(newInput,
        'Password must be at least 8 characters and contain a letter and a number');
      hasErrors = true;
    } else if (newInput.value === user.password) {
      setFieldError(newInput, 'New password must be different from the current one');
      hasErrors = true;
    }

    if (confirmInput.value !== newInput.value) {
      setFieldError(confirmInput, 'Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) return;

    user.password = newInput.value;
    saveUsers(users);
    form.reset(); // the form is cleared after success
    showToast('Password changed ✓', 'success');
  });
}

/* ---- P5.4 Reset CRM data ------------------------------------------------------------ */

function initResetButton() {
  document.getElementById('reset-btn').addEventListener('click', async function () {
    const confirmed = confirm('Reset all CRM data? Clients will be reloaded from the API.');
    if (!confirmed) return;

    // Only the clients cache is wiped — accounts and the session stay.
    localStorage.removeItem(STORAGE_KEYS.clients);

    try {
      await loadClients(); // fetches the fresh 30 from the API and saves them
      showToast('CRM data reset ✓', 'success');
    } catch (err) {
      console.error('Reset failed:', err);
      showToast('Could not reload clients. Check your connection.', 'error');
    }
  });
}

/* ---- Page init ------------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', function () {
  renderProfileInfo();
  initEditForm();
  initPasswordForm();
  initResetButton();
});
