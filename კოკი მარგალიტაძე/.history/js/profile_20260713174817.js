document.addEventListener('DOMContentLoaded', () => {

    const session = CRMStorage.getSession();

    if (!session) return;


    const users = CRMStorage.getUsers();

    const currentUser = users.find(user => user.id === session.userId);


    if (!currentUser) return;


    document.getElementById('profile-name').innerText = currentUser.fullName;
    document.getElementById('profile-email').innerText = currentUser.email;
    document.getElementById('profile-company').innerText = currentUser.company;


    const memberSince = new Date(currentUser.createdAt);

    document.getElementById('profile-member-since').innerText =
        `Member since: ${memberSince.toLocaleDateString()}`;


    document.getElementById('profile-avatar').innerText =
        currentUser.fullName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase();


});


const profileEditForm = document.getElementById('profile-edit-form');

profileEditForm.addEventListener('submit', function(e) {

    e.preventDefault();


    const newName = document.getElementById('edit-fullname').value.trim();
    const newCompany = document.getElementById('edit-company').value.trim();


    const errorBox = document.getElementById('profile-error-box');
    const errorList = document.getElementById('profile-error-list');


    errorList.innerHTML = '';
    errorBox.style.display = 'none';


    const errors = [];


    if (!newName || newName.length < 3) {
        errors.push('Full name must be at least 3 characters');
    }


    if (!newCompany) {
        errors.push('Company is required');
    }


    if (errors.length > 0) {

        errors.forEach(error => {

            const li = document.createElement('li');
            li.innerText = error;
            errorList.appendChild(li);

        });

        errorBox.style.display = 'block';

        return;
    }


    const session = CRMStorage.getSession();

    const users = CRMStorage.getUsers();


    const currentUser = users.find(user => user.id === session.userId);


    if (!currentUser) return;


    currentUser.fullName = newName;
    currentUser.company = newCompany;


    CRMStorage.setUsers(users);


    // update displayed profile immediately

    document.getElementById('profile-name').innerText = currentUser.fullName;
    document.getElementById('profile-company').innerText = currentUser.company;


    // update session so dashboard greeting changes

    session.fullName = newName;

    CRMStorage.setSession(session);


    window.showToast('Profile updated ✓', 'success');

});



const passwordChangeForm = document.getElementById('password-change-form');


passwordChangeForm.addEventListener('submit', function(e) {

    e.preventDefault();


    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;


    const errorBox = document.getElementById('password-error-box');
    const errorList = document.getElementById('password-error-list');


    errorList.innerHTML = '';
    errorBox.style.display = 'none';


    const errors = [];


    const session = CRMStorage.getSession();

    const users = CRMStorage.getUsers();

    const currentUser = users.find(user => user.id === session.userId);



    // Rule 1: Current password must match

    if (currentPassword !== currentUser.password) {
        errors.push('Current password is incorrect');
    }


    // Rule 2: New password length

    if (!newPassword || newPassword.length < 8) {
        errors.push('Password must be at least 8 characters');
    }


    // Rule 3: Must contain letter and number

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        errors.push('Password must contain a letter and a number');
    }


    // Rule 4: Confirmation match

    if (newPassword !== confirmPassword) {
        errors.push('Passwords do not match');
    }



    if (errors.length > 0) {

        errors.forEach(error => {

            const li = document.createElement('li');
            li.innerText = error;
            errorList.appendChild(li);

        });


        errorBox.style.display = 'block';

        return;
    }



    // Update password

    currentUser.password = newPassword;


    CRMStorage.setUsers(users);



    // Clear fields

    passwordChangeForm.reset();



    window.showToast('Password changed ✓', 'success');

});