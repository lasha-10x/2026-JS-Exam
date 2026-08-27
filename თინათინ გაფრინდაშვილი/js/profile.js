const editProfileForm = document.getElementById('edit-profile-form');
const changePasswordForm = document.getElementById('change-password-form');
const resetCRMDataBtn = document.getElementById('reset-crm-data-btn');

// Error Elements
const fullNameError = document.getElementById('fullname-error');
const currentPasswordError = document.getElementById('current-password-error');
const newPasswordError = document.getElementById('new-password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

function getCurrentUser() {
    const users = JSON.parse(localStorage.getItem("crm_users")) || [];
    const session = JSON.parse(localStorage.getItem("crm_session"));
    return users.find(user => user.email === session.email);
}


// Initialize the profile page with user data
function initializeProfilePage() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Populate user info
    document.getElementById('user-fullname').textContent = currentUser.fullName;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-company').textContent = currentUser.company || ' Not specified';
    document.getElementById('user-member-since').textContent =  new Date(currentUser.createdAt).toLocaleDateString("en-GB");
    // Set initial for avatar
    document.getElementById('avatar-initials').textContent = currentUser.fullName.charAt(0).toUpperCase();

    // Pre-fill edit profile form
    document.getElementById('fullname').value = currentUser.fullName;
    document.getElementById('company').value = currentUser.company || '';
}

// Validate Full Name 
function validateFullName(fullName) {
    if (!fullName || fullName.trim().length < 3) {
        fullNameError.textContent = 'Full name must be at least 3 characters';
        return false;
    }
    fullNameError.textContent = '';
    return true;
}

// Validate Password
function validatePassword(currentPassword, newPassword, confirmPassword) {
    const currentUser = getCurrentUser();
    let isValid = true;

    // Current Password
    if (currentPassword !== currentUser.password) {
        currentPasswordError.textContent = 'Current password is incorrect';
        isValid = false;
    } else {
        currentPasswordError.textContent = '';
    }

    // New Password
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        newPasswordError.textContent = 'Password must be at least 8 characters and contain a letter and a number';
        isValid = false;
    } else if (newPassword === currentPassword) {
        newPasswordError.textContent = 'New password must be different from the current one';
        isValid = false;
    } else {
        newPasswordError.textContent = '';
    }

    // Confirm Password
    if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    } else {
        confirmPasswordError.textContent = '';
    }

    return isValid;
}

// Handle Save Changes 
editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullname').value.trim();
    const company = document.getElementById('company').value.trim();

    if (!validateFullName(fullName)) return;

    // Load the current users list and session fresh from localStorage
    const users = JSON.parse(localStorage.getItem("crm_users")) || [];
    const session = JSON.parse(localStorage.getItem("crm_session"));
    const currentUser = users.find(user => user.email === session.email);

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Update user data
    currentUser.fullName = fullName;
    currentUser.company = company;

    // Update UI
    document.getElementById('user-fullname').textContent = fullName;
    document.getElementById('user-company').textContent = company || ' Not specified';
    const initials = fullName.split(' ').map(name => name[0]).join('').toUpperCase();
    document.getElementById('avatar-initials').textContent = initials;

    // Save updated users array back to localStorage
    localStorage.setItem('crm_users', JSON.stringify(users));

    // Keep session in sync with the new name
    session.fullName = fullName;
    localStorage.setItem('crm_session', JSON.stringify(session));

    // Show toast 
    alert('Profile updated ✓');
});

// Handle Change Password 
changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!validatePassword(currentPassword, newPassword, confirmPassword)) return;

    // Load the current users list and session fresh from localStorage
    const users = JSON.parse(localStorage.getItem("crm_users")) || [];
    const session = JSON.parse(localStorage.getItem("crm_session"));
    const currentUser = users.find(user => user.email === session.email);

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Update password
    currentUser.password = newPassword;

    // Save updated users array back to localStorage
    localStorage.setItem('crm_users', JSON.stringify(users));

    // Clear form
    changePasswordForm.reset();

    // Show toast 
    alert('Password changed ✓');
});

// Handle Reset CRM Data (C)
resetCRMDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset CRM data? This action cannot be undone.')) {
        // Clear crm_clients 
        localStorage.removeItem('crm_clients');

        // Show toast 
        alert('CRM data reset ✓');
    }
});

// Initialize the page
initializeProfilePage();