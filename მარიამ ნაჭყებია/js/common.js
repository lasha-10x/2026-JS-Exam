function getCurrentUser() {
    const sessionData = localStorage.getItem('crm_session') || sessionStorage.getItem('crm_session');
    if (!sessionData) return null;

    let session;
    try {
        session = JSON.parse(sessionData);
    } catch (e) {
        return null;
    }

    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    return users.find(u =>
        (session.userId !== undefined && String(u.id) === String(session.userId)) ||
        (session.email && u.email === session.email)
    ) || null;
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const user = getCurrentUser();

    if (user) {
        if (profileName) profileName.textContent = user.fullName || "User";
        if (profileEmail) profileEmail.textContent = user.email || "user@example.com";
    }
});
