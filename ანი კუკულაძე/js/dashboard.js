import { getStorageData } from "./storage.js";

const welcomeMessage = document.getElementById("welcomeMessage");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const totalClients = document.getElementById("totalClients");
const activeDeals = document.getElementById("activeDeals");
const wonRevenue = document.getElementById("wonRevenue");
const newThisWeek = document.getElementById("newThisWeek");

const leadCount = document.getElementById("leadCount");
const contactedCount = document.getElementById("contactedCount");
const wonCount = document.getElementById("wonCount");
const lostCount = document.getElementById("lostCount");

const recentClientsList =
  document.getElementById("recentClientsList");

// Load current session and registered users
const session = getStorageData("crm_session", null);
const users = getStorageData("crm_users", []);

if (session && users.length > 0) {
  const currentUser = users.find(function (user) {
    return user.id === session.userId;
  });

  if (currentUser) {
    const firstName = currentUser.fullName
      .trim()
      .split(" ")[0];

    welcomeMessage.textContent =
      `Welcome back, ${firstName}!`;
  }
}

// Update current date and time
function updateClock() {
  const now = new Date();

  currentDate.textContent =
    now.toLocaleDateString();

  currentTime.textContent =
    now.toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);

// Load clients from storage
const clients = getStorageData("crm_clients", []);

if (clients.length > 0) {
  updateDashboard(clients);
} else {
  showEmptyDashboard();
}

// Update dashboard information
function updateDashboard(clients) {
  // Total Clients
  totalClients.textContent = clients.length;

  // Active Deals
  const activeClients = clients.filter(function (client) {
    return (
      client.status !== "Won" &&
      client.status !== "Lost"
    );
  });

  activeDeals.textContent = activeClients.length;

  // Won Revenue
  const wonClients = clients.filter(function (client) {
    return client.status === "Won";
  });

  const totalRevenue = wonClients.reduce(
    function (sum, client) {
      return sum + Number(client.dealValue);
    },
    0
  );

  wonRevenue.textContent =
    "$" + totalRevenue.toLocaleString();

  // New This Week
  const recentWeekClients = clients.filter(
    function (client) {
      const createdAt =
        new Date(client.createdAt);

      const difference =
        Date.now() - createdAt.getTime();

      const days =
        difference / 86400000;

      return days <= 7;
    }
  );

  newThisWeek.textContent =
    recentWeekClients.length;

  // Pipeline Overview
  const leadClients = clients.filter(function (client) {
    return client.status === "Lead";
  });

  const contactedClients = clients.filter(
    function (client) {
      return client.status === "Contacted";
    }
  );

  const wonStatusClients = clients.filter(
    function (client) {
      return client.status === "Won";
    }
  );

  const lostClients = clients.filter(function (client) {
    return client.status === "Lost";
  });

  leadCount.textContent = leadClients.length;
  contactedCount.textContent = contactedClients.length;
  wonCount.textContent = wonStatusClients.length;
  lostCount.textContent = lostClients.length;

  renderRecentClients(clients);
}

// Render five most recent clients
function renderRecentClients(clients) {
  const recentClients = clients
    .slice()
    .sort(function (firstClient, secondClient) {
      return (
        new Date(secondClient.createdAt) -
        new Date(firstClient.createdAt)
      );
    })
    .slice(0, 5);

  if (recentClients.length === 0) {
    recentClientsList.innerHTML =
      '<p class="empty-message">No clients found.</p>';

    return;
  }

  const recentClientsHTML = recentClients
    .map(function (client) {
      const image =
        client.image ||
        "https://dummyjson.com/icon/default/128";

      return `
        <div class="recent-client-row">
          <div class="recent-client-main">
            <img
              src="${image}"
              alt="${client.name}"
              class="recent-client-avatar"
            >

            <div class="recent-client-info">
              <p class="recent-client-name">
                ${client.name}
              </p>

              <p class="recent-client-email">
                ${client.email}
              </p>
            </div>
          </div>

          <span class="recent-client-company">
            ${client.company || "No company"}
          </span>

          <span class="status-badge ${getStatusClass(client.status)}">
            ${client.status}
          </span>

          <span class="recent-client-date">
            ${formatClientDate(client.createdAt)}
          </span>
        </div>
      `;
    })
    .join("");

  recentClientsList.innerHTML = recentClientsHTML;
}

// Get client initials
function getInitials(name) {
  if (!name) {
    return "?";
  }

  const nameParts = name
    .trim()
    .split(" ")
    .filter(function (part) {
      return part !== "";
    });

  if (nameParts.length === 0) {
    return "?";
  }

  let initials = nameParts[0][0];

  if (nameParts.length > 1) {
    initials +=
      nameParts[nameParts.length - 1][0];
  }

  return initials.toUpperCase();
}

// Format client date
function formatClientDate(createdAt) {
  const date = new Date(createdAt);

  if (isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString();
}

// Return status class
function getStatusClass(status) {
  if (status === "Lead") {
    return "status-lead";
  }

  if (status === "Contacted") {
    return "status-contacted";
  }

  if (status === "Won") {
    return "status-won";
  }

  if (status === "Lost") {
    return "status-lost";
  }

  return "";
}

// Show empty dashboard
function showEmptyDashboard() {
  totalClients.textContent = "0";
  activeDeals.textContent = "0";
  wonRevenue.textContent = "$0";
  newThisWeek.textContent = "0";

  leadCount.textContent = "0";
  contactedCount.textContent = "0";
  wonCount.textContent = "0";
  lostCount.textContent = "0";

  recentClientsList.innerHTML =
    '<p class="empty-message">No clients found.</p>';
}