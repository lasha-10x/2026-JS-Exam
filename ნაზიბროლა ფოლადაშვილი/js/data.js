/* CLIENT STORAGE CONFIGURATION */

const CLIENTS_KEY = "crm_clients";

const CLIENTS_API_URL =
    "https://dummyjson.com/users?limit=30";


/* GET CLIENTS FROM LOCAL STORAGE */

function getClients() {
    const storedClients =
        localStorage.getItem(CLIENTS_KEY);

    if (storedClients === null) {
        return [];
    }

    try {
        return JSON.parse(storedClients);
    } catch (error) {
        console.error(
            "Stored client data is invalid:",
            error
        );

        localStorage.removeItem(CLIENTS_KEY);

        return [];
    }
}


/* SAVE CLIENTS TO LOCAL STORAGE */

function saveClients(clients) {
    localStorage.setItem(
        CLIENTS_KEY,
        JSON.stringify(clients)
    );
}


/* CONVERT AN API USER TO A CRM CLIENT */

function createClientFromApiUser(user) {
    const randomDaysAgo =
        Math.floor(Math.random() * 60);

    const createdDate = new Date();

    createdDate.setDate(
        createdDate.getDate() - randomDaysAgo
    );

    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        company: user.company?.name || "",
        image: user.image,
        status: "Lead",
        dealValue:
            Math.floor(Math.random() * 9501) + 500,
        notes: [],
        createdAt: createdDate.toISOString(),
    };
}


/* FETCH CLIENTS FROM DUMMYJSON */

async function fetchClientsFromApi() {
    const response = await fetch(
        CLIENTS_API_URL
    );

    if (!response.ok) {
        throw new Error(
            "Could not load clients"
        );
    }

    const data = await response.json();

    const clients = data.users.map((user) => {
        return createClientFromApiUser(user);
    });

    saveClients(clients);

    return clients;
}


/* LOAD CLIENTS FROM LOCAL STORAGE OR API */

async function loadClients() {
    const clients = getClients();

    if (clients.length > 0) {
        return clients;
    }

    return fetchClientsFromApi();
}


/* ADD A CLIENT TO LOCAL STORAGE */

function addClientToStorage(client) {
    const clients = getClients();

    clients.unshift(client);

    saveClients(clients);

    return clients;
}


/* UPDATE A CLIENT IN LOCAL STORAGE */

function updateClientInStorage(updatedClient) {
    const clients = getClients();

    const updatedClients = clients.map(
        (client) => {
            if (
                client.id === updatedClient.id
            ) {
                return updatedClient;
            }

            return client;
        }
    );

    saveClients(updatedClients);

    return updatedClients;
}


/* REMOVE A CLIENT FROM LOCAL STORAGE */

function removeClientFromStorage(
    clientId
) {
    const clients = getClients();

    const updatedClients =
        clients.filter((client) => {
            return client.id !== clientId;
        });

    saveClients(updatedClients);

    return updatedClients;
}


/* RELOAD CLIENTS FROM THE API */

async function resetClients() {
    localStorage.removeItem(CLIENTS_KEY);

    return fetchClientsFromApi();
}