// P3.1 - greeting with the user's first name
function showGreeting() {
    const user = getCurrentUser();
    const greetingEl = document.getElementById('greeting');
    // This is important cause it's check's is or not page loaded
    if (!user || !greetingEl) return;

    const firstName = user.fullName.split(' ')[0];
    greetingEl.textContent = `Welcome back, ${firstName}!`;
}

// P3.1 - clock that updates every second
function startLiveClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    // This is important cause it's check's is or not page loaded
    if (!clockEl || !dateEl) return;

    function tick() {
        clockEl.textContent = new Date().toLocaleTimeString();
        dateEl.textContent = new Date().toLocaleDateString();
    }

    tick();
    setInterval(tick, 1000);
}

async function loadClients() {
    // 1. check - have you data from JSON?
    const saved = localStorage.getItem('crm_clients');
    if (saved) return JSON.parse(saved);

    // 2. If not bring it from API
    const response = await fetch('https://dummyjson.com/users?limit=30');
    const data = await response.json();

    // 3. გარდავქმნათ API-ს user ობიექტები ჩვენს Client ფორმატში
    const clients = data.users.map(apiUser => {
        return {
            id: apiUser.id,
            name: apiUser.firstName + ' ' + apiUser.lastName,
            email: apiUser.email,
            phone: apiUser.phone,
            company: apiUser.company.name,
            image: apiUser.image,
            status: 'Lead',
            dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
            notes: [],
            createdAt: new Date().toISOString()
        };
    });

    // 4. save data in localStorage to do not use fetch twise
    localStorage.setItem('crm_clients', JSON.stringify(clients));

    return clients;
}


function renderStats(clients) {
    const totalEl = document.getElementById('stat-total-clients');
    if (!totalEl) return;
    
    totalEl.textContent = clients.length;

    // if it is not 'On' either 'Lost' it is active Deals
    const activeDeals = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost');
    document.getElementById('stat-active-deals').textContent = activeDeals.length;

    const wonRevenue = clients.filter(c => c.status === 'Won').reduce((sum, c) => sum + Number(c.dealValue), 0);
    document.getElementById('stat-won-revenue').textContent = '$' + wonRevenue.toLocaleString();

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = clients.filter(c => new Date(c.createdAt).getTime() >= oneWeekAgo);
    document.getElementById('stat-new-week').textContent = newThisWeek.length;
}

function renderPipeline(clients) {
    const container = document.getElementById('pipeline-overview');
    if (!container) return;

    const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];
    container.innerHTML = '';

    statuses.forEach(status => {
        const count = clients.filter(c => c.status === status).length;

        const block = document.createElement('div');
        block.className = 'pipeline-block';

        block.innerHTML = `
            <span class="pipeline-count">${count}</span>
            <span class="status-badge status-${status.toLowerCase()}">${status}</span>
        `;
        container.appendChild(block);
    });
}

function renderRecentClients(clients) {
    const container = document.getElementById('recent-clients-list');
    if (!container) return;

    const sorted = [...clients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recent = sorted.slice(0, 5);

    container.innerHTML = '';
    recent.forEach(client => {
        const row = document.createElement('div');
        row.className = 'recent-row';
        
        row.innerHTML = `
            <img src="${client.image}" class="avatar-small" alt="${client.name}" />
            <div class="recent-info">
                <strong>${client.name}</strong>
                <span>${client.company}</span>
            </div>
            <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
            <span class="recent-date">${new Date(client.createdAt).toLocaleDateString()}</span>
        `;
        container.appendChild(row);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    // theme toggle
    applyStoredTheme();

    showGreeting();
    startLiveClock();

    // ველოდებით, სანამ API/localStorage არ დაბრუნდება
    const clients = await loadClients();

    renderStats(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
});