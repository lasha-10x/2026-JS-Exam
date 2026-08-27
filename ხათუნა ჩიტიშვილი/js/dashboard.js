document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Clock
  initClock();

  // Load Data and Compute Stats
  const { clients, error } = await initClientsData();
  if (error) {
    const container = document.getElementById('recent-clients-container');
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <p>Could not load clients. Check your connection and try again.</p>
          <button id="retry-btn" class="btn btn--primary" style="margin-top: 1rem;">Retry</button>
        </div>
      `;
      document.getElementById('retry-btn').addEventListener('click', () => window.location.reload());
    }
  } else if (clients) {
    computeStats(clients);
    renderRecentClients(clients);
  }

});

function initClock() {
  const timeElement = document.getElementById('current-time');
  if (!timeElement) return;

  const updateClock = () => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    timeElement.textContent = `${date}, ${time}`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}


function renderRecentClients(clients) {
  const container = document.getElementById('recent-clients-container');
  if (!container) return;

  // Sort by createdAt descending and take top 5
  const sortedClients = [...clients].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 5);

  if (sortedClients.length === 0) {
    container.innerHTML = '<div class="empty-state">No clients found. Add some from the Clients page.</div>';
    return;
  }

  container.innerHTML = sortedClients.map(client => {
    const formattedDate = new Date(client.createdAt).toLocaleDateString();
    return `
      <div class="recent-client-item">
        <div class="recent-client-info">
          <span class="recent-client-name">${client.name}</span>
          <span class="recent-client-company">${client.company} &bull; ${formattedDate}</span>
        </div>
        <div class="recent-client-status status-badge--${client.status.toLowerCase()}">
          ${client.status}
        </div>
      </div>
    `;
  }).join('');
}

function computeStats(clients) {
  // Stats 
  const totalClients = clients.length;

  const activeDeals = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;

  const wonRevenue = clients
    .filter(c => c.status === 'Won')
    // Ensure dealValue is a number (may come as string from storage)
    .reduce((sum, c) => sum + Number(c.dealValue || 0), 0);

  const newThisWeek = clients.filter(c => {
    if (!c.createdAt) return false;
    return (Date.now() - new Date(c.createdAt)) / 86400000 <= 7;
  }).length;

  // Pipeline counts 
  const pipelineCounts = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, { Lead: 0, Contacted: 0, Won: 0, Lost: 0 });

  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  // Update DOM for Stats
  document.getElementById('stat-total').textContent = totalClients;
  document.getElementById('stat-active').textContent = activeDeals;
  document.getElementById('stat-revenue').textContent = formatter.format(wonRevenue);
  document.getElementById('stat-new').textContent = newThisWeek;

  // Update DOM for Pipeline
  document.getElementById('pipe-lead').textContent = pipelineCounts.Lead;
  document.getElementById('pipe-contacted').textContent = pipelineCounts.Contacted;
  document.getElementById('pipe-won').textContent = pipelineCounts.Won;
  document.getElementById('pipe-lost').textContent = pipelineCounts.Lost;
}