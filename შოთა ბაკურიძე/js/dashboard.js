// dashboard.js
// Builds the Dashboard page: greeting + live clock, 4 stat cards, the
// pipeline breakdown, and a "recent clients" mini-list.

// Runs guard.js's shared setup (auth check, theme, nav highlight,
// logout button) before anything else on this page happens.
initProtectedPage("dashboard");

// getOrLoadClients() is async (it might need to `await fetch(...)`), so
// this whole startup function is async too, and we `await` its result.
async function initDashboard() {
  setGreeting();
  startClock();

  const clients = await getOrLoadClients(); // from data.js

  renderStatCards(clients);
  renderPipeline(clients);
  renderRecentClients(clients);
}

function setGreeting() {
  const session = getSession();
  const users = getUsers();
  const currentUser = users.find((u) => u.id === session.userId);
  const firstName = currentUser ? currentUser.fullName.split(" ")[0] : "there";
  document.getElementById("greeting").textContent = `Welcome, ${firstName}!`;
}

function startClock() {
  const clockEl = document.getElementById("clock");

  function tick() {
    // toLocaleString() formats a Date into a readable local date+time string.
    clockEl.textContent = new Date().toLocaleString();
  }

  tick(); // show immediately, don't wait 1 full second for the first tick
  setInterval(tick, 1000); // then update every second
}

function renderStatCards(clients) {
  const totalClients = clients.length;
  const activeDeals = clients.filter(
    (c) => c.status !== "Won" && c.status !== "Lost"
  ).length;

  // reduce() walks the array once, accumulating a running total. Here we
  // only add dealValue for clients whose status is "Won".
  const wonRevenue = clients
    .filter((c) => c.status === "Won")
    .reduce((total, c) => total + c.dealValue, 0);

  // "New this week" = createdAt within the last 7 days.
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = clients.filter(
    (c) => new Date(c.createdAt).getTime() >= oneWeekAgo
  ).length;

  const stats = [
    { label: "Total Clients", value: totalClients },
    { label: "Active Deals", value: activeDeals },
    { label: "Won Revenue", value: `$${wonRevenue.toLocaleString()}` },
    { label: "New This Week", value: newThisWeek },
  ];

  const container = document.getElementById("stat-cards");
  container.innerHTML = ""; // clear before rebuilding
  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    container.appendChild(card);
  });
}

function renderPipeline(clients) {
  const statuses = ["New", "Contacted", "Negotiation", "Won", "Lost"];
  const container = document.getElementById("pipeline-row");
  container.innerHTML = "";

  statuses.forEach((status) => {
    const count = clients.filter((c) => c.status === status).length;
    const item = document.createElement("div");
    item.className = "pipeline-item";
    item.innerHTML = `<div class="stat-value">${count}</div><div class="stat-label">${status}</div>`;
    container.appendChild(item);
  });
}

function renderRecentClients(clients) {
  // Sort a COPY (slice()) by createdAt, newest first, then take the top 5.
  // We copy first so we never reorder the original `clients` array that
  // other parts of the app rely on staying in its original order.
  const recent = clients
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById("recent-clients");
  container.innerHTML = "";

  if (recent.length === 0) {
    container.textContent = "No clients yet.";
    return;
  }

  recent.forEach((client) => {
    const row = document.createElement("div");
    row.style.padding = "8px 0";
    row.style.borderBottom = "1px solid #eee";
    row.innerHTML = `
      <strong>${client.name}</strong> - ${client.company}
      <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
    `;
    container.appendChild(row);
  });
}

initDashboard();
