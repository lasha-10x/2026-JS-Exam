/**
 * Clients Module Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("clients-grid");

  container.innerHTML = '<p class="loading-text">Loading clients...</p>';

  const { clients, error } = await initClientsData();

  if (error) {
    // FULL: Handle network errors
    container.innerHTML = `
      <div class="error-state">
        <p>${error}</p>
        <button id="retry-btn" class="btn btn--primary" style="margin-top: 1rem;">Retry</button>
      </div>
    `;

    document.getElementById("retry-btn").addEventListener("click", () => {
      window.location.reload();
    });
    return;
  }

  // Render initial clients to the DOM
  renderClients(clients);

  /**
   * Toolbar search,filter and sort State & Logic
   */
  let searchQuery = '';
  let filterStatus = 'All';
  let sortOption = 'newest';

  function applyFiltersAndRender() {
    let filteredClients = getClients() || [];

    // 1. Apply Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.company.toLowerCase().includes(query)
      );
    }

    // 2. Apply Status Filter
    if (filterStatus !== 'All') {
      filteredClients = filteredClients.filter(client => client.status === filterStatus);
    }

    // 3. Apply Sorting
    filteredClients.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'deal-desc':
          return b.dealValue - a.dealValue;
        case 'deal-asc':
          return a.dealValue - b.dealValue;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    renderClients(filteredClients);
  }

  // Search Logic (with Debouncing)
  const searchInput = document.getElementById("search-input");
  let searchTimeout;

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.trim();
        applyFiltersAndRender();
      }, 300);
    });
  }

  // Filter Logic (Status Chips)
  const statusFilters = document.getElementById("status-filters");
  if (statusFilters) {
    statusFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-chip")) {
        // Update UI (active class)
        statusFilters.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("filter-chip--active"));
        e.target.classList.add("filter-chip--active");

        // Update state and re-render
        filterStatus = e.target.getAttribute("data-status");
        applyFiltersAndRender();
      }
    });
  }

  // Sort Logic (Select Dropdown)
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortOption = e.target.value;
      applyFiltersAndRender();
    });
  }

  /**
   * Client Delete Logic (Event Delegation)
   */
  container.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest('.client-card__delete-btn');
    if (deleteBtn) {
      if (deleteBtn.disabled) return;
      const id = deleteBtn.getAttribute('data-id');
      if (confirm("Delete this client? This cannot be undone.")) {
        deleteBtn.disabled = true;
        const result = await deleteClient(id);
        if (result.success) {
          applyFiltersAndRender();
          showToast('Client deleted', 'success');
        } else {
          deleteBtn.disabled = false;
          showToast(result.error, 'error');
        }
      }
    }
  });


  /**
   * Client Status Change Logic (Event Delegation)
   */
  container.addEventListener("change", (e) => {
    if (e.target.classList.contains('client-card__status')) {
      const id = e.target.getAttribute('data-id');
      const newStatus = e.target.value;

      let currentClients = getClients() || [];
      const clientIndex = currentClients.findIndex(c => String(c.id) === String(id));

      if (clientIndex !== -1) {
        currentClients[clientIndex].status = newStatus;
        saveClients(currentClients);
        applyFiltersAndRender();
        showToast('Status updated', 'success');
      }
    }
  });

  /**
   * Client Details Modal Logic
   */
  const detailsModal = document.getElementById("client-details-modal");
  const btnCloseDetailsModal = document.getElementById("btn-close-details-modal");
  const detailsAvatar = document.getElementById("details-avatar");
  const detailsName = document.getElementById("details-name");
  const detailsDate = document.getElementById("details-date");
  const detailsCompany = document.getElementById("details-company");
  const detailsEmail = document.getElementById("details-email");
  const detailsPhone = document.getElementById("details-phone");
  const detailsDeal = document.getElementById("details-deal");
  const detailsStatus = document.getElementById("details-status");

  const notesList = document.getElementById("notes-list");
  const addNoteForm = document.getElementById("add-note-form");
  const noteInput = document.getElementById("note-input");
  const btnRemind = document.getElementById("btn-remind");

  let currentDetailClientId = null;

  function renderNotes(clientId) {
    const clients = getClients() || [];
    const client = clients.find(c => String(c.id) === String(clientId));
    const notes = (client && client.notes) ? client.notes : [];

    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = '<p class="empty-state" style="padding: 1.6rem; text-align: center;">No notes yet. Add one below!</p>';
      return;
    }

    // Sort notes descending (newest first)
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    const notesHTML = notes.map(note => {
      const dateObj = new Date(note.date);
      return `
        <div class="note-item">
          <span class="note-date">${dateObj.toLocaleString()}</span>
          <p class="note-text">${escapeHTML(note.text)}</p>
        </div>
      `;
    }).join("");

    notesList.innerHTML = notesHTML;
  }

  // Add Note Form Submit
  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentDetailClientId) return;

    const text = noteInput.value.trim();
    if (!text) return;

    const clients = getClients() || [];
    const clientIndex = clients.findIndex(c => String(c.id) === String(currentDetailClientId));

    if (clientIndex !== -1) {
      if (!clients[clientIndex].notes) {
        clients[clientIndex].notes = [];
      }
      clients[clientIndex].notes.push({
        text: text,
        date: new Date().toISOString()
      });
      saveClients(clients);
      renderNotes(currentDetailClientId);
      noteInput.value = "";
      showToast('Note added successfully', 'success');
    }
  });


  function openDetailsModal(clientId) {
    const clients = getClients() || [];
    const client = clients.find(c => String(c.id) === String(clientId));
    if (!client) return;

    currentDetailClientId = clientId;

    const avatarSrc = client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`;
    detailsAvatar.src = avatarSrc;
    detailsName.textContent = client.name;

    const dateObj = new Date(client.createdAt);
    detailsDate.textContent = `Client since ${dateObj.toLocaleDateString()}`;

    detailsCompany.textContent = client.company || "N/A";
    detailsEmail.textContent = client.email || "N/A";
    detailsPhone.textContent = client.phone || "N/A";
    detailsDeal.textContent = `$${(Number(client.dealValue) || 0).toLocaleString()}`;

    detailsStatus.textContent = client.status;
    detailsStatus.className = `detail-value status-badge client-card__status--${client.status.toLowerCase()}`;


    // Clear note input
    noteInput.value = "";

    // Reset remind button if it was disabled
    if (btnRemind) {
      btnRemind.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 1.8rem; height: 1.8rem;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Remind me in 1 min
      `;
      btnRemind.disabled = false;
    }

    renderNotes(clientId);

    detailsModal.classList.add("modal--active");
  }


  function closeDetailsModal() {
    detailsModal.classList.remove("modal--active");
    currentDetailClientId = null;
  }

  btnCloseDetailsModal.addEventListener("click", closeDetailsModal);

  detailsModal.addEventListener("click", (e) => {
    if (e.target === detailsModal) {
      closeDetailsModal();
    }
  });

  // Remind me in 1 min logic (PRD requirement P4.8)
  if (btnRemind) {
    const originalHTML = btnRemind.innerHTML;
    btnRemind.addEventListener("click", () => {
      const clientName = detailsName.textContent || "Client";
      showToast('Reminder set ✓', 'success');

      // Visual feedback on the button
      btnRemind.innerHTML = `✓ Reminder Set`;
      btnRemind.disabled = true;

      setTimeout(() => {
        showToast(`⏰ Follow up: ${clientName}`, 'success');
        // Restore button state exactly when the reminder fires
        btnRemind.innerHTML = originalHTML;
        btnRemind.disabled = false;
      }, 60000); // 60 seconds
    });
  }

  // Open Details Modal on Card Click
  container.addEventListener("click", (e) => {
    const card = e.target.closest('.client-card');
    if (card && !e.target.closest('.client-card__status') && !e.target.closest('.client-card__delete-btn')) {
      const id = card.getAttribute('data-id');
      openDetailsModal(id);
    }
  });

  /**
   * Add Client Modal UI Logic (Open / Close)
   */
  const btnAddClient = document.getElementById("btn-add-client");
  const clientModal = document.getElementById("add-client-modal");
  const btnCloseClientModal = document.getElementById("btn-close-modal");
  const btnCancelClientModal = document.getElementById("btn-cancel-modal");

  function openClientModal() {
    clientModal.classList.add("modal--active");
  }

  function closeClientModal() {
    clientModal.classList.remove("modal--active");
    const form = document.getElementById("add-client-form");
    form.reset();
    clearFieldErrors(form);
  }

  btnAddClient.addEventListener("click", openClientModal);
  btnCloseClientModal.addEventListener("click", closeClientModal);
  btnCancelClientModal.addEventListener("click", (e) => {
    e.preventDefault();
    closeClientModal();
  });

  // Close modal when clicking outside the content box
  clientModal.addEventListener("click", (e) => {
    if (e.target === clientModal) {
      closeClientModal();
    }
  });

  /**
    * Form Validation and Submission
   */
  const addClientForm = document.getElementById("add-client-form");
  const btnSaveClient = document.getElementById("btn-save-client");

  // Attach dynamic error clearing to this form
  attachDynamicErrorClearing(addClientForm);

  // Live filter for phone input (prevent letters/symbols)
  addClientForm.phone?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d\s\-+]/g, '');
  });

  // Live filter for name input (allow only letters, spaces, hyphens, apostrophes)
  addClientForm.name?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\p{L}\s\-']/gu, '');
  });

  // Live filter for email input (allow only Latin letters, numbers, and standard email symbols)
  addClientForm.email?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9._%+-@]/g, '');
  });

  addClientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldErrors(addClientForm);

    if (btnSaveClient.disabled) return;

    const name = addClientForm.name.value.trim();
    const company = addClientForm.company.value.trim();
    const email = addClientForm.email.value.trim().toLowerCase();
    const phone = addClientForm.phone.value.trim();
    const dealValue = addClientForm.dealValue.value.trim();
    const status = addClientForm.status.value;

    let isValid = true;

    if (!name || name.length < 3) {
      showFieldError("client-name", "Name must be at least 3 characters");
      isValid = false;
    }

    if (!email || !isValidEmail(email)) {
      showFieldError("client-email", "Please enter a valid email address");
      isValid = false;
    } else {
      const emailExists = getClients().some(c => c.email.toLowerCase() === email);
      if (emailExists) {
        showFieldError("client-email", "A client with this email already exists");
        isValid = false;
      }
    }

    if (phone && !isValidPhone(phone)) {
      showFieldError("client-phone", "Phone number looks too short");
      isValid = false;
    }

    if (!isValidDealValue(dealValue)) {
      showFieldError("client-deal-value", "Deal value must be a number greater than 0");
      isValid = false;
    }

    if (!isValid) return;

    const clientData = {
      name,
      company,
      email,
      phone,
      dealValue,
      status
    };

    const originalText = btnSaveClient.textContent;
    btnSaveClient.textContent = "Saving...";
    btnSaveClient.disabled = true;

    const result = await addClientData(clientData);

    if (result.success) {
      closeClientModal();
      applyFiltersAndRender(); // Refresh the UI instantly
      showToast('Client added', 'success');
    } else {
      // General error fallback using PRD-compliant toast notification
      showToast(result.error, 'error');
    }

    btnSaveClient.textContent = originalText;
    btnSaveClient.disabled = false;
  });
});

/**
 * Escapes HTML special characters to prevent XSS when inserting user data into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders the list of clients as cards in the DOM.
 * @param {Array} clients
 */
function renderClients(clients) {
  const container = document.getElementById("clients-grid");
  container.innerHTML = "";

  if (!clients || clients.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found.</p>';
    return;
  }

  const cardsHTML = clients.map(client => {
    const avatarSrc = client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`;

    return `
      <div class="client-card" data-id="${client.id}">
        <div class="client-card__header">
          <img src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(client.name)}" class="client-card__avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random'" />
          <div class="client-card__info">
            <h3 class="client-card__name">${escapeHTML(client.name)}</h3>
            <p class="client-card__company">${escapeHTML(client.company)}</p>
          </div>
        </div>
        <div class="client-card__body">
          <p class="client-card__detail">
            <svg class="client-card__icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
            ${escapeHTML(client.email)}
          </p>
          <p class="client-card__detail">
            <svg class="client-card__icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            ${escapeHTML(client.phone || " ")}
          </p>
        </div>
        <div class="client-card__footer">
          <select class="client-card__status client-card__status--${client.status.toLowerCase()}" data-id="${client.id}">
            <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
            <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
            <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
          </select>
          <span class="client-card__deal">$${client.dealValue.toLocaleString()}</span>
        </div>
        <button class="client-card__delete-btn" data-id="${client.id}" title="Delete Client">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    `;
  }).join('');

  container.insertAdjacentHTML('beforeend', cardsHTML);
}
