const STATUSES = ["Lead", "Contacted", "Won", "Lost"];

const BADGE_CLASSES = {
  Lead: "badge-lead",
  Contacted: "badge-contacted",
  Won: "badge-won",
  Lost: "badge-lost",
};

function renderWelcome() {
  const user = getCurrentUser();
  const firstName = user ? user.fullName.split(" ")[0] : "there";
  document.getElementById("welcome-text").textContent =
    "Welcome back, " + firstName + "!";
}

function updateClock() {
  const now = new Date();
  document.getElementById("live-clock").textContent =
    now.toLocaleDateString() + " · " + now.toLocaleTimeString();
}

function renderStats(clients) {
  document.getElementById("stat-total").textContent = clients.length;

  const activeDeals = clients.filter(function (c) {
    return c.status !== "Won" && c.status !== "Lost";
  }).length;
  document.getElementById("stat-active").textContent = activeDeals;

  const wonRevenue = clients
    .filter(function (c) {
      return c.status === "Won";
    })
    .reduce(function (sum, c) {
      return sum + c.dealValue;
    }, 0);
  document.getElementById("stat-revenue").textContent = formatMoney(wonRevenue);

  const newThisWeek = clients.filter(function (c) {
    return (Date.now() - new Date(c.createdAt)) / 86400000 <= 7;
  }).length;
  document.getElementById("stat-new").textContent = newThisWeek;
}

function renderPipeline(clients) {
  const counts = clients.reduce(function (acc, c) {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const container = document.getElementById("pipeline");
  container.innerHTML = "";

  STATUSES.forEach(function (status) {
    const item = document.createElement("div");
    item.className = "pipeline-item";
    item.innerHTML =
      '<div class="count">' +
      (counts[status] || 0) +
      "</div>" +
      '<div class="label">' +
      status +
      "</div>";
    container.appendChild(item);
  });
}

function renderRecent(clients) {
  const recent = clients
    .slice()
    .sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 5);

  const container = document.getElementById("recent-clients");
  container.innerHTML = "";

  if (recent.length === 0) {
    container.innerHTML = '<p class="list-message">No clients yet.</p>';
    return;
  }

  recent.forEach(function (client) {
    const row = document.createElement("div");
    row.className = "recent-row";

    const badgeClass = BADGE_CLASSES[client.status] || "badge-lead";
    row.innerHTML =
      '<span class="who"></span>' +
      '<span class="company"></span>' +
      '<span class="badge ' +
      badgeClass +
      '">' +
      client.status +
      "</span>" +
      '<span class="date">' +
      new Date(client.createdAt).toLocaleDateString() +
      "</span>";
    row.querySelector(".who").textContent = client.name;
    row.querySelector(".company").textContent = client.company || "—";

    container.appendChild(row);
  });
}

async function initDashboard() {
  renderWelcome();
  updateClock();
  setInterval(updateClock, 1000);

  try {
    const clients = await loadClients();
    renderStats(clients);
    renderPipeline(clients);
    renderRecent(clients);
  } catch (error) {
    document.getElementById("recent-clients").innerHTML =
      '<p class="list-message">Could not load clients. Check your connection and try again.</p>';
    renderStats([]);
    renderPipeline([]);
  }
}

initDashboard();
