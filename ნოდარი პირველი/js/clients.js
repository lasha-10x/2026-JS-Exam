const CLIENTS_API_URL = "https://dummyjson.com/users?limit=30";
const STATUSES = ["Lead", "Contacted", "Won", "Lost"];
let clientsState = [];

// === ჩატვირთვა (P4.2) ===
async function ensureClientsLoaded() {
  const existing = getClients();
  if (existing.length > 0) {
    clientsState = existing;
    return clientsState;
  }

  const response = await fetch(CLIENTS_API_URL);
  const data = await response.json();

  clientsState = data.users.map(function (u) {
    return {
      id: u.id,
      name: u.firstName + " " + u.lastName,
      email: u.email,
      phone: u.phone,
      company: u.company.name,
      image: u.image,
      status: ["Lead", "Contacted", "Won", "Lost"][
        Math.floor(Math.random() * 4)
      ],
      dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
      notes: [],
      createdAt: new Date().toISOString(),
    };
  });

  saveClients(clientsState);
  return clientsState;
}

async function loadClients() {
  const statusEl = document.getElementById("clients-status");
  statusEl.textContent = "Loading clients...";

  await ensureClientsLoaded();

  statusEl.textContent = "";
  renderClients(clientsState);
}

// === დამხმარე ფუნქციები ===

function formatCurrency(amount) {
  return "$" + amount.toLocaleString("en-US");
}

function statusBadgeClass(status) {
  const map = {
    Lead: "badge-lead",
    Contacted: "badge-contacted",
    Won: "badge-won",
    Lost: "badge-lost",
  };
  return map[status] || "badge-lead";
}

// === რენდერი (P4.3) ===
function renderClients(list) {
  const container = document.getElementById("clients-list");
  const statusEl = document.getElementById("clients-status");

  container.innerHTML = "";

  if (list.length === 0) {
    statusEl.textContent = "No clients found.";
    return;
  }
  statusEl.textContent = "";

  list.forEach(function (client) {
    const card = document.createElement("div");
    card.className = "client-card";
    card.setAttribute("data-id", client.id);

    card.innerHTML =
      '<img class="client-avatar" src="' +
      client.image +
      '" alt="' +
      client.name +
      '">' +
      '<div class="client-info">' +
      '<div class="client-name">' +
      client.name +
      "</div>" +
      '<div class="client-meta">' +
      client.company +
      " &middot; " +
      client.email +
      "</div>" +
      '<div class="client-deal">' +
      formatCurrency(client.dealValue) +
      "</div>" +
      "</div>" +
      '<select class="status-select ' +
      statusBadgeClass(client.status) +
      '" data-id="' +
      client.id +
      '">' +
      STATUSES.map(function (s) {
        return (
          '<option value="' +
          s +
          '"' +
          (s === client.status ? " selected" : "") +
          ">" +
          s +
          "</option>"
        );
      }).join("") +
      "</select>" +
      '<button class="btn-delete" type="button" data-id="' +
      client.id +
      '">Delete</button>';

    container.appendChild(card);
  });
}

function generateAvatarDataUrl(name) {
  const initials = name
    .split(" ")
    .map(function (part) {
      return part[0] || "";
    })
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">' +
    '<rect width="128" height="128" fill="#1e3a5f"/>' +
    '<text x="50%" y="50%" font-size="48" fill="#fff" text-anchor="middle" dominant-baseline="central" font-family="sans-serif">' +
    initials +
    "</text></svg>";

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// === Add Client ვალიდაცია (P4.4) ===
function validateClientForm(name, email, phone, dealValue) {
  const errors = {};

  const trimmedName = name.trim();
  if (trimmedName.length < 3) {
    errors.clientName = "Name must be at least 3 characters";
  }

  const emailLower = email.trim().toLowerCase();
  const atIndex = emailLower.indexOf("@");
  const dotIndex = emailLower.indexOf(".", atIndex + 1);
  const emailFormatValid = atIndex > 0 && dotIndex > atIndex;

  if (!emailFormatValid) {
    errors.clientEmail = "Please enter a valid email address";
  } else {
    const alreadyExists = clientsState.some(function (c) {
      return c.email.toLowerCase() === emailLower;
    });
    if (alreadyExists) {
      errors.clientEmail = "A client with this email already exists";
    }
  }

  if (phone.trim() !== "" && phone.trim().length < 6) {
    errors.clientPhone = "Phone number looks too short";
  }

  const dealNum = Number(dealValue);
  if (dealValue.trim() === "" || isNaN(dealNum) || dealNum <= 0) {
    errors.clientDealValue = "Deal value must be a positive number";
  }

  return errors;
}

// === გვერდის ჩატვირთვისას ===
document.addEventListener("DOMContentLoaded", function () {
  loadClients();

  const modal = document.getElementById("add-client-modal");
  const addForm = document.getElementById("add-client-form");

  document
    .getElementById("add-client-btn")
    .addEventListener("click", function () {
      modal.classList.remove("hidden");
    });
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", function () {
      modal.classList.add("hidden");
    });

  addForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value;
    const phone = document.getElementById("clientPhone").value;
    const company = document.getElementById("clientCompany").value;
    const dealValue = document.getElementById("clientDealValue").value;
    const status = document.getElementById("clientStatus").value;

    clearFieldErrors([
      "clientName",
      "clientEmail",
      "clientPhone",
      "clientDealValue",
    ]);

    const errors = validateClientForm(name, email, phone, dealValue);
    if (Object.keys(errors).length > 0) {
      for (const fieldId in errors) {
        showFieldError(fieldId, errors[fieldId]);
      }
      return;
    }

    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim(),
      }),
    });
    const data = await response.json();

    const newClient = {
      id: data.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      image: generateAvatarDataUrl(name.trim()),
      status: status,
      dealValue: Number(dealValue),
      notes: [],
      createdAt: new Date().toISOString(),
    };

    clientsState.unshift(newClient);
    saveClients(clientsState);
    renderClients(clientsState);

    modal.classList.add("hidden");
    addForm.reset();
    showToast("Client added ✓", "success");
  });

  // === Delete (P4.5) ===
  document
    .getElementById("clients-list")
    .addEventListener("click", async function (event) {
      if (!event.target.classList.contains("btn-delete")) return;

      const id = Number(event.target.getAttribute("data-id"));

      const confirmed = confirm("Delete this client? This cannot be undone.");
      if (!confirmed) return;

      await fetch("https://dummyjson.com/users/" + id, { method: "DELETE" });

      clientsState = clientsState.filter(function (c) {
        return c.id !== id;
      });
      saveClients(clientsState);
      renderClients(clientsState);
      showToast("Client deleted", "success");
    });

  document
    .getElementById("clients-list")
    .addEventListener("change", function (event) {
      if (!event.target.classList.contains("status-select")) return;

      const id = Number(event.target.getAttribute("data-id"));
      const newStatus = event.target.value;

      const client = clientsState.find(function (c) {
        return c.id === id;
      });
      if (!client) return;

      client.status = newStatus;
      saveClients(clientsState);

      event.target.className = "status-select " + statusBadgeClass(newStatus);

      showToast(client.name + " moved to " + newStatus, "success");
    });
});
