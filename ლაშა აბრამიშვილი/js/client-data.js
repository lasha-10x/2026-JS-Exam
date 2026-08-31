function generateDealValue() {
  return Math.floor(Math.random() * 9001) + 1000;
}

function getCurrentClientOwnerId() {
  const session = typeof getSession === "function" ? getSession() : null;

  if (!session || session.userId === undefined || session.userId === null) {
    return null;
  }

  return String(session.userId);
}

function getInitializedClientOwners() {
  const savedOwners = localStorage.getItem("crm_client_owners_initialized");

  if (!savedOwners) {
    return [];
  }

  try {
    const owners = JSON.parse(savedOwners);

    return Array.isArray(owners) ? owners.map(String) : [];
  } catch (error) {
    console.error("Failed to read initialized client owners:", error);
    return [];
  }
}

function isCurrentClientOwnerInitialized() {
  const currentOwnerId = getCurrentClientOwnerId();

  if (currentOwnerId === null) {
    return true;
  }

  return getInitializedClientOwners().includes(currentOwnerId);
}

function markCurrentClientOwnerInitialized() {
  const currentOwnerId = getCurrentClientOwnerId();

  if (currentOwnerId === null) {
    return;
  }

  const owners = getInitializedClientOwners();

  if (!owners.includes(currentOwnerId)) {
    owners.push(currentOwnerId);
    localStorage.setItem(
      "crm_client_owners_initialized",
      JSON.stringify(owners)
    );
  }
}

// Normalization gives old or imported records the current Client shape.
function normalizeStoredClient(client, ownerId, forceOwnerId) {
  const savedDealValue = Number(client.dealValue);
  const validStatuses = ["Lead", "Contacted", "Won", "Lost"];
  const clientOwnerId =
    forceOwnerId || client.ownerId === undefined || client.ownerId === null
      ? ownerId
      : String(client.ownerId);

  return {
    id: client.id,
    ownerId: clientOwnerId,
    name: client.name || client.fullName || "",
    email: (client.email || "").trim().toLowerCase(),
    phone: client.phone || "",
    company: client.company || "",
    image: client.image || "",
    status: validStatuses.includes(client.status) ? client.status : "Lead",
    dealValue: savedDealValue >= 0 ? savedDealValue : generateDealValue(),
    notes: Array.isArray(client.notes) ? client.notes : [],
    createdAt: client.createdAt || new Date().toISOString(),
  };
}

function getAllStoredClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients === null) {
    return null;
  }

  try {
    const clients = JSON.parse(savedClients);

    if (!Array.isArray(clients)) {
      throw new Error("Stored client data is not an array");
    }

    const containsInvalidClient = clients.some(function (client) {
      return !client || typeof client !== "object";
    });

    if (containsInvalidClient) {
      throw new Error("Stored client data contains an invalid client");
    }

    const currentOwnerId = getCurrentClientOwnerId();
    const normalizedClients = clients.map(function (client) {
      return normalizeStoredClient(client, currentOwnerId);
    });
    const normalizedClientsJson = JSON.stringify(normalizedClients);

    if (normalizedClientsJson !== savedClients) {
      localStorage.setItem("crm_clients", normalizedClientsJson);
    }

    return normalizedClients;
  } catch (error) {
    console.error("Failed to read stored clients:", error);
    localStorage.removeItem("crm_clients");
    return null;
  }
}

// Stored clients are preferred so user changes survive page refreshes.
function getStoredClients() {
  const clients = getAllStoredClients();
  const currentOwnerId = getCurrentClientOwnerId();

  if (clients === null) {
    return null;
  }

  if (currentOwnerId === null) {
    return clients;
  }

  return clients.filter(function (client) {
    return String(client.ownerId) === currentOwnerId;
  });
}

function saveClientsForCurrentUser(currentUserClients) {
  const currentOwnerId = getCurrentClientOwnerId();
  const allClients = getAllStoredClients() || [];
  const otherUsersClients = allClients.filter(function (client) {
    return String(client.ownerId) !== currentOwnerId;
  });
  const normalizedCurrentClients = currentUserClients.map(function (client) {
    return normalizeStoredClient(client, currentOwnerId, true);
  });
  const updatedClients = otherUsersClients.concat(normalizedCurrentClients);

  localStorage.setItem("crm_clients", JSON.stringify(updatedClients));
  markCurrentClientOwnerInitialized();

  return normalizedCurrentClients;
}

// The API response is transformed into the Client model used by every page.
async function fetchClientsFromApi() {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=30");

    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }

    const data = await response.json();

    if (!Array.isArray(data.users)) {
      throw new Error("The API returned invalid client data");
    }

    const currentOwnerId = getCurrentClientOwnerId();
    const clients = data.users.map(function (apiUser) {
      return {
        id: apiUser.id,
        ownerId: currentOwnerId,
        name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
        email: (apiUser.email || "").trim().toLowerCase(),
        phone: apiUser.phone || "",
        company: apiUser.company ? apiUser.company.name : "",
        image: apiUser.image || "",
        status: "Lead",
        dealValue: generateDealValue(),
        notes: [],
        createdAt: new Date().toISOString(),
      };
    });

    saveClientsForCurrentUser(clients);

    return clients;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    throw error;
  }
}

// DummyJSON simulates writes; localStorage provides the real persistence.
async function createClientInApi(clientData) {
  const response = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    throw new Error("Failed to create client");
  }

  return response.json();
}

async function deleteClientFromApi(clientId) {
  const response = await fetch(`https://dummyjson.com/users/${clientId}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete client");
  }
}

// One shared loader keeps Dashboard and Clients on the same data source.
async function loadClients() {
  const storedClients = getStoredClients();

  if (storedClients !== null) {
    if (storedClients.length > 0) {
      markCurrentClientOwnerInitialized();
    }

    if (
      storedClients.length === 0 &&
      !isCurrentClientOwnerInitialized()
    ) {
      return await fetchClientsFromApi();
    }

    return storedClients;
  }

  try {
    return await fetchClientsFromApi();
  } catch (error) {
    console.error("Failed to load clients:", error);
    throw error;
  }
}
