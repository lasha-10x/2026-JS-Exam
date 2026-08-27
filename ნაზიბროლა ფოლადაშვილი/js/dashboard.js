/* DASHBOARD ELEMENTS */

const liveClock = document.querySelector(
    "#live-clock"
);

const welcomeMessage = document.querySelector(
    "#welcome-message"
);

const totalClientsElement = document.querySelector(
    "#total-clients"
);

const activeDealsElement = document.querySelector(
    "#active-deals"
);

const wonRevenueElement = document.querySelector(
    "#won-revenue"
);

const newThisWeekElement = document.querySelector(
    "#new-this-week"
);

const pipelineLeadElement = document.querySelector(
    "#pipeline-lead"
);

const pipelineContactedElement = document.querySelector(
    "#pipeline-contacted"
);

const pipelineWonElement = document.querySelector(
    "#pipeline-won"
);

const pipelineLostElement = document.querySelector(
    "#pipeline-lost"
);

const recentClientsList = document.querySelector(
    "#recent-clients-list"
);

const exportClientsButton = document.querySelector(
    "#export-clients-button"
);


/* LIVE CLOCK */

function updateClock() {
    if (!liveClock) {
        return;
    }

    const currentDate = new Date();

    liveClock.textContent =
        currentDate.toLocaleString();
}


/* CURRENT USER */

function getCurrentUser() {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );

    if (!session) {
        return null;
    }

    const users = JSON.parse(
        localStorage.getItem("crm_users")
    ) || [];

    return users.find((user) => {
        return user.id === session.userId;
    });
}


/* WELCOME MESSAGE */

function displayWelcomeMessage() {
    if (!welcomeMessage) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const firstName = currentUser.fullName
        .trim()
        .split(/\s+/)[0];

    welcomeMessage.textContent =
        `Welcome back, ${firstName}!`;
}


/* TOTAL CLIENTS */

function displayTotalClients() {
    if (!totalClientsElement) {
        return;
    }

    const clients = getClients();

    totalClientsElement.textContent =
        clients.length;
}


/* ACTIVE DEALS */

function displayActiveDeals() {
    if (!activeDealsElement) {
        return;
    }

    const clients = getClients();

    const activeDeals = clients.filter((client) => {
        return (
            client.status === "Lead" ||
            client.status === "Contacted"
        );
    });

    activeDealsElement.textContent =
        activeDeals.length;
}


/* WON REVENUE */

function displayWonRevenue() {
    if (!wonRevenueElement) {
        return;
    }

    const clients = getClients();

    const wonRevenue = clients
        .filter((client) => {
            return client.status === "Won";
        })
        .reduce((total, client) => {
            return (
                total +
                Number(client.dealValue || 0)
            );
        }, 0);

    wonRevenueElement.textContent =
        `$${wonRevenue.toLocaleString()}`;
}


/* NEW THIS WEEK */

function displayNewThisWeek() {
    if (!newThisWeekElement) {
        return;
    }

    const clients = getClients();

    const currentDate = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
        currentDate.getDate() - 7
    );

    const newClients = clients.filter((client) => {
        const clientCreatedDate =
            new Date(client.createdAt);

        return (
            clientCreatedDate >= sevenDaysAgo &&
            clientCreatedDate <= currentDate
        );
    });

    newThisWeekElement.textContent =
        newClients.length;
}


/* PIPELINE OVERVIEW */

function displayPipelineOverview() {
    if (
        !pipelineLeadElement ||
        !pipelineContactedElement ||
        !pipelineWonElement ||
        !pipelineLostElement
    ) {
        return;
    }

    const clients = getClients();

    const leadClients = clients.filter((client) => {
        return client.status === "Lead";
    });

    const contactedClients = clients.filter((client) => {
        return client.status === "Contacted";
    });

    const wonClients = clients.filter((client) => {
        return client.status === "Won";
    });

    const lostClients = clients.filter((client) => {
        return client.status === "Lost";
    });

    pipelineLeadElement.textContent =
        leadClients.length;

    pipelineContactedElement.textContent =
        contactedClients.length;

    pipelineWonElement.textContent =
        wonClients.length;

    pipelineLostElement.textContent =
        lostClients.length;
}

/* RECENT CLIENTS */

function displayRecentClients() {
    if (!recentClientsList) {
        return;
    }

    const clients = getClients();

    const recentClients = [...clients]
        .sort((a, b) => {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        })
        .slice(0, 5);

    recentClientsList.replaceChildren();

    if (recentClients.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No clients added yet.";

        recentClientsList.append(
            emptyMessage
        );

        return;
    }

    const clientsFragment =
        document.createDocumentFragment();

    recentClients.forEach((client) => {
        const dealValue = Number(
            client.dealValue || 0
        );

        const createdDate = new Date(
            client.createdAt
        ).toLocaleDateString();

        const statusClass = String(
            client.status || ""
        )
            .trim()
            .toLowerCase();

        const clientCard =
            document.createElement("article");

        clientCard.className =
            "recent-client-card";

        const clientName =
            document.createElement("h3");

        clientName.className =
            "recent-client-name";

        clientName.textContent =
            client.name;

        const clientCompany =
            document.createElement("p");

        clientCompany.className =
            "recent-client-company";

        clientCompany.textContent =
            client.company || "No company";

        const clientValue =
            document.createElement("strong");

        clientValue.className =
            "recent-client-value";

        clientValue.textContent =
            `$${dealValue.toLocaleString()}`;

        const clientStatus =
            document.createElement("span");

        clientStatus.className =
            `recent-client-status status-${statusClass}`;

        clientStatus.textContent =
            client.status;

        const clientDate =
            document.createElement("time");

        clientDate.className =
            "recent-client-date";

        clientDate.dateTime =
            client.createdAt;

        clientDate.textContent =
            createdDate;

        clientCard.append(
            clientName,
            clientCompany,
            clientValue,
            clientStatus,
            clientDate
        );

        clientsFragment.append(
            clientCard
        );
    });

    recentClientsList.append(
        clientsFragment
    );
}


/* ESCAPE CSV VALUE */

function escapeCSVValue(value) {
    const stringValue = String(
        value ?? ""
    );

    const escapedValue = stringValue.replace(
        /"/g,
        '""'
    );

    return `"${escapedValue}"`;
}


/* CREATE CSV CONTENT */

function createClientsCSV(clients) {
    const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Status",
        "Deal Value",
        "Created At"
    ];

    const rows = clients.map((client) => {
        return [
            client.id,
            client.name,
            client.email,
            client.phone,
            client.company || "",
            client.status,
            client.dealValue,
            client.createdAt
        ]
            .map(escapeCSVValue)
            .join(",");
    });

    const headerRow = headers
        .map(escapeCSVValue)
        .join(",");

    return [
        headerRow,
        ...rows
    ].join("\n");
}


/* EXPORT CLIENTS */

function exportClients() {
    const clients = getClients();

    if (clients.length === 0) {
        showToast(
            "There are no clients to export",
            "info"
        );

        return;
    }

    const shouldExport = window.confirm(
        "Are you sure you want to export all client data?"
    );

    if (!shouldExport) {
        return;
    }

    const csvContent =
        createClientsCSV(clients);

    const csvBlob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const downloadURL =
        URL.createObjectURL(csvBlob);

    const downloadLink =
        document.createElement("a");

    const currentDate = new Date()
        .toISOString()
        .split("T")[0];

    downloadLink.href = downloadURL;

    downloadLink.download =
        `crm-clients-${currentDate}.csv`;

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadURL);

    showToast(
        "Client data exported successfully",
        "success"
    );
}


/* EVENT LISTENERS */

if (exportClientsButton) {
    exportClientsButton.addEventListener(
        "click",
        exportClients
    );
}


/* PAGE INITIALIZATION */

async function initializeDashboard() {
    updateClock();

    window.setInterval(
        updateClock,
        1000
    );

    displayWelcomeMessage();

    try {
        await loadClients();

        displayTotalClients();
        displayActiveDeals();
        displayWonRevenue();
        displayNewThisWeek();
        displayPipelineOverview();
        displayRecentClients();
    } catch (error) {
        console.error(
            "Dashboard data could not be loaded:",
            error
        );

        showToast(
            "Could not load dashboard data.",
            "error"
        );
    }
}

initializeDashboard();