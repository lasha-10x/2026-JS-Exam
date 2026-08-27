document.addEventListener('DOMContentLoaded', () => {
    const session = CRMStorage.getSession();

    const greeting = document.getElementById('greeting-text');

    if (session && session.fullName) {
        greeting.innerText = `Welcome back, ${session.fullName.split(' ')[0]}!`;
    }

});

const clock = document.getElementById('live-clock');

function updateClock() {
    const now = new Date();

    clock.innerText = now.toLocaleString();
}

updateClock();

setInterval(updateClock, 1000);