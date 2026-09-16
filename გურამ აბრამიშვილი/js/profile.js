// profile.js — P5 Profile.

document.addEventListener('DOMContentLoaded', function () {
  requireAuth();
  applyTheme();
  renderNav('profile');

  loadProfile();
  bindSaveChanges();
  bindChangePassword();
  bindResetData();
});

function loadProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const initials = user.fullName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('profile-initials').textContent = initials;
  document.getElementById('profile-name').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-company').textContent = user.company || '\u2014';
  document.getElementById('profile-since').textContent = new Date(user.createdAt).toLocaleDateString();

  document.getElementById('edit-fullname').value = user.fullName;
  document.getElementById('edit-company').value = user.company || '';
}

function bindSaveChanges() {
  const form = document.getElementById('save-changes-form');
  attachLiveClear('edit-fullname');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(form);

    const fullName = document.getElementById('edit-fullname').value.trim();
    const company = document.getElementById('edit-company').value.trim();

    if (fullName.length < 3) {
      showFieldError('edit-fullname', 'Full name must be at least 3 characters');
      return;
    }

    const users = getUsers();
    const session = getSession();
    const user = users.find(u => u.id === session.userId);
    if (!user) return;

    user.fullName = fullName;
    user.company = company;
    saveUsers(users);

    showToast('Profile updated \u2713', 'success');
    loadProfile();
  });
}

function bindChangePassword() {
  const form = document.getElementById('change-password-form');
  ['current-password', 'new-password', 'confirm-password'].forEach(attachLiveClear);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(form);

    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    const users = getUsers();
    const session = getSession();
    const user = users.find(u => u.id === session.userId);
    if (!user) return;

    let hasError = false;

    if (current !== user.password) {
      showFieldError('current-password', 'Current password is incorrect');
      hasError = true;
    }

    if (newPass.length < 8 || !hasLetterAndNumber(newPass)) {
      showFieldError('new-password', 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    } else if (newPass === current) {
      showFieldError('new-password', 'New password must be different from the current one');
      hasError = true;
    }

    if (confirmPass !== newPass) {
      showFieldError('confirm-password', 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    user.password = newPass;
    saveUsers(users);
    form.reset();
    showToast('Password changed \u2713', 'success');
  });
}

function bindResetData() {
  document.getElementById('reset-data-btn').addEventListener('click', async function () {
    const confirmed = confirm('Reset all client data? This will reload the original 30 clients.');
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    try {
      const clients = await fetchInitialClients();
      saveClients(clients);
      showToast('Client data reset \u2713', 'success');
    } catch (err) {
      showToast('Could not reset data. Try again.', 'error');
    }
  });
}
