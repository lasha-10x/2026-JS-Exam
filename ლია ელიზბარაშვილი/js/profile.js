function renderProfileInfo() {
  const user = getCurrentUser();

  const initials = user.fullName
    .split(' ')
    .map(function (word) { return word.charAt(0); })
    .join('')
    .toUpperCase()
    .slice(0, 2);

  document.getElementById('profile-avatar').textContent = initials;
  document.getElementById('profile-name').textContent = user.fullName;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-company').textContent = user.company || 'No company';
  document.getElementById('profile-since').textContent =
    'Member since ' + new Date(user.createdAt).toLocaleDateString();
}

const editForm = document.getElementById('edit-form');

function fillEditForm() {
  const user = getCurrentUser();
  document.getElementById('edit-name').value = user.fullName;
  document.getElementById('edit-company').value = user.company;
}

editForm.addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors(editForm);

  const nameInput = document.getElementById('edit-name');
  const fullName = nameInput.value.trim();

  if (fullName.length < 3) {
    setError(nameInput, 'Full name must be at least 3 characters');
    return;
  }

  const users = getUsers();
  const user = users.find(function (u) { return u.id === getSession().userId; });
  user.fullName = fullName;
  user.company = document.getElementById('edit-company').value.trim();
  saveUsers(users);

  renderProfileInfo(); 
  showToast('Profile updated ✓');
});

const passwordForm = document.getElementById('password-form');

passwordForm.addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors(passwordForm);

  const currentInput = document.getElementById('current-password');
  const newInput = document.getElementById('new-password');
  const confirmInput = document.getElementById('confirm-password');

  const users = getUsers();
  const user = users.find(function (u) { return u.id === getSession().userId; });

  const newPassword = newInput.value;
  let hasErrors = false;

  if (currentInput.value !== user.password) {
    setError(currentInput, 'Current password is incorrect');
    hasErrors = true;
  }

  if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    setError(newInput, 'Password must be at least 8 characters and contain a letter and a number');
    hasErrors = true;
  } else if (newPassword === currentInput.value) {
    setError(newInput, 'New password must be different from the current one');
    hasErrors = true;
  }

  if (confirmInput.value !== newPassword) {
    setError(confirmInput, 'Passwords do not match');
    hasErrors = true;
  }

  if (hasErrors) return;

  user.password = newPassword;
  saveUsers(users);

  passwordForm.reset();
  showToast('Password changed ✓');
});

document.getElementById('reset-btn').addEventListener('click', async function () {
  const confirmed = confirm('Reset all client data? This will reload the original clients from the API.');
  if (!confirmed) return;

  localStorage.removeItem('crm_clients');

  try {
    await loadClients();
    showToast('CRM data has been reset ✓');
  } catch (error) {
    showToast('Could not reload clients. Check your connection.', 'error');
  }
});

renderProfileInfo();
fillEditForm();
