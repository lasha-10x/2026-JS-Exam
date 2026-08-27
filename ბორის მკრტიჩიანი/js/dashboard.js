// ─── State ────────────────────────────────────────────────────────────────────
let allClients = [];
let dateFrom = null;
let dateTo = null;
let activePeriod = "week"; // for line chart grouping
let donutChart = null;
let lineChart = null;

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Greet the logged-in user.
  const session = JSON.parse(
    localStorage.getItem("crm_session") || sessionStorage.getItem("crm_session") || "null",
  );
  const users = JSON.parse(localStorage.getItem("crm_users") || "[]");
  const user = users.find((savedUser) => savedUser.id === session?.userId);

  document.getElementById("user-name").textContent = user?.fullName || "there";
  updateClock();
  window.setInterval(updateClock, 1000);

  // Date filter inputs
  setupDateFilter();

  // Chart period buttons
  document.querySelectorAll(".chart-period-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chart-period-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePeriod = btn.dataset.period;
      renderLineChart(filterClients());
    });
  });

  // Real-time cross-tab sync via BroadcastChannel
  setupLiveSync();

  try {
    allClients = await getCrmClients();
    renderDashboard(filterClients());
  } catch (error) {
    console.error(error);
    document.getElementById("recent-clients").textContent = "Could not load clients.";
  }
});

// ─── Clock ────────────────────────────────────────────────────────────────────
function updateClock() {
  document.getElementById("today-date").textContent = new Date().toLocaleString();
}

// ─── Date Filter ──────────────────────────────────────────────────────────────
function setupDateFilter() {
  const fromInput = document.getElementById("date-from");
  const toInput = document.getElementById("date-to");
  const clearBtn = document.getElementById("clear-dates-btn");

  fromInput.addEventListener("change", () => {
    dateFrom = fromInput.value ? new Date(fromInput.value) : null;
    clearPresetsActive();
    renderDashboard(filterClients());
    updateFilterBadge();
  });

  toInput.addEventListener("change", () => {
    dateTo = toInput.value ? new Date(toInput.value + "T23:59:59") : null;
    clearPresetsActive();
    renderDashboard(filterClients());
    updateFilterBadge();
  });

  clearBtn.addEventListener("click", () => {
    fromInput.value = "";
    toInput.value = "";
    dateFrom = null;
    dateTo = null;
    setPreset("all");
    renderDashboard(filterClients());
    updateFilterBadge();
  });

  // Preset buttons
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPreset(btn.dataset.preset));
  });
}

function setPreset(preset) {
  document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.preset-btn[data-preset="${preset}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const now = new Date();
  const fromInput = document.getElementById("date-from");
  const toInput = document.getElementById("date-to");

  if (preset === "7d") {
    dateFrom = new Date(now - 7 * 24 * 60 * 60 * 1000);
    dateTo = null;
  } else if (preset === "30d") {
    dateFrom = new Date(now - 30 * 24 * 60 * 60 * 1000);
    dateTo = null;
  } else if (preset === "90d") {
    dateFrom = new Date(now - 90 * 24 * 60 * 60 * 1000);
    dateTo = null;
  } else {
    dateFrom = null;
    dateTo = null;
  }

  // Sync inputs with preset
  fromInput.value = dateFrom ? dateFrom.toISOString().slice(0, 10) : "";
  toInput.value = dateTo ? dateTo.toISOString().slice(0, 10) : "";

  renderDashboard(filterClients());
  updateFilterBadge();
}

function clearPresetsActive() {
  document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
}

function filterClients() {
  if (!dateFrom && !dateTo) return allClients;
  return allClients.filter((c) => {
    const created = new Date(c.createdAt);
    if (dateFrom && created < dateFrom) return false;
    if (dateTo && created > dateTo) return false;
    return true;
  });
}

function updateFilterBadge() {
  const badge = document.getElementById("filter-badge");
  const badgeText = document.getElementById("filter-badge-text");
  const filtered = filterClients();

  if (dateFrom || dateTo) {
    badge.classList.remove("hidden");
    badgeText.textContent = `${filtered.length} of ${allClients.length} clients`;
  } else {
    badge.classList.add("hidden");
  }
}

// ─── Live Cross-tab Sync ──────────────────────────────────────────────────────
function setupLiveSync() {
  // BroadcastChannel: fires when clients.js posts a message
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel("crm_updates");
    channel.addEventListener("message", async (event) => {
      if (event.data?.type === "clients_updated") {
        await refreshFromStorage();
      }
    });
  }

  // storage event: fires on other tabs when localStorage changes
  window.addEventListener("storage", async (event) => {
    if (event.key === "crm_clients") {
      await refreshFromStorage();
    }
  });
}

async function refreshFromStorage() {
  try {
    allClients = await getCrmClients();
    renderDashboard(filterClients());
    showSyncToast();
  } catch (error) {
    console.error("Live sync failed:", error);
  }
}

function showSyncToast() {
  const toast = document.getElementById("sync-toast");
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, 3000);
}

// ─── Dashboard Render ─────────────────────────────────────────────────────────
function renderDashboard(clients) {
  const activeDeals = clients.filter((c) => !["Won", "Lost"].includes(c.status));
  const wonRevenue = clients
    .filter((c) => c.status === "Won")
    .reduce((sum, c) => sum + Number(c.dealValue), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  document.getElementById("total-clients").textContent = clients.length;
  document.getElementById("active-deals").textContent = activeDeals.length;
  document.getElementById("won-revenue").textContent = formatCurrency(wonRevenue);
  document.getElementById("new-clients").textContent = clients.filter(
    (c) => new Date(c.createdAt).getTime() >= weekAgo,
  ).length;

  ["Lead", "Contacted", "Won", "Lost"].forEach((status) => {
    document.getElementById(`${status.toLowerCase()}-count`).textContent = clients.filter(
      (c) => c.status === status,
    ).length;
  });

  renderRecentClients(clients);
  renderDonutChart(clients);
  renderLineChart(clients);
  updateFilterBadge();
}

// ─── Recent Clients ───────────────────────────────────────────────────────────
function renderRecentClients(clients) {
  const container = document.getElementById("recent-clients");
  container.replaceChildren();

  clients
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .forEach((client) => {
      const item = document.createElement("article");
      item.className = "client";
      const info = document.createElement("div");
      info.className = "client-info";
      const avatar = document.createElement("div");
      avatar.className = "client-avatar";
      avatar.textContent = client.name.charAt(0).toUpperCase();
      const text = document.createElement("div");
      const name = document.createElement("div");
      name.className = "client-name";
      name.textContent = client.name;
      const company = document.createElement("div");
      company.className = "client-email";
      company.textContent = client.company;
      text.append(name, company);
      info.append(avatar, text);

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.flexDirection = "column";
      right.style.alignItems = "flex-end";
      right.style.gap = "4px";

      const badge = document.createElement("span");
      badge.className = `status-badge status-${client.status.toLowerCase()}`;

      let iconClass = "fa-circle-dot";
      if (client.status === "Won") iconClass = "fa-circle-check";
      else if (client.status === "Lost") iconClass = "fa-circle-xmark";
      else if (client.status === "Contacted") iconClass = "fa-comments";
      else if (client.status === "Lead") iconClass = "fa-user";

      const icon = document.createElement("i");
      icon.className = `fa-solid ${iconClass}`;
      badge.append(icon, ` ${client.status}`);

      const value = document.createElement("div");
      value.className = `client-deal-value ${client.status === "Won" ? "deal-won" : client.status === "Lost" ? "deal-lost" : ""}`;
      value.style.fontSize = "13px";
      value.textContent = formatCurrency(client.dealValue);

      right.append(badge, value);
      item.append(info, right);
      container.appendChild(item);
    });
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function renderDonutChart(clients) {
  const counts = {
    Lead: clients.filter((c) => c.status === "Lead").length,
    Contacted: clients.filter((c) => c.status === "Contacted").length,
    Won: clients.filter((c) => c.status === "Won").length,
    Lost: clients.filter((c) => c.status === "Lost").length,
  };

  const colors = {
    Lead: "#3b82f6",
    Contacted: "#f59e0b",
    Won: "#22c55e",
    Lost: "#ef4444",
  };

  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const total = data.reduce((a, b) => a + b, 0);

  document.getElementById("donut-total").textContent = total;

  // Update or create chart
  const canvas = document.getElementById("pipeline-donut-chart");
  const ctx = canvas.getContext("2d");

  if (donutChart) {
    donutChart.data.datasets[0].data = data;
    donutChart.update("active");
  } else {
    donutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((l) => colors[l] + "cc"),
            borderColor: labels.map((l) => colors[l]),
            borderWidth: 2,
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              },
            },
          },
        },
        animation: { animateRotate: true, duration: 700 },
      },
    });
  }

  // Custom legend
  const legendEl = document.getElementById("donut-legend");
  legendEl.innerHTML = labels
    .map(
      (label, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${colors[label]}"></span>
        <span class="legend-label">${label}</span>
        <span class="legend-value">${data[i]}</span>
      </div>
    `,
    )
    .join("");
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function renderLineChart(clients) {
  const { labels, datasets } = buildLineChartData(clients, activePeriod);

  const canvas = document.getElementById("clients-line-chart");
  const ctx = canvas.getContext("2d");

  const isDark = !document.body.classList.contains("light");
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const tickColor = isDark ? "#9ca3af" : "#6b7280";

  if (lineChart) {
    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = datasets.added;
    lineChart.data.datasets[1].data = datasets.won;
    lineChart.update("active");
  } else {
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "New Clients",
            data: datasets.added,
            borderColor: "#4f8cff",
            backgroundColor: "rgba(79,140,255,0.12)",
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Won Deals",
            data: datasets.won,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.08)",
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: { color: tickColor, boxWidth: 12, boxHeight: 12, borderRadius: 4 },
          },
          tooltip: { mode: "index" },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: tickColor, maxRotation: 0 },
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: tickColor, stepSize: 1 },
            beginAtZero: true,
          },
        },
        animation: { duration: 600 },
      },
    });
  }
}

function buildLineChartData(clients, period) {
  const now = new Date();
  const labels = [];
  const buckets = {};

  if (period === "week") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      labels.push(key);
      buckets[key] = { added: 0, won: 0 };
    }
    clients.forEach((c) => {
      const d = new Date(c.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (buckets[key]) {
        buckets[key].added++;
        if (c.status === "Won") buckets[key].won++;
      }
    });
  } else if (period === "month") {
    // Last 30 days, grouped by week
    for (let w = 4; w >= 1; w--) {
      const key = `Week -${w}`;
      labels.push(key);
      buckets[key] = { added: 0, won: 0 };
    }
    clients.forEach((c) => {
      const ageMs = now - new Date(c.createdAt);
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      if (ageDays <= 30) {
        const weekIdx = Math.min(3, Math.floor(ageDays / 7));
        const key = `Week -${4 - weekIdx}`;
        if (buckets[key]) {
          buckets[key].added++;
          if (c.status === "Won") buckets[key].won++;
        }
      }
    });
  } else {
    // year: last 12 months
    for (let m = 11; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      labels.push(key);
      buckets[key] = { added: 0, won: 0 };
    }
    clients.forEach((c) => {
      const d = new Date(c.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (buckets[key]) {
        buckets[key].added++;
        if (c.status === "Won") buckets[key].won++;
      }
    });
  }

  return {
    labels,
    datasets: {
      added: labels.map((l) => buckets[l]?.added ?? 0),
      won: labels.map((l) => buckets[l]?.won ?? 0),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
