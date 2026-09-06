// clients.js - logic for clients.html.
// main.js calls initClients() after it has already checked the
// visitor is logged in and set up the sidebar.

import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { DataStore } from "./data.js";

const STATUS_OPTIONS = ["Lead", "Contacted", "Won", "Lost"];

// Everything the Clients page needs to remember while it's open.
const state = {
  clients: [],
  searchQuery: "",
  activeStatusFilter: "All",
  sortOption: "newest",
  selectedClientId: null,
};

function isValidEmailFormat(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Builds the little avatar image (or a colored circle with initials,
// if the client has no picture).
function renderAvatarHtml(client, sizeClass) {
  if (client.image) {
    return `<img src="${UI.escapeHtml(client.image)}" alt="${UI.escapeHtml(client.name)}" class="avatar ${sizeClass}">`;
  }
  const initials = UI.getInitials(client.name);
  return `<div class="avatar-fallback ${sizeClass}">${UI.escapeHtml(initials)}</div>`;
}

// Takes the full client list and returns only the ones that should be
// visible right now, based on the search box, the active filter chip,
// and the sort dropdown. This never changes state.clients itself — it
// works on a copy.
function getVisibleClients() {
  let visibleClients = state.clients.slice();

  if (state.activeStatusFilter !== "All") {
    visibleClients = visibleClients.filter(function (client) {
      return client.status === state.activeStatusFilter;
    });
  }

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    visibleClients = visibleClients.filter(function (client) {
      const matchesName = client.name.toLowerCase().includes(query);
      const matchesCompany = client.company.toLowerCase().includes(query);
      return matchesName || matchesCompany;
    });
  }

  if (state.sortOption === "newest") {
    visibleClients.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (state.sortOption === "name") {
    visibleClients.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (state.sortOption === "deal") {
    visibleClients.sort(function (a, b) {
      return b.dealValue - a.dealValue;
    });
  }

  return visibleClients;
}

function renderClients() {
  const container = document.getElementById("clients-list");
  const visibleClients = getVisibleClients();

  if (visibleClients.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found.</p>';
    return;
  }

  const cardsHtml = visibleClients.map(function (client) {
    return `
      <div class="client-card" data-id="${client.id}">
        ${renderAvatarHtml(client, "")}
        <div class="client-info">
          <strong>${UI.escapeHtml(client.name)}</strong>
          <span>${UI.escapeHtml(client.company)}</span>
          <span>${UI.escapeHtml(client.email)}</span>
        </div>
        <select class="status-select status-${client.status}" data-id="${client.id}">
          ${STATUS_OPTIONS.map(function (status) {
            const isSelected = status === client.status ? "selected" : "";
            return `<option value="${status}" ${isSelected}>${status}</option>`;
          }).join("")}
        </select>
        <span class="deal-value">${UI.formatCurrency(client.dealValue)}</span>
        <button class="btn-delete" data-id="${client.id}" type="button">Delete</button>
      </div>
    `;
  });

  container.innerHTML = cardsHtml.join("");
}

function saveAndRender() {
  Storage.saveClients(state.clients);
  renderClients();
}

async function loadAndRenderClients() {
  const container = document.getElementById("clients-list");
  container.innerHTML = '<p class="empty-state">Loading clients...</p>';

  try {
    state.clients = await DataStore.loadClients();
    renderClients();
  } catch (error) {
    container.innerHTML = `
      <p class="empty-state">Could not load clients. Check your connection and try again.</p>
      <button id="retry-btn" class="btn-secondary" type="button">Retry</button>
    `;
    document.getElementById("retry-btn").addEventListener("click", loadAndRenderClients);
  }
}

//Add Client modal

function openAddModal() {
  document.getElementById("add-client-modal").showModal();
}

function closeAddModal() {
  const form = document.getElementById("add-client-form");
  document.getElementById("add-client-modal").close();
  form.reset();
  UI.clearFieldErrors(form);
}

async function handleAddClientSubmit(event) {
  event.preventDefault();
  const form = event.target;
  UI.clearFieldErrors(form);

  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const phone = form.phone.value.trim();
  const company = form.company.value.trim();
  const dealValueText = form.dealValue.value.trim();
  const dealValue = Number(dealValueText);
  const status = form.status.value;

  let formIsValid = true;

  if (name.length < 3) {
    UI.showFieldError("ac-name", "Name must be at least 3 characters");
    formIsValid = false;
  }

  if (!isValidEmailFormat(email)) {
    UI.showFieldError("ac-email", "Please enter a valid email address");
    formIsValid = false;
  } else {
    const emailAlreadyUsed = state.clients.some(function (client) {
      return client.email.toLowerCase() === email;
    });
    if (emailAlreadyUsed) {
      UI.showFieldError("ac-email", "A client with this email already exists");
      formIsValid = false;
    }
  }

  if (phone && phone.length < 6) {
    UI.showFieldError("ac-phone", "Phone number looks too short");
    formIsValid = false;
  }

  if (!dealValueText || isNaN(dealValue) || dealValue <= 0) {
    UI.showFieldError("ac-dealValue", "Deal value must be a positive number");
    formIsValid = false;
  }

  if (!formIsValid) {
    return;
  }

  // The PRD requires a real POST request here, even though DummyJSON
  // does not actually save what we send - it just echoes back an id.
  const response = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName: name }),
  });
  const result = await response.json();

  const newClient = {
    id: result.id,
    name: name,
    email: email,
    phone: phone,
    company: company,
    image: "",
    status: status,
    dealValue: dealValue,
    notes: [],
    createdAt: new Date().toISOString(),
  };

  // unshift puts the new client at the front, so it shows up first.
  state.clients.unshift(newClient);
  saveAndRender();
  closeAddModal();
  UI.showToast("Client added ✓", "success");
}

// Delete

async function handleDeleteClient(id) {
  const confirmed = confirm("Delete this client? This cannot be undone.");
  if (!confirmed) {
    return;
  }

  try {
    await fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" });
  } catch (error) {
    // DummyJSON never really stored clients we added ourselves, so a
    // failed or 404 delete here is expected - we still remove the
    // client from our own data either way.
  }

  state.clients = state.clients.filter(function (client) {
    return client.id !== id;
  });
  saveAndRender();
  UI.showToast("Client deleted", "success");
}

//  Status change

function handleStatusChange(id, newStatus) {
  const client = state.clients.find(function (c) {
    return c.id === id;
  });
  client.status = newStatus;
  saveAndRender();
}

//Details modal + notes + reminder

function renderNotes(notes) {
  const container = document.getElementById("notes-list");

  if (notes.length === 0) {
    container.innerHTML = '<p class="text-muted">No notes yet.</p>';
    return;
  }

  container.innerHTML = notes
    .map(function (note) {
      return `
      <div class="note">
        <p>${UI.escapeHtml(note.text)}</p>
        <span class="text-muted">${UI.escapeHtml(note.date)}</span>
      </div>
    `;
    })
    .join("");
}

function openDetailsModal(id) {
  const client = state.clients.find(function (c) {
    return c.id === id;
  });

  state.selectedClientId = id;

  const imageEl = document.getElementById("d-image");
  const initialsEl = document.getElementById("d-initials");
  if (client.image) {
    imageEl.src = client.image;
    imageEl.alt = client.name;
    imageEl.hidden = false;
    initialsEl.hidden = true;
  } else {
    initialsEl.textContent = UI.getInitials(client.name);
    initialsEl.hidden = false;
    imageEl.hidden = true;
  }

  document.getElementById("d-name").textContent = client.name;
  document.getElementById("d-company").textContent = client.company;
  document.getElementById("d-email").textContent = client.email;
  document.getElementById("d-phone").textContent = client.phone || "—";
  document.getElementById("d-status").textContent = client.status;
  document.getElementById("d-dealValue").textContent = UI.formatCurrency(client.dealValue);
  document.getElementById("d-createdAt").textContent = new Date(client.createdAt).toLocaleDateString();

  renderNotes(client.notes);
  document.getElementById("note-input").value = "";

  document.getElementById("details-modal").showModal();
}

function closeDetailsModal() {
  document.getElementById("details-modal").close();
  state.selectedClientId = null;
}

function handleAddNote(event) {
  event.preventDefault();
  const input = document.getElementById("note-input");
  const text = input.value.trim();
  if (!text) {
    return;
  }

  const client = state.clients.find(function (c) {
    return c.id === state.selectedClientId;
  });
  client.notes.push({ text: text, date: new Date().toLocaleString() });
  Storage.saveClients(state.clients);
  renderNotes(client.notes);
  input.value = "";
}

function handleReminder() {
  const client = state.clients.find(function (c) {
    return c.id === state.selectedClientId;
  });
  const clientName = client.name;

  UI.showToast("Reminder set ✓", "success");
  setTimeout(function () {
    UI.showToast(`⏰ Follow up: ${clientName}`, "success");
  }, 60000);
}

// Wiring everything together

function setupEventListeners() {
  document.getElementById("add-client-btn").addEventListener("click", openAddModal);
  document.getElementById("add-client-close").addEventListener("click", closeAddModal);
  document.getElementById("add-client-form").addEventListener("submit", handleAddClientSubmit);

  document.getElementById("search-input").addEventListener("input", function (event) {
    state.searchQuery = event.target.value.trim();
    renderClients();
  });

  document.getElementById("sort-select").addEventListener("change", function (event) {
    state.sortOption = event.target.value;
    renderClients();
  });

  document.getElementById("filter-chips").addEventListener("click", function (event) {
    if (!event.target.classList.contains("chip")) {
      return;
    }
    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.remove("active");
    });
    event.target.classList.add("active");
    state.activeStatusFilter = event.target.dataset.status;
    renderClients();
  });

  const clientsList = document.getElementById("clients-list");

  // One click listener handles both "Delete" and opening the details
  // modal, since both happen inside the same list of cards.
  clientsList.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".btn-delete");
    if (deleteButton) {
      handleDeleteClient(Number(deleteButton.dataset.id));
      return;
    }

    const card = event.target.closest(".client-card");
    if (card && !event.target.closest("select, button")) {
      openDetailsModal(Number(card.dataset.id));
    }
  });

  clientsList.addEventListener("change", function (event) {
    if (!event.target.classList.contains("status-select")) {
      return;
    }
    const id = Number(event.target.dataset.id);
    handleStatusChange(id, event.target.value);
  });

  document.getElementById("details-close").addEventListener("click", closeDetailsModal);
  document.getElementById("note-form").addEventListener("submit", handleAddNote);
  document.getElementById("remind-btn").addEventListener("click", handleReminder);
}

export function initClients() {
  setupEventListeners();
  loadAndRenderClients();
}
