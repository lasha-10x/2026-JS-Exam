/**
 * dashboard.js
 * ---------------------------------------------------------------------------
 * P3 — the first thing a user sees after logging in. Everything on this
 * page is a computed VIEW over the same `crm_clients` data the Clients page
 * owns — nothing here is a separate source of truth. That's why it reuses
 * loadClients() from data.js (P3.5: "dashboard gets its data the same way
 * Clients does").
 * ---------------------------------------------------------------------------
 */

// ============================================================================
// P3.1 — Greeting + live clock
// ============================================================================

function renderGreeting() {
  const user = Storage10X.getCurrentUser();
  const firstName = user ? user.fullName.split(' ')[0] : 'there';
  document.getElementById('greeting').textContent = `Welcome back, ${firstName}!`;
}

function startClock() {
  const tick = () => {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString();
    document.getElementById('clock-date').textContent = now.toLocaleDateString();
  };
  tick();
  setInterval(tick, 1000);
}

// ============================================================================
// P3.2 — Stat cards
// ============================================================================

function renderStats(clientList) {
  const total = clientList.length;
  const activeDeals = clientList.filter((c) => c.status !== 'Won' && c.status !== 'Lost').length;
  const wonRevenue = clientList
    .filter((c) => c.status === 'Won')
    .reduce((sum, c) => sum + c.dealValue, 0);
  const newThisWeek = clientList.filter(
    (c) => (Date.now() - new Date(c.createdAt)) / 86400000 <= 7
  ).length;

  document.getElementById('stats-grid').innerHTML = [
    statCardHtml('Total Clients', total),
    statCardHtml('Active Deals', activeDeals),
    statCardHtml('Won Revenue', formatMoney(wonRevenue)),
    statCardHtml('New This Week', newThisWeek),
  ].join('');
}

function statCardHtml(label, value) {
  return `
    <div class="stat-card">
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

// ============================================================================
// P3.3 — Pipeline Overview (proportional bar + legend)
// ============================================================================

function renderPipeline(clientList) {
  const counts = clientList.reduce((acc, c) => {
    if (acc[c.status] !== undefined) {
      acc[c.status] += 1;
    }
    return acc;
  }, { Lead: 0, Contacted: 0, Won: 0, Lost: 0 });

  const total = clientList.length || 1; // avoid divide-by-zero on an empty list

  const segments = STATUSES.map((status) => {
    const pct = (counts[status] / total) * 100;
    const segClass = `seg-${status.toLowerCase()}`;
    return `<div class="pipeline-segment ${segClass}" style="width:${pct}%" title="${status}: ${counts[status]}"></div>`;
  }).join('');

  const legend = STATUSES.map((status) => `
    <div class="pipeline-legend-item">
      <span class="legend-dot seg-${status.toLowerCase()}"></span>
      <span>${status}</span>
      <span class="legend-count">${counts[status]}</span>
    </div>
  `).join('');

  document.getElementById('pipeline-overview').innerHTML = `
    <div class="pipeline-bar">${segments}</div>
    <div class="pipeline-legend">${legend}</div>
  `;
}

// ============================================================================
// P3.4 — Recent Clients (last 5 by createdAt)
// ============================================================================

function renderRecentClients(clientList) {
  const recent = [...clientList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById('recent-clients-list');

  if (recent.length === 0) {
    container.innerHTML = `<div class="empty-state">No clients found.</div>`;
    return;
  }

  container.innerHTML = recent.map((c) => `
    <div class="recent-client-row">
      ${avatarHtml(c.name, c.image, 'avatar-sm')}
      <div class="recent-client-info">
        <div class="recent-client-name">${escapeHtml(c.name)}</div>
        <div class="recent-client-company">${escapeHtml(c.company || '—')}</div>
      </div>
      ${statusBadgeHtml(c.status)}
      <div class="recent-client-date">${new Date(c.createdAt).toLocaleDateString()}</div>
    </div>
  `).join('');
}

// ============================================================================
// P3.5 — Data loading (shared with Clients page) + error handling
// ============================================================================

async function loadAndRenderDashboard() {
  const contentEl = document.getElementById('dashboard-content');
  contentEl.innerHTML = `<div class="loading-state"><div class="spinner"></div>Loading dashboard...</div>`;

  try {
    const clientList = await loadClients(); // js/data.js — localStorage first, else API
    contentEl.innerHTML = DASHBOARD_CONTENT_TEMPLATE;
    renderStats(clientList);
    renderPipeline(clientList);
    renderRecentClients(clientList);
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    contentEl.innerHTML = `
      <div class="error-state">
        <p>Could not load clients. Check your connection and try again.</p>
        <button class="btn btn-secondary btn-sm" id="dashboard-retry-btn" type="button">Retry</button>
      </div>
    `;
    document.getElementById('dashboard-retry-btn').addEventListener('click', loadAndRenderDashboard);
  }
}

// The stats/pipeline/recent sections are re-inserted on every successful
// load (so a Retry after a failure rebuilds a clean structure to render
// into) — this is that structure, kept in one constant instead of repeated
// inline HTML.
const DASHBOARD_CONTENT_TEMPLATE = `
  <div class="stats-grid" id="stats-grid"></div>
  <div class="dashboard-grid">
    <section class="card">
      <div class="section-header-row"><h3>Pipeline Overview</h3></div>
      <div id="pipeline-overview"></div>
    </section>
    <section class="card">
      <div class="section-header-row">
        <h3>Recent Clients</h3>
        <a href="clients.html" class="view-all-link">View all clients -></a>
      </div>
      <div id="recent-clients-list"></div>
    </section>
  </div>
`;

// ============================================================================
// Page init
// ============================================================================

function initDashboard() {
  initNav();
  renderGreeting();
  startClock();
  loadAndRenderDashboard();
}
