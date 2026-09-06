// dashboard.js — logic for dashboard.html.
// main.js calls initDashboard() after it has already checked the
// visitor is logged in and set up the sidebar.

import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { DataStore } from "./data.js";

const STATUS_OPTIONS = ["Lead", "Contacted", "Won", "Lost"];

function renderGreeting() {
  const session = Storage.getSession();
  const user = Storage.getUsers().find((u) => u.id === session.userId);
  const firstName = user ? user.fullName.split(" ")[0] : "there";
  document.getElementById("dashboard-greeting").textContent = `Welcome back, ${firstName}!`;
}

function renderClock() {
  const clockEl = document.getElementById("dashboard-clock");

  function updateClock() {
    const now = new Date();
    clockEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function renderStats(clients) {
  document.getElementById("stat-total").textContent = clients.length;

  const activeDeals = clients.filter((client) => client.status !== "Won" && client.status !== "Lost");
  document.getElementById("stat-active").textContent = activeDeals.length;

  const wonRevenue = clients.filter((client) => client.status === "Won").reduce((total, client) => total + client.dealValue, 0);
  document.getElementById("stat-revenue").textContent = UI.formatCurrency(wonRevenue);

  const newThisWeek = clients.filter((client) => {
    const daysOld = (Date.now() - new Date(client.createdAt)) / 86400000;
    return daysOld <= 7;
  });
  document.getElementById("stat-new").textContent = newThisWeek.length;
}

function renderPipeline(clients) {
  const grid = document.getElementById("pipeline-grid");

  grid.innerHTML = STATUS_OPTIONS.map((status) => {
    const count = clients.filter((client) => client.status === status).length;
    return `
      <div class="pipeline-card">
        <span class="badge status-${status}">${status}</span>
        <p>${count}</p>
      </div>
    `;
  }).join("");
}

function renderRecentClients(clients) {
  const container = document.getElementById("recent-clients-list");

  const recentClients = clients
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recentClients.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients yet.</p>';
    return;
  }

  container.innerHTML = recentClients
    .map((client) => {
      const avatarHtml = client.image
        ? `<img src="${UI.escapeHtml(client.image)}" alt="${UI.escapeHtml(client.name)}" class="avatar">`
        : `<div class="avatar-fallback">${UI.escapeHtml(UI.getInitials(client.name))}</div>`;

      return `
        <div class="client-card">
          ${avatarHtml}
          <div class="client-info">
            <strong>${UI.escapeHtml(client.name)}</strong>
            <span>${UI.escapeHtml(client.company)}</span>
          </div>
          <span class="badge status-${client.status}">${client.status}</span>
          <span class="text-muted">${new Date(client.createdAt).toLocaleDateString()}</span>
        </div>
      `;
    })
    .join("");
}

export async function initDashboard() {
  renderGreeting();
  renderClock();

  const clients = await DataStore.loadClients();
  renderStats(clients);
  renderPipeline(clients);
  renderRecentClients(clients);
}
