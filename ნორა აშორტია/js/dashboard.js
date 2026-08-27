// dashboard.js — derives dashboard numbers & recent activities from crm_clients data

function initClock() {
    const updateClock = () => {
        const liveClockEl = document.getElementById("liveClock");
        if (liveClockEl) {
            const now = new Date();
            liveClockEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// Helper function: Formatting amounts (e.g. 118000 -> $118K)
function formatCurrency(num) {
    if (num >= 1000) {
        return `$${Math.round(num / 1000)}K`;
    }
    return `$${num.toLocaleString()}`;
}

async function initDashboard() {
    initClock();

    // 1. Profiling Topbar Avatar
    try {
        if (typeof getSession === "function") {
            const session = getSession();
            if (session && session.name) {
                const avatarEl = document.getElementById("topbar-avatar");
                const greetNameEl = document.getElementById("greet-name");

                if (avatarEl) {
                    avatarEl.textContent = session.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                }
                if (greetNameEl) {
                    greetNameEl.textContent = session.name.split(" ")[0];
                }
            }
        }
    } catch (e) {
        console.error("Session error:", e);
    }

    // 2. Client Metrics Calculation
    try {
        let clients = [];

        if (typeof apiGetClients === "function") {
            clients = await apiGetClients();
        } else {
            clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
        }

        if (!Array.isArray(clients)) clients = [];

        const statClientsEl = document.getElementById("stat-clients");
        const statActiveEl = document.getElementById("stat-active");
        const statDealsEl = document.getElementById("stat-deals");
        const statRevenueEl = document.getElementById("stat-revenue");

        // a) Total Clients
        if (statClientsEl) statClientsEl.textContent = clients.length;

        // b) Active Clients (Lead and Contacted status clients only)
        const activeClients = clients.filter((c) => {
            const st = c.status ? c.status.toLowerCase() : "";
            return st === "lead" || st === "contacted";
        });
        if (statActiveEl) statActiveEl.textContent = activeClients.length;

        // c) Deals Won
        const wonClients = clients.filter(
            (c) => c.status && c.status.toLowerCase() === "won",
        );
        if (statDealsEl) statDealsEl.textContent = wonClients.length;

        // d) Revenue
        if (statRevenueEl) {
            const totalRevenue = wonClients.reduce((sum, c) => {
                const val = parseFloat(
                    c.value?.toString().replace(/[^0-9.]/g, "") || 0,
                );
                return sum + val;
            }, 0);

            statRevenueEl.textContent = formatCurrency(totalRevenue);
        }

        // ე) Activity & Top Deals Render
        renderRecentActivity(clients);
        renderTopDeals(clients);
    } catch (error) {
        console.error("Error loading dashboard metrics:", error);
    }
}

// Recent Activity Render
function renderRecentActivity(clients) {
    const activityCard = document.getElementById("recent-activity-card");
    if (!activityCard) return;

    activityCard.innerHTML = "";

    const secTitle = document.createElement("div");
    secTitle.className = "sec-title";
    secTitle.textContent = "Recent activity";
    activityCard.appendChild(secTitle);

    if (clients.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "No recent activity yet";
        activityCard.appendChild(emptyState);
        return;
    }

    const recentClients = [...clients].reverse().slice(0, 4);

    recentClients.forEach((client) => {
        const row = document.createElement("div");
        row.className = "row";

        const dot = document.createElement("span");
        dot.className = "dot";

        const txt = document.createElement("span");
        txt.className = "txt";

        const b = document.createElement("b");
        b.textContent = client.name || "Client";

        txt.appendChild(b);
        txt.append(` added — ${client.company || "New Lead"}`);

        const time = document.createElement("span");
        time.className = "time";
        time.textContent = "Recently";

        row.appendChild(dot);
        row.appendChild(txt);
        row.appendChild(time);

        activityCard.appendChild(row);
    });
}

// Top Deals Render (Top 4 highest-budget deals/client)
function renderTopDeals(clients) {
    const dealsCard = document.getElementById("top-deals-card");
    if (!dealsCard) return;

    dealsCard.innerHTML = "";

    const secTitle = document.createElement("div");
    secTitle.className = "sec-title";
    secTitle.textContent = "Top deals";
    dealsCard.appendChild(secTitle);

    if (clients.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "No deals found";
        dealsCard.appendChild(emptyState);
        return;
    }

    // Sort by amount in descending order and take the top 4
    const sortedClients = [...clients]
        .map((c) => ({
            ...c,
            numericValue: parseFloat(
                c.value?.toString().replace(/[^0-9.]/g, "") || 0,
            ),
        }))
        .sort((a, b) => b.numericValue - a.numericValue)
        .slice(0, 4);

    sortedClients.forEach((client) => {
        const clientName = client.name || client.company || "Client";
        const initials = clientName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const formattedVal = formatCurrency(client.numericValue);

        const rep = document.createElement("div");
        rep.className = "rep";

        const av = document.createElement("span");
        av.className = "av";
        av.textContent = initials;

        const nm = document.createElement("span");
        nm.className = "nm";
        nm.textContent = clientName;

        const val = document.createElement("span");
        val.className = "val";
        val.textContent = formattedVal;

        rep.appendChild(av);
        rep.appendChild(nm);
        rep.appendChild(val);

        dealsCard.appendChild(rep);
    });
}

document.addEventListener("DOMContentLoaded", initDashboard);
