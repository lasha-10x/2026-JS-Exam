/* clients.js */
let currentFilter = "All";
let currentSearch = "";
let currentSort = "newest";
let currentDetailId = null;
let currentEditingId = null;
let callTimerInterval = null;
let callTimerSeconds = 0;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadClients();
    renderClients(getVisibleClients());
  } catch (e) {
    const container = document.getElementById("clients-container");
    container.innerHTML = `
      <div class="empty-state">
        Could not load clients. Check your connection and try again.
        <br><button type="button" class="retry-btn">Retry</button>
      </div>`;
    container
      .querySelector(".retry-btn")
      .addEventListener("click", () => window.location.reload());
  }

  setupToolbar();
  setupAddModal();
  setupDetailsModal();
});

function setupToolbar() {
  document.getElementById("search-input").addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderClients(
      getVisibleClients({
        status: currentFilter,
        search: currentSearch,
        sort: currentSort,
      }),
    );
  });

  document.querySelectorAll("#filter-chips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document
        .querySelectorAll("#filter-chips .chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.status;
      renderClients(
        getVisibleClients({
          status: currentFilter,
          search: currentSearch,
          sort: currentSort,
        }),
      );
    });
  });

  document.getElementById("sort-select").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderClients(
      getVisibleClients({
        status: currentFilter,
        search: currentSearch,
        sort: currentSort,
      }),
    );
  });

  document.getElementById("add-client-btn").addEventListener("click", () => {
    prepareAddClientForm();
    openModal("add-modal");
  });
}
function prepareAddClientForm() {
  const form = document.getElementById("add-client-form");

  currentEditingId = null;
  form.reset();
  clearErrors(form);

  document.getElementById("client-modal-title").textContent = "Add New Client";
  document.getElementById("client-form-submit").textContent = "Add Client";
}

function openEditClient(id) {
  const client = getClientById(id);

  if (!client) return;

  const form = document.getElementById("add-client-form");

  currentEditingId = id;
  clearErrors(form);

  document.getElementById("add-name").value = client.name;
  document.getElementById("add-email").value = client.email;
  document.getElementById("add-phone").value = client.phone || "";
  document.getElementById("add-company").value = client.company || "";
  document.getElementById("add-deal").value = client.dealValue;
  document.getElementById("add-status").value = client.status;

  document.getElementById("client-modal-title").textContent = "Edit Client";
  document.getElementById("client-form-submit").textContent = "Save Changes";

  openModal("add-modal");
}
function renderClients(list) {
  const container = document.getElementById("clients-container");

  if (!list || list.length === 0) {
    container.innerHTML = '<div class="empty-state">No clients found.</div>';
    return;
  }

  container.innerHTML =
    '<div class="clients-list">' +
    list
      .map((c) => {
        const initials = escapeHTML(getInitials(c.name));
        const safeName = escapeHTML(c.name);
        const safeCompany = escapeHTML(c.company);
        const safeEmail = escapeHTML(c.email);
        const safeImage = /^https?:\/\//i.test(c.image || "")
          ? escapeHTML(c.image)
          : "";
        const status = ["Lead", "Contacted", "Won", "Lost"].includes(c.status)
          ? c.status
          : "Lead";
        const dealValue = Number(c.dealValue) || 0;
        const avatar = safeImage
          ? `<img src="${safeImage}" alt="${safeName}">`
          : initials;

        const clientId = Number(c.id);

        return `
      <div class="client-card" data-id="${clientId}">
        <div class="client-avatar">${avatar}</div>
        <div class="client-info">
          <div class="name">${safeName}</div>
          <div class="company">${safeCompany} · ${safeEmail}</div>
          <div class="deal">$${dealValue.toLocaleString()}</div>
        </div>
        <div class="client-actions">
          <span class="badge badge-${status.toLowerCase()}">${status}</span>
          <select class="status-select" data-id="${clientId}">
            <option value="Lead" ${status === "Lead" ? "selected" : ""}>Lead</option>
            <option value="Contacted" ${status === "Contacted" ? "selected" : ""}>Contacted</option>
            <option value="Won" ${status === "Won" ? "selected" : ""}>Won</option>
            <option value="Lost" ${status === "Lost" ? "selected" : ""}>Lost</option>
          </select>
          <button
  type="button"
  class="btn btn-secondary edit-btn"
  data-id="${clientId}"
  style="padding:8px 14px;"
>
  Edit
</button>
          <button class="delete-btn" data-id="${clientId}">Delete</button>
        </div>
      </div>
    `;
      })
      .join("") +
    "</div>";

  // Event delegation
  container.querySelectorAll(".status-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      e.stopPropagation();
      const id = Number(sel.dataset.id);
      updateClientStatus(id, sel.value);
      renderClients(
        getVisibleClients({
          status: currentFilter,
          search: currentSearch,
          sort: currentSort,
        }),
      );
    });
  });
  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      openEditClient(id);
    });
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      if (!confirm("Delete this client? This cannot be undone.")) return;
      try {
        await deleteClientFromAPI(id);
        deleteClient(id);
        renderClients(
          getVisibleClients({
            status: currentFilter,
            search: currentSearch,
            sort: currentSort,
          }),
        );
        showToast("Client deleted", "success");
      } catch (error) {
        console.error(error);
        showToast("Could not delete client. Please try again.", "error");
      }
    });
  });

  container.querySelectorAll(".client-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".status-select") ||
        e.target.closest(".edit-btn") ||
        e.target.closest(".delete-btn")
      )
        return;
      openDetails(Number(card.dataset.id));
    });
  });
}

function setupAddModal() {
  const form = document.getElementById('add-client-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const name = document.getElementById('add-name');
    const email = document.getElementById('add-email');
    const phone = document.getElementById('add-phone');
    const company = document.getElementById('add-company');
    const deal = document.getElementById('add-deal');
    const status = document.getElementById('add-status');

    let valid = true;

    if (name.value.trim().length < 3) {
      showError(name, document.getElementById('add-name-err'));
      valid = false;
    }

    if (!isValidEmail(email.value)) {
      showError(email, document.getElementById('add-email-err'));
      valid = false;
    } else {
      const duplicateEmail = getClients().some(client =>
        client.id !== currentEditingId &&
        client.email.toLowerCase() === email.value.trim().toLowerCase()
      );

      if (duplicateEmail) {
        showError(email, document.getElementById('add-email-dup-err'));
        valid = false;
      }
    }

    if (phone.value.trim() && phone.value.trim().length < 6) {
      showError(phone, document.getElementById('add-phone-err'));
      valid = false;
    }

    const dealNum = Number(deal.value);

    if (Number.isNaN(dealNum) || dealNum <= 0) {
      showError(deal, document.getElementById('add-deal-err'));
      valid = false;
    }

    if (!valid) return;

    const clientData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      company: company.value,
      dealValue: dealNum,
      status: status.value
    };

    const isEditing = currentEditingId !== null;
    const submitButton = document.getElementById('client-form-submit');

    submitButton.disabled = true;

    try {
      if (isEditing) {
        await putClientToAPI(currentEditingId, clientData);
        updateClient(currentEditingId, clientData);
      } else {
        const apiClient = await postClientToAPI(clientData);

        addClient({
          ...clientData,
          id: apiClient.id
        });
      }

      closeModal('add-modal');
      form.reset();

      currentEditingId = null;

      document.getElementById('client-modal-title').textContent =
        'Add New Client';

      submitButton.textContent = 'Add Client';

      renderClients(
        getVisibleClients({
          status: currentFilter,
          search: currentSearch,
          sort: currentSort
        })
      );

      showToast(
        isEditing ? 'Client updated ✓' : 'Client added ✓',
        'success'
      );
    } catch (error) {
      console.error(error);

      showToast(
        isEditing
          ? 'Could not update client. Please try again.'
          : 'Could not add client. Please try again.',
        'error'
      );
    } finally {
      submitButton.disabled = false;
    }
  });
}

function setupDetailsModal() {
  document.getElementById("add-note-btn").addEventListener("click", () => {
    const input = document.getElementById("note-input");
    if (!input.value.trim()) return;
    addNoteToClient(currentDetailId, input.value);
    input.value = "";
    openDetails(currentDetailId);
  });

  document.getElementById("remind-btn").addEventListener("click", () => {
    const client = getClientById(currentDetailId);
    if (!client) return;
    showToast("Reminder set ✓", "success");
    setTimeout(() => {
      showToast(` Follow up: ${client.name}`, "success");
    }, 60000);
  });
    document
    .getElementById('call-timer-toggle')
    .addEventListener('click', toggleCallTimer);

  document
    .getElementById('call-timer-reset')
    .addEventListener('click', resetCallTimer);
}
function formatCallTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');

  const seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function updateCallTimerDisplay() {
  document.getElementById('call-timer-display').textContent =
    formatCallTime(callTimerSeconds);
}

function toggleCallTimer() {
  const button = document.getElementById('call-timer-toggle');

  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;

    button.textContent = 'Resume Call';
    button.classList.remove('btn-danger');
    button.classList.add('btn-success');
    return;
  }

  callTimerInterval = setInterval(() => {
    callTimerSeconds++;
    updateCallTimerDisplay();
  }, 1000);

  button.textContent = 'Pause Call';
  button.classList.remove('btn-success');
  button.classList.add('btn-danger');
}

function resetCallTimer() {
  const button = document.getElementById('call-timer-toggle');

  if (callTimerInterval) {
    clearInterval(callTimerInterval);
  }

  callTimerInterval = null;
  callTimerSeconds = 0;

  updateCallTimerDisplay();

  button.textContent = 'Start Call';
  button.classList.remove('btn-danger');
  button.classList.add('btn-success');
}

function openDetails(id) {
  const c = getClientById(id);
  if (!c) return;
  currentDetailId = id;

  document.getElementById("det-name").textContent = c.name;
  const safeImage = /^https?:\/\//i.test(c.image || "")
    ? escapeHTML(c.image)
    : "";
  const avatar = safeImage
    ? `<img src="${safeImage}" alt="${escapeHTML(c.name)}">`
    : escapeHTML(getInitials(c.name));
  document.getElementById("det-body").innerHTML = `
    <div class="client-detail-summary">
      <div class="client-avatar">${avatar}</div>
      <div>
        <p><strong>${escapeHTML(c.name)}</strong> · ${escapeHTML(c.status)} · $${(Number(c.dealValue) || 0).toLocaleString()} · Client since ${new Date(c.createdAt).toLocaleDateString()}</p>
        <p class="client-detail-meta">${escapeHTML(c.company)} · ${escapeHTML(c.email)} · ${escapeHTML(c.phone || "—")}</p>
      </div>
    </div>
  `;

  const notesEl = document.getElementById("det-notes");
  const notes = Array.isArray(c.notes) ? c.notes : [];
  if (notes.length === 0) {
    notesEl.innerHTML =
      '<div style="color:var(--text-muted);font-size:14px;">No notes yet.</div>';
  } else {
    notesEl.innerHTML = notes
      .map(
        (n) => `
      <div class="note-item">
        <div>• ${escapeHTML(n.text)}</div>
        <div class="note-date">${escapeHTML(n.date)}</div>
      </div>
    `,
      )
      .join("");
  }

  openModal("details-modal");
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
  }
  if (e.target.dataset.close) {
    closeModal(e.target.dataset.close);
  }
});
