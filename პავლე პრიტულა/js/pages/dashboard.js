// Dashboard controller: derives sales metrics and recent-client data from saved clients.
import { requireAuthentication } from "../core/guard.js";
import { loadClients } from "../core/data.js";
import { STORAGE_KEYS, readSession, readStorage } from "../core/storage.js";
import { formatCurrency, formatDate, getLanguage, t } from "../core/i18n.js";
import { initializeProtectedLayout } from "../ui/navigation.js";

requireAuthentication();
initializeProtectedLayout();

const dashboardContent = document.querySelector("#dashboard-content");

/** Finds the signed-in user's complete record for the welcome message. */
function getCurrentUser() {
  const session = readSession();
  const users = readStorage(STORAGE_KEYS.users, []);
  return users.find((user) => user.id === session?.userId);
}

/** Derives CRM metrics and renders the dashboard from the current client list. */
function renderDashboard(clients, user) {
  const activeDeals = clients.filter((client) => !["Won", "Lost"].includes(client.status)).length;
  const wonRevenue = clients.filter((client) => client.status === "Won").reduce((total, client) => total + client.dealValue, 0);
  const newThisWeek = clients.filter((client) => (Date.now() - new Date(client.createdAt)) / 86400000 <= 7).length;
  const statusCounts = ["Lead", "Contacted", "Won", "Lost"].map((status) => ({ status, count: clients.filter((client) => client.status === status).length }));
  const recentClients = [...clients].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)).slice(0, 5);
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const maxCount = Math.max(...statusCounts.map((item) => item.count), 1);

  dashboardContent.innerHTML = `
    <section class="dashboard-welcome"><div><p class="dashboard-kicker">10X CRM</p><h2>${t("welcomeBack")}, ${firstName}!</h2><p>${t("pipelineText")}</p></div><p class="live-clock" id="live-clock"></p></section>
    <section class="stats-grid"><article class="stat-card" data-stat="clients"><div class="stat-card-heading"><p>${t("totalClients")}</p><span class="stat-icon" aria-hidden="true"></span></div><strong>${clients.length}</strong></article><article class="stat-card" data-stat="deals"><div class="stat-card-heading"><p>${t("activeDeals")}</p><span class="stat-icon" aria-hidden="true"></span></div><strong>${activeDeals}</strong></article><article class="stat-card" data-stat="revenue"><div class="stat-card-heading"><p>${t("wonRevenue")}</p><span class="stat-icon" aria-hidden="true"></span></div><strong>${formatCurrency(wonRevenue)}</strong></article><article class="stat-card" data-stat="recent"><div class="stat-card-heading"><p>${t("newThisWeek")}</p><span class="stat-icon" aria-hidden="true"></span></div><strong>${newThisWeek}</strong></article></section>
    <section class="dashboard-columns"><article class="dashboard-panel"><h2>${t("pipelineOverview")}</h2><ul class="pipeline-list">${statusCounts.map((item) => `<li><div class="pipeline-row"><span>${t(item.status.toLowerCase())}</span><strong>${item.count}</strong></div><div class="pipeline-bar"><span style="width: ${(item.count / maxCount) * 100}%"></span></div></li>`).join("")}</ul></article><article class="dashboard-panel"><h2>${t("recentClients")}</h2><ul class="recent-list">${recentClients.map((client) => `<li class="recent-client"><div><strong>${client.name}</strong><small>${client.company} · ${formatDate(client.createdAt)}</small></div><span class="status-badge status-${client.status.toLowerCase()}">${t(client.status.toLowerCase())}</span></li>`).join("")}</ul><a class="view-all-link" href="clients.html">${t("viewAll")}</a></article></section>`;

  updateClock();
  window.setInterval(updateClock, 1000);
}

/** Refreshes the small live clock after the dashboard has rendered. */
function updateClock() {
  const clock = document.querySelector("#live-clock");
  if (clock) clock.textContent = `${formatDate(new Date())} · ${new Date().toLocaleTimeString(getLanguage() === "ka" ? "ka-GE" : "en-US")}`;
}

/** Loads clients and renders either dashboard data or a recoverable error state. */
async function initializeDashboard() {
  try {
    const clients = await loadClients();
    renderDashboard(clients, getCurrentUser());
  } catch (error) {
    console.error("Unable to load dashboard", error);
    dashboardContent.innerHTML = `<p class="error-state">${t("loadClientsError")}</p>`;
  }
}

initializeDashboard();
