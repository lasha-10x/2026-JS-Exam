// const session = getSession();

// if (!session) {
//   window.location.href = 'index.html';
// }

// function getFirstName(fullName) {
//   return fullName.split(' ')[0];
// }

// function showWelcomeMessage() {
//   const welcomeText = document.getElementById('welcomeText');
//   const firstName = getFirstName(session.fullName);
//   welcomeText.textContent = `Welcome back, ${firstName}!`;
// }

// function updateClock() {
//   const now = new Date();
//   document.getElementById('clock').textContent = now.toLocaleTimeString();
//   document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// }

// showWelcomeMessage();
// updateClock();
// setInterval(updateClock, 1000);

//----------------- protecting Dashboard page and redirects user at the index.html to log in--------------
const session = requireAuth();

function getFirstName(fullName) {
  return fullName.split(' ')[0];
}

function showWelcomeMessage() {
  const welcomeText = document.getElementById('welcomeText');
  const firstName = getFirstName(session.fullName);
  welcomeText.textContent = `Welcome back, ${firstName}!`;
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

showWelcomeMessage();
updateClock();
setInterval(updateClock, 1000);

//--------------Handles theme changing-------------
initTheme();

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

//---------------In the Header Active page------
highlightActiveNavLink();



//--------------filling statCards


async function loadDashboardStats() {
  const clients = await getEnrichedClients();

  const totalClients = clients.length;

  const activeDeals = clients.filter(
    c => c.status !== 'Won' && c.status !== 'Lost'
  ).length;

  const wonRevenue = clients
    .filter(c => c.status === 'Won')
    .reduce((sum, c) => sum + c.dealValue, 0);

  const newThisWeek = clients.filter(c => {
    const daysAgo = (Date.now() - new Date(c.createdAt)) / 86400000;
    return daysAgo <= 7;
  }).length;

  return { totalClients, activeDeals, wonRevenue, newThisWeek };
}


async function renderStatCards() {
  const stats = await loadDashboardStats();

  document.getElementById('totalClientsCard').innerHTML =
    `<h4>Total Clients</h4><p>${stats.totalClients}</p>`;

  document.getElementById('activeDealsCard').innerHTML =
    `<h4>Active Deals</h4><p>${stats.activeDeals}</p>`;

  document.getElementById('wonRevenueCard').innerHTML =
    `<h4>Won Revenue</h4><p>${formatCurrency(stats.wonRevenue)}</p>`;

  document.getElementById('newThisWeekCard').innerHTML =
    `<h4>New This Week</h4><p>${stats.newThisWeek}</p>`;
}

renderStatCards();


//-------------Pipline status counter-------
async function getStatusCounts() {
  const clients = await getEnrichedClients();

  const counts = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, { Lead: 0, Contacted: 0, Won: 0, Lost: 0 });

  return counts;
}


async function renderPipeline() {
  const counts = await getStatusCounts();
  const pipelineDiv = document.getElementById('pipeline');

  pipelineDiv.innerHTML = `
    <h3>Pipeline</h3>
    <p class="pipelineCounts">
      Lead: ${counts.Lead} • Contacted: ${counts.Contacted} • Won: ${counts.Won} • Lost: ${counts.Lost}
    </p>
  `;
}

renderPipeline();

//-----------------------Bar Charts ---------------------
async function renderBarChart() {
  const counts = await getStatusCounts();
  const container = document.getElementById('barChart');

  const data = [
    { label: 'Lead', value: counts.Lead },
    { label: 'Contacted', value: counts.Contacted },
    { label: 'Won', value: counts.Won },
    { label: 'Lost', value: counts.Lost }
  ];

  const maxValue = Math.max(...data.map(d => d.value), 1);

  container.innerHTML = `
    <div class="barChartCard">
      <div class="barChartWrapper">
        ${data.map(d => `
          <div class="barColumn">
            <div class="barTrack">
              <div class="bar" style="height: ${(d.value / maxValue) * 100}%;"></div>
            </div>
            <span class="barValue">${d.value}</span>
            <span class="barLabel">${d.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

renderBarChart();

//-----------Recent clients-----------
async function renderRecentClients() {
  const clients = await getEnrichedClients();

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById('recentClients');

  container.innerHTML = `
    <h3>Recent Clients</h3>
  ${recent.map(client => `
    <div class="recentClientRow">
      <p class="recentName">${client.firstName} ${client.lastName} •</p> 
      <p class="recentCompany">${client.company?.name || ''} •</p>
      <p class="recentStatus">${client.status} •</p>
      <p class="recentDate">${new Date(client.createdAt).toLocaleDateString()}</p>
    </div>
      `).join('')}
    
    <a href="clients.html" class="viewAllLink">View all clients →</a>
  `;
}

renderRecentClients();

//-------------------Log Out--------
document.getElementById('logoutBtn').addEventListener('click', logout);