// js/profile.js
import { STORAGE_KEYS } from './data.js';
import { showToast } from './ui.js';

// DOM Elements
const accountInfo = {
    fullName: document.getElementById('profile-full-name'),
    email: document.getElementById('profile-email'),
    company: document.getElementById('profile-company'),
    memberSince: document.getElementById('profile-member-since')
};

const editForm = {
    fullName: document.getElementById('edit-full-name'),
    company: document.getElementById('edit-company'),
    saveBtn: document.getElementById('btn-save-changes')
};

const passwordForm = {
    current: document.getElementById('current-password'),
    new: document.getElementById('new-password'),
    confirm: document.getElementById('confirm-password'),
    changeBtn: document.getElementById('btn-change-password')
};

const resetBtn = document.getElementById('btn-reset-data');

// Current user data
let currentUser = null;

/**
 * Extracts initials from a full name (e.g., "John Doe" -> "JD", "Alice" -> "AL")
 * @param {string} fullName - The user's full name
 * @returns {string} - The initials (up to 2 characters, uppercase)
 */
function getInitials(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return 'U'; // Default fallback for undefined/empty names
    }

    const names = fullName.trim().split(' ');

    if (names.length === 0) return 'U';
    if (names.length === 1) {
        // If only one name is provided, take the first 2 letters
        return names[0].substring(0, 2).toUpperCase();
    }

    // Take the first letter of the first name and the first letter of the last name
    const initials = names[0].charAt(0) + names[names.length - 1].charAt(0);
    return initials.toUpperCase();
}

/**
 * Generates a consistent gradient color based on the user's name
 * This ensures the same user always gets the same avatar color
 * @param {string} fullName - The user's full name
 * @returns {string} - CSS linear-gradient string
 */
function getAvatarColor(fullName) {
    const colors = [
        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Blue
        'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Purple
        'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink
    ];

    // Calculate a deterministic hash from the string
    let sum = 0;
    for (let i = 0; i < fullName.length; i++) {
        sum += fullName.charCodeAt(i);
    }

    return colors[sum % colors.length];
}

/**
 * Loads current user data from session and crm_users
 */
function loadUserProfile() {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    currentUser = users.find(u => u.id === session.userId);

    if (!currentUser) {
        showToast('User not found', 'error');
        return;
    }

    // 1. Display user info (P5.1)
    accountInfo.fullName.textContent = currentUser.fullName;
    accountInfo.email.textContent = currentUser.email;
    accountInfo.company.textContent = currentUser.company || 'Not specified';
    accountInfo.memberSince.textContent = new Date(currentUser.createdAt).toLocaleDateString();

    // 2. Dynamically render initials in the avatar circle
    const avatarElement = document.getElementById('profile-avatar');
    if (avatarElement) {
        const initials = getInitials(currentUser.fullName);
        avatarElement.textContent = initials;

        // Apply dynamic background color based on the name
        avatarElement.style.background = getAvatarColor(currentUser.fullName);
    }

    // 3. Pre-fill edit form with current data
    editForm.fullName.value = currentUser.fullName;
    editForm.company.value = currentUser.company || '';
}

/**
 * Handles profile update (P5.2)
 */
function handleSaveChanges(event) {
    event.preventDefault();

    const fullName = editForm.fullName.value.trim();
    const company = editForm.company.value.trim();

    // Validation
    if (fullName.length < 3) {
        showToast('Full name must be at least 3 characters', 'error');
        return;
    }

    // Update user data in memory
    currentUser.fullName = fullName;
    currentUser.company = company;

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Re-load profile to update display (including new initials if name changed)
    loadUserProfile();

    showToast('Profile updated ✓', 'success');
}

/**
 * Handles password change (P5.3)
 */
function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = passwordForm.current.value;
    const newPassword = passwordForm.new.value;
    const confirmPassword = passwordForm.confirm.value;

    // Validation
    if (currentPassword !== currentUser.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        showToast('Password must be at least 8 characters and contain a letter and a number', 'error');
        return;
    }

    if (newPassword === currentPassword) {
        showToast('New password must be different from the current one', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Update password in memory
    currentUser.password = newPassword;

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Clear form fields
    passwordForm.current.value = '';
    passwordForm.new.value = '';
    passwordForm.confirm.value = '';

    showToast('Password changed ✓', 'success');
}

/**
 * Handles CRM data reset (P5.4)
 */
function handleResetData() {
    if (!confirm('Reset all CRM data? This will delete all clients and reload from API.')) {
        return;
    }

    // Delete clients data from localStorage
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);

    // Reload from API
    fetch('https://dummyjson.com/users?limit=30')
        .then(response => response.json())
        .then(data => {
            const clients = data.users.map(user => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone,
                company: user.company.name,
                image: user.image,
                status: 'Lead',
                dealValue: Math.floor(Math.random() * 9501) + 500,
                notes: [],
                createdAt: new Date().toISOString()
            }));

            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
            showToast('CRM data reset successfully', 'success');

            // Redirect to clients page to see fresh data
            setTimeout(() => {
                window.location.href = 'clients.html';
            }, 1500);
        })
        .catch(error => {
            console.error('Error resetting data:', error);
            showToast('Failed to reset data', 'error');
        });
}

// Event Listeners
if (editForm.saveBtn) {
    editForm.saveBtn.addEventListener('click', handleSaveChanges);
}

if (passwordForm.changeBtn) {
    passwordForm.changeBtn.addEventListener('click', handleChangePassword);
}

if (resetBtn) {
    resetBtn.addEventListener('click', handleResetData);
}

// Initialize profile on page load
loadUserProfile();