const welcomeText = document.querySelector("#welcomeText");
const liveClock = document.querySelector("#liveClock");

const currentUser = getCurrentUser();

if (currentUser) {
    const fullName = currentUser.fullName || "User";
    const firstName = fullName.split(" ")[0];

    if (welcomeText) welcomeText.textContent = `Welcome back, ${firstName}!`;
}

// live clock
let clockInterval = null;

function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    liveClock.textContent = `${dateStr} ${timeStr}`;
}

if (liveClock) {
    clockInterval = setInterval(updateClock, 1000);
    updateClock();
}


window.addEventListener('beforeunload', () => {
    if (clockInterval) clearInterval(clockInterval);
});


document.addEventListener("DOMContentLoaded", () => {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];

    // total clients
    const totalClientsEl = document.getElementById("totalClients");
    if (totalClientsEl) {
        totalClientsEl.textContent = clients.length;
    }

    // active deals
    const activeDealsEl = document.getElementById("activeDeals");
    if (activeDealsEl) {
        const activeDealsCount = clients.filter(client =>
            client.status && client.status !== "Won" && client.status !== "Lost"
        ).length;
        activeDealsEl.textContent = activeDealsCount;
    }

    // won revenue
    const wonRevenueEl = document.getElementById("wonRevenue");
    if (wonRevenueEl) {
        const totalWonRevenue = clients
            .filter(client => client.status === "Won")
            .reduce((sum, client) => sum + Number(client.dealValue || 0), 0);

        wonRevenueEl.textContent = `$${totalWonRevenue.toLocaleString()}`;
    }

    // new this week
    const newThisWeekEl = document.getElementById("newThisWeek");
    if (newThisWeekEl) {
        const newClientsCount = clients.filter(client => {
            if (!client.createdAt) return false;
            const diffTime = Date.now() - new Date(client.createdAt).getTime();
            const diffDays = diffTime / 86400000;
            return diffDays <= 7;
        }).length;

        newThisWeekEl.textContent = newClientsCount;
    }

    // pipeline overview
    const totalClients = clients.length;

    const counts = {
        lead: clients.filter(c => c.status === "Lead").length,
        contacted: clients.filter(c => c.status === "Contacted").length,
        won: clients.filter(c => c.status === "Won").length,
        lost: clients.filter(c => c.status === "Lost").length
    };

    function updatePipelineItem(countId, percentageId, progressId, count) {
        const countEl = document.getElementById(countId);
        const percentageEl = document.getElementById(percentageId);
        const progressEl = document.getElementById(progressId);

        if (countEl) countEl.textContent = count;

        const percentage = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;

        if (percentageEl) {
            percentageEl.textContent = `${percentage}%`;
        }

        if (progressEl) {
            progressEl.style.width = `${percentage}%`;
        }
    }

    updatePipelineItem("leadCount", "leadPercentage", "leadProgress", counts.lead);
    updatePipelineItem("contactedCount", "contactedPercentage", "contactedProgress", counts.contacted);
    updatePipelineItem("wonCount", "wonPercentage", "wonProgress", counts.won);
    updatePipelineItem("lostCount", "lostPercentage", "lostProgress", counts.lost);
});