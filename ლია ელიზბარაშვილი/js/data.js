const API_URL = 'https://dummyjson.com/users';

function getSession() {
  return JSON.parse(localStorage.getItem('crm_session'));
}

function getUsers() {
  return JSON.parse(localStorage.getItem('crm_users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('crm_users', JSON.stringify(users));
}

function getCurrentUser() {
  const session = getSession();
  return getUsers().find(function (user) {
    return user.id === session.userId;
  });
}

function saveClients(clients) {
  localStorage.setItem('crm_clients', JSON.stringify(clients));
}

function mapApiUserToClient(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.firstName + ' ' + apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone,
    company: apiUser.company.name,
    image: apiUser.image,
    status: 'Lead',
    dealValue: Math.floor(Math.random() * 9500) + 500, 
    notes: [],
    createdAt: new Date().toISOString()
  };
}

async function loadClients() {
  const stored = localStorage.getItem('crm_clients');
  if (stored) {
    return JSON.parse(stored);
  }

  const response = await fetch(API_URL + '?limit=30');
  if (!response.ok) {
    throw new Error('API responded with status ' + response.status);
  }

  const data = await response.json();
  const clients = data.users.map(mapApiUserToClient);
  saveClients(clients);
  return clients;
}

async function apiAddClient(payload) {
  const response = await fetch(API_URL + '/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('API responded with status ' + response.status);
  }
  return response.json();
}

async function apiDeleteClient(id) {
  const response = await fetch(API_URL + '/' + id, { method: 'DELETE' });
  if (!response.ok && response.status !== 404) {
    throw new Error('API responded with status ' + response.status);
  }
}
