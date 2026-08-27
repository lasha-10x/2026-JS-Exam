/**
 * Profile page logic: display user info, edit profile, change password, reset data.
 */

/**
 * Get initials from full name (first letter of each word, max 2).
 */
function getInitials(fullName) {
  return fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Render the profile information block.
 */
function renderProfileInfo() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('profile-avatar').textContent = getInitials(user.fullName);
  document.getElementById('profile-name').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-company').textContent = user.company || 'No company';
  document.getElementById('profile-member-since').textContent =
    `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

  document.getElementById('edit-fullName').value = user.fullName;
  document.getElementById('edit-company').value = user.company || '';
  document.getElementById('profile-form-btn').disabled = true;
}

/**
 * Handle profile form input changes to enable/disable the save button.
 */
function handleProfileFormChanges() {
  const fullName = document.getElementById('edit-fullName').value.trim();
  const company = document.getElementById('edit-company').value.trim();
  const user = getCurrentUser();
  const btn = document.getElementById('profile-form-btn');
  const hasChanges = (fullName !== user.fullName || company !== (user.company || ''));
  btn.disabled = !hasChanges;
}

/**
 * Handle profile update form submission.
 */
function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearFormErrors(form);

  const fullName = form.fullName.value.trim();
  const company = form.company.value.trim();

  if (fullName.length < 3) {
    const errorEl = form.querySelector('[data-error="fullName"]');
    const inputEl = form.querySelector('[name="fullName"]');
    if (errorEl) errorEl.textContent = 'Full name must be at least 3 characters';
    if (inputEl) inputEl.classList.add('input-error');
    return;
  }

  const session = getSession();
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === session.userId);

  if (userIndex === -1) return;

  users[userIndex].fullName = fullName;
  users[userIndex].company = company;
  saveUsers(users);

  renderProfileInfo();
  showToast('Profile updated ✓', 'success');
}

/**
 * Handle password change form submission.
 */
function handlePasswordSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearFormErrors(form);

  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  const confirmNewPassword = form.confirmNewPassword.value;

  const user = getCurrentUser();
  if (!user) return;

  let hasErrors = false;

  if (user.password !== currentPassword) {
    const errorEl = form.querySelector('[data-error="currentPassword"]');
    if (errorEl) errorEl.textContent = 'Current password is incorrect';
    hasErrors = true;
  }

  if (!isValidPassword(newPassword)) {
    const errorEl = form.querySelector('[data-error="newPassword"]');
    if (errorEl) errorEl.textContent = 'Password must be at least 8 characters and contain a letter and a number';
    hasErrors = true;
  } else if (newPassword === currentPassword) {
    const errorEl = form.querySelector('[data-error="newPassword"]');
    if (errorEl) errorEl.textContent = 'New password must be different from the current one';
    hasErrors = true;
  }

  if (newPassword !== confirmNewPassword) {
    const errorEl = form.querySelector('[data-error="confirmNewPassword"]');
    if (errorEl) errorEl.textContent = 'Passwords do not match';
    hasErrors = true;
  }

  if (hasErrors) return;

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);
  users[userIndex].password = newPassword;
  saveUsers(users);

  form.reset();
  showToast('Password changed ✓', 'success');
}

/**
 * Reset CRM client data after confirmation.
 */
async function handleResetData() {
  const confirmed = confirm('Reset all client data? This will reload clients from the API.');
  if (!confirmed) return;

  try {
    await resetClientData();
    showToast('CRM data reset successfully.', 'success');
  } catch (error) {
    console.error('Reset failed:', error);
    showToast('Could not reset data. Check your connection.', 'error');
  }
}

/**
 * Initialize profile page.
 */
function initProfile() {
  renderProfileInfo();

  const profileForm = document.getElementById('profile-form');
  const editProfileFullName = document.getElementById('edit-fullName');
  const editProfileCompany = document.getElementById('edit-company');
  const passwordForm = document.getElementById('password-form');
  const resetBtn = document.getElementById('reset-data-btn');
  
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  if (editProfileFullName) {
    editProfileFullName.addEventListener('input', handleProfileFormChanges);
  }

  if (editProfileCompany) {
    editProfileCompany.addEventListener('input', handleProfileFormChanges);
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordSubmit);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', handleResetData);
  }
}

initProfile();
