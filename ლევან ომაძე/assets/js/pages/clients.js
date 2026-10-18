let clients = [];
let activeStatus = "All";
let searchQuery = "";
let sortMode = "newest";

const grid = document.querySelector("#client-grid");
const stateRegion = document.querySelector("#clients-state");
const addModal = document.querySelector("#client-modal");
const detailsModal = document.querySelector("#details-modal");
const clientForm = document.querySelector("#client-form");

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderStatusFilters() {
  const wrapper = document.querySelector("#status-filters");
  wrapper.innerHTML = "";
  CLIENT_STATUSES.forEach((status) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${status === activeStatus ? "active" : ""}`;
    button.textContent = status;
    button.addEventListener("click", () => {
      activeStatus = status;
      renderClients();
      renderStatusFilters();
    });
    wrapper.append(button);
  });
}

function getVisibleClients() {
  const query = searchQuery.trim().toLowerCase();
  return [...clients]
    .filter((client) => activeStatus === "All" || client.status === activeStatus)
    .filter((client) => {
      if (!query) return true;
      return [client.name, client.email, client.company].some((value) =>
        String(value).toLowerCase().includes(query),
      );
    })
    .sort((a, b) => {
      if (sortMode === "name") return a.name.localeCompare(b.name);
      if (sortMode === "valueHigh") return b.dealValue - a.dealValue;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

function renderState(type, title, message, action) {
  stateRegion.innerHTML = "";
  if (!type) return;
  const section = document.createElement("section");
  section.className = type === "error" ? "error-state" : "empty-state";
  section.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
  if (action) section.append(action);
  stateRegion.append(section);
}

function renderSkeletons() {
  grid.innerHTML = Array.from({ length: 6 })
    .map(
      () => `
        <article class="client-card" aria-hidden="true">
          <div class="client-head">
            <span class="avatar"></span>
            <div class="client-meta">
              <h3>Loading client</h3>
              <p class="muted">Please wait</p>
            </div>
          </div>
          <p class="muted">Loading pipeline data...</p>
        </article>
      `,
    )
    .join("");
}

function renderClients() {
  const visibleClients = getVisibleClients();
  grid.innerHTML = "";
  renderState(null);

  if (visibleClients.length === 0) {
    renderState(
      "empty",
      "No clients found",
      "Adjust search or filters, or add a new client to this pipeline.",
    );
    return;
  }

  visibleClients.forEach((client) => {
    const card = document.createElement("article");
    card.className = "client-card";
    card.innerHTML = `
      <button class="client-card-button" type="button" data-details="${client.id}">
        <div class="client-head">
          <span class="avatar" aria-hidden="true">${client.image ? `<img src="${client.image}" alt="" />` : initials(client.name)}</span>
          <div class="client-meta">
            <h3>${client.name}</h3>
            <p class="muted">${client.company}</p>
          </div>
        </div>
        <p class="muted">${client.email}</p>
        <p><strong>${formatCurrency(client.dealValue)}</strong></p>
      </button>
      <span class="badge ${statusClass(client.status)}">${client.status}</span>
      <div class="client-actions">
        <select aria-label="Change status for ${client.name}" data-status="${client.id}">
          ${CLIENT_STATUSES.filter((status) => status !== "All")
            .map((status) => `<option ${status === client.status ? "selected" : ""}>${status}</option>`)
            .join("")}
        </select>
        <button class="button secondary" type="button" data-details="${client.id}">Details</button>
        <button class="button danger" type="button" data-delete="${client.id}">Delete</button>
      </div>
    `;
    grid.append(card);
  });
}

async function loadClients() {
  renderState(null);
  renderSkeletons();
  try {
    clients = await ensureClientsLoaded();
    renderClients();
  } catch (error) {
    grid.innerHTML = "";
    const retryButton = document.createElement("button");
    retryButton.className = "button secondary";
    retryButton.type = "button";
    retryButton.textContent = "Retry";
    retryButton.addEventListener("click", loadClients);
    renderState("error", "Could not load clients.", "Check your connection and try again.", retryButton);
  }
}

function validateClient(formData) {
  const name = String(formData.get("name")).trim();
  const email = normalizeEmail(String(formData.get("email")));
  const phone = String(formData.get("phone")).trim();
  const company = String(formData.get("company")).trim();
  const dealValue = Number(String(formData.get("dealValue")).trim());
  const status = String(formData.get("status"));
  let hasError = false;

  if (name.length < 3) {
    setFieldError("client-name", "Name must be at least 3 characters");
    hasError = true;
  }

  if (!isValidEmail(email)) {
    setFieldError("client-email", "Please enter a valid email address");
    hasError = true;
  } else if (clients.some((client) => client.email === email)) {
    setFieldError("client-email", "A client with this email already exists");
    hasError = true;
  }

  if (phone && phone.length < 6) {
    setFieldError("client-phone", "Phone number looks too short");
    hasError = true;
  }

  if (!Number.isFinite(dealValue) || dealValue <= 0) {
    setFieldError("client-value", "Deal value must be a positive number");
    hasError = true;
  }

  return {
    hasError,
    client: {
      name,
      email,
      phone,
      company,
      dealValue,
      status,
      createdAt: new Date().toISOString(),
      notes: [],
      reminderAt: null,
    },
  };
}

function openDetails(clientId) {
  const client = clients.find((item) => String(item.id) === String(clientId));
  if (!client) return;
  document.querySelector("#details-title").textContent = client.name;
  document.querySelector("#details-body").innerHTML = `
    <div class="client-head">
      <span class="avatar" aria-hidden="true">${client.image ? `<img src="${client.image}" alt="" />` : initials(client.name)}</span>
      <div class="client-meta">
        <h3>${client.company}</h3>
        <p class="muted">${client.email}</p>
      </div>
    </div>
    <div class="details-grid">
      <div class="details-row"><span>Phone</span><strong>${client.phone || "Not added"}</strong></div>
      <div class="details-row"><span>Status</span><strong>${client.status}</strong></div>
      <div class="details-row"><span>Deal value</span><strong>${formatCurrency(client.dealValue)}</strong></div>
      <div class="details-row"><span>Client since</span><strong>${formatDate(client.createdAt)}</strong></div>
    </div>
    <form class="form" id="note-form">
      <div class="field">
        <label for="note-text">Add note</label>
        <textarea id="note-text" name="note" placeholder="Write a follow-up note"></textarea>
      </div>
      <button class="button primary" type="submit">Add note</button>
    </form>
    <div class="note-list">
      ${(client.notes || [])
        .map(
          (note) => `
            <article class="note">
              <p>${note.text}</p>
              <time>${note.date}</time>
            </article>
          `,
        )
        .join("") || "<p class='muted'>No notes yet.</p>"}
    </div>
    <button class="button secondary" id="reminder-button" type="button">Remind me in 1 min</button>
  `;

  document.querySelector("#note-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const noteText = String(new FormData(event.currentTarget).get("note")).trim();
    if (!noteText) return;
    client.notes = [...(client.notes || []), { text: noteText, date: new Date().toLocaleString() }];
    saveClients(clients);
    showToast("Note added ✓");
    openDetails(client.id);
  });

  document.querySelector("#reminder-button").addEventListener("click", () => {
    client.reminderAt = new Date(Date.now() + 60000).toISOString();
    saveClients(clients);
    window.setTimeout(() => showToast(`⏰ Follow up: ${client.name}`), 60000);
    showToast("Reminder set ✓");
    detailsModal.close();
  });

  detailsModal.showModal();
}

document.addEventListener("DOMContentLoaded", () => {
  renderStatusFilters();
  closeDialogOnBackdrop(addModal);
  closeDialogOnBackdrop(detailsModal);
  loadClients();

  document.querySelector("#open-add-client").addEventListener("click", () => addModal.showModal());
  document.querySelector("[data-close-modal]").addEventListener("click", () => addModal.close());
  document.querySelector("[data-close-details]").addEventListener("click", () => detailsModal.close());

  document.querySelector("#client-search").addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderClients();
  });

  document.querySelector("#sort-select").addEventListener("change", (event) => {
    sortMode = event.target.value;
    renderClients();
  });

  clientForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors(clientForm);
    const { hasError, client } = validateClient(new FormData(clientForm));
    if (hasError) {
      focusFirstError(clientForm);
      return;
    }

    const submitButton = clientForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Saving...";
    try {
      const createdClient = await postClient(client);
      clients = [createdClient, ...clients];
      saveClients(clients);
      clientForm.reset();
      addModal.close();
      renderClients();
      showToast("Client added ✓");
    } catch (error) {
      showToast(error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Save client";
    }
  });

  grid.addEventListener("click", async (event) => {
    const detailsButton = event.target.closest("[data-details]");
    const deleteButton = event.target.closest("[data-delete]");

    if (detailsButton) {
      openDetails(detailsButton.dataset.details);
      return;
    }

    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      if (!window.confirm("Delete this client? This cannot be undone.")) return;
      try {
        await deleteClientRequest(id);
      } catch (error) {
        console.warn("DummyJSON delete did not persist this id, removing locally.", error);
      }
      clients = clients.filter((client) => String(client.id) !== String(id));
      saveClients(clients);
      renderClients();
      showToast("Client deleted");
    }
  });

  grid.addEventListener("change", (event) => {
    const select = event.target.closest("[data-status]");
    if (!select) return;
    const client = clients.find((item) => String(item.id) === String(select.dataset.status));
    if (!client) return;
    client.status = select.value;
    saveClients(clients);
    renderClients();
    showToast("Status updated ✓");
  });
});
