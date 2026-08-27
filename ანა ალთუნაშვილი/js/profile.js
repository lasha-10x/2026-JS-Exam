/**
 * profile.js
 * ---------------------------------------------------------------------------
 * P5 — Profile page. Three independent forms, each following the same
 * pattern as everywhere else: validate -> mutate the right localStorage
 * key -> save -> toast -> update the screen.
 * ---------------------------------------------------------------------------
 */

// ============================================================================
// P5.1 — Info block
// ============================================================================

function renderProfileInfo() {
  const user = Storage10X.getCurrentUser();
  if (!user) return;

  document.getElementById('profile-avatar').textContent = getInitials(user.fullName);
  document.getElementById('profile-fullname').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-meta').textContent =
    `${user.company ? user.company + ' · ' : ''}Member since ${new Date(user.createdAt).toLocaleDateString()}`;

  // Pre-fill the edit form with current values (P5.2).
  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editCompany').value = user.company || '';
}

// ============================================================================
// P5.2 — Edit profile (Full Name, Company)
// ============================================================================

function initEditForm() {
  const form = document.getElementById('edit-profile-form');
  liveClearOnInput(['editFullName']);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllFieldErrors(['editFullName']);

    const fullName = document.getElementById('editFullName').value.trim();
    const company = document.getElementById('editCompany').value.trim();

    if (fullName.length < 3) {
      setFieldError('editFullName', 'Full name must be at least 3 characters');
      return;
    }

    const session = Storage10X.getSession();
    const users = Storage10X.getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return;

    user.fullName = fullName;
    user.company = company;
    Storage10X.saveUsers(users);

    showToast('Profile updated ✓', 'success');
    renderProfileInfo(); // reflect the new name/company on this page immediately
    // The Dashboard greeting picks up the change automatically next time it
    // loads, since it also reads through Storage10X.getCurrentUser().
  });
}

// ============================================================================
// P5.3 — Change password
// ============================================================================

function initPasswordForm() {
  const form = document.getElementById('change-password-form');
  const fieldNames = ['currentPassword', 'newPassword', 'confirmNewPassword'];
  liveClearOnInput(fieldNames);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllFieldErrors(fieldNames);

    const current = document.getElementById('currentPassword').value;
    const next = document.getElementById('newPassword').value;
    const confirmNext = document.getElementById('confirmNewPassword').value;

    const session = Storage10X.getSession();
    const users = Storage10X.getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return;

    let hasError = false;

    if (current !== user.password) {
      setFieldError('currentPassword', 'Current password is incorrect');
      hasError = true;
    }

    if (next.length < 8 || !HAS_LETTER_RE.test(next) || !HAS_DIGIT_RE.test(next)) {
      setFieldError('newPassword', 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    } else if (next === user.password) {
      setFieldError('newPassword', 'New password must be different from the current one');
      hasError = true;
    }

    if (confirmNext !== next) {
      setFieldError('confirmNewPassword', 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    user.password = next;
    Storage10X.saveUsers(users);
    form.reset();
    showToast('Password changed ✓', 'success');
  });
}

// ============================================================================
// P5.4 — Reset CRM Data
// ============================================================================

function initResetButton() {
  document.getElementById('reset-data-btn').addEventListener('click', async () => {
    const confirmed = confirm(
      'Reset all client data? This deletes every client and reloads the original list from the API. This cannot be undone.'
    );
    if (!confirmed) return;

    // Clearing crm_clients (and ONLY crm_clients — users/session are
    // untouched) makes loadClients() treat this as a first-ever load, so
    // it fetches the starter dataset from the API again.
    localStorage.removeItem(Storage10X.KEYS.CLIENTS);

    try {
      await loadClients();
      showToast('CRM data has been reset ✓', 'success');
    } catch (err) {
      console.error('Failed to reset CRM data:', err);
      showToast('Could not reset data. Please try again.', 'error');
    }
  });
}

// ============================================================================
// Page init
// ============================================================================

function initProfilePage() {
  initNav();
  renderProfileInfo();
  initEditForm();
  initPasswordForm();
  initResetButton();
}
