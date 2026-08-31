const dashboardContent = document.querySelector("#dashboard-content");
const dashboardClientState = document.querySelector("#dashboard-client-state");

// The dashboard greeting uses only the first word of the saved full name.
function displayUserName() {
  const session = getSession();
  const userNameElement = document.querySelector("#user-name");
  const fullName = session && session.fullName
    ? session.fullName.trim()
    : "";
  const firstName = fullName ? fullName.split(" ")[0] : "User";

  if (userNameElement) {
    userNameElement.textContent = firstName;
  }
}

function displayCurrentDateTime() {
  const currentDateElement = document.querySelector("#current-date");
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  function updateDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(
      undefined,
      dateOptions
    );
    const formattedTime = currentDate.toLocaleTimeString();

    if (currentDateElement) {
      currentDateElement.textContent = `${formattedDate} • ${formattedTime}`;
    }
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
}

// Statistics are calculated from the same client array shown on the Clients page.
function displayClientStatistics(clients) {
  const totalClients = clients.length;
  const activeDeals = clients.filter((client) => {
    return client.status !== "Won" && client.status !== "Lost";
  }).length;
  const wonRevenue = clients
    .filter((client) => client.status === "Won")
    .reduce((total, client) => {
      return total + (Number(client.dealValue) || 0);
    }, 0);
  const newThisWeek = clients.filter((client) => {
    const daysSinceCreated =
      (Date.now() - new Date(client.createdAt).getTime()) / 86400000;

    return daysSinceCreated >= 0 && daysSinceCreated <= 7;
  }).length;

  const totalClientsElement = document.querySelector("#total-clients");
  const activeDealsElement = document.querySelector("#active-deals");
  const wonRevenueElement = document.querySelector("#won-revenue");
  const newThisWeekElement = document.querySelector("#new-this-week");

  if (totalClientsElement) {
    totalClientsElement.textContent = totalClients;
  }

  if (activeDealsElement) {
    activeDealsElement.textContent = activeDeals;
  }

  if (wonRevenueElement) {
    wonRevenueElement.textContent = `$${wonRevenue.toLocaleString()}`;
  }

  if (newThisWeekElement) {
    newThisWeekElement.textContent = newThisWeek;
  }
}

function displayPipelineOverview(clients) {
  const leadClients = clients.filter((client) => {
    return client.status === "Lead";
  }).length;
  const contactedClients = clients.filter((client) => {
    return client.status === "Contacted";
  }).length;
  const wonClients = clients.filter((client) => {
    return client.status === "Won";
  }).length;
  const lostClients = clients.filter((client) => {
    return client.status === "Lost";
  }).length;

  const leadElement = document.querySelector("#pipeline-lead");
  const contactedElement = document.querySelector("#pipeline-contacted");
  const wonElement = document.querySelector("#pipeline-won");
  const lostElement = document.querySelector("#pipeline-lost");

  if (leadElement) {
    leadElement.textContent = leadClients;
  }

  if (contactedElement) {
    contactedElement.textContent = contactedClients;
  }

  if (wonElement) {
    wonElement.textContent = wonClients;
  }

  if (lostElement) {
    lostElement.textContent = lostClients;
  }
}

function getStatusClass(status) {
  if (status === "Contacted") {
    return "status-contacted";
  }

  if (status === "Won") {
    return "status-won";
  }

  if (status === "Lost") {
    return "status-lost";
  }

  return "status-lead";
}

// A copied array is sorted so the shared client order is not changed.
function displayRecentClients(clients) {
  const recentClientsList = document.querySelector("#recent-clients-list");
  const emptyMessage = document.querySelector("#recent-clients-empty");

  if (!recentClientsList || !emptyMessage) {
    return;
  }

  const recentClients = [...clients]
    .sort((firstClient, secondClient) => {
      const firstDate =
        new Date(firstClient.createdAt).getTime() || 0;
      const secondDate =
        new Date(secondClient.createdAt).getTime() || 0;

      return secondDate - firstDate;
    })
    .slice(0, 5);

  recentClientsList.textContent = "";

  if (recentClients.length === 0) {
    recentClientsList.classList.add("hidden");
    emptyMessage.classList.add("visible");
    return;
  }

  recentClientsList.classList.remove("hidden");
  emptyMessage.classList.remove("visible");

  recentClients.forEach((client) => {
    const clientItem = document.createElement("article");
    const clientInformation = document.createElement("div");
    const clientName = document.createElement("p");
    const clientCompany = document.createElement("p");
    const clientMetadata = document.createElement("div");
    const statusBadge = document.createElement("span");
    const createdDate = document.createElement("time");
    const date = new Date(client.createdAt);
    const hasValidDate = !Number.isNaN(date.getTime());

    clientItem.classList.add("recent-client");
    clientName.classList.add("recent-client-name");
    clientCompany.classList.add("recent-client-company", "text-muted");
    clientMetadata.classList.add("recent-client-metadata");
    statusBadge.classList.add(
      "status-badge",
      getStatusClass(client.status)
    );
    createdDate.classList.add("recent-client-date", "text-muted");

    clientName.textContent = client.name || "Unnamed Client";
    clientCompany.textContent = client.company || "—";
    statusBadge.textContent = client.status || "Lead";
    createdDate.textContent = hasValidDate
      ? date.toLocaleDateString()
      : "Date unavailable";

    if (hasValidDate) {
      createdDate.dateTime = date.toISOString();
    }

    clientInformation.appendChild(clientName);
    clientInformation.appendChild(clientCompany);
    clientMetadata.appendChild(statusBadge);
    clientMetadata.appendChild(createdDate);
    clientItem.appendChild(clientInformation);
    clientItem.appendChild(clientMetadata);
    recentClientsList.appendChild(clientItem);
  });
}

function displayDashboardData(clients) {
  displayClientStatistics(clients);
  displayPipelineOverview(clients);
  displayRecentClients(clients);
}

function showDashboardLoading() {
  dashboardContent.classList.add("hidden");
  dashboardClientState.textContent = "Loading clients...";
  dashboardClientState.classList.remove("hidden");
}

function showDashboardError() {
  dashboardClientState.textContent = "";
  dashboardClientState.classList.remove("hidden");
  dashboardContent.classList.add("hidden");

  const errorMessage = document.createElement("p");
  const retryButton = document.createElement("button");

  errorMessage.textContent = "Could not load dashboard data.";
  retryButton.type = "button";
  retryButton.classList.add("btn", "btn-primary");
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", function () {
    loadDashboardData(true);
  });

  dashboardClientState.appendChild(errorMessage);
  dashboardClientState.appendChild(retryButton);
}

// Retry skips storage and asks the shared loader for a fresh API response.
async function loadDashboardData(forceFreshRequest) {
  showDashboardLoading();

  try {
    const clients = forceFreshRequest
      ? await fetchClientsFromApi()
      : await loadClients();

    dashboardClientState.textContent = "";
    dashboardClientState.classList.add("hidden");
    dashboardContent.classList.remove("hidden");
    displayDashboardData(clients);
  } catch (error) {
    console.error("Could not load dashboard data:", error);
    showDashboardError();
  }
}

displayUserName();
displayCurrentDateTime();
loadDashboardData(false);
