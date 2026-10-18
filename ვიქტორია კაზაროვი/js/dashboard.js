// Reads saved client data and renders the read-only Dashboard overview.

// One formatter keeps every displayed deal value in consistent USD format.
const dashboardCurrencyFormatter = new Intl.NumberFormat("en-US", {
  // Reuse this formatter instead of rebuilding it for every card.
  style: "currency",
  currency: "USD"
});

function formatDashboardCurrency(value) {
  // Convert stored text/numbers into a safe value for the formatter.
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return dashboardCurrencyFormatter.format(safeValue);
}

// Dashboard greeting and live date/time header.
function getDashboardUser() {
  return getUserForSession(getSession(), getUsers());
}

function renderDashboardGreeting() {
  // Use only the first word of the name for a friendlier greeting.
  const greeting = document.getElementById("dashboard-greeting");
  const currentUser = getDashboardUser();
  const fullName =
    currentUser && typeof currentUser.fullName === "string"
      ? currentUser.fullName.trim()
      : "";
  const firstName = fullName === "" ? "there" : fullName.split(/\s+/)[0];

  if (greeting) {
    greeting.textContent = `Welcome back, ${firstName}!`;
  }
}

function renderDashboardClock() {
  // Create one Date so the date and time always match the same moment.
  const dateElement = document.getElementById("dashboard-date");
  const timeElement = document.getElementById("dashboard-time");
  const currentDate = new Date();

  if (dateElement) {
    dateElement.textContent = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  if (timeElement) {
    timeElement.textContent = currentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }
}

// Calculates card totals and status counts without modifying client data.
function calculateDashboardStats(clients) {
  const totalClients = clients.length;
  // length is the number of items in the clients array.
  const activeDeals = clients.filter(function (client) {
    // Leads and contacted clients are still active; won/lost are finished.
    return client.status !== "Won" && client.status !== "Lost";
  }).length;
  const wonRevenue = clients
    // First keep only won deals, then add their values together.
    .filter(function (client) {
      return client.status === "Won";
    })
    .reduce(function (total, client) {
      const dealValue = Number(client.dealValue);
      return total + (Number.isFinite(dealValue) ? dealValue : 0);
    }, 0);
  const newThisWeek = clients.filter(function (client) {
    const timestamp = Date.parse(client.createdAt);

    if (!Number.isFinite(timestamp)) {
      // Ignore clients with a bad date instead of guessing their age.
      return false;
    }

    // 86,400,000 is the number of milliseconds in one day.
    const ageInDays = (Date.now() - timestamp) / 86400000;
    return ageInDays >= 0 && ageInDays <= 7;
  }).length;
  const statusCounts = clients.reduce(
    // Start every status count at zero, then add one per matching client.
    function (counts, client) {
      if (Object.prototype.hasOwnProperty.call(counts, client.status)) {
        counts[client.status] += 1;
      }

      return counts;
    },
    {
      Lead: 0,
      Contacted: 0,
      Won: 0,
      Lost: 0
    }
  );

  return {
    totalClients: totalClients,
    activeDeals: activeDeals,
    wonRevenue: wonRevenue,
    newThisWeek: newThisWeek,
    statusCounts: statusCounts
  };
}

// Safely updates the statistic cards and their text values.
function setDashboardText(elementId, value) {
  // Skip safely when this script is loaded on a different page.
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

function renderDashboardStats(stats) {
  setDashboardText("total-clients", stats.totalClients);
  setDashboardText("active-deals", stats.activeDeals);
  setDashboardText(
    "won-revenue",
    formatDashboardCurrency(stats.wonRevenue)
  );
  setDashboardText("new-this-week", stats.newThisWeek);
  setDashboardText("lead-status-count", stats.statusCounts.Lead);
  setDashboardText(
    "contacted-status-count",
    stats.statusCounts.Contacted
  );
  setDashboardText("won-status-count", stats.statusCounts.Won);
  setDashboardText("lost-status-count", stats.statusCounts.Lost);
}

// Converts status counts into percentages for the pipeline chart and legend.
function updateStatusBars(statusCounts, totalClients) {
  const pipelineStatuses = [
    {
      percentageId: "lead-status-percentage",
      label: "Lead",
      count: statusCounts.Lead
    },
    {
      percentageId: "contacted-status-percentage",
      label: "Contacted",
      count: statusCounts.Contacted
    },
    {
      percentageId: "won-status-percentage",
      label: "Won",
      count: statusCounts.Won
    },
    {
      percentageId: "lost-status-percentage",
      label: "Lost",
      count: statusCounts.Lost
    }
  ];
  const chart = document.getElementById("pipeline-chart");
  const pipelineTotal = document.getElementById("pipeline-total");
  const percentages = pipelineStatuses.map(function (status) {
    const rawPercentage =
      totalClients === 0 ? 0 : (status.count / totalClients) * 100;

    // Clamp values so unexpected data can never overflow the visual chart.
    return Math.min(100, Math.max(0, rawPercentage));
  });

  pipelineStatuses.forEach(function (status, index) {
    // index matches this status to its calculated percentage.
    const percentageElement = document.getElementById(
      status.percentageId
    );

    if (percentageElement) {
      percentageElement.textContent = `${Math.round(percentages[index])}%`;
    }
  });

  if (pipelineTotal) {
    pipelineTotal.textContent = totalClients;
  }

  if (!chart) {
    return;
  }

  const leadEnd = percentages[0];
  const contactedEnd = leadEnd + percentages[1];
  const wonEnd = contactedEnd + percentages[2];

  chart.style.setProperty("--lead-end", leadEnd);
  // CSS reads these custom properties to draw the segmented pipeline bar.
  chart.style.setProperty("--contacted-end", contactedEnd);
  chart.style.setProperty("--won-end", wonEnd);
  chart.classList.toggle("empty", totalClients === 0);
  chart.setAttribute(
    "aria-label",
    pipelineStatuses
      .map(function (status, index) {
        return `${status.label}: ${status.count} clients, ${Math.round(
          percentages[index]
        )} percent`;
      })
      .join(". ")
  );
}

// Recent-client helpers safely handle missing dates, statuses, and images.
function getDashboardClientTimestamp(createdAt) {
  const timestamp = Date.parse(createdAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getRecentClients(clients) {
  // Newest timestamps sort first; take only the first five results.
  return [...clients]
    .sort(function (firstClient, secondClient) {
      return (
        getDashboardClientTimestamp(secondClient.createdAt) -
        getDashboardClientTimestamp(firstClient.createdAt)
      );
    })
    .slice(0, 5);
}

function getDashboardStatusClass(status) {
  const statusClasses = {
    Lead: "status-lead",
    Contacted: "status-contacted",
    Won: "status-won",
    Lost: "status-lost"
  };

  return statusClasses[status] || "";
}

function formatDashboardDate(createdAt) {
  const timestamp = Date.parse(createdAt);

  if (!Number.isFinite(timestamp)) {
    return "Date unavailable";
  }

  return new Date(timestamp).toLocaleDateString();
}

function getDashboardClientInitials(name) {
  if (typeof name !== "string") {
    return "U";
  }

  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "U";
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function createDashboardClientAvatar(client) {
  // The image error handler gives broken photos a text fallback.
  const avatar = document.createElement("span");
  avatar.className = "recent-client-avatar";

  if (client.image) {
    const image = document.createElement("img");
    image.className = "recent-client-avatar-image";
    image.src = client.image;
    image.alt = `${client.name || "Client"} avatar`;
    image.addEventListener(
      "error",
      function () {
        avatar.textContent = getDashboardClientInitials(client.name);
        avatar.setAttribute("aria-hidden", "true");
      },
      { once: true }
    );
    avatar.appendChild(image);
  } else {
    avatar.textContent = getDashboardClientInitials(client.name);
    avatar.setAttribute("aria-hidden", "true");
  }

  return avatar;
}

// Builds the five newest client rows with DOM methods instead of HTML strings.
function renderRecentClients(clients) {
  const recentClientsElement = document.getElementById("recent-clients");

  if (!recentClientsElement) {
    return;
  }

  recentClientsElement.replaceChildren();

  if (clients.length === 0) {
    // Avoid rendering an empty list with no explanation.
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No recent clients to display.";
    recentClientsElement.appendChild(emptyMessage);
    return;
  }

  clients.forEach(function (client) {
    const recentClientItem = document.createElement("article");
    recentClientItem.className = "recent-client-item";

    const recentClientLeading = document.createElement("div");
    recentClientLeading.className = "recent-client-leading";

    const recentClientAvatar = createDashboardClientAvatar(client);

    const recentClientInfo = document.createElement("div");
    recentClientInfo.className = "recent-client-info";

    const recentClientName = document.createElement("h3");
    recentClientName.className = "recent-client-name";
    recentClientName.textContent = client.name || "Unnamed client";

    const recentClientCompany = document.createElement("p");
    recentClientCompany.className = "recent-client-company";
    recentClientCompany.textContent = client.company || "No company";

    const recentClientMeta = document.createElement("div");
    recentClientMeta.className = "recent-client-meta";

    const statusBadge = document.createElement("span");
    statusBadge.className = "status-badge";
    const statusClass = getDashboardStatusClass(client.status);

    if (statusClass !== "") {
      statusBadge.classList.add(statusClass);
    }

    statusBadge.textContent = client.status || "Unknown";

    const dateAdded = document.createElement("time");
    dateAdded.dateTime = client.createdAt || "";
    dateAdded.textContent = formatDashboardDate(client.createdAt);

    recentClientInfo.append(recentClientName, recentClientCompany);
    recentClientMeta.append(statusBadge, dateAdded);
    recentClientLeading.append(recentClientAvatar, recentClientInfo);
    recentClientItem.append(recentClientLeading, recentClientMeta);
    recentClientsElement.appendChild(recentClientItem);
  });
}

// Loading and error messages for the Dashboard data request.
function showDashboardLoading() {
  const statusElement = document.getElementById("dashboard-status");

  if (!statusElement) {
    return;
  }

  statusElement.className = "status-message loading";
  statusElement.textContent = "Loading dashboard data...";
}

function clearDashboardStatus() {
  const statusElement = document.getElementById("dashboard-status");

  if (statusElement) {
    statusElement.className = "dashboard-status";
    statusElement.replaceChildren();
  }
}

function showDashboardError() {
  const statusElement = document.getElementById("dashboard-status");

  if (!statusElement) {
    return;
  }

  const message = document.createElement("p");
  message.textContent = "Unable to load dashboard data.";

  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "retry-dashboard-button";
  retryButton.textContent = "Retry";
  retryButton.addEventListener("click", initializeDashboardData);

  statusElement.className =
    "status-message error dashboard-load-error";
  statusElement.replaceChildren(message, retryButton);
}

// Renders all Dashboard sections from one client array.
function renderDashboardData(clients) {
  const stats = calculateDashboardStats(clients);
  renderDashboardStats(stats);
  updateStatusBars(stats.statusCounts, stats.totalClients);
  renderRecentClients(getRecentClients(clients));
}

async function initializeDashboardData() {
  if (!hasStoredClients()) {
    showDashboardLoading();
  }

  try {
    // loadClients returns cached data when possible and fetches only when needed.
    const clients = await loadClients();
    clearDashboardStatus();
    renderDashboardData(clients);
  } catch (error) {
    // Show a retry button instead of leaving the dashboard blank.
    showDashboardError();
  }
}

// Starts the page only when its expected Dashboard elements are present.
document.addEventListener("DOMContentLoaded", function () {
  const dashboardStats = document.getElementById("dashboard-stats");
  const statusSummary = document.getElementById("status-summary");
  const recentClientsElement = document.getElementById("recent-clients");

  if (!dashboardStats || !statusSummary || !recentClientsElement) {
    return;
  }

  renderDashboardGreeting();
  renderDashboardClock();
  setInterval(renderDashboardClock, 1000);
  initializeDashboardData();
});
