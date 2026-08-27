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