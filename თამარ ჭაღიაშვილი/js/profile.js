/**
 * profile.js — P5
 */

function renderProfileInfo(user) {
  document.getElementById('profile-avatar').textContent = initialsFromName(user.fullName);
  document.getElementById('profile-name').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-company').textContent = user.company || '—';
  document.getElementById('profile-since').textContent =
    `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

  document.getElementById('edit-fullname-input').value = user.fullName;
  document.getElementById('edit-company-input').value = user.company || '';
}

function setupEditProfileForm() {
  const form = document.getElementById('edit-profile-form');
  const fieldName = document.getElementById('field-edit-fullname');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const fullName = document.getElementById('edit-fullname-input').value.trim();
    const company = document.getElementById('edit-company-input').value.trim();

    if (fullName.length < 3) {
      showFieldError(fieldName, 'Full name must be at least 3 characters');
      return;
    }

    const session = getSession();
    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return;

    user.fullName = fullName;
    user.company = company;
    saveUsers(users);

    renderProfileInfo(user);
    showToast('Profile updated \u2713', 'success');
  });
}

function setupChangePasswordForm() {
  const form = document.getElementById('change-password-form');

  const fields = {
    current: document.getElementById('field-current-password'),
    next: document.getElementById('field-new-password'),
    confirm: document.getElementById('field-confirm-new-password'),
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const current = fields.current.querySelector('input').value;
    const next = fields.next.querySelector('input').value;
    const confirm = fields.confirm.querySelector('input').value;

    const session = getSession();
    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return;

    let hasError = false;

    if (current !== user.password) {
      showFieldError(fields.current, 'Current password is incorrect');
      hasError = true;
    }
    if (!isValidPasswordShape(next)) {
      showFieldError(fields.next, 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    } else if (next === current) {
      showFieldError(fields.next, 'New password must be different from the current one');
      hasError = true;
    }
    if (confirm !== next) {
      showFieldError(fields.confirm, 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    user.password = next;
    saveUsers(users);
    form.reset();
    showToast('Password changed \u2713', 'success');
  });
}

function setupResetDataButton() {
  const btn = document.getElementById('reset-data-btn');
  btn.addEventListener('click', async () => {
    const confirmed = window.confirm(
      'Reset CRM data? This replaces all clients with a fresh set from the API. Your account is not affected.'
    );
    if (!confirmed) return;

    btn.disabled = true;
    btn.textContent = 'Resetting...';
    try {
      const fresh = await fetchFreshClientsFromApi();
      saveClients(fresh);
      showToast('CRM data has been reset \u2713', 'success');
    } catch (err) {
      console.error('Reset failed:', err);
      showToast('Could not reset data. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Reset CRM Data';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const session = initProtectedPage('profile');
  if (!session) return;

  const user = getCurrentUser();
  if (!user) return;

  renderProfileInfo(user);
  setupEditProfileForm();
  setupChangePasswordForm();
  setupResetDataButton();
});