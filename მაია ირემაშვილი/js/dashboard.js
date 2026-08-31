const welcomeMessage =
    document.getElementById("welcomeMessage");

const liveClock =
    document.getElementById("liveClock");

const totalClientsElement =
    document.getElementById("totalClients");

const activeDealsElement =
    document.getElementById("activeDeals");

const wonRevenueElement =
    document.getElementById("wonRevenue");

const newThisWeekElement =
    document.getElementById("newThisWeek");

const leadCountElement =
    document.getElementById("leadCount");

const contactedCountElement =
    document.getElementById("contactedCount");

const wonCountElement =
    document.getElementById("wonCount");

const lostCountElement =
    document.getElementById("lostCount");

const leadPercentElement =
    document.getElementById("leadPercent");

const contactedPercentElement =
    document.getElementById("contactedPercent");

const wonPercentElement =
    document.getElementById("wonPercent");

const lostPercentElement =
    document.getElementById("lostPercent");

const pipelinePieChart =
    document.getElementById("pipelinePieChart");

const pipelineValueElement =
    document.getElementById("pipelineValue");

const averageDealElement =
    document.getElementById("averageDeal");

const winRateElement =
    document.getElementById("winRate");

const recentClientsElement =
    document.getElementById("recentClients");


function getCurrentUser() {
    const session =
        getStorageItem(STORAGE_KEYS.SESSION);

    const users =
        getStorageItem(STORAGE_KEYS.USERS) || [];

    if (!session) {
        return null;
    }

    return users.find(function (user) {
        return user.id === session.userId;
    });
}


function showWelcomeMessage() {
    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        welcomeMessage.textContent =
            "Welcome back!";

        return;
    }

    const firstName =
        currentUser.fullName.split(" ")[0];

    welcomeMessage.textContent =
        `Welcome back, ${firstName}!`;
}


function updateClock() {
    const now =
        new Date();

    liveClock.textContent =
        now.toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}


function formatDashboardMoney(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}


function formatClientDate(dateValue) {
    if (!dateValue) {
        return "No date";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "No date";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


function getClientInitials(name) {
    if (!name) {
        return "?";
    }

    const nameParts =
        name
            .trim()
            .split(" ")
            .filter(Boolean);

    return nameParts
        .slice(0, 2)
        .map(function (part) {
            return part.charAt(0).toUpperCase();
        })
        .join("");
}


function calculatePercentage(
    value,
    total
) {
    if (total === 0) {
        return 0;
    }

    return Math.round(
        (value / total) * 100
    );
}


function updatePieChart(
    totalClients,
    leadCount,
    contactedCount,
    wonCount,
    lostCount
) {
    if (totalClients === 0) {
        pipelinePieChart.style.background =
            "#d1d5db";

        return;
    }

    const leadPercent =
        (leadCount / totalClients) * 100;

    const contactedPercent =
        (contactedCount / totalClients) * 100;

    const wonPercent =
        (wonCount / totalClients) * 100;

    const leadEnd =
        leadPercent;

    const contactedEnd =
        leadEnd + contactedPercent;

    const wonEnd =
        contactedEnd + wonPercent;

    pipelinePieChart.style.background = `
        conic-gradient(
            #3b82f6 0% ${leadEnd}%,
            #f59e0b ${leadEnd}% ${contactedEnd}%,
            #22c55e ${contactedEnd}% ${wonEnd}%,
            #ef4444 ${wonEnd}% 100%
        )
    `;
}


function calculateStatistics(clients) {
    const totalClients =
        clients.length;

    const activeClients =
        clients.filter(function (client) {
            return (
                client.status !== "Won" &&
                client.status !== "Lost"
            );
        });

    const activeDeals =
        activeClients.length;

    const wonClients =
        clients.filter(function (client) {
            return client.status === "Won";
        });

    const wonRevenue =
        wonClients.reduce(function (
            total,
            client
        ) {
            return (
                total +
                Number(client.dealValue || 0)
            );
        }, 0);

    const pipelineValue =
        activeClients.reduce(function (
            total,
            client
        ) {
            return (
                total +
                Number(client.dealValue || 0)
            );
        }, 0);

    const totalDealValue =
        clients.reduce(function (
            total,
            client
        ) {
            return (
                total +
                Number(client.dealValue || 0)
            );
        }, 0);

    const averageDeal =
        totalClients > 0
            ? totalDealValue / totalClients
            : 0;

    const closedDeals =
        clients.filter(function (client) {
            return (
                client.status === "Won" ||
                client.status === "Lost"
            );
        }).length;

    const winRate =
        closedDeals > 0
            ? Math.round(
                (
                    wonClients.length /
                    closedDeals
                ) * 100
            )
            : 0;

    const sevenDaysAgo =
        new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    const newThisWeek =
        clients.filter(function (client) {
            return (
                new Date(client.createdAt) >=
                sevenDaysAgo
            );
        }).length;

    const leadCount =
        clients.filter(function (client) {
            return client.status === "Lead";
        }).length;

    const contactedCount =
        clients.filter(function (client) {
            return client.status === "Contacted";
        }).length;

    const wonCount =
        wonClients.length;

    const lostCount =
        clients.filter(function (client) {
            return client.status === "Lost";
        }).length;

    const leadPercent =
        calculatePercentage(
            leadCount,
            totalClients
        );

    const contactedPercent =
        calculatePercentage(
            contactedCount,
            totalClients
        );

    const wonPercent =
        calculatePercentage(
            wonCount,
            totalClients
        );

    const lostPercent =
        calculatePercentage(
            lostCount,
            totalClients
        );


    totalClientsElement.textContent =
        totalClients;

    activeDealsElement.textContent =
        activeDeals;

    wonRevenueElement.textContent =
        formatDashboardMoney(
            wonRevenue
        );

    newThisWeekElement.textContent =
        newThisWeek;

    leadCountElement.textContent =
        leadCount;

    contactedCountElement.textContent =
        contactedCount;

    wonCountElement.textContent =
        wonCount;

    lostCountElement.textContent =
        lostCount;

    leadPercentElement.textContent =
        `${leadPercent}%`;

    contactedPercentElement.textContent =
        `${contactedPercent}%`;

    wonPercentElement.textContent =
        `${wonPercent}%`;

    lostPercentElement.textContent =
        `${lostPercent}%`;

    pipelineValueElement.textContent =
        formatDashboardMoney(
            pipelineValue
        );

    averageDealElement.textContent =
        formatDashboardMoney(
            averageDeal
        );

    winRateElement.textContent =
        `${winRate}%`;


    updatePieChart(
        totalClients,
        leadCount,
        contactedCount,
        wonCount,
        lostCount
    );
}


function renderRecentClients(clients) {
    recentClientsElement.innerHTML = "";

    if (clients.length === 0) {
        recentClientsElement.innerHTML =
            "<p>No clients found.</p>";

        return;
    }

    const recentClients =
        [...clients]
            .sort(function (
                firstClient,
                secondClient
            ) {
                return (
                    new Date(
                        secondClient.createdAt
                    ) -
                    new Date(
                        firstClient.createdAt
                    )
                );
            })
            .slice(0, 5);

    recentClients.forEach(function (client) {
        const clientElement =
            document.createElement("div");

        clientElement.className =
            "recent-client-item recent-client-row";

        const imageMarkup =
            client.image
                ? `
                    <img
                        src="${client.image}"
                        alt="${client.name}"
                        class="recent-client-avatar"
                    >
                `
                : `
                    <div class="recent-client-avatar recent-client-initials">
                        ${getClientInitials(client.name)}
                    </div>
                `;

        clientElement.innerHTML = `
            <div class="recent-client-main">

                ${imageMarkup}

                <div class="recent-client-copy">

                    <strong>
                        ${client.name}
                    </strong>

                    <p>
                        ${client.company || "No company"}
                    </p>

                    <small>
                        ${formatClientDate(client.createdAt)}
                    </small>

                </div>

            </div>

            <div class="recent-client-deal">

                <span>
                    Deal Value
                </span>

                <strong>
                    ${formatDashboardMoney(
                        Number(client.dealValue || 0)
                    )}
                </strong>

            </div>

            <span
                class="status-badge status-${client.status.toLowerCase()}"
            >
                ${client.status}
            </span>
        `;

        recentClientsElement.appendChild(
            clientElement
        );
    });
}


async function initializeDashboard() {
    showWelcomeMessage();

    updateClock();

    setInterval(
        updateClock,
        1000
    );

    try {
        const clients =
            await loadClients();

        calculateStatistics(
            clients
        );

        renderRecentClients(
            clients
        );
    } catch (error) {
        console.error(
            error
        );

        recentClientsElement.innerHTML =
            "<p>Could not load dashboard data.</p>";
    }
}


initializeDashboard();