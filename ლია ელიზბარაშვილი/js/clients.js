let state = [];

let activeFilter = "All";
let searchQuery = "";
let sortMode = "newest";

let openClientId = null;

const STATUS_BADGES = {
  Lead: "badge-lead",
  Contacted: "badge-contacted",
  Won: "badge-won",
  Lost: "badge-lost",
};

const listEl = document.getElementById("clients-list");

async function initClients() {
  listEl.innerHTML = '<p class="list-message">Loading clients...</p>';
  try {
    state = await loadClients();
    render();
  } catch (error) {
    listEl.innerHTML = "";
    const message = document.createElement("div");
    message.className = "list-message";
    message.textContent =
      "Could not load clients. Check your connection and try again.";

    const retryBtn = document.createElement("button");
    retryBtn.className = "btn";
    retryBtn.textContent = "Retry";
    retryBtn.addEventListener("click", initClients);

    message.appendChild(document.createElement("br"));
    message.appendChild(retryBtn);
    listEl.appendChild(message);
  }
}

function getVisibleClients() {
  let list = state.slice();

  if (activeFilter !== "All") {
    list = list.filter(function (client) {
      return client.status === activeFilter;
    });
  }

  if (searchQuery !== "") {
    list = list.filter(function (client) {
      return (
        client.name.toLowerCase().includes(searchQuery) ||
        client.company.toLowerCase().includes(searchQuery)
      );
    });
  }

  if (sortMode === "name") {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortMode === "deal") {
    list.sort(function (a, b) {
      return b.dealValue - a.dealValue;
    });
  } else {
    list.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  return list;
}

function render() {
  renderClients(getVisibleClients());
}

function renderClients(list) {
  listEl.innerHTML = "";

  if (list.length === 0) {
    listEl.innerHTML = '<p class="list-message">No clients found.</p>';
    return;
  }

  list.forEach(function (client) {
    listEl.appendChild(buildClientCard(client));
  });
}

function buildClientCard(client) {
  const card = document.createElement("div");
  card.className = "client-card";
  card.dataset.id = client.id;

  const badgeClass = STATUS_BADGES[client.status] || "badge-lead";

  card.innerHTML =
    '<div class="card-top">' +
    buildAvatarHtml(client) +
    '<div><div class="name"></div><div class="company"></div></div>' +
    "</div>" +
    '<div class="email"></div>' +
    '<div class="card-row">' +
    '<span class="badge ' +
    badgeClass +
    '">' +
    client.status +
    "</span>" +
    '<span class="deal">' +
    formatMoney(client.dealValue) +
    "</span>" +
    "</div>" +
    '<div class="card-actions">' +
    '<select class="status-select">' +
    ["Lead", "Contacted", "Won", "Lost"]
      .map(function (s) {
        return (
          '<option value="' +
          s +
          '"' +
          (s === client.status ? " selected" : "") +
          ">" +
          s +
          "</option>"
        );
      })
      .join("") +
    "</select>" +
    '<button class="delete-btn">Delete</button>' +
    "</div>";

  card.querySelector(".name").textContent = client.name;
  card.querySelector(".company").textContent = client.company || "—";
  card.querySelector(".email").textContent = client.email;

  card
    .querySelector(".status-select")
    .addEventListener("change", function (event) {
      changeStatus(client.id, event.target.value);
    });

  card.querySelector(".delete-btn").addEventListener("click", function (event) {
    event.stopPropagation();
    deleteClient(client.id);
  });

  card.addEventListener("click", function (event) {
    if (
      event.target.closest(".status-select") ||
      event.target.closest(".delete-btn")
    )
      return;
    openDetails(client.id);
  });

  return card;
}

function buildAvatarHtml(client) {
  if (client.image) {
    return '<img src="' + client.image + '" alt="" />';
  }
  const initials = client.name
    .split(" ")
    .map(function (word) {
      return word.charAt(0);
    })
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return '<div class="avatar-initials">' + initials + "</div>";
}

function changeStatus(id, newStatus) {
  const client = state.find(function (c) {
    return c.id === id;
  });
  if (!client) return;
  client.status = newStatus;
  saveClients(state);
  render();
}

async function deleteClient(id) {
  const confirmed = confirm("Delete this client? This cannot be undone.");
  if (!confirmed) return;

  try {
    await apiDeleteClient(id);
    state = state.filter(function (c) {
      return c.id !== id;
    });
    saveClients(state);
    render();
    showToast("Client deleted");
  } catch (error) {
    showToast("Could not delete client. Try again.", "error");
  }
}

const addModal = document.getElementById("add-modal");
const addForm = document.getElementById("add-client-form");

document
  .getElementById("add-client-btn")
  .addEventListener("click", function () {
    addForm.reset();
    clearErrors(addForm);
    addModal.classList.remove("hidden");
  });

addForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearErrors(addForm);

  const nameInput = document.getElementById("client-name");
  const emailInput = document.getElementById("client-email");
  const phoneInput = document.getElementById("client-phone");
  const companyInput = document.getElementById("client-company");
  const dealInput = document.getElementById("client-deal");
  const statusSelect = document.getElementById("client-status");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const phone = phoneInput.value.trim();
  const dealValue = Number(dealInput.value);

  let hasErrors = false;

  if (name.length < 3) {
    setError(nameInput, "Name must be at least 3 characters");
    hasErrors = true;
  }

  if (!isClientEmailValid(email)) {
    setError(emailInput, "Please enter a valid email address");
    hasErrors = true;
  } else if (
    state.some(function (c) {
      return c.email.toLowerCase() === email;
    })
  ) {
    setError(emailInput, "A client with this email already exists");
    hasErrors = true;
  }

  if (phone !== "" && phone.length < 6) {
    setError(phoneInput, "Phone number looks too short");
    hasErrors = true;
  }

  if (dealInput.value.trim() === "" || isNaN(dealValue) || dealValue <= 0) {
    setError(dealInput, "Deal value must be a positive number");
    hasErrors = true;
  }

  if (hasErrors) return;

  const payload = {
    name: name,
    email: email,
    phone: phone,
    company: companyInput.value.trim(),
    image: "",
    status: statusSelect.value,
    dealValue: dealValue,
    notes: [],
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await apiAddClient(payload);
    payload.id = response.id;

    state.unshift(payload);
    saveClients(state);
    render();
    addModal.classList.add("hidden");
    showToast("Client added ✓");
  } catch (error) {
    showToast("Could not add client. Check your connection.", "error");
  }
});

function isClientEmailValid(email) {
  const atIndex = email.indexOf("@");
  return atIndex > 0 && email.indexOf(".", atIndex) > atIndex + 1;
}

const detailsModal = document.getElementById("details-modal");

function openDetails(id) {
  const client = state.find(function (c) {
    return c.id === id;
  });
  if (!client) return;

  openClientId = id;

  const content = document.getElementById("details-content");
  content.innerHTML = "";

  const top = document.createElement("div");
  top.className = "detail-top";
  top.innerHTML =
    buildAvatarHtml(client) +
    '<div><div class="name"></div><div class="company"></div></div>';
  top.querySelector(".name").textContent = client.name;
  top.querySelector(".name").style.fontWeight = "600";
  top.querySelector(".company").textContent = client.company || "—";
  top.querySelector(".company").style.color = "var(--text-muted)";
  content.appendChild(top);

  const badgeClass = STATUS_BADGES[client.status] || "badge-lead";
  const list = document.createElement("ul");
  list.className = "detail-list";
  list.innerHTML =
    '<li><span>Email</span><span class="d-email"></span></li>' +
    '<li><span>Phone</span><span class="d-phone"></span></li>' +
    '<li><span>Status</span><span class="badge ' +
    badgeClass +
    '">' +
    client.status +
    "</span></li>" +
    "<li><span>Deal value</span><span>" +
    formatMoney(client.dealValue) +
    "</span></li>" +
    "<li><span>Client since</span><span>" +
    new Date(client.createdAt).toLocaleDateString() +
    "</span></li>";
  list.querySelector(".d-email").textContent = client.email;
  list.querySelector(".d-phone").textContent = client.phone || "—";
  content.appendChild(list);

  renderNotes(client);
  document.getElementById("note-input").value = "";
  detailsModal.classList.remove("hidden");
}

function renderNotes(client) {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  if (client.notes.length === 0) {
    notesList.innerHTML = "<li>No notes yet.</li>";
    return;
  }

  client.notes.forEach(function (note) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = note.text;
    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = note.date;
    item.appendChild(text);
    item.appendChild(date);
    notesList.appendChild(item);
  });
}

document
  .getElementById("note-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.getElementById("note-input");
    const text = input.value.trim();
    if (text === "") return;

    const client = state.find(function (c) {
      return c.id === openClientId;
    });
    if (!client) return;

    client.notes.push({ text: text, date: new Date().toLocaleString() });
    saveClients(state);
    renderNotes(client);
    input.value = "";
  });

document.getElementById("remind-btn").addEventListener("click", function () {
  const client = state.find(function (c) {
    return c.id === openClientId;
  });
  if (!client) return;

  const clientName = client.name;
  showToast("Reminder set ✓");

  setTimeout(function () {
    showToast("⏰ Follow up: " + clientName);
  }, 60000);
});

document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    searchQuery = event.target.value.trim().toLowerCase();
    render();
  });

document
  .getElementById("filter-chips")
  .addEventListener("click", function (event) {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    document.querySelectorAll("#filter-chips .chip").forEach(function (el) {
      el.classList.remove("active");
    });
    chip.classList.add("active");

    activeFilter = chip.dataset.status;
    render();
  });

document
  .getElementById("sort-select")
  .addEventListener("change", function (event) {
    sortMode = event.target.value;
    render();
  });

document.querySelectorAll(".modal-close").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.getElementById(btn.dataset.close).classList.add("hidden");
  });
});

document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
});

initClients();
