// clients.js
// The biggest page: shows all clients as cards, with search/filter/sort,
// an "Add Client" modal (that POSTs to the API), a details modal (with
// notes + reminders), status changes, and delete (DELETE to the API).

initProtectedPage("clients");

// --- In-memory state ------------------------------------------------
// We keep ONE copy of the clients array in memory (loaded once on page
// load) and re-render from it. Every action below either changes this
// array, saves it to localStorage, and re-renders - or just re-renders
// (for search/filter/sort, which don't change the data itself).
let clients = [];
let searchTerm = "";
let activeStatus = "All";
let sortOption = "newest";
let currentDetailsClientId = null; // which client the details modal is showing

// --- Startup --------------------------------------------------------

async function initClientsPage() {
  const statusEl = document.getElementById("clients-status");
  statusEl.textContent = "Loading clients...";

  try {
    clients = await getOrLoadClients(); // from data.js
    statusEl.textContent = "";
    renderClients();
  } catch (err) {
    // If the fetch fails (e.g. no internet), show a Retry button instead
    // of a blank/broken page.
    statusEl.innerHTML = "";
    const msg = document.createElement("span");
    msg.textContent = "Could not load clients. ";
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Retry";
    retryBtn.onclick = initClientsPage;
    statusEl.appendChild(msg);
    statusEl.appendChild(retryBtn);
  }
}

// --- Filter / search / sort (pure - never change `clients` itself) -----

// Returns a NEW array: the subset of `clients` that should currently be
// visible, in the currently chosen order. We never sort/filter in place,
// so `clients` always stays as the full, unfiltered source of truth.
function getVisibleClients() {
  let result = clients;

  if (activeStatus !== "All") {
    result = result.filter((c) => c.status === activeStatus);
  }

  if (searchTerm.trim() !== "") {
    const term = searchTerm.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }

  // .slice() copies the array before sorting, so sort() (which sorts
  // IN PLACE) never touches the original `clients`/`result` reference.
  result = result.slice().sort((a, b) => {
    if (sortOption === "name") return a.name.localeCompare(b.name);
    if (sortOption === "dealValue") return b.dealValue - a.dealValue;
    // default: "newest" - most recently created first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
}

// --- Rendering --------------------------------------------------------

function renderClients() {
  const grid = document.getElementById("clients-grid");
  grid.innerHTML = "";

  const visible = getVisibleClients();

  if (visible.length === 0) {
    grid.innerHTML = "<p>No clients found.</p>";
    return;
  }

  visible.forEach((client) => {
    const card = document.createElement("div");
    card.className = "client-card";
    card.innerHTML = `
      <h3>${client.name}</h3>
      <div class="company">${client.company}</div>
      <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
      <p style="margin:8px 0 0; font-size:13px;">$${client.dealValue.toLocaleString()}</p>
    `;
    // Clicking anywhere on the card opens the details modal for THIS client.
    card.addEventListener("click", () => openDetailsModal(client.id));
    grid.appendChild(card);
  });
}

// --- Search / filter / sort event wiring -------------------------------

document.getElementById("search-input").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderClients();
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    // Move the "active" class from whichever chip had it to this one.
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeStatus = chip.dataset.status; // reads the data-status="..." attribute
    renderClients();
  });
});

document.getElementById("sort-select").addEventListener("change", (e) => {
  sortOption = e.target.value;
  renderClients();
});

// --- Add Client modal ---------------------------------------------------

const addModal = document.getElementById("add-modal");

document.getElementById("add-client-btn").addEventListener("click", () => {
  addModal.classList.remove("hidden");
});
document.getElementById("add-modal-cancel").addEventListener("click", () => {
  addModal.classList.add("hidden");
});

document.getElementById("add-client-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("c-name").value;
  const email = document.getElementById("c-email").value;
  const phone = document.getElementById("c-phone").value;
  const company = document.getElementById("c-company").value;
  const dealValue = document.getElementById("c-dealValue").value;
  const status = document.getElementById("c-status").value;

  clearFieldErrors(["c-name", "c-email", "c-phone", "c-dealValue"]);

  const errors = {};
  if (name.trim().length < 2) errors["c-name"] = "Name is required";
  if (!email.includes("@")) errors["c-email"] = "A valid email is required";
  if (phone.trim().length < 5) errors["c-phone"] = "Phone is required";
  if (dealValue === "" || Number(dealValue) < 0) {
    errors["c-dealValue"] = "Enter a deal value of 0 or more";
  }

  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    errorKeys.forEach((field) => showFieldError(field, errors[field]));
    return;
  }

  // The PRD wants us to actually POST to the API (DummyJSON echoes back
  // a fake new id - it doesn't really save on their server, but it
  // proves we know how to send data with fetch).
  try {
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: name, email }),
    });
    const created = await response.json();

    const newClient = {
      id: created.id || Date.now(), // fall back to Date.now() just in case
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim() || "—",
      status,
      dealValue: Number(dealValue),
      notes: [],
      createdAt: new Date().toISOString(),
    };

    // Add to the FRONT of the array so it shows up first under "newest".
    clients.unshift(newClient);
    saveClients(clients);

    addModal.classList.add("hidden");
    e.target.reset(); // clears all the form's inputs back to blank
    showToast("Client added", "success");
    renderClients();
  } catch (err) {
    showToast("Could not add client - check your connection", "error");
  }
});

// --- Details modal (view/edit status, notes, reminder, delete) ---------

const detailsModal = document.getElementById("details-modal");
const statusOptions = ["New", "Contacted", "Negotiation", "Won", "Lost"];

function openDetailsModal(clientId) {
  currentDetailsClientId = clientId;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  document.getElementById("d-name").textContent = client.name;
  document.getElementById("d-company").textContent = client.company;
  document.getElementById("d-email").textContent = client.email;
  document.getElementById("d-phone").textContent = client.phone;
  document.getElementById("d-dealValue").textContent = client.dealValue.toLocaleString();
  document.getElementById("d-createdAt").textContent = new Date(client.createdAt).toLocaleDateString();

  const statusSelect = document.getElementById("d-status");
  statusSelect.innerHTML = statusOptions
    .map((s) => `<option value="${s}" ${s === client.status ? "selected" : ""}>${s}</option>`)
    .join("");

  renderNotes(client);
  detailsModal.classList.remove("hidden");
}

document.getElementById("details-modal-close").addEventListener("click", () => {
  detailsModal.classList.add("hidden");
});

document.getElementById("d-status").addEventListener("change", (e) => {
  const client = clients.find((c) => c.id === currentDetailsClientId);
  if (!client) return;
  client.status = e.target.value; // mutate the object that's already inside `clients`
  saveClients(clients);
  renderClients(); // refresh the badge on the card behind the modal
});

function renderNotes(client) {
  const list = document.getElementById("d-notes");
  list.innerHTML = "";
  if (client.notes.length === 0) {
    list.innerHTML = "<li>No notes yet.</li>";
    return;
  }
  client.notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
}

document.getElementById("d-add-note-btn").addEventListener("click", () => {
  const input = document.getElementById("d-note-input");
  const text = input.value.trim();
  if (text === "") return;

  const client = clients.find((c) => c.id === currentDetailsClientId);
  if (!client) return;

  client.notes.push(text);
  saveClients(clients);
  renderNotes(client);
  input.value = "";
});

document.getElementById("d-remind-btn").addEventListener("click", () => {
  const client = clients.find((c) => c.id === currentDetailsClientId);
  if (!client) return;

  showToast("Reminder set ✓", "success");

  // setTimeout schedules code to run later WITHOUT freezing the page -
  // the user can keep using the app for that full minute.
  setTimeout(() => {
    showToast(`⏰ Follow up: ${client.name}`, "success");
  }, 60 * 1000); // 60 seconds
});

document.getElementById("d-delete-btn").addEventListener("click", async () => {
  const client = clients.find((c) => c.id === currentDetailsClientId);
  if (!client) return;

  // confirm() IS allowed by the PRD, specifically for delete confirmations.
  const sure = confirm(`Delete ${client.name}? This cannot be undone.`);
  if (!sure) return;

  try {
    // DummyJSON's fake DELETE endpoint - like the POST above, it doesn't
    // really persist server-side, but we still call it to prove the flow.
    await fetch(`https://dummyjson.com/users/${client.id}`, { method: "DELETE" });
  } catch (err) {
    // Even if the network call fails, we still remove it locally below -
    // this is OUR CRM's data, the fake API isn't the real source of truth.
  }

  clients = clients.filter((c) => c.id !== currentDetailsClientId);
  saveClients(clients);
  detailsModal.classList.add("hidden");
  showToast("Client deleted", "success");
  renderClients();
});

initClientsPage();
