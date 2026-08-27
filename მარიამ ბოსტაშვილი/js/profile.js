function initialsOf(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(function (word) {
      return word[0];
    })
    .join('')
    .toUpperCase();
}

function renderProfile() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  document.getElementById('pfAvatar').textContent = initialsOf(user.fullName);
  document.getElementById('pfName').textContent = user.fullName;
  document.getElementById('pfEmail').textContent = user.email;
  document.getElementById('pfCompany').textContent = user.company || 'No company';
  document.getElementById('pfMeta').textContent =
    `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

  document.getElementById('pFullName').value = user.fullName;
  document.getElementById('pCompany').value = user.company || '';

  return user;
}

function updateCurrentUser(changes) {
  const session = getSession();
  const users = getUsers();
  const user = users.find(function (candidate) {
    return candidate.id === session.userId;
  });

  if (!user) {
    return null;
  }

  Object.assign(user, changes);

  if (!saveUsers(users)) {
    return null;
  }

  return user;
}

function saveProfile({ fullName, company }) {
  const name = fullName.trim();

  if (name.length < 3) {
    return {
      pFullName: 'Full name must be at least 3 characters',
    };
  }

  const updatedUser = updateCurrentUser({
    fullName: name,
    company: company.trim(),
  });

  if (!updatedUser) {
    showToast('Could not save profile changes. Check browser storage.', 'error');
    return {};
  }

  renderProfile();
  showCurrentUser();
  showToast('Profile updated \u2713', 'success');

  return {};
}

function validatePasswordChange({ currentPassword, newPassword, confirmPassword }, user) {
  const errors = {};

  if (currentPassword !== user.password) {
    errors.curPass = 'Current password is incorrect';
  }

  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  if (newPassword.length < MIN_PASSWORD_LENGTH || !hasLetter || !hasNumber) {
    errors.newPass = `Password must be at least ${MIN_PASSWORD_LENGTH} characters and contain a letter and a number`;
  } else if (newPassword === user.password) {
    errors.newPass = 'New password must be different from the current one';
  }

  if (confirmPassword !== newPassword) {
    errors.confPass = 'Passwords do not match';
  }

  return errors;
}

function changePassword(values) {
  const user = getCurrentUser();
  const errors = validatePasswordChange(values, user);

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  if (!updateCurrentUser({ password: values.newPassword })) {
    showToast('Could not change the password. Check browser storage.', 'error');
    return {
      newPass: 'Could not save the password. Please try again',
    };
  }

  showToast('Password changed \u2713', 'success');

  return {};
}

document.addEventListener('DOMContentLoaded', function () {
  if (!initProtectedPage('profile')) {
    return;
  }

  renderProfile();

  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const resetButton = document.getElementById('resetBtn');

  profileForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    const errors = saveProfile({
      fullName: document.getElementById('pFullName').value,
      company: document.getElementById('pCompany').value,
    });

    for (const [field, message] of Object.entries(errors)) {
      showError(field, message);
    }
  });

  passwordForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    const errors = changePassword({
      currentPassword: document.getElementById('curPass').value,
      newPassword: document.getElementById('newPass').value,
      confirmPassword: document.getElementById('confPass').value,
    });

    if (Object.keys(errors).length > 0) {
      for (const [field, message] of Object.entries(errors)) {
        showError(field, message);
      }
      return;
    }

    passwordForm.reset();
  });

  resetButton.addEventListener('click', async function () {
    const confirmed = window.confirm('Reset CRM data? All clients will be reloaded from the API.');

    if (!confirmed) {
      return;
    }

    resetButton.disabled = true;

    try {
      await reloadClientsFromApi();
      clearCurrentUserReminders();
      showToast('CRM data reset \u2713', 'success');
    } catch (error) {
      console.error(error);
      showToast('Could not reload clients. Check your connection.', 'error');
    } finally {
      resetButton.disabled = false;
    }
  });

  clearErrorOnInput(profileForm);
  clearErrorOnInput(passwordForm);
});
