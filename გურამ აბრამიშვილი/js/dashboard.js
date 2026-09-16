// dashboard.js — P3 Dashboard.

document.addEventListener('DOMContentLoaded', async function () {
  requireAuth();
  applyTheme();
  renderNav('dashboard');

  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('welcome-name').textContent = user.fullName.split(' ')[0];
  updateClock();
  setInterval(updateClock, 1000);

  const clients = await loadClientsForDashboard();
  renderStats(clients);
});

function updateClock() {
  const now = new Date();
  const dateEl = document.getElementById('current-date');
  const timeEl = document.getElementById('current-time');
  if (dateEl) dateEl.textContent = now.toLocaleDateString();
  if (timeEl) timeEl.textContent = now.toLocaleTimeString();
}

async function loadClientsForDashboard() {
  const cached = getClients();
  if (cached) return cached;
  try {
    const clients = await fetchInitialClients();
    saveClients(clients);
    return clients;
  } catch (err) {
    return [];
  }
}

function renderStats(clients) {
  document.getElementById('stat-total').textContent = clients.length;

  const active = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;
  document.getElementById('stat-active').textContent = active;

  const wonRevenue = clients
    .filter(c => c.status === 'Won')
    .reduce((sum, c) => sum + c.dealValue, 0);
  document.getElementById('stat-revenue').textContent = '$' + wonRevenue.toLocaleString();

  const newThisWeek = clients.filter(c => (Date.now() - new Date(c.createdAt)) / 86400000 <= 7).length;
  document.getElementById('stat-new').textContent = newThisWeek;

  renderPipeline(clients);
  renderRecent(clients);
}

function renderPipeline(clients) {
  const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];
  const total = clients.length || 1;
  const counts = statuses.map(s => clients.filter(c => c.status === s).length);

  const bar = document.getElementById('pipeline-bar');
  bar.innerHTML = statuses.map((s, i) => {
    const pct = (counts[i] / total * 100).toFixed(2);
    if (counts[i] === 0) return '';
    return `<div class="pipeline-segment status-bg-${s.toLowerCase()}" style="width:${pct}%" title="${s}: ${counts[i]}"></div>`;
  }).join('');

  const legend = document.getElementById('pipeline-legend');
  legend.innerHTML = statuses.map((s, i) =>
    `<span class="legend-item"><span class="dot status-bg-${s.toLowerCase()}"></span>${s}: ${counts[i]}</span>`
  ).join('');

  renderPipelineChart(counts, clients.length);
}

// Bonus: mini donut chart drawn on <canvas>, showing the same pipeline proportions as the bar above
function renderPipelineChart(counts, total) {
  const canvas = document.getElementById('pipeline-chart');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) - 4;
  const colors = ['#8B93A7', '#E0A458', '#5FA88F', '#E2665A']; // Lead, Contacted, Won, Lost
  const safeTotal = total || 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startAngle = -Math.PI / 2;
  counts.forEach((count, i) => {
    const sliceAngle = (count / safeTotal) * Math.PI * 2;
    if (count > 0) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
    startAngle += sliceAngle;
  });

  // Cut a hole in the middle to turn the pie into a donut
  const bodyStyles = getComputedStyle(document.body);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = bodyStyles.getPropertyValue('--surface').trim() || '#1B212C';
  ctx.fill();

  ctx.fillStyle = bodyStyles.getPropertyValue('--ink').trim() || '#E7E5DF';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(total), cx, cy);
}

function renderRecent(clients) {
  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById('recent-clients');
  if (recent.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found.</p>';
    return;
  }

  container.innerHTML = recent.map(c => `
    <div class="recent-item">
      <div class="recent-info">
        <strong>${escapeHtml(c.name)}</strong>
        <span class="recent-company">${escapeHtml(c.company)}</span>
      </div>
      <span class="badge status-bg-${c.status.toLowerCase()}">${c.status}</span>
      <span class="recent-date">${new Date(c.createdAt).toLocaleDateString()}</span>
    </div>
  `).join('');
}
