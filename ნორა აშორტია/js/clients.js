// clients.js — wires the clients page up to the mock API in api.js

const statusLabel = {
    lead: "Lead",
    contacted: "Contacted",
    won: "Won",
    lost: "Lost",
};

let currentModalClientId = null;
let currentFilter = "all";
let currentSort = "newest";
let allLoadedClients = [];

function rowHtml(client) {
    const rawStatus = (client.status || "lead").toLowerCase();
    const status = ["lead", "contacted", "won", "lost"].includes(rawStatus)
        ? rawStatus
        : "lead";

    const tr = document.createElement("tr");
    tr.dataset.id = client.id;
    tr.style.cursor = "pointer";

    // 1. Name
    const tdName = document.createElement("td");
    tdName.textContent = client.name;
    tr.appendChild(tdName);

    // 2. Company
    const tdCompany = document.createElement("td");
    tdCompany.textContent = client.company;
    tr.appendChild(tdCompany);

    // 3. Value
    const tdValue = document.createElement("td");
    tdValue.textContent = client.value || "—";
    tr.appendChild(tdValue);

    // 4. Status Select
    const tdSelect = document.createElement("td");
    const select = document.createElement("select");
    select.className = `status-select ${status}`;
    select.addEventListener("change", (e) => updateClientStatus(e, client.id));

    const statuses = [
        { value: "lead", label: "Lead" },
        { value: "contacted", label: "Contacted" },
        { value: "won", label: "Won" },
        { value: "lost", label: "Lost" },
    ];

    statuses.forEach((s) => {
        const option = document.createElement("option");
        option.value = s.value;
        option.textContent = s.label;
        if (status === s.value) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    tdSelect.appendChild(select);
    tr.appendChild(tdSelect);

    // 5. Delete Button
    const tdBtn = document.createElement("td");
    const button = document.createElement("button");
    button.className = "del-btn";
    button.textContent = "Delete";
    button.addEventListener("click", (e) => removeClient(e, client.id));

    tdBtn.appendChild(button);
    tr.appendChild(tdBtn);

    return tr;
}

function renderClients(list) {
    allLoadedClients = list;
    filterAndSortClients();
}

function filterAndSortClients() {
    const tbody = document.getElementById("client-rows");
    if (!tbody) return;

    const searchInput = document.getElementById("client-search-input");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    // 1. Filter by status
    let filtered = allLoadedClients.filter((client) => {
        const clientStatus = (client.status || "lead").toLowerCase();
        if (currentFilter === "all") return true;
        return clientStatus === currentFilter;
    });

    // 2. Search by name or company
    if (query !== "") {
        filtered = filtered.filter(
            (client) =>
                (client.name && client.name.toLowerCase().includes(query)) ||
                (client.company &&
                    client.company.toLowerCase().includes(query)),
        );
    }

    // 3. Sorting
    filtered.sort((a, b) => {
        if (currentSort === "name") {
            return (a.name || "").localeCompare(b.name || "");
        } else if (currentSort === "value") {
            const valA =
                parseFloat((a.value || "0").replace(/[^0-9.-]+/g, "")) || 0;
            const valB =
                parseFloat((b.value || "0").replace(/[^0-9.-]+/g, "")) || 0;
            return valB - valA;
        } else {
            // Newest Arrived (By: ID)
            return (b.id || 0) - (a.id || 0);
        }
    });

    tbody.innerHTML = "";

    if (!filtered.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        const div = document.createElement("div");
        div.className = "empty-state";
        div.textContent = "No matching clients found.";
        td.appendChild(div);
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    filtered.forEach((client, index) => {
        const rowElement = rowHtml(client);

        // Bind clicking on rows to open a modal (unless we click on delete or select)
        rowElement.addEventListener("click", (e) => {
            if (e.target.closest(".del-btn") || e.target.closest("select"))
                return;
            openClientModal(filtered[index].id);
        });

        tbody.appendChild(rowElement);
    });
}

function loadClients() {
    const tbody = document.getElementById("client-rows");
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    const div = document.createElement("div");
    div.className = "loading-state";
    div.textContent = "Loading clients…";
    td.appendChild(div);
    tr.appendChild(td);
    tbody.appendChild(tr);

    apiGetClients().then((list) => {
        const cleanedList = (list || []).map((c) => {
            const s = (c.status || "lead").toLowerCase();
            return {
                ...c,
                status: ["lead", "contacted", "won", "lost"].includes(s)
                    ? s
                    : "lead",
            };
        });
        localStorage.setItem("crm_clients", JSON.stringify(cleanedList));
        renderClients(cleanedList);
    });
}

function addClient(event) {
    event.preventDefault();
    const name = document.getElementById("in-name").value.trim();
    const company = document.getElementById("in-company").value.trim();
    const value = document.getElementById("in-value").value.trim();
    const status = document.getElementById("in-status").value;

    if (!name || !company) {
        showToast("Name and company are required", "error");
        return;
    }

    const btn = document.getElementById("add-btn");
    btn.disabled = true;
    btn.textContent = "Adding…";

    apiAddClient({ name, company, value, status }).then(() => {
        showToast("Client added", "success");
        document.getElementById("in-name").value = "";
        document.getElementById("in-company").value = "";
        document.getElementById("in-value").value = "";
        btn.disabled = false;
        btn.textContent = "Add client";
        loadClients();
    });
}

function removeClient(event, id) {
    event.stopPropagation();
    if (!confirm("Remove this client?")) return;
    apiDeleteClient(id).then((list) => {
        showToast("Client removed", "success");
        renderClients(list);
    });
}

function updateClientStatus(event, id) {
    event.stopPropagation();
    const newStatus = event.target.value;

    // Updating the data in localStorage
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const client = clients.find((c) => c.id == id);
    if (client) {
        client.status = newStatus;
        localStorage.setItem("crm_clients", JSON.stringify(clients));
        showToast("Status updated", "success");
        loadClients();
    }
}

// Modal & Notes Logic
function openClientModal(clientId) {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const client = clients.find((c) => c.id == clientId);
    if (!client) return;

    currentModalClientId = client.id;

    document.getElementById("m-name").textContent = client.name || "—";
    document.getElementById("m-company").textContent = client.company || "—";
    document.getElementById("m-email").textContent =
        client.email || "client@example.com";
    document.getElementById("m-phone").textContent =
        client.phone || "+1 000-000-0000";
    document.getElementById("m-value").textContent = client.value || "—";
    document.getElementById("m-inducted").textContent =
        client.inducted || new Date().toLocaleDateString();
    document.getElementById("m-avatar").textContent = (client.name || "C")
        .slice(0, 2)
        .toUpperCase();

    renderNotes(client.notes || []);

    document.getElementById("client-modal").classList.remove("hidden");
}

function closeClientModal() {
    document.getElementById("client-modal").classList.add("hidden");
    currentModalClientId = null;
}

function renderNotes(notes) {
    const list = document.getElementById("m-notes-list");
    if (!list) return;

    list.innerHTML = "";

    if (!notes.length) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-notes";
        emptyDiv.style.cssText =
            "color:var(--muted); font-size:13px; text-align:center; padding:15px;";
        emptyDiv.textContent = "No notes yet.";
        list.appendChild(emptyDiv);
        return;
    }

    notes.forEach((n, index) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";
        noteItem.style.cssText =
            "background:var(--panel); padding:8px 12px; border-radius:8px; margin-bottom:8px; border:1px solid var(--line); display: flex; justify-content: space-between; align-items: center;";

        const span = document.createElement("span");
        span.style.fontSize = "13px";

        const b = document.createElement("b");
        b.style.cssText = "color:var(--muted); font-size:11px; display:block;";
        b.textContent = n.date;

        span.appendChild(b);
        span.append(n.text);

        const deleteBtn = document.createElement("button");
        deleteBtn.style.cssText =
            "background:none; border:none; color:var(--muted); cursor:pointer; font-size:18px; padding:0 4px;";
        deleteBtn.title = "Delete note";
        deleteBtn.innerHTML = "&times;";
        deleteBtn.addEventListener("click", () =>
            deleteClientNote(currentModalClientId, index),
        );

        noteItem.appendChild(span);
        noteItem.appendChild(deleteBtn);
        list.appendChild(noteItem);
    });
}

function deleteClientNote(clientId, noteIndex) {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const client = clients.find((c) => c.id == clientId);
    if (client && client.notes) {
        client.notes.splice(noteIndex, 1);
        localStorage.setItem("crm_clients", JSON.stringify(clients));
        renderNotes(client.notes);
        showToast("Note deleted", "success");
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadClients();

    // Search Input Event
    const searchInput = document.getElementById("client-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            filterAndSortClients();
        });
    }

    // Filter Pills Buttons Click Event
    const pillButtons = document.querySelectorAll(".client-filter-btn");
    pillButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            pillButtons.forEach((b) => {
                b.classList.remove("active");
                b.style.background = "var(--panel)";
                b.style.color = "var(--muted)";
            });
            btn.classList.add("active");
            btn.style.background = "var(--coral)";
            btn.style.color = "#fff";

            currentFilter = btn.dataset.status;
            filterAndSortClients();
        });
    });

    // Sort Dropdown Change Event
    const sortSelect = document.getElementById("client-sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            filterAndSortClients();
        });
    }

    // Close with X button and click on modal background
    document
        .getElementById("close-modal")
        ?.addEventListener("click", closeClientModal);
    document.getElementById("client-modal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeClientModal();
    });

    // Add Note
    document.getElementById("m-add-note")?.addEventListener("click", () => {
        const input = document.getElementById("m-new-note");
        if (!input || !input.value.trim() || !currentModalClientId) return;

        const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
        const client = clients.find((c) => c.id == currentModalClientId);

        if (client) {
            if (!client.notes) client.notes = [];
            client.notes.push({
                text: input.value.trim(),
                date: new Date().toLocaleString(),
            });

            localStorage.setItem("crm_clients", JSON.stringify(clients));
            renderNotes(client.notes);
            input.value = "";
            showToast("Note added", "success");
        }
    });

    // Reminder Button
    document.getElementById("m-remind")?.addEventListener("click", () => {
        showToast("Reminder set for 1 minute.", "success");
        const clientName =
            document.getElementById("m-name")?.textContent || "Client";
        setTimeout(() => {
            showToast(`REMINDER: Follow up with ${clientName}!`, "success");
        }, 60000);
    });
});
