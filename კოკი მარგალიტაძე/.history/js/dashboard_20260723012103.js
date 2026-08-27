document.addEventListener('DOMContentLoaded', () => {
    const session = CRMStorage.getSession();
    const clients = CRMStorage.getClients();

    const greeting = document.getElementById('greeting-text');
    if (session && session.fullName) {
        greeting.innerText = `Welcome back, ${session.fullName.split(' ')[0]}!`;
    }

    const clock = document.getElementById('live-clock');
    function updateClock() {
        clock.innerText = new Date().toLocaleString();
    }
    updateClock();
    setInterval(updateClock, 1000);

    document.getElementById('stat-total-clients').innerText = clients.length;

    const activeDeals = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;
    document.getElementById('stat-active-deals').innerText = activeDeals;

    const wonRevenue = clients
        .filter(c => c.status === 'Won')
        .reduce((sum, c) => sum + c.dealValue, 0);
    document.getElementById('stat-won-revenue').innerText = `$${wonRevenue.toLocaleString()}`;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = clients.filter(c => new Date(c.createdAt) >= oneWeekAgo).length;
    document.getElementById('stat-new-week').innerText = newThisWeek;

    renderPipeline(clients);
    renderRecentClients(clients);
});

function renderPipeline(clients) {
    const container = document.getElementById('pipeline-overview');
    const stages = ['Lead', 'Contacted', 'Won', 'Lost'];
    container.innerHTML = '';
    stages.forEach(stage => {
        const count = clients.filter(c => c.status === stage).length;
        const card = document.createElement('div');
        card.className = 'pipeline-stage';
        card.innerHTML = `
            <span class="pipeline-stage-label">${stage}</span>
            <span class="pipeline-stage-count">${count}</span>
        `;
        container.appendChild(card);
    });
}

function renderRecentClients(clients) {
    const container = document.getElementById('recent-clients-list');
    // container.innerHTML = '';
    const recent = [...clients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    recent.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `
            <div class="client-card-header">
                <img src="${client.image}" alt="${client.name}" class="client-card-avatar">
                <div>
                    <div class="client-card-name">${client.name}</div>
                    <div class="client-card-company">${client.company}</div>
                </div>
            </div>
            <div class="client-card-footer">
                <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
                <span class="client-card-deal-value">$${client.dealValue.toLocaleString()}</span>
            </div>
        `;
        container.appendChild(card);
    });
}