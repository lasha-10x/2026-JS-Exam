// P5 - Profile Page Logic
document.addEventListener('DOMContentLoaded', () => {
  const session = Storage.getSession();
  const users = Storage.getUsers();
  const user = users.find(u => u.id === session?.userId);

  if (!user) return;

  renderProfileInfo(user);
  setupProfileForms(user);
});

function renderProfileInfo(user) {
  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('infoFullName').textContent = user.fullName;
  document.getElementById('infoEmail').textContent = user.email;
  document.getElementById('infoCompany').textContent = user.company || 'No Company';
  document.getElementById('infoMemberSince').textContent = `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editCompany').value = user.company || '';
}

function setupProfileForms(currentUser) {
  // Edit Profile Form
  const editForm = document.getElementById('editProfileForm');
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.clearAllErrors(editForm);

    const fullName = document.getElementById('editFullName').value.trim();
    const company = document.getElementById('editCompany').value.trim();

    if (fullName.length < 3) {
      UI.showFieldError('editFullName', 'editFullNameError', 'Full name must be at least 3 characters');
      return;
    }

    const users = Storage.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex].fullName = fullName;
      users[userIndex].company = company;
      Storage.saveUsers(users);

      renderProfileInfo(users[userIndex]);
      UI.showToast('Profile updated ✓');
    }
  });

  // Change Password Form
  const passForm = document.getElementById('changePasswordForm');
  passForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.clearAllErrors(passForm);

    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmNewPassword').value;

    let isValid = true;

    if (currentPass !== currentUser.password) {
      UI.showFieldError('currentPassword', 'currentPasswordError', 'Current password is incorrect');
      isValid = false;
    }

    const hasLetter = /[a-zA-Z]/.test(newPass);
    const hasDigit = /[0-9]/.test(newPass);

    if (newPass.length < 8 || !hasLetter || !hasDigit) {
      UI.showFieldError('newPassword', 'newPasswordError', 'Password must be at least 8 characters and contain a letter and a number');
      isValid = false;
    } else if (newPass === currentPass) {
      UI.showFieldError('newPassword', 'newPasswordError', 'New password must be different from the current one');
      isValid = false;
    }

    if (newPass !== confirmPass) {
      UI.showFieldError('confirmNewPassword', 'confirmNewPasswordError', 'Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    const users = Storage.getUsers();
    const user = users.find(u => u.id === currentUser.id);
    if (user) {
      user.password = newPass;
      Storage.saveUsers(users);
      passForm.reset();
      UI.showToast('Password changed ✓');
    }
  });

  // P5.4 - Reset CRM Data: wipe cached clients and reload fresh from the API.
  // Users and the current session are left untouched.
  document.getElementById('resetDataBtn').addEventListener('click', async () => {
    if (!confirm('Reset all CRM client data? This cannot be undone.')) return;

    localStorage.removeItem(Storage.KEYS.CLIENTS);
    try {
      await Data.getOrLoadClients();
      UI.showToast('CRM data reset successfully ✓');
    } catch (err) {
      UI.showToast('Could not reload clients from the API', 'error');
    }
  });
}
