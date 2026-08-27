
// profile name, company and email
function currentUserInfo() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    if (!users || !session) return;

    let user = users.find(u => u.id === session.userId);

    return user;
}

// user info in title area 
function addProfileInfo() {
    let currentUser = currentUserInfo();
    let profileCont = document.getElementById('profile-initials');
    if (!profileCont) return;

    profileCont.textContent = currentUser.fullName.split(' ').map(name => name[0]).join('').toUpperCase();

    document.getElementById('profile-name').textContent = currentUser.fullName;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-company').textContent = currentUser.company ? currentUser.company : '-';
    document.getElementById('profile-since').textContent = new Date(currentUser.createdAt).toLocaleDateString("en-US");
}


// check if profail is edited
function changeName() {
    let editProfileForm = document.getElementById('edit-profile-form');
    if (!editProfileForm) return;

    editProfileForm.addEventListener('submit', e => {
        e.preventDefault();

        let user = {
            editName: editProfileForm.querySelector('#edit-fullName'),
            editCompany: editProfileForm.querySelector('#edit-company')
        }

        resetFieldErrors(user);

        if (user.editName.value.trim().length < 3) {
            showFieldError(user.editName, "Full name must be at least 3 characters");
            return;
        }

        const session = JSON.parse(localStorage.getItem('crm_session'));
        const users = JSON.parse(localStorage.getItem('crm_users')) || [];
        if (!users || !session) return;

        let userNow = users.find(u => u.id === session.userId);

        userNow.fullName = user.editName.value.trim();
        userNow.company = user.editCompany.value.trim();
        
        localStorage.setItem('crm_users', JSON.stringify(users));
        showToast("Profile updated ✓", "success");

        addProfileInfo();
    });
}


// password changer
function changePassword() {
    let editPasswordForm = document.getElementById('change-password-form');
    if (!editPasswordForm) return;

    editPasswordForm.addEventListener('submit', e => {
        e.preventDefault();

        currentPass    = editPasswordForm.querySelector('#currentPassword');
        newPass        = editPasswordForm.querySelector('#newPassword');
        confirmNewPass = editPasswordForm.querySelector('#confirmNewPassword');

        resetFieldErrors({currentPass, newPass, confirmNewPass});

        let currentUser = currentUserInfo();
        let hasError = false;
        

        if (currentPass.value !== currentUser.password) {
            showFieldError(currentPass, "Current password is incorrect");
            hasError = true;
        }

        // CHECK new password
        let pass = newPass.value;
        let isNum = /[0-9]/.test(pass);
        let isChar = /[a-zA-Z]/.test(pass);
        let isPass = pass.length >= 8;

        if (!isNum || !isChar || !isPass) {
            showFieldError(newPass, "Password must be at least 8 characters and contain a letter and a number");
            hasError = true;
        } else if (currentPass.value === newPass.value) {
            showFieldError(newPass, "New password must be different from the current one");
            hasError = true;
        }

        if ((newPass.value.length > 0 || confirmNewPass.value.length > 0) && newPass.value !== confirmNewPass.value){
            showFieldError(confirmNewPass, "Passwords do not match");
            hasError = true;
        }

        if (hasError) return;


        const users = JSON.parse(localStorage.getItem('crm_users')) || [];
        const session = JSON.parse(localStorage.getItem('crm_session'));

        const user = users.find(u => u.id === session.userId);
        if (!user) return;

        user.password = newPass.value;

        localStorage.setItem('crm_users', JSON.stringify(users));

        showToast("Password changed ✓", "success");

        editPasswordForm.reset();
    });
}

function resetCRMdata() {
    let resetCRM = document.getElementById('reset-data-btn');
    if (!resetCRM) return;
    
    resetCRM.addEventListener('click', async e => {
        const confirmed = confirm("This will delete all your clients and reload the original 30. Continue?");
        if (!confirmed) return;

        localStorage.removeItem('crm_clients');

        try {
            await loadClients();
            showToast("Client data has been reset ✓", "success");
        } catch (err) {
            console.error(err);
            showToast("Could not reset data. Check your connection.", "error");
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // theme toggle
    applyStoredTheme();

    addProfileInfo();
    changeName();
    changePassword();
    resetCRMdata();
});