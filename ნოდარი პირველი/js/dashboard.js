document.addEventListener("DOMContentLoaded", async function () {
  const session = getSession();
  const users = getUsers();
  const currentUser = users.find(function (u) {
    return u.id === session.userId;
  });
  const firstName = currentUser ? currentUser.fullName.split(" ")[0] : "there";

  document.getElementById("greeting-text").textContent =
    "Welcome back, " + firstName + "!";

  function updateClock() {
    const now = new Date();
    document.getElementById("dash-clock").textContent =
      now.toLocaleDateString() + " \u00b7 " + now.toLocaleTimeString();
  }
  updateClock();
  setInterval(updateClock, 1000);

  await ensureClientsLoaded();
  renderDashboardStats(clientsState);
  renderPipelineOverview(clientsState);
  renderRecentClients(clientsState);
});

function renderDashboardStats(clients) {
  document.getElementById("stat-total").textContent = clients.length;

  const active = clients.filter(function (c) {
    return c.status !== "Won" && c.status !== "Lost";
  });
  document.getElementById("stat-active").textContent = active.length;

  const wonRevenue = clients
    .filter(function (c) {
      return c.status === "Won";
    })
    .reduce(function (sum, c) {
      return sum + c.dealValue;
    }, 0);
  document.getElementById("stat-revenue").textContent =
    formatCurrency(wonRevenue);

  const newThisWeek = clients.filter(function (c) {
    const daysSince = (Date.now() - new Date(c.createdAt)) / 86400000;
    return daysSince <= 7;
  });
  document.getElementById("stat-new").textContent = newThisWeek.length;
}

function renderPipelineOverview(clients) {
  const statuses = ["Lead", "Contacted", "Won", "Lost"];
  const container = document.getElementById("pipeline-overview");
  container.innerHTML = "";

  statuses.forEach(function (status) {
    const count = clients.filter(function (c) {
      return c.status === status;
    }).length;
    const row = document.createElement("div");
    row.className = "pipeline-row";
    row.innerHTML = "<span>" + status + "</span><span>" + count + "</span>";
    container.appendChild(row);
  });
}

function renderRecentClients(clients) {
  const sorted = clients.slice().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const recent = sorted.slice(0, 5);

  const container = document.getElementById("recent-clients");
  container.innerHTML = "";

  recent.forEach(function (client) {
    const row = document.createElement("div");
    row.className = "recent-item";
    row.innerHTML =
      "<span>" +
      client.name +
      "</span>" +
      '<span class="status-badge ' +
      statusBadgeClass(client.status) +
      '">' +
      client.status +
      "</span>";
    container.appendChild(row);
  });
}
