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

const clients = CRMStorage.getClients();

document.getElementById('stat-total-clients').innerText = clients.length;

const activeDeals = clients.filter(client => client.status !== 'Lost').length;

document.getElementById('stat-active-deals').innerText = activeDeals;

const wonRevenue = clients
    .filter(client => client.status === 'Won')
    .reduce((sum, client) => sum + client.dealValue, 0);

document.getElementById('stat-won-revenue').innerText =
    `$${wonRevenue.toLocaleString()}`;

    const oneWeekAgo = new Date();

    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newThisWeek = clients.filter(client =>
        new Date(client.createdAt) >= oneWeekAgo
    ).length;
    
    document.getElementById('stat-new-week').innerText = newThisWeek;    