const API_BASE = 'https://dummyjson.com';
const CLIENT_STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];

let clients = [];

function createLocalClientId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureUniqueClientIds(list) {
  const seenIds = new Set();
  let changed = false;

  const normalizedClients = list.map(function (client) {
    let id = client.id;
    const apiId = client.apiId ?? (Number.isInteger(client.id) ? client.id : null);
    const idKey = id == null ? '' : String(id);

    if (!idKey || seenIds.has(idKey)) {
      id = createLocalClientId();
      changed = true;
    }

    seenIds.add(String(id));
    if (id !== client.id || apiId !== client.apiId) {
      changed = true;
      return { ...client, id, apiId };
    }

    return client;
  });

  return { clients: normalizedClients, changed };
}

function ensureDemoPipelineStatuses(list) {
  const isUntouchedLeadSeed =
    list.length === 30 &&
    list.every(function (client) {
      return client.status === 'Lead' && Number.isInteger(client.apiId);
    });

  if (!isUntouchedLeadSeed) {
    return { clients: list, changed: false };
  }

  return {
    clients: list.map(function (client, index) {
      return { ...client, status: CLIENT_STATUSES[index % CLIENT_STATUSES.length] };
    }),
    changed: true,
  };
}

// Convert an API user into a CRM client.
function mapApiClient(user, index) {
  return {
    id: user.id,
    apiId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    company: user.company?.name || '',
    image: user.image,
    status: CLIENT_STATUSES[index % CLIENT_STATUSES.length],
    dealValue: Math.floor(Math.random() * 9500) + 500,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}

function persistClients(list) {
  if (!saveClients(list)) {
    throw new Error('Could not save client data. Browser storage may be full.');
  }
}

// Load saved clients or fetch them on the first visit.
async function loadClients() {
  const storedClients = getClients();

  if (storedClients !== null) {
    const normalized = ensureUniqueClientIds(storedClients);
    const seeded = ensureDemoPipelineStatuses(normalized.clients);
    clients = seeded.clients;

    if (normalized.changed || seeded.changed) {
      persistClients(clients);
    }

    return clients;
  }

  const response = await fetch(`${API_BASE}/users?limit=30`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();
  clients = data.users.map(mapApiClient);
  persistClients(clients);

  return clients;
}

// Clear local data and fetch the original clients again.
async function reloadClientsFromApi() {
  const previousClients = getClients();
  clearClients();
  clients = [];

  try {
    return await loadClients();
  } catch (error) {
    clients = previousClients || [];

    if (previousClients !== null) {
      persistClients(previousClients);
    }

    throw error;
  }
}

function activeDeals(list) {
  return list.filter(function (client) {
    return client.status !== 'Won' && client.status !== 'Lost';
  });
}

function wonRevenue(list) {
  return list
    .filter(function (client) {
      return client.status === 'Won';
    })
    .reduce(function (total, client) {
      return total + Number(client.dealValue || 0);
    }, 0);
}

function newThisWeek(list) {
  return list.filter(function (client) {
    const ageInDays = (Date.now() - new Date(client.createdAt)) / 86400000;
    return ageInDays <= 7;
  });
}

function countByStatus(list) {
  const initialCounts = Object.fromEntries(
    CLIENT_STATUSES.map(function (status) {
      return [status, 0];
    }),
  );

  return list.reduce(function (totals, client) {
    totals[client.status] = (totals[client.status] || 0) + 1;
    return totals;
  }, initialCounts);
}

function recentClients(list, limit = 5) {
  return [...list]
    .sort(function (firstClient, secondClient) {
      return new Date(secondClient.createdAt) - new Date(firstClient.createdAt);
    })
    .slice(0, limit);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', function (event) {
    if (event.key !== STORAGE_KEYS.clients) {
      return;
    }

    try {
      const incomingClients = event.newValue ? JSON.parse(event.newValue) : [];
      clients = ensureUniqueClientIds(incomingClients).clients;

      if (typeof refreshClients === 'function') {
        refreshClients();
      }

      if (typeof renderStats === 'function') {
        renderStats(clients);
        renderPipeline(clients);
        renderRecent(clients);
      }
    } catch (error) {
      console.error('Could not synchronize client data:', error);
    }
  });
}
