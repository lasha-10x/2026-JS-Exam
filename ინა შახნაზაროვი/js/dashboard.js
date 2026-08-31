/* dashboard.js */
document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  if (!user) return;

  const firstName = user.fullName.split(' ')[0];
  document.getElementById('welcome-text').textContent = `Welcome back, ${firstName}!`;

  // Live clock
  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
      `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Load clients
  try {
    await loadClients();
  } catch (e) {
    console.error(e);
    showToast('Could not load dashboard data. Please try again.', 'error');
  }

  renderStats();

  window.addEventListener('storage', handleDashboardStorageChange);
});

function handleDashboardStorageChange(event) {
  if (event.key !== STORAGE_KEYS.CLIENTS) return;

  clientsState = getClients();
  renderStats();

  showToast('Dashboard updated from another tab', 'success');
}

function renderStats() {
  const clients = getClients();

  // Total
  document.getElementById('stat-total').textContent = clients.length;

  // Active (not Won/Lost)
  const active = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;
  document.getElementById('stat-active').textContent = active;

  // Won revenue
  const wonRevenue = clients
    .filter(c => c.status === 'Won')
    .reduce((sum, c) => sum + (c.dealValue || 0), 0);
  document.getElementById('stat-won').textContent = '$' + wonRevenue.toLocaleString();

  // New this week
  const newWeek = clients.filter(c => {
    const ageInDays = (Date.now() - new Date(c.createdAt).getTime()) / 86400000;
    return ageInDays >= 0 && ageInDays <= 7;
  }).length;
  document.getElementById('stat-week').textContent = newWeek;

  // Pipeline
  const count = (s) => clients.filter(c => c.status === s).length;
  document.getElementById('p-lead').textContent = count('Lead');
  document.getElementById('p-contacted').textContent = count('Contacted');
  document.getElementById('p-won').textContent = count('Won');
  document.getElementById('p-lost').textContent = count('Lost');
  // Pipeline percentages
  function updatePipelineProgress(status, progressId, barId) {
    const statusCount = count(status);

    const percentage = clients.length
      ? Math.round((statusCount / clients.length) * 100)
      : 0;

    const progress = document.getElementById(progressId);
    const bar = document.getElementById(barId);

    progress.setAttribute('aria-valuenow', percentage);
    progress.title = `${percentage}% of all clients`;
    bar.style.width = `${percentage}%`;
  }

  updatePipelineProgress('Lead', 'progress-lead', 'bar-lead');
  updatePipelineProgress(
    'Contacted',
    'progress-contacted',
    'bar-contacted'
  );
  updatePipelineProgress('Won', 'progress-won', 'bar-won');
  updatePipelineProgress('Lost', 'progress-lost', 'bar-lost');
  // Recent 5
  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const list = document.getElementById('recent-list');
  list.innerHTML = recent.map(c => {
    const status = ['Lead', 'Contacted', 'Won', 'Lost'].includes(c.status) ? c.status : 'Lead';
    return `
    <div class="client-row">
      <div>
        <div class="name">${escapeHTML(c.name)}</div>
        <div class="company">${escapeHTML(c.company)}</div>
      </div>
      <div class="meta">
        <span class="badge badge-${status.toLowerCase()}">${status}</span>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${new Date(c.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  `;
  }).join('');
}
