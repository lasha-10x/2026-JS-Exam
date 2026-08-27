import {getClients, saveClients, areClientsInitialized, markClientsInitialized} from "./storage.js";


export async function initializeClients() {
    if (areClientsInitialized()) {
        return getClients();
    }

    const response = await fetch("https://dummyjson.com/users?limit=30");

    if (!response.ok) {
        throw new Error("Failed to load client list.");
    }

    const data = await response.json();
    const statuses = ["Lead", "Contacted", "Won", "Lost"];

    const clients = data.users.map((user, index) => {
        return {
            id: user.id, 
            fullName: `${user.firstName} ${user.lastName}`, 
            email: user.email,
            phone: user.phone, 
            company: user.company?.name || "No Company",
            status: statuses[index % statuses.length],
            value: (index + 1) * 500, 
            createdAt: new Date(
                Date.now() - index * 24 * 60 * 60 * 1000
            ).toISOString(),
            image: user.image || ""
        }
    })

    saveClients(clients);
    markClientsInitialized();

    return clients;
}