// P3 — Dashboard Page (Greeting, Live Clock, 4 Stat Cards, Pipeline Overview, Recent Clients)
class DashboardPage {
    constructor() {
        if (!document.getElementById('welcomeText')) return;
        this.showWelcome();
        this.startClock();
        this.loadStats();
    }

    showWelcome() {
        const session = Storage.getSession();
        if (!session) return;

        const user = Storage.getUsers().find(u => u.email === session.email);
        if (!user) return;

        const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
        document.getElementById('welcomeText').innerText = `Welcome back, ${firstName}!`;
    }

    startClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) return;

        const updateTime = () => {
            const now = new Date();
            clockEl.innerText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    loadStats() {
        const clients = Storage.getClients() || [];
        
        // P3.2 Stats
        const totalClients = clients.length;
        const activeDeals = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;
        
        const wonRevenue = clients
            .filter(c => c.status === 'Won')
            .reduce((sum, c) => sum + (c.dealValue || 0), 0);
        
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        const newThisWeek = clients.filter(c => {
            return (Date.now() - new Date(c.createdAt).getTime()) <= oneWeekMs;
        }).length;

        const formattedRevenue = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        }).format(wonRevenue);

        // Populate HTML stats
        const totalEl = document.getElementById('statTotalClients');
        if (totalEl) totalEl.innerText = totalClients;

        const activeEl = document.getElementById('statActiveDeals');
        if (activeEl) activeEl.innerText = activeDeals;

        const revenueEl = document.getElementById('statWonRevenue');
        if (revenueEl) revenueEl.innerText = formattedRevenue;

        const newEl = document.getElementById('statNewThisWeek');
        if (newEl) newEl.innerText = newThisWeek;

        // P3.3 Pipeline Overview (Lead, Contacted, Proposal, Won, Lost)
        const leads = clients.filter(c => c.status === 'Lead').length;
        const contacted = clients.filter(c => c.status === 'Contacted').length;
        const proposal = clients.filter(c => c.status === 'Proposal').length;
        const won = clients.filter(c => c.status === 'Won').length;
        const lost = clients.filter(c => c.status === 'Lost').length;

        const pipelineEl = document.getElementById('pipelineCounts');
        if (pipelineEl) {
            const maxVal = Math.max(totalClients, 1);
            pipelineEl.className = 'pipeline-grid';
            pipelineEl.innerHTML = `
                <div class="pipeline-stage-card">
                    <div class="pipeline-stage-header">
                        <span class="pipeline-stage-name">Lead</span>
                        <span class="pipeline-stage-count">${leads}</span>
                    </div>
                    <div class="pipeline-bar-bg"><div class="pipeline-bar-fill fill-lead" style="width: ${(leads / maxVal) * 100}%;"></div></div>
                </div>
                <div class="pipeline-stage-card">
                    <div class="pipeline-stage-header">
                        <span class="pipeline-stage-name">Contacted</span>
                        <span class="pipeline-stage-count">${contacted}</span>
                    </div>
                    <div class="pipeline-bar-bg"><div class="pipeline-bar-fill fill-contacted" style="width: ${(contacted / maxVal) * 100}%;"></div></div>
                </div>
                <div class="pipeline-stage-card">
                    <div class="pipeline-stage-header">
                        <span class="pipeline-stage-name">Proposal</span>
                        <span class="pipeline-stage-count">${proposal}</span>
                    </div>
                    <div class="pipeline-bar-bg"><div class="pipeline-bar-fill fill-proposal" style="width: ${(proposal / maxVal) * 100}%;"></div></div>
                </div>
                <div class="pipeline-stage-card">
                    <div class="pipeline-stage-header">
                        <span class="pipeline-stage-name">Won</span>
                        <span class="pipeline-stage-count">${won}</span>
                    </div>
                    <div class="pipeline-bar-bg"><div class="pipeline-bar-fill fill-won" style="width: ${(won / maxVal) * 100}%;"></div></div>
                </div>
                <div class="pipeline-stage-card">
                    <div class="pipeline-stage-header">
                        <span class="pipeline-stage-name">Lost</span>
                        <span class="pipeline-stage-count">${lost}</span>
                    </div>
                    <div class="pipeline-bar-bg"><div class="pipeline-bar-fill fill-lost" style="width: ${(lost / maxVal) * 100}%;"></div></div>
                </div>
            `;
        }

        // P3.4 Recent Clients (top 5 sorted by createdAt desc)
        const recentContainer = document.getElementById('recentClientsList');
        if (recentContainer) {
            const recent = [...clients]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            recentContainer.innerHTML = '';
            if (recent.length === 0) {
                recentContainer.innerHTML = '<p class="empty-state-text">No clients yet.</p>';
            } else {
                recent.forEach(client => {
                    const row = document.createElement('div');
                    row.className = 'recent-client-item';
                    row.innerHTML = `
                        <div class="recent-client-left">
                            <img src="${client.image || 'https://dummyjson.com/icon/newuser/128'}" alt="${client.name}" class="recent-client-avatar">
                            <div>
                                <strong class="recent-client-name">${client.name}</strong>
                                <span class="recent-client-company">${client.company || ''}</span>
                            </div>
                        </div>
                        <div class="recent-client-right">
                            <span class="badge badge-${client.status.toLowerCase()}">${client.status}</span>
                            <span class="recent-client-date">${new Date(client.createdAt).toLocaleDateString()}</span>
                        </div>
                    `;
                    recentContainer.appendChild(row);
                });
            }
        }
    }
}
