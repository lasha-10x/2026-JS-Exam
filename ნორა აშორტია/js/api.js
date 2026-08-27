// api.js — a tiny mock API so the app behaves like it talks to a real
// backend (loading delays, promises) while actually persisting to the
// "crm_clients" localStorage key.

const SEED_CLIENTS = [
    {
        id: 1,
        name: "Naruto Uzumaki",
        company: "Konoha Tech",
        value: "$12,400",
        status: "new",
    },
    {
        id: 2,
        name: "Ichigo Kurosaki",
        company: "Soul Society Corp",
        value: "$24,000",
        status: "active",
    },
    {
        id: 3,
        name: "Sung Jinwoo",
        company: "Shadow Monarch Guild",
        value: "$56,200",
        status: "active",
    },
    {
        id: 4,
        name: "Sasuke Uchiha",
        company: "Uchiha Investments",
        value: "$31,000",
        status: "paused",
    },
    {
        id: 5,
        name: "Kakashi Hatake",
        company: "Sharingan Security",
        value: "$44,800",
        status: "active",
    },
];

function readClients() {
    const raw = localStorage.getItem("crm_clients");
    if (!raw) {
        localStorage.setItem("crm_clients", JSON.stringify(SEED_CLIENTS));
        return SEED_CLIENTS;
    }
    return JSON.parse(raw);
}

function writeClients(list) {
    localStorage.setItem("crm_clients", JSON.stringify(list));
}

// GET /clients — resolves after a short simulated delay
function apiGetClients() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(readClients()), 600);
    });
}

// POST /clients — adds one client, resolves with the new record
function apiAddClient(client) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const list = readClients();
            const record = { id: Date.now(), ...client };
            list.push(record);
            writeClients(list);
            resolve(record);
        }, 400);
    });
}

// DELETE /clients/:id — removes one client, resolves with the new list
function apiDeleteClient(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const list = readClients().filter((c) => c.id !== id);
            writeClients(list);
            resolve(list);
        }, 300);
    });
}
