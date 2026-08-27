// ─── dashboard.js — entry point for dashboard.html ───
import { requireAuth } from "./guard.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { loadClients } from "./data.js";
import { getSession, getUsers } from "./storage.js";

// small local helper (same idea as in clients.js)/ safe text via textContent
function el(tag, className, text = "") {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function formatMoney(value) {
  return `$${value.toLocaleString("en-US")}`;
}

// ===Greeting: first name from the logged-in user ===
function renderGreeting() {
  const session = getSession();
  const user = getUsers().find((u) => u.id === session.userId);
  const firstName = user ? user.fullName.split(" ")[0] : "there";
  document.querySelector("#greeting").textContent = `Welcome back, ${firstName}!`;
}

// ==== Live clock: updates every second =====
function startClock() {
  const clock = document.querySelector("#clock");
  function tick() {
    const now = new Date();
    clock.textContent = `${now.toLocaleDateString()} · ${now.toLocaleTimeString()}`;
  }
  tick();                    // show immediately
  setInterval(tick, 1000);   // then every 1s turn on tick fn
}

// === 4 stat cards ====
function renderStats(clients) {
  document.querySelector("#stat-total").textContent = clients.length;

  const activeDeals = clients.filter(
    (c) => c.status !== "Won" && c.status !== "Lost"
  ).length;
  document.querySelector("#stat-active").textContent = activeDeals;

  const wonRevenue = clients
    .filter((c) => c.status === "Won")
    .reduce((sum, c) => sum + c.dealValue, 0);
  document.querySelector("#stat-revenue").textContent = formatMoney(wonRevenue);

  const newThisWeek = clients.filter(
    (c) => (Date.now() - new Date(c.createdAt)) / 86400000 <= 7
  ).length;
  document.querySelector("#stat-new").textContent = newThisWeek;
}

// === Pipeline counts per status ====
function renderPipeline(clients) {
  const counts = { Lead: 0, Contacted: 0, Won: 0, Lost: 0 };
  clients.forEach((c) => { counts[c.status]++; });

  document.querySelector("#pipe-lead").textContent = counts.Lead;
  document.querySelector("#pipe-contacted").textContent = counts.Contacted;
  document.querySelector("#pipe-won").textContent = counts.Won;
  document.querySelector("#pipe-lost").textContent = counts.Lost;
}

// === Recent 5 clients (newest first) ===
function renderRecent(clients) {
  const list = document.querySelector("#recent-list");
  list.innerHTML = "";

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    list.append(el("li", "recent__empty", "No clients yet."));
    return;
  }

  recent.forEach((c) => {
    const item = el("li", "recent__item");

    const info = el("div", "recent__info");
    info.append(
      el("p", "recent__name", c.name),
      el("p", "recent__company", c.company)
    );

    const badge = el("span", `badge badge--${c.status.toLowerCase()}`, c.status);
    const date = el("span", "recent__date", new Date(c.createdAt).toLocaleDateString());

    item.append(info, badge, date);
    list.append(item);
  });
}

async function initDashboardPage() {
  initTheme();
  initNav();
  renderGreeting();
  startClock();

  try {
    const clients = await loadClients();   // same source as the Clients page
    renderStats(clients);
    renderPipeline(clients);
    renderRecent(clients);
  } catch (error) {
    console.error(error);
  }
}

if (requireAuth()) {
  initDashboardPage();
}
