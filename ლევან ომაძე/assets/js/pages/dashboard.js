function calculateStats(clients) {
  const wonDeals = clients.filter((client) => client.status === "Won");
  const openDeals = clients.filter((client) => !["Won", "Lost"].includes(client.status));
  const wonRevenue = wonDeals.reduce((sum, client) => sum + Number(client.dealValue || 0), 0);
  const newThisWeek = clients.filter((client) => {
    const daysOld = (Date.now() - new Date(client.createdAt).getTime()) / 86400000;
    return daysOld <= 7;
  });
  return [
    { label: "Total clients", value: clients.length },
    { label: "Active Deals", value: openDeals.length },
    { label: "Won Revenue", value: formatCurrency(wonRevenue) },
    { label: "New This Week", value: newThisWeek.length },
  ];
}

function renderStats(clients) {
  const grid = document.querySelector("#stats-grid");
  grid.innerHTML = "";
  calculateStats(clients).forEach((stat) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `<p>${stat.label}</p><strong>${stat.value}</strong>`;
    grid.append(card);
  });
}

function renderPipeline(clients) {
  const wrapper = document.querySelector("#pipeline-list");
  const total = Math.max(clients.length, 1);
  wrapper.innerHTML = "";
  CLIENT_STATUSES.filter((status) => status !== "All").forEach((status) => {
    const count = clients.filter((client) => client.status === status).length;
    const row = document.createElement("div");
    row.className = "pipeline-row";
    row.innerHTML = `
      <strong>${status}</strong>
      <span class="pipeline-bar"><span class="pipeline-fill" style="width: ${(count / total) * 100}%"></span></span>
      <span class="muted">${count}</span>
    `;
    wrapper.append(row);
  });
}

function renderRecentClients(clients) {
  const wrapper = document.querySelector("#recent-clients");
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recentClients.length === 0) {
    wrapper.innerHTML = "<p class='muted'>No clients yet. Add your first client from the Clients page.</p>";
    return;
  }

  wrapper.innerHTML = "";
  recentClients.forEach((client) => {
    const row = document.createElement("div");
    row.className = "compact-row";
    row.innerHTML = `
      <span class="avatar" aria-hidden="true">${initials(client.name)}</span>
      <div class="client-meta">
        <h3>${client.name}</h3>
        <p class="muted">${client.company} · ${client.status} · ${formatDate(client.createdAt)}</p>
      </div>
    `;
    wrapper.append(row);
  });
}

function startClock() {
  const clock = document.querySelector("#live-clock");
  const updateClock = () => {
    clock.textContent = new Date().toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  updateClock();
  window.setInterval(updateClock, 1000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = requireAuth();
  if (!user) return;
  const firstName = user.fullName.split(" ")[0];
  document.querySelector("#welcome-title").textContent = `Welcome back, ${firstName}!`;
  startClock();

  try {
    const clients = await ensureClientsLoaded();
    renderStats(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
  } catch (error) {
    document.querySelector("#stats-grid").innerHTML = `
      <section class="error-state">
        <h2>Could not load dashboard</h2>
        <p>${error.message}</p>
      </section>
    `;
  }
});
