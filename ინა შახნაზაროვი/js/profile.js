/* profile.js */
document.addEventListener('DOMContentLoaded', async () => {
  let currentUser = getCurrentUser();
  if (!currentUser) return;

  function renderProfile(user) {
    document.getElementById('profile-initials').textContent = getInitials(user.fullName);
    document.getElementById('profile-name').textContent = user.fullName;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-company').textContent = user.company || '—';
    document.getElementById('profile-since').textContent = 'Member since ' + new Date(user.createdAt).toLocaleDateString();
  }

  renderProfile(currentUser);

  // Prefill forms
  document.getElementById('edit-name').value = currentUser.fullName;
  document.getElementById('edit-company').value = currentUser.company || '';

  // Edit profile
  document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(e.target);

    const nameEl = document.getElementById('edit-name');
    if (nameEl.value.trim().length < 3) {
      showError(nameEl, document.getElementById('edit-name-err'));
      return;
    }

    currentUser = updateUser(currentUser.id, {
      fullName: nameEl.value.trim(),
      company: document.getElementById('edit-company').value.trim()
    });

    renderProfile(currentUser);

    showToast('Profile updated ✓', 'success');
  });

  // Change password
  document.getElementById('change-pass-form').addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(e.target);

    const cur = document.getElementById('cur-pass');
    const newP = document.getElementById('new-pass');
    const conf = document.getElementById('confirm-pass');

    let valid = true;

    if (cur.value !== currentUser.password) {
      showError(cur, document.getElementById('cur-pass-err'));
      valid = false;
    }

    if (!isValidPassword(newP.value)) {
      showError(newP, document.getElementById('new-pass-err'));
      valid = false;
    } else if (newP.value === currentUser.password) {
      showError(newP, document.getElementById('new-pass-same-err'));
      valid = false;
    }

    if (newP.value !== conf.value || !conf.value) {
      showError(conf, document.getElementById('confirm-pass-err'));
      valid = false;
    }

    if (!valid) return;

    currentUser = updateUser(currentUser.id, { password: newP.value });
    e.target.reset();
    showToast('Password changed ✓', 'success');
  });

  // Reset data
  document.getElementById('reset-data-btn').addEventListener('click', async () => {
    if (!confirm('Reset all CRM data? This will reload clients from the API.')) return;
    const resetButton = document.getElementById('reset-data-btn');
    resetButton.disabled = true;

    try {
      localStorage.removeItem(STORAGE_KEYS.CLIENTS);
      await loadClients();
      showToast('CRM data reset ✓', 'success');
    } catch (error) {
      console.error(error);
      showToast('Could not reset CRM data. Please try again.', 'error');
    } finally {
      resetButton.disabled = false;
    }
  });
});
