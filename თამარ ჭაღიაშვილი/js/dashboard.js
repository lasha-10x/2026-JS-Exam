/**
 * dashboard.js — P3
 */

const STATUS_ORDER = ['Lead', 'Contacted', 'Won', 'Lost'];
const STATUS_COLOR_VAR = {
  Lead: 'var(--grey)',
  Contacted: 'var(--blue)',
  Won: 'var(--green)',
  Lost: 'var(--red)',
};

function startLiveClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = `${now.toLocaleDateString()} · ${now.toLocaleTimeString()}`;
  };
  tick();
  setInterval(tick, 1000);
}

function renderGreeting() {
  const user = getCurrentUser();
  const nameEl = document.getElementById('greet-name');
  if (nameEl && user) {
    const firstName = user.fullName.split(' ')[0];
    nameEl.textContent = `Welcome back, ${firstName}!`;
  }
}

function renderStats(clients) {
  const total = clients.length;
  const active = clients.filter((c) => c.status !== 'Won' && c.status !== 'Lost').length;
  const wonRevenue = clients
    .filter((c) => c.status === 'Won')
    .reduce((sum, c) => sum + Number(c.dealValue || 0), 0);
  const newThisWeek = clients.filter((c) => {
    const days = (Date.now() - new Date(c.createdAt).getTime()) / 86400000;
    return days <= 7;
  }).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-revenue').textContent = formatCurrency(wonRevenue);
  document.getElementById('stat-new').textContent = newThisWeek;
}

function renderPipeline(clients) {
  const counts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = clients.filter((c) => c.status === status).length;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(counts));

  const container = document.getElementById('pipeline-bars');
  container.innerHTML = STATUS_ORDER.map((status) => {
    const count = counts[status];
    const heightPct = Math.max(6, Math.round((count / max) * 100));
    return `
      <div class="signal-col">
        <span class="signal-count">${count}</span>
        <div class="signal-bar" style="height:${heightPct}%; background:${STATUS_COLOR_VAR[status]}"></div>
        <span class="signal-label">${status}</span>
      </div>`;
  }).join('');
}

function renderRecentClients(clients) {
  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById('recent-clients');

  if (recent.length === 0) {
    container.innerHTML = `<div class="state-msg"><div class="icon">&#128100;</div>No clients found.</div>`;
    return;
  }

  container.innerHTML = recent
    .map((c) => {
      const badgeClass = `badge-${c.status.toLowerCase()}`;
      return `
        <div class="recent-row">
          <div class="avatar-fallback">${initialsFromName(c.name)}</div>
          <div class="who">
            <div class="name">${c.name}</div>
            <div class="company">${c.company || '—'}</div>
          </div>
          <span class="badge ${badgeClass}">${c.status}</span>
          <div class="meta">${new Date(c.createdAt).toLocaleDateString()}</div>
        </div>`;
    })
    .join('');
}

async function initDashboard() {
  const listArea = document.getElementById('recent-clients');
  listArea.innerHTML = `<div class="state-msg">Loading clients...</div>`;

  try {
    const clients = await loadClients();
    renderStats(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
  } catch (err) {
    console.error('Failed to load clients for dashboard:', err);
    listArea.innerHTML = `<div class="state-msg">Could not load clients. Check your connection and try again.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const session = initProtectedPage('dashboard');
  if (!session) return;
  renderGreeting();
  startLiveClock();
  initDashboard();
});