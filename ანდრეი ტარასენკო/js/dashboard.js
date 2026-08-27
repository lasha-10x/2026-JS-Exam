/**
 * Dashboard page logic: welcome message, live clock, stats, pipeline, recent clients.
 */

let clockInterval = null;

/**
 * Get the first name from the current user's full name.
 */
function getFirstName() {
  const user = getCurrentUser();
  if (!user) return 'User';
  return user.fullName.split(' ')[0];
}

/**
 * Update the welcome message with the user's first name.
 */
function renderWelcome() {
  const welcomeEl = document.getElementById('welcome-message');
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${getFirstName()}!`;
  }
}

/**
 * Start the live clock that updates every second.
 */
function startLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    clockEl.textContent = `${now.toLocaleDateString()} — ${now.toLocaleTimeString()}`;
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

/**
 * Calculate and render dashboard statistics.
 */
function renderStats(clients) {
  const total = clients.length;
  const activeDeals = clients.filter(
    (c) => c.status !== 'Won' && c.status !== 'Lost'
  ).length;
  const wonRevenue = clients
    .filter((c) => c.status === 'Won')
    .reduce((sum, c) => sum + c.dealValue, 0);
  const newThisWeek = clients.filter((c) => {
    const daysDiff = (Date.now() - new Date(c.createdAt)) / 86400000;
    return daysDiff <= 7;
  }).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = activeDeals;
  document.getElementById('stat-revenue').textContent = formatCurrency(wonRevenue);
  document.getElementById('stat-new').textContent = newThisWeek;
}

/**
 * Render pipeline overview counts by status.
 */
function renderPipeline(clients) {
  const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];

  statuses.forEach((status) => {
    const count = clients.filter((c) => c.status === status).length;
    const el = document.getElementById(`pipeline-${status.toLowerCase()}`);
    if (el) el.textContent = count;
  });
}

/**
 * Render the 5 most recently added clients.
 */
function renderRecentClients(clients) {
  const container = document.getElementById('recent-clients-list');
  if (!container) return;

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<p class="clients-empty">No clients yet.</p>';
    return;
  }

  container.innerHTML = recent
    .map(
      (client) => `
      <div class="recent-client-item">
        <div class="recent-client-item__info">
          <span class="recent-client-item__name">${client.name}</span>
          <span class="recent-client-item__company">${client.company}</span>
        </div>
        <span class="badge ${getStatusBadgeClass(client.status)}">${client.status}</span>
        <span class="recent-client-item__date">${new Date(client.createdAt).toLocaleDateString()}</span>
      </div>
    `
    )
    .join('');
}

/**
 * Initialize dashboard: load data and render all sections.
 */
async function initDashboard() {
  try {
    const clients = await loadClients();
    renderWelcome();
    startLiveClock();
    renderStats(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    showToast('Could not load dashboard data.', 'error');
  }
}

initDashboard();
