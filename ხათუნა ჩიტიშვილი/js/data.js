/**
 * Shared Data Logic
 * Centralizes data fetching and manipulation so both Dashboard and Clients pages can use it.
 */

/**
 * Initializes client data.
 * Checks localStorage first, if missing, fetches from API and stores.
 * @returns {Promise<Array>}
 */

async function initClientsData() {
  let clients = getClients();

  // If no clients in storage, fetch from API
  if (!clients || clients.length === 0) {
    try {
      const response = await fetch('https://dummyjson.com/users?limit=30');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API data to CRM Client format
      clients = data.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        company: user.company?.name || "Independent",
        image: user.image,
        status: "Lead",
        dealValue: Math.floor(Math.random() * 9501) + 500,
        notes: [],
        createdAt: new Date().toISOString()
      }));

      saveClients(clients);

      return { clients, error: null };
    } catch (error) {
      console.error("Failed to fetch clients:", error.message);
      return {
        clients: [],
        error: "Could not load clients. Check your connection and try again."
      };
    }
  } else {
    return { clients, error: null };
  }
}

/**
 * Adds a new client via API and updates local storage.
 * @param {Object} clientData - The raw client data from the form.
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function addClientData(clientData) {
  try {
    // 1. Send POST request to DummyJSON API
    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: clientData.name.split(' ')[0],
        lastName: clientData.name.split(' ').slice(1).join(' ') || '',
        email: clientData.email,
        phone: clientData.phone,
        company: { name: clientData.company },
        dealValue: Number(clientData.dealValue),
        status: clientData.status
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResult = await response.json();

    const newClient = {
      id: apiResult.id || Date.now(),
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone || "N/A",
      company: clientData.company || "Independent",
      image: null,
      status: clientData.status || "Lead",
      dealValue: Number(clientData.dealValue) || 0,
      notes: [],
      createdAt: new Date().toISOString()
    };

    //Add to local storage array at the top
    let currentClients = getClients() || [];
    currentClients.unshift(newClient);
    saveClients(currentClients);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to add client:", error.message);
    return { success: false, error: "Could not add client. Please try again." };
  }
}

/**
 * Deletes a client via API and updates local storage.
 * @param {string|number} id - The ID of the client to delete.
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function deleteClient(id) {
  try {
    const response = await fetch(`https://dummyjson.com/users/${id}`, {
      method: 'DELETE',
    });

    // Simulated clients might return 404, which is expected.
    if (!response.ok && response.status !== 404) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let currentClients = getClients() || [];
    currentClients = currentClients.filter(client => String(client.id) !== String(id));
    saveClients(currentClients);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to delete client:", error.message);
    return { success: false, error: "Could not delete client. Please try again." };
  }
}
