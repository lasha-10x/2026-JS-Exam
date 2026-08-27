/* DummyJSON client data functions */

const CLIENTS_API_URL =
    "https://dummyjson.com/users";

// Requests the initial client users from DummyJSON
async function fetchClientUsers() {
    const response = await fetch(
        CLIENTS_API_URL + "?limit=30"
    );

    if (!response.ok) {
        throw new Error(
            "Could not load clients. Check your connection and try again."
        );
    }

    const data = await response.json();

    return data.users;
}

// Converts a DummyJSON user into the CRM client structure
function convertUserToClient(user) {
    const dealValue =
        Math.floor(Math.random() * 20 + 1) * 500;

    return {
        id: user.id,
        name: user.firstName + " " + user.lastName,
        email: String(user.email).toLowerCase(),
        phone: user.phone,
        company: user.company.name,
        image: user.image,
        status: "Lead",
        dealValue: dealValue,
        notes: [],
        createdAt: new Date().toISOString()
    };
}

// Converts every API user into a CRM client
function convertUsersToClients(users) {
    return users.map(function (user) {
        return convertUserToClient(user);
    });
}


// Sends a new client to the DummyJSON API
async function createClientOnApi(clientData) {
    const response = await fetch(
        CLIENTS_API_URL + "/add",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clientData)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Could not add the client. Please try again."
        );
    }

    return response.json();
}

// Requests deletion of a client from DummyJSON
async function deleteClientOnApi(clientId) {
    const response = await fetch(
        CLIENTS_API_URL + "/" +
            encodeURIComponent(clientId),
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Could not delete the client. Please try again."
        );
    }

    return response.json();
}

// Returns saved clients or loads them from the API
async function loadClients() {
    if (hasStoredClients()) {
        return getClients();
    }

    const apiUsers = await fetchClientUsers();
    const loadedClients = convertUsersToClients(apiUsers);

    saveClients(loadedClients);

    return loadedClients;
}