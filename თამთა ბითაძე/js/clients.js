/**
 * 10X CRM - Clients Management Script (Conflict-Free & Integrated Modal View)
 */

console.log("CLIENTS JS WORKING - SAFE LOAD");

// ==========================================
// 1. Global State & DOM Selectors
// ==========================================
let clients = [];
let currentFilter = "All";

const clientsContainer = document.getElementById("clientsContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");

// Modals
const addClientModal = document.getElementById("addClientModal");
const addClientBtn = document.getElementById("addClientBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const addClientForm = document.getElementById("addClientForm");

// Detail Modal Elements
const detailClientModal = document.getElementById("detailClientModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const detailModalBody = document.getElementById("detailModalBody");

// ==========================================
// 2. Helper Functions (Toasts & Errors)
// ==========================================
function showClientsToast(message, type = "success") {
  const existingToast = document.querySelector(".crm-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `crm-toast toast-${type}`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "6px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "10000";
  toast.style.backgroundColor = type === "success" ? "#10b981" : "#ef4444";
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showClientsError(inputElement, message) {
  inputElement.classList.add("input-error");
  let errorDiv = inputElement.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains("error-msg")) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-msg";
    errorDiv.style.color = "#ef4444";
    errorDiv.style.fontSize = "12px";
    errorDiv.style.marginTop = "4px";
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }
  errorDiv.textContent = message;
}

function clearClientsErrors(formElement) {
  formElement.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
  formElement.querySelectorAll(".error-msg").forEach(msg => msg.remove());
}

// ==========================================
// 3. Filter, Search & Sort Logic
// ==========================================
function getVisibleClients() {
  let result = [...clients];

  if (currentFilter !== "All") {
    result = result.filter(client => client.status === currentFilter);
  }

  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
  if (searchValue) {
    result = result.filter(client => 
      client.name.toLowerCase().includes(searchValue) ||
      client.company.toLowerCase().includes(searchValue)
    );
  }

  const sortValue = sortSelect ? sortSelect.value : "newest";
  if (sortValue === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "newest") {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortValue === "oldest") {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return result;
}

// ==========================================
// 4. Load Clients from API or Storage
// ==========================================
async function loadClients() {
  const savedClients = localStorage.getItem("crm_clients");

  if (savedClients) {
    clients = JSON.parse(savedClients);
    renderClients();
    return;
  }

  if (clientsContainer) {
    clientsContainer.innerHTML = "<div class='loading'>Loading clients...</div>";
  }

  try {
    const response = await fetch("https://dummyjson.com/users?limit=30");
    if (!response.ok) throw new Error("Could not load clients");

    const data = await response.json();

    clients = data.users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || "",
      company: user.company ? user.company.name : "Independent",
      image: user.image || `https://dummyjson.com/icon/${user.firstName.toLowerCase()}s/128`,
      status: "Lead",
      dealValue: Math.floor(Math.random() * 9500) + 500,
      notes: [],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString() // იმიტაცია სხვადასხვა დროის სორტირებისთვის
    }));

    localStorage.setItem("crm_clients", JSON.stringify(clients));
    renderClients();

  } catch (error) {
    console.error(error);
    if (clientsContainer) {
      clientsContainer.innerHTML = `
        <div class="error-container">
          <p>Could not load clients. Check your connection.</p>
          <button id="retryBtn">Retry</button>
        </div>
      `;
      document.getElementById("retryBtn").addEventListener("click", loadClients);
    }
  }
}

// ==========================================
// 5. UI Rendering
// ==========================================
function renderClients() {
  if (!clientsContainer) return;
  clientsContainer.innerHTML = "";

  const visible = getVisibleClients();

  if (visible.length === 0) {
    clientsContainer.innerHTML = "<p class='no-results' style='grid-column: 1/-1; text-align: center; color: #94a3b8;'>No clients found.</p>";
    return;
  }

  visible.forEach(client => {
    let badgeClass = `badge-${client.status.toLowerCase()}`;

    const card = document.createElement("div");
    card.className = "client-card";
    card.dataset.id = client.id;
    card.style.cursor = "pointer";
    
    card.innerHTML = `
      <img src="${client.image}" alt="${client.name}" width="64">
      <h3>${client.name}</h3>
      <p class="company-name">${client.company}</p>
      <p style="word-break: break-all;">${client.email}</p>
      <p class="status-wrapper">Status: <span class="badge ${badgeClass}">${client.status}</span></p>
      <p class="deal-value">Deal: $${client.dealValue.toLocaleString()}</p>
      <div class="card-actions" style="margin-top: 15px; width: 100%; display: flex; gap: 8px;">
        <button class="view-btn" data-id="${client.id}" style="flex: 1; padding: 8px; background: #3b82f6; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">View & Edit</button>
        <button class="delete-btn" data-id="${client.id}" style="flex: 1; padding: 8px; background: #ef4444; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
      </div>
    `;
    clientsContainer.appendChild(card);
  });
}

// ==========================================
// 6. დეტალური ინფორმაცია MODAL-ში და სტატუსის შეცვლა
// ==========================================
function openClientDetailsModal(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return;

  const notesHtml = client.notes && client.notes.length
    ? client.notes.map(note => `<li style="margin-bottom: 6px; font-size: 13px;"><span style="color: #94a3b8; font-size: 11px;">[${note.date}]</span> ${note.text}</li>`).join("")
    : "<li>No notes yet</li>";

  detailModalBody.innerHTML = `
    <div style="display: flex; gap: 15px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;">
      <img src="${client.image}" width="64" alt="${client.name}" style="border-radius: 50%;">
      <div>
        <h3 style="margin: 0; font-size: 20px;">${client.name}</h3>
        <p style="margin: 2px 0; color: #94a3b8; font-size: 14px;">${client.company}</p>
      </div>
    </div>

    <div style="font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
      <p style="margin: 4px 0;"><strong>Email:</strong> ${client.email}</p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> ${client.phone || "-"}</p>
      <p style="margin: 4px 0;"><strong>Deal Value:</strong> $${client.dealValue.toLocaleString()}</p>
    </div>

    <!-- სტატუსის შეცვლის სელექტორი -->
    <div style="margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 6px;">
      <label style="font-weight: bold; display: block; margin-bottom: 6px;">Change Pipeline Status:</label>
      <select id="modalStatusSelect" style="width: 100%; padding: 8px; background: #0f172a; color: #fff; border: 1px solid #475569; border-radius: 4px; font-weight: bold; cursor: pointer;">
        <option value="Lead" ${client.status === "Lead" ? "selected" : ""}>Lead</option>
        <option value="Contacted" ${client.status === "Contacted" ? "selected" : ""}>Contacted</option>
        <option value="Won" ${client.status === "Won" ? "selected" : ""}>Won</option>
        <option value="Lost" ${client.status === "Lost" ? "selected" : ""}>Lost</option>
      </select>
    </div>

    <!-- შეხსენების ღილაკი -->
    <div style="margin-bottom: 15px;">
      <button id="modalRemindBtn" style="width: 100%; padding: 8px; background: #eab308; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">⏰ Remind me in 1 min</button>
    </div>

    <!-- ჩანაწერების სექცია -->
    <div>
      <h4 style="margin: 0 0 8px 0; font-size: 15px;">Interaction Notes</h4>
      <ul style="padding-left: 15px; margin: 0 0 10px 0; max-height: 80px; overflow-y: auto; color: #cbd5e1;">
        ${notesHtml}
      </ul>
      <textarea id="modalNoteInput" placeholder="Write a new note..." style="width: 100%; height: 50px; padding: 8px; background: #0f172a; color: #fff; border: 1px solid #475569; border-radius: 4px; resize: none; box-sizing: border-box;"></textarea>
      <button id="modalSaveNoteBtn" style="margin-top: 6px; width: 100%; padding: 8px; background: #10b981; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Save Note</button>
    </div>
  `;

  detailClientModal.style.display = "flex";

  // სტატუსის შეცვლის ივენთი
  document.getElementById("modalStatusSelect").addEventListener("change", function () {
    client.status = this.value;
    saveAndSyncState();
    renderClients();
    showClientsToast(`Status updated to ${this.value} ✓`, "success");
  });

  // ნოუთის შენახვის ივენთი
  document.getElementById("modalSaveNoteBtn").addEventListener("click", () => {
    const noteInput = document.getElementById("modalNoteInput");
    const noteText = noteInput.value.trim();
    if (!noteText) return;

    if (!client.notes) client.notes = [];
    client.notes.push({
      text: noteText,
      date: new Date().toLocaleString()
    });

    saveAndSyncState();
    showClientsToast("Note successfully recorded ✓", "success");
    openClientDetailsModal(client.id); // განახლება
  });

  // შეხსენების ივენთი
  document.getElementById("modalRemindBtn").addEventListener("click", () => {
    showClientsToast("Reminder scheduled for 1 minute ✓", "success");
    setTimeout(() => {
      showClientsToast(`⏰ Follow up with: ${client.name}`, "success");
    }, 60000);
  });
}

// Modal-ის დახურვა
if (closeDetailModalBtn) {
  closeDetailModalBtn.addEventListener("click", () => {
    detailClientModal.style.display = "none";
  });
}

// გარე კლიკით დახურვა
window.addEventListener("click", (e) => {
  if (e.target === detailClientModal) {
    detailClientModal.style.display = "none";
  }
});

function saveAndSyncState() {
  localStorage.setItem("crm_clients", JSON.stringify(clients));
}

// ==========================================
// 7. Add Client Modal & POST Integration
// ==========================================
if (addClientBtn && addClientModal) {
  addClientBtn.addEventListener("click", () => {
    addClientModal.style.display = "flex";
    clearClientsErrors(addClientForm);
    addClientForm.reset();
  });
}

if (closeModalBtn && addClientModal) {
  closeModalBtn.addEventListener("click", () => {
    addClientModal.style.display = "none";
  });
}

if (addClientForm) {
  addClientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearClientsErrors(addClientForm);

    const nameInp = document.getElementById("modalFullName");
    const emailInp = document.getElementById("modalEmail");
    const phoneInp = document.getElementById("modalPhone");
    const companyInp = document.getElementById("modalCompany");
    const dealInp = document.getElementById("modalDeal");

    let hasError = false;

    if (nameInp.value.trim().length < 3) {
      showClientsError(nameInp, "Name must be at least 3 characters");
      hasError = true;
    }

    const emailVal = emailInp.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showClientsError(emailInp, "Please enter a valid email address");
      hasError = true;
    } else if (clients.some(c => c.email.toLowerCase() === emailVal)) {
      showClientsError(emailInp, "A client with this email already exists");
      hasError = true;
    }

    if (phoneInp.value.trim() && phoneInp.value.trim().length < 6) {
      showClientsError(phoneInp, "Phone number looks too short");
      hasError = true;
    }

    const dealVal = Number(dealInp.value);
    if (isNaN(dealVal) || dealVal <= 0) {
      showClientsError(dealInp, "Deal value must be a positive number");
      hasError = true;
    }

    if (hasError) return;

    try {
      showClientsToast("Registering client...", "success");
      
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: nameInp.value.trim().split(" ")[0] || "Client",
          lastName: nameInp.value.trim().split(" ").slice(1).join(" ") || "",
          email: emailVal
        })
      });

      if (!response.ok) throw new Error("API post request failed");

      const serverResponse = await response.json();

      const newClient = {
        id: serverResponse.id || Date.now(),
        name: nameInp.value.trim(),
        email: emailVal,
        phone: phoneInp.value.trim() || "-",
        company: companyInp.value.trim() || "Independent",
        image: "https://dummyjson.com/icon/user/128",
        status: "Lead",
        dealValue: dealVal,
        notes: [],
        createdAt: new Date().toISOString()
      };

      clients.unshift(newClient);
      saveAndSyncState();
      renderClients();

      addClientModal.style.display = "none";
      showClientsToast("Client added ✓", "success");

    } catch (err) {
      showClientsToast("Server communication error. Client added offline.", "error");
    }
  });
}

// ==========================================
// 8. Interactive Events & Delete / Click Handle
// ==========================================
if (searchInput) {
  searchInput.addEventListener("input", renderClients);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderClients();
  });
});

if (sortSelect) {
  sortSelect.addEventListener("change", renderClients);
}

if (clientsContainer) {
  clientsContainer.addEventListener("click", async function (e) {
    const deleteBtn = e.target.closest(".delete-btn");
    const viewBtn = e.target.closest(".view-btn");
    const clientCard = e.target.closest(".client-card");

    // წაშლის ლოგიკა
    if (deleteBtn) {
      e.stopPropagation();
      const clientId = Number(deleteBtn.dataset.id);
      
      const proceed = confirm("Delete this client? This cannot be undone.");
      if (!proceed) return;

      try {
        showClientsToast("Requesting server-side deletion...", "success");

        await fetch(`https://dummyjson.com/users/${clientId}`, {
          method: "DELETE"
        });

        clients = clients.filter(c => c.id !== clientId);
        saveAndSyncState();
        renderClients();

       showClientsToast("Client successfully deleted ✓", "success");
      } catch (err) {
        showClientsToast("Failed to complete server deletion request.", "error");
      }
      return;
    }

  
    if (viewBtn || clientCard) {
      const targetElement = viewBtn || clientCard;
      const clientId = Number(targetElement.dataset.id);
      openClientDetailsModal(clientId);
    }
  });
}

// Start loading process
loadClients();