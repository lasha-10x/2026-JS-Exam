let clockTimer = null;

function renderGreeting() {
  const user = getCurrentUser();
  const firstName = user?.fullName.trim().split(/\s+/)[0] || 'there';

  document.getElementById('greeting').textContent = `Welcome back, ${firstName}!`;
}

function startClock() {
  const clock = document.getElementById('clock');

  function updateClock() {
    const now = new Date();
    clock.textContent = `${now.toLocaleDateString()} · ${now.toLocaleTimeString()}`;
  }

  updateClock();
  clockTimer = setInterval(updateClock, 1000);
}

function createStatCard(label, value, icon) {
  const card = document.createElement('article');
  card.className = 'stat';

  const top = document.createElement('div');
  top.className = 'stat__top';

  const title = document.createElement('span');
  title.className = 'stat__label';
  title.textContent = label;

  const iconBox = document.createElement('span');
  iconBox.className = 'stat__icon';
  iconBox.setAttribute('aria-hidden', 'true');
  iconBox.textContent = icon;

  const number = document.createElement('div');
  number.className = 'stat-num';
  number.textContent = value;

  top.append(title, iconBox);
  card.append(top, number);

  return card;
}

function renderStats(list) {
  const cards = [
    { label: 'Total Clients', value: list.length, icon: '◎' },
    { label: 'Active Deals', value: activeDeals(list).length, icon: '◇' },
    { label: 'Won Revenue', value: formatMoney(wonRevenue(list)), icon: '$' },
    { label: 'New This Week', value: newThisWeek(list).length, icon: '↗' },
  ];
  const container = document.getElementById('statCards');

  container.replaceChildren(
    ...cards.map(function (card) {
      return createStatCard(card.label, card.value, card.icon);
    }),
  );
}

function renderPipeline(list) {
  const container = document.getElementById('pipeline');
  const counts = countByStatus(list);

  container.replaceChildren();

  for (const status of CLIENT_STATUSES) {
    const row = document.createElement('div');
    row.className = 'pipe-row';

    const header = document.createElement('div');
    header.className = 'pipe-row__head';

    const badge = document.createElement('span');
    badge.className = `badge badge-${status.toLowerCase()}`;
    badge.textContent = status;

    const count = document.createElement('strong');
    count.className = 'pipe-row__count';
    count.textContent = counts[status];

    const bar = document.createElement('div');
    bar.className = 'pipe-bar';

    const fill = document.createElement('div');
    fill.className = `pipe-bar__fill is-${status.toLowerCase()}`;
    fill.style.width = list.length ? `${(counts[status] / list.length) * 100}%` : '0%';

    header.append(badge, count);
    bar.append(fill);
    row.append(header, bar);
    container.append(row);
  }
}

function renderRecent(list) {
  const container = document.getElementById('recent');
  const recent = recentClients(list, 5);

  container.replaceChildren();

  if (recent.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'sub';
    empty.textContent = 'No clients yet.';
    container.append(empty);
    return;
  }

  for (const client of recent) {
    const row = document.createElement('div');
    row.className = 'recent-row';

    const info = document.createElement('div');
    info.className = 'recent-row__info';

    const name = document.createElement('div');
    name.className = 'recent-row__name';
    name.textContent = client.name;

    const company = document.createElement('div');
    company.className = 'recent-row__company';
    company.textContent = client.company || 'No company';

    const badge = document.createElement('span');
    badge.className = `badge badge-${client.status.toLowerCase()}`;
    badge.textContent = client.status;

    const date = document.createElement('time');
    date.className = 'recent-row__date';
    date.dateTime = client.createdAt;
    date.textContent = new Date(client.createdAt).toLocaleDateString();

    info.append(name, company);
    row.append(info, badge, date);
    container.append(row);
  }
}

function showDashboardLoading() {
  document.getElementById('statCards').textContent = 'Loading dashboard…';
  document.getElementById('pipeline').textContent = 'Loading pipeline…';
  document.getElementById('recent').textContent = 'Loading clients…';
}

document.addEventListener('DOMContentLoaded', async function () {
  if (!initProtectedPage('dashboard')) {
    return;
  }

  renderGreeting();
  startClock();
  showDashboardLoading();

  try {
    const list = await loadClients();
    renderStats(list);
    renderPipeline(list);
    renderRecent(list);
  } catch (error) {
    console.error(error);
    document.getElementById('statCards').replaceChildren();
    document.getElementById('pipeline').textContent = 'Could not load pipeline.';
    document.getElementById('recent').textContent = 'Could not load clients.';
    showToast('Could not load clients. Check your connection.', 'error');
  }
});

window.addEventListener('beforeunload', function () {
  clearInterval(clockTimer);
});
