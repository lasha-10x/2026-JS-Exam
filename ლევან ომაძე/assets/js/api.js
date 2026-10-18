const CLIENT_STATUSES = ["All", "Lead", "Contacted", "Won", "Lost"];

function mapApiUserToClient(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    company: user.company?.name || "Independent",
    image: user.image,
    dealValue: Math.floor(Math.random() * 9501) + 500,
    status: "Lead",
    createdAt: new Date().toISOString(),
    notes: [],
    reminderAt: null,
  };
}

async function fetchInitialClients() {
  const response = await fetch("https://dummyjson.com/users?limit=30");
  if (!response.ok) {
    throw new Error("Could not load clients. Please try again.");
  }
  const data = await response.json();
  return data.users.map(mapApiUserToClient);
}

async function ensureClientsLoaded() {
  const savedClients = getClients();
  if (savedClients.length > 0) return savedClients;
  const clients = await fetchInitialClients();
  saveClients(clients);
  return clients;
}

async function postClient(client) {
  const response = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });
  if (!response.ok) {
    throw new Error("Could not add client. Please try again.");
  }
  const data = await response.json();
  return { ...client, id: Date.now() + Number(data.id || 0) };
}

async function deleteClientRequest(id) {
  const response = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Could not delete client. Please try again.");
  }
  return response.json();
}
