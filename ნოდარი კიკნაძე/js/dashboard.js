// P3 - Dashboard page logic.
document.addEventListener('DOMContentLoaded', async () => {
  renderGreeting();
  startLiveClock();
  await loadDashboardData();
});

// P3.1 - Greeting: first name from the session's user.
function renderGreeting() {
  const session = Storage.getSession();
  const users = Storage.getUsers();
  const user = users.find(u => u.id === session?.userId);

  const welcomeTitle = document.getElementById('welcome-title');
  if (welcomeTitle) {
    const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';
    welcomeTitle.textContent = `Welcome back, ${firstName}!`;
  }
}

// P3.1 - Live clock, updates every second.
function startLiveClock() {
  const timeEl = document.getElementById('current-time');
  if (!timeEl) return;

  const update = () => {
    const now = new Date();
    timeEl.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };
  update();
  setInterval(update, 1000);
}

// P3.2-P3.4 - Stats, pipeline overview, and recent clients.
async function loadDashboardData() {
  let clients = [];
  try {
    clients = await Data.getOrLoadClients();
  } catch (err) {
    console.error('Dashboard: could not load clients', err);
    clients = [];
  }

  renderStats(clients);
  renderPipeline(clients);
  renderRecentClients(clients);
}

function renderStats(clients) {
  const totalEl = document.getElementById('stat-total-clients');
  const activeEl = document.getElementById('stat-active-deals');
  const revenueEl = document.getElementById('stat-won-revenue');
  const newWeekEl = document.getElementById('stat-new-week');

  if (totalEl) totalEl.textContent = clients.length;

  if (activeEl) {
    const active = clients.filter(c => c.status !== 'Won' && c.status !== 'Lost').length;
    activeEl.textContent = active;
  }

  if (revenueEl) {
    const revenue = clients
      .filter(c => c.status === 'Won')
      .reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);
    revenueEl.textContent = `$${revenue.toLocaleString()}`;
  }

  if (newWeekEl) {
    const newThisWeek = clients.filter(c => {
      const days = (Date.now() - new Date(c.createdAt)) / 86400000;
      return days <= 7;
    }).length;
    newWeekEl.textContent = newThisWeek;
  }
}

function renderPipeline(clients) {
  const counts = { Lead: 0, Contacted: 0, Won: 0, Lost: 0 };
  clients.forEach(c => {
    if (counts[c.status] !== undefined) counts[c.status]++;
  });

  const leadEl = document.getElementById('pipeline-lead');
  const contactedEl = document.getElementById('pipeline-contacted');
  const wonEl = document.getElementById('pipeline-won');
  const lostEl = document.getElementById('pipeline-lost');

  if (leadEl) leadEl.textContent = counts.Lead;
  if (contactedEl) contactedEl.textContent = counts.Contacted;
  if (wonEl) wonEl.textContent = counts.Won;
  if (lostEl) lostEl.textContent = counts.Lost;
}

function renderRecentClients(clients) {
  const listEl = document.getElementById('recent-clients-list');
  if (!listEl) return;

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    listEl.innerHTML = '<li><span>No clients yet.</span></li>';
    return;
  }

  listEl.innerHTML = recent.map(c => `
    <li>
      <span>${c.name} <small style="color: var(--text-muted);">(${c.company})</small></span>
      <span class="badge">${c.status}</span>
    </li>
  `).join('');
}