/* Dashboard page */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboardPage
);

// Starts every dashboard feature
async function initializeDashboardPage() {
    const currentUser = getCurrentUser();

    if (currentUser === null) {
        return;
    }

    showWelcomeMessage(currentUser);
    startLiveClock();

    try {
        const clients = await loadClients();

        renderStatistics(clients);
        renderPipeline(clients);
        renderRecentClients(clients);
    } catch (error) {
        showDashboardError(error.message);
    }
}

// Displays the user's first name
function showWelcomeMessage(user) {
    const firstName = user.fullName.split(" ")[0];
    const welcomeMessage =
        document.getElementById("welcomeMessage");

    welcomeMessage.textContent = "Welcome back, " + firstName + "!";
}

// Updates the date and time once per second
function startLiveClock() {
    updateLiveClock();

    setInterval(updateLiveClock, 1000);
}

// Displays the current local date and time
function updateLiveClock() {
    const now = new Date();
    const liveClock = document.getElementById("liveClock");

    liveClock.textContent =
        now.toLocaleDateString() +
        " " +
        now.toLocaleTimeString();

    liveClock.dateTime = now.toISOString();
}

// Formats a number as US dollars
function formatDashboardMoney(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(value);
}

// Calculates and displays the four statistic cards
function renderStatistics(clients) {
    const activeDeals = clients.filter(function (client) {
        return client.status !== "Won" &&
            client.status !== "Lost";
    });

    const wonClients = clients.filter(function (client) {
        return client.status === "Won";
    });

    const wonRevenue = wonClients.reduce(
        function (total, client) {
            return total + Number(client.dealValue);
        },
        0
    );

    const newClients = clients.filter(function (client) {
        const createdTime =  new Date(client.createdAt).getTime();

        const ageInDays =
            (Date.now() - createdTime) / 86400000;

        return ageInDays >= 0 && ageInDays <= 7;
    });

    document.getElementById("totalClients").textContent = clients.length;

    document.getElementById("activeDeals").textContent = activeDeals.length;

    document.getElementById("wonRevenue").textContent = formatDashboardMoney(wonRevenue);

    document.getElementById("newClients").textContent = newClients.length;
}

// Counts clients in one status
function countClientsByStatus(clients, status) {
    return clients.filter(function (client) {
        return client.status === status;
    }).length;
}

// Displays Lead, Contacted, Won, and Lost totals
function renderPipeline(clients) {
    const pipelineContainer = document.getElementById("pipelineContainer");

    const statuses = [
        "Lead",
        "Contacted",
        "Won",
        "Lost"
    ];

    pipelineContainer.replaceChildren();

    statuses.forEach(function (status) {
        const count = countClientsByStatus(
            clients,
            status
        );

        let percentage = 0;

        if (clients.length > 0) {
            percentage = count / clients.length * 100;
        }

        const item = document.createElement("div");
        item.className = "pipeline-item";

        const label = document.createElement("span");

        const statusName = document.createElement("strong");
        statusName.textContent = status;

        const statusCount = document.createElement("small");
        statusCount.textContent = count + " clients";

        label.append(statusName, statusCount);

        const bar = document.createElement("div");
        bar.className = "pipeline-bar";

        const progress = document.createElement("div");
        progress.className =
            "pipeline-progress pipeline-" +
            status.toLowerCase();

        progress.style.width = percentage + "%";

        bar.appendChild(progress);
        item.append(label, bar);
        pipelineContainer.appendChild(item);
    });
}

// Returns the five newest clients without changing the original array
function getRecentClients(clients) {
    return clients
        .slice()
        .sort(function (firstClient, secondClient) {
            return new Date(secondClient.createdAt) -
                new Date(firstClient.createdAt);
        })
        .slice(0, 5);
}

// Creates the status badge used in a recent-client row
function createStatusBadge(status) {
    const badge = document.createElement("span");

    badge.className =
        "badge badge-" + status.toLowerCase();

    badge.textContent = status;

    return badge;
}

// Displays the five newest clients
function renderRecentClients(clients) {
    const recentClientsList =
        document.getElementById("recentClientsList");

    const recentClients = getRecentClients(clients);

    recentClientsList.replaceChildren();

    if (recentClients.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "No clients yet.";

        recentClientsList.appendChild(emptyMessage);
        return;
    }

    recentClients.forEach(function (client) {
        const row = document.createElement("article");
        row.className = "client-row";

        const details = document.createElement("div");
        details.className = "recent-client-details";

        const name = document.createElement("strong");
        name.textContent = client.name;

        const company = document.createElement("small");
        company.textContent = client.company;

        details.append(name, company);

        const meta = document.createElement("div");
        meta.className = "recent-client-meta";

        const badge = createStatusBadge(client.status);

        const date = document.createElement("time");
        const createdDate = new Date(client.createdAt);

        date.dateTime = client.createdAt;
        date.textContent = createdDate.toLocaleDateString();

        meta.append(badge, date);
        row.append(details, meta);
        recentClientsList.appendChild(row);
    });
}

// Displays an error if client data cannot be loaded
function showDashboardError(message) {
    const pipelineContainer =
        document.getElementById("pipelineContainer");

    const recentClientsList =
        document.getElementById("recentClientsList");

    pipelineContainer.textContent = message;
    recentClientsList.textContent =
        "Dashboard data could not be loaded.";
}