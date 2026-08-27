document.addEventListener('DOMContentLoaded', () => {
    // this is a function for edit name
    const editProfileForm = document.querySelector('.editProfile');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameErrorEl = document.getElementById('nameError');
            if (nameErrorEl) {
                nameErrorEl.textContent = '';
                nameErrorEl.style.display = 'none';
            }

            const currentUser = getCurrentUser();
            if (!currentUser) {
                if (nameErrorEl) {
                    nameErrorEl.textContent = 'You must be logged in to update your profile.';
                    nameErrorEl.style.display = 'block';
                }
                return;
            }

            const fullName = editProfileForm.querySelector('[name="fullname"]').value.trim();
            const company = editProfileForm.querySelector('[name="company"]').value.trim();

            if (fullName.length < 3) {
                if (nameErrorEl) {
                    nameErrorEl.textContent = 'Full name must be at least 3 characters';
                    nameErrorEl.style.display = 'block';
                }
                return;
            }

            currentUser.fullName = fullName;
            if (company) currentUser.company = company;

            if (!saveUser(currentUser)) {
                if (nameErrorEl) {
                    nameErrorEl.textContent = 'Could not update profile. Please try again.';
                    nameErrorEl.style.display = 'block';
                }
                return;
            }

            const profileNameEls = document.querySelectorAll('#profile-name');
            profileNameEls.forEach(el => el.textContent = fullName);
            showToast('Profile updated');
        });
    }

    // this is a function for edit password
    function isValidPassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    }
    const editPasswordForm = document.querySelector('.editPassword');
    if (editPasswordForm) {
        editPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPasswordErrorEl = document.getElementById('currentPasswordError');
            const newPasswordErrorEl = document.getElementById('newPasswordError');
            const confirmErrorEl = document.getElementById('confirmError');

            [currentPasswordErrorEl, newPasswordErrorEl, confirmErrorEl].forEach(el => {
                if (el) {
                    el.textContent = '';
                    el.style.display = 'none';
                }
            });

            const currentUser = getCurrentUser();
            if (!currentUser) {
                if (currentPasswordErrorEl) {
                    currentPasswordErrorEl.textContent = 'You must be logged in to change your password.';
                    currentPasswordErrorEl.style.display = 'block';
                }
                return;
            }

            const currentPassword = editPasswordForm.querySelector('[name="currentPassword"]').value;
            const newPassword = editPasswordForm.querySelector('[name="newPassword"]').value;
            const confirmPassword = editPasswordForm.querySelector('[name="confirmPassword"]').value;

            if (currentPassword !== currentUser.password) {
                if (currentPasswordErrorEl) {
                    currentPasswordErrorEl.textContent = 'Current password is incorrect';
                    currentPasswordErrorEl.style.display = 'block';
                }
                return;
            }
            if (!isValidPassword(newPassword)) {
                if (newPasswordErrorEl) {
                    newPasswordErrorEl.textContent = 'Password must be at least 8 characters and contain a letter and a number';
                    newPasswordErrorEl.style.display = 'block';
                }
                return;
            }
            if (newPassword === currentPassword) {
                if (newPasswordErrorEl) {
                    newPasswordErrorEl.textContent = 'New password must be different from the current one';
                    newPasswordErrorEl.style.display = 'block';
                }
                return;
            }
            if (newPassword !== confirmPassword) {
                if (confirmErrorEl) {
                    confirmErrorEl.textContent = 'Passwords do not match';
                    confirmErrorEl.style.display = 'block';
                }
                return;
            }

            currentUser.password = newPassword;

            if (!saveUser(currentUser)) {
                if (newPasswordErrorEl) {
                    newPasswordErrorEl.textContent = 'Could not update password. Please try again.';
                    newPasswordErrorEl.style.display = 'block';
                }
                return;
            }

            editPasswordForm.reset();
            showToast('Password changed');
        });
    }
});

//this updates user password
function saveUser(updatedUser) {
    try {
        let users = JSON.parse(localStorage.getItem('crm_users')) || [];
        users = users.map(user => String(user.id) === String(updatedUser.id) ? updatedUser : user);
        localStorage.setItem('crm_users', JSON.stringify(users));
        return true;
    } catch (e) {
        console.error("Could not save user", e);
        return false;
    }
}

function resetCrmData() {
    const confirmed = confirm("Reset all client data? This will remove your current clients list and reload fresh sample data. This cannot be undone.");
    if (!confirmed) return;

    localStorage.removeItem('crm_clients');
    loadUsersFromApi();
    showToast("CRM data has been reset");
}

const resetDataBtn = document.querySelector('.reset-data-btn');
if (resetDataBtn) {
    resetDataBtn.addEventListener('click', resetCrmData);
}