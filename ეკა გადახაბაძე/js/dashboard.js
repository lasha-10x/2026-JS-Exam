/* ==========================================================================
   dashboard.js — Dashboard page (PRD P3).
   Uses the same shared loading logic as the Clients page (data.js), so the
   numbers always reflect the latest state in crm_clients.
   ========================================================================== */

/* ---- P3.1 Greeting + live clock ------------------------------------------ */

function renderGreeting() {
  const user = getCurrentUser();
  const greetingEl = document.getElementById('greeting-text');
  if (user && greetingEl) {
    // First word of fullName, e.g. "Nino Beridze" -> "Nino".
    const firstName = user.fullName.split(' ')[0];
    greetingEl.textContent = 'Welcome back, ' + firstName + '!';
  }
}

function startLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleDateString() + ' · ' + now.toLocaleTimeString();
  }

  tick(); // Show the time immediately, then refresh every second.
  setInterval(tick, 1000);
}

/* ---- P3.2 Stat cards ------------------------------------------------------ */

function renderStats() {
  // Total Clients — plain length.
  document.getElementById('stat-total').textContent = clientsState.length;

  // Active Deals — everything that is neither Won nor Lost.
  const activeDeals = clientsState.filter(function (c) {
    return c.status !== 'Won' && c.status !== 'Lost';
  }).length;
  document.getElementById('stat-active').textContent = activeDeals;

  // Won Revenue — sum of dealValue for Won clients (filter + reduce).
  const wonRevenue = clientsState
    .filter(function (c) { return c.status === 'Won'; })
    .reduce(function (sum, c) { return sum + c.dealValue; }, 0);
  document.getElementById('stat-revenue').textContent = formatMoney(wonRevenue);

  // New This Week — createdAt within the last 7 days.
  const newThisWeek = clientsState.filter(function (c) {
    return (Date.now() - new Date(c.createdAt)) / 86400000 <= 7;
  }).length;
  document.getElementById('stat-new').textContent = newThisWeek;
}

/* ---- P3.3 Pipeline overview ----------------------------------------------- */

function renderPipeline() {
  // One reduce builds a { status: count } lookup for all four stages.
  const counts = clientsState.reduce(function (acc, c) {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  ['Lead', 'Contacted', 'Won', 'Lost'].forEach(function (status) {
    const el = document.getElementById('pipe-' + status.toLowerCase());
    if (el) el.textContent = counts[status] || 0;
  });
}

/* ---- P3.4 Recent clients ---------------------------------------------------- */

function renderRecentClients() {
  const container = document.getElementById('recent-list');
  container.innerHTML = '';

  // Sort a copy by createdAt descending, then take the first 5.
  const recent = clientsState
    .slice()
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<p class="list-message">No clients yet.</p>';
    return;
  }

  recent.forEach(function (client) {
    const row = document.createElement('div');
    row.className = 'recent-row';

    const left = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'recent-name';
    name.textContent = client.name;
    const company = document.createElement('div');
    company.className = 'recent-company';
    company.textContent = client.company || '—';
    left.appendChild(name);
    left.appendChild(company);

    const badge = document.createElement('span');
    badge.className = 'badge badge-' + client.status.toLowerCase();
    badge.textContent = client.status;

    const date = document.createElement('span');
    date.className = 'recent-date';
    date.textContent = new Date(client.createdAt).toLocaleDateString();

    row.appendChild(left);
    row.appendChild(badge);
    row.appendChild(date);
    container.appendChild(row);
  });
}

/* ---- Page init -------------------------------------------------------------- */

async function initDashboard() {
  renderGreeting();
  startLiveClock();

  try {
    await loadClients();
  } catch (err) {
    console.error('Failed to load clients:', err);
    showToast('Could not load client data', 'error');
    return;
  }

  renderStats();
  renderPipeline();
  renderRecentClients();
}

document.addEventListener('DOMContentLoaded', initDashboard);
