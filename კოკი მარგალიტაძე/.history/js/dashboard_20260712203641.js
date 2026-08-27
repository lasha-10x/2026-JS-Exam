document.addEventListener('DOMContentLoaded', () => {
    const session = CRMStorage.getSession();

    const greeting = document.getElementById('greeting-text');

    if (session && session.fullName) {
        greeting.innerText = `Welcome back, ${session.fullName.split(' ')[0]}!`;
    }
});