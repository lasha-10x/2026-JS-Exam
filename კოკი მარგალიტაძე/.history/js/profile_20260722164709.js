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


   // Rule 2: length + letter + number, combined into one message per spec
    if (!newPassword || newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        errors.push('Password must be at least 8 characters and contain a letter and a number');
    }

    // Rule 3: must differ from current
    if (newPassword === currentPassword) {
        errors.push('New password must be different from the current one');
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


const resetDataBtn = document.getElementById('reset-data-btn');


resetDataBtn.addEventListener('click', async function() {
    const confirmed = confirm('Reset CRM data? All clients will be reloaded from scratch.');
    if (!confirmed) return;

    CRMStorage.remove('crm_clients');

    try {
        const response = await fetch('https://dummyjson.com/users?limit=30');
        const data = await response.json();
        const freshClients = data.users.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            company: user.company.name,
            image: user.image,
            status: 'Lead',
            dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
            notes: [],
            createdAt: new Date().toISOString(),
        }));
        CRMStorage.setClients(freshClients);
        window.showToast('CRM data reset ✓', 'success');
    } catch (err) {
        window.showToast('Reset failed. Please try again.', 'error');
    }
});