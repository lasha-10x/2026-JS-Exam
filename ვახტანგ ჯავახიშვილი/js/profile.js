document.addEventListener('DOMContentLoaded', () => {
    // 1. Session check & dynamic data population
    // აქ შევცვალეთ sessionStorage -> localStorage-ით:
    const activeUserText = localStorage.getItem('crm_session');
    if (!activeUserText) {
        window.location.href = 'index.html';
        return;
    }

    let user = {};
    try {
        user = JSON.parse(activeUserText) || {};
    } catch (e) {
        console.error("Session parse error", e);
    }

    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';

    // Navbar welcome text
    const welcomeEl = document.getElementById('welcome_user');
    if (welcomeEl) {
        welcomeEl.textContent = fullName;
    }

    // Profile Hero Card details
    const profileName = document.getElementById('profile_name');
    const profileEmail = document.getElementById('profile_email');
    const profileAvatar = document.getElementById('profile_avatar');

    if (profileName) profileName.textContent = fullName;
    if (profileEmail) profileEmail.textContent = user.email || '';
    if (profileAvatar) profileAvatar.textContent = fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    // Logout handling
    const logoutBtn = document.getElementById('logout_butt');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // აქაც შევცვალეთ sessionStorage -> localStorage-ით:
            localStorage.removeItem('crm_session');
            window.location.href = 'index.html';
        });
    }

    // 2. Editable Cards Logic (Full Name & Email)
    const editableCards = document.querySelectorAll('.editable-card');
    editableCards.forEach(card => {
        const displayText = card.querySelector('.display-text');
        const editBox = card.querySelector('.edit-box');
        const input = card.querySelector('.edit-input');
        const saveBtn = card.querySelector('.save-card-btn');
        const cancelBtn = card.querySelector('.cancel-card-btn');
        const fieldName = card.getAttribute('data-field');

        // Initial set
        if (fieldName === 'fullName') displayText.textContent = fullName;
        if (fieldName === 'email') displayText.textContent = user.email || '';

        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            displayText.style.display = 'none';
            editBox.style.display = 'block';
            input.value = displayText.textContent.trim();
            input.focus();
        });

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editBox.style.display = 'none';
            displayText.style.display = 'block';
        });

        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newValue = input.value.trim();
            if (!newValue) return;

            user[fieldName] = newValue;
            if (fieldName === 'fullName') {
                user.firstName = newValue.split(' ')[0] || '';
                user.lastName = newValue.split(' ').slice(1).join(' ') || '';
            }

            // Save to storage (ეს უკვე სწორად გაქვს localStorage ან sessionStorage, მოდი აქ დავტოვოთ localStorage რომ ყველაფერი მიბმული იყოს)
            localStorage.setItem('crm_session', JSON.stringify(user));

            let allUsers = JSON.parse(localStorage.getItem('crm_users')) || [];
            allUsers = allUsers.map(u => (u.email === user.email || u.id === user.id) ? user : u);
            localStorage.setItem('crm_users', JSON.stringify(allUsers));

            // Update UI
            displayText.textContent = newValue;
            if (welcomeEl && fieldName === 'fullName') welcomeEl.textContent = newValue;
            if (profileName && fieldName === 'fullName') profileName.textContent = newValue;
            if (profileEmail && fieldName === 'email') profileEmail.textContent = newValue;

            editBox.style.display = 'none';
            displayText.style.display = 'block';
        });
    });

    // 3. Password Change Logic
    const passwordCard = document.getElementById('password_card');
    const passwordTriggerText = document.getElementById('password_trigger_text');
    const passwordEditBox = document.getElementById('password_edit_box');
    const savePassBtn = document.getElementById('save_password_btn');
    const cancelPassBtn = document.getElementById('cancel_password_btn');
    const passFeedback = document.getElementById('password_feedback');

    if (passwordCard) {
        passwordCard.addEventListener('click', () => {
            passwordTriggerText.style.display = 'none';
            passwordEditBox.style.display = 'flex';
        });

        cancelPassBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            passwordEditBox.style.display = 'none';
            passwordTriggerText.style.display = 'block';
            passFeedback.textContent = '';
            document.getElementById('current_password').value = '';
            document.getElementById('new_password').value = '';
            document.getElementById('confirm_password').value = '';
        });

        savePassBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentPass = document.getElementById('current_password').value;
            const newPass = document.getElementById('new_password').value;
            const confirmPass = document.getElementById('confirm_password').value;

            if (newPass !== confirmPass) {
                passFeedback.style.color = '#dc2626';
                passFeedback.textContent = 'New passwords do not match!';
                return;
            }

            if (user.password && user.password !== currentPass) {
                passFeedback.style.color = '#dc2626';
                passFeedback.textContent = 'Current password is incorrect!';
                return;
            }

            // პაროლის მინიმუმ 8 სიმბოლოს შემოწმება (რაც დავამატეთ):
            if (newPass.length < 8) {
                passFeedback.style.color = '#dc2626';
                passFeedback.textContent = 'Password must be at least 8 characters long!';
                return;
            }

            user.password = newPass;
            localStorage.setItem('crm_session', JSON.stringify(user));

            let allUsers = JSON.parse(localStorage.getItem('crm_users')) || [];
            allUsers = allUsers.map(u => (u.email === user.email || u.id === user.id) ? user : u);
            localStorage.setItem('crm_users', JSON.stringify(allUsers));

            passFeedback.style.color = '#16a34a';
            passFeedback.textContent = 'Password updated successfully!';
            setTimeout(() => {
                passwordEditBox.style.display = 'none';
                passwordTriggerText.style.display = 'block';
                passFeedback.textContent = '';
                document.getElementById('current_password').value = '';
                document.getElementById('new_password').value = '';
                document.getElementById('confirm_password').value = '';
            }, 1500);
        });
    }
});