const welcomeMessage = document.querySelector("#welcomeMessage");
const currentTimeElement = document.querySelector("#currentTime");
const currentDateElement = document.querySelector("#currentDate");

const totalClientsElement = document.querySelector("#totalClients");
const activeDealsElement = document.querySelector("#activeDeals");
const wonRevenueElement = document.querySelector("#wonRevenue");
const newThisWeekElement = document.querySelector("#newThisWeek");

const leadCountElement = document.querySelector("#leadCount");
const contactedCountElement = document.querySelector("#contactedCount");
const wonCountElement = document.querySelector("#wonCount");
const lostCountElement = document.querySelector("#lostCount");

const recentClientsContainer = document.querySelector("#recentClients");

initializeDashboard();

async function initializeDashboard() {
  showCurrentUser();
  startClock();

  try {
    const clients = await loadClients();

    renderStatistics(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
  } catch (error) {
    console.error(error);

    recentClientsContainer.innerHTML = `
      <p class="error-message">
        Could not load dashboard data.
      </p>
    `;
  }
}

function showCurrentUser() {
  const session = getStorageItem("crm_session", null);
  const users = getStorageItem("crm_users", []);

  const currentUser = users.find((user) => {
    return user.id === session.userId;
  });

  if (!currentUser) {
    return;
  }

  const firstName = currentUser.fullName.split(" ")[0];

  welcomeMessage.textContent = `Welcome back, ${firstName}!`;
}

function startClock() {
  updateClock();

  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();

  currentTimeElement.textContent = now.toLocaleTimeString();

  currentDateElement.textContent = now.toLocaleDateString();
}

function renderStatistics(clients) {
  const totalClients = clients.length;

  const activeDeals = clients.filter((client) => {
    return client.status !== "Won" && client.status !== "Lost";
  }).length;

  const wonRevenue = clients
    .filter((client) => {
      return client.status === "Won";
    })
    .reduce((total, client) => {
      return total + Number(client.dealValue);
    }, 0);

  const newThisWeek = clients.filter((client) => {
    const clientCreatedAt = new Date(client.createdAt);
    const differenceInMilliseconds =
      Date.now() - clientCreatedAt.getTime();

    const differenceInDays =
      differenceInMilliseconds / 86400000;

    return differenceInDays <= 7;
  }).length;

  totalClientsElement.textContent = totalClients;
  activeDealsElement.textContent = activeDeals;
  wonRevenueElement.textContent =
    `$${wonRevenue.toLocaleString()}`;
  newThisWeekElement.textContent = newThisWeek;
}

function renderPipeline(clients) {
  leadCountElement.textContent = countByStatus(
    clients,
    "Lead"
  );

  contactedCountElement.textContent = countByStatus(
    clients,
    "Contacted"
  );

  wonCountElement.textContent = countByStatus(
    clients,
    "Won"
  );

  lostCountElement.textContent = countByStatus(
    clients,
    "Lost"
  );
}

function countByStatus(clients, status) {
  return clients.filter((client) => {
    return client.status === status;
  }).length;
}

function renderRecentClients(clients) {
  const recentClients = [...clients]
    .sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 5);

  recentClientsContainer.innerHTML = "";

  if (recentClients.length === 0) {
    recentClientsContainer.innerHTML = `
      <p>No clients found.</p>
    `;

    return;
  }

  recentClients.forEach((client) => {
    const clientRow = document.createElement("article");

    clientRow.className = "recent-client-row";

    clientRow.innerHTML = `
      <div>
        <strong>${client.name}</strong>
        <span>${client.company || "No company"}</span>
      </div>

      <span class="status-badge ${getDashboardStatusClass(
        client.status
      )}">
        ${client.status}
      </span>

      <time>
        ${new Date(client.createdAt).toLocaleDateString()}
      </time>
    `;

    recentClientsContainer.appendChild(clientRow);
  });
}

function getDashboardStatusClass(status) {
  switch (status) {
    case "Contacted":
      return "status-contacted";

    case "Won":
      return "status-won";

    case "Lost":
      return "status-lost";

    default:
      return "status-lead";
  }
}