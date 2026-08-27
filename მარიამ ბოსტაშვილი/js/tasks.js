// Tasks page: shows Jira issues and Asana tasks side by side.
// Each column loads on its own, so one integration failing (or not being
// configured) never blocks the other.

function setColumnMessage(host, message, options = {}) {
  const { loading = false, withRetry = false, onRetry = null } = options;
  host.textContent = '';

  const state = document.createElement('div');
  state.className = 'list-state';

  if (loading) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    state.append(spinner);
  }

  const title = document.createElement('div');
  title.className = 'list-state__title';
  title.textContent = message;
  state.append(title);

  if (withRetry && onRetry) {
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.className = 'btn btn-outline';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', onRetry);
    state.append(retryButton);
  }

  host.append(state);
}

// One task row: a title, an optional status badge, and a link out to the tool.
function createTaskCard(title, statusText, url) {
  const card = document.createElement('article');
  card.className = 'client-card';

  const top = document.createElement('div');
  top.className = 'client-card__top';

  const identity = document.createElement('div');
  identity.className = 'client-card__id';

  const name = document.createElement('div');
  name.className = 'client-card__name';
  name.textContent = title;
  identity.append(name);
  top.append(identity);

  const meta = document.createElement('div');
  meta.className = 'client-card__meta';

  if (statusText) {
    const badge = document.createElement('span');
    badge.className = 'badge badge-contacted';
    badge.textContent = statusText;
    meta.append(badge);
  }

  if (url) {
    const link = document.createElement('a');
    link.className = 'client-card__value';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open →';
    meta.append(link);
  }

  card.append(top, meta);
  return card;
}

function renderTaskCards(host, cards) {
  host.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'client-grid';

  for (const card of cards) {
    grid.append(card);
  }

  host.append(grid);
}

// Generic column loader: fetch, then render cards / empty / error states.
async function loadColumn(hostId, loader, buildCard, emptyMessage) {
  const host = document.getElementById(hostId);
  setColumnMessage(host, 'Loading…', { loading: true });

  try {
    const items = await loader();

    if (!items.length) {
      setColumnMessage(host, emptyMessage);
      return;
    }

    renderTaskCards(host, items.map(buildCard));
  } catch (error) {
    console.error(error);
    setColumnMessage(host, error.message || 'Could not load tasks.', {
      withRetry: true,
      onRetry: function () {
        loadColumn(hostId, loader, buildCard, emptyMessage);
      },
    });
  }
}

function loadJiraColumn() {
  return loadColumn(
    'jiraColumn',
    loadJiraIssues,
    function (issue) {
      return createTaskCard(issue.summary, issue.status, issue.url);
    },
    'No Jira issues yet.',
  );
}

function loadAsanaColumn() {
  return loadColumn(
    'asanaColumn',
    loadAsanaTasks,
    function (task) {
      return createTaskCard(task.name, task.completed ? 'Completed' : 'Open', task.permalink_url);
    },
    'No Asana tasks yet.',
  );
}

document.addEventListener('DOMContentLoaded', function () {
  if (!initProtectedPage('tasks')) {
    return;
  }

  loadJiraColumn();
  loadAsanaColumn();

  document.getElementById('refreshTasksBtn')?.addEventListener('click', function () {
    loadJiraColumn();
    loadAsanaColumn();
  });
});
