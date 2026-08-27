let clientsState = []; // გლობალური მასივი მიმდინარე კლიენტებისთვის
let currentFilter = "All";

document.addEventListener("DOMContentLoaded", async () => {
  const loadingStatus = document.getElementById("loadingStatus");
  if (loadingStatus) loadingStatus.style.display = "block";

  // P4.2 - ჩატვირთვის ლოგიკა app.js-ში არსებული ფუნქციიდან
  clientsState = await initClientsData();

  if (loadingStatus) loadingStatus.style.display = "none";

  // პირველადი რენდერი
  applyFiltersAndRender();
  initEventListeners();
});

// P4.7 - ერთიანი ფუნქცია ფილტრაციის, ძებნისა და სორტირებისთვის
function applyFiltersAndRender() {
  let result = [...clientsState];

  // 1. სტატუსის ფილტრი
  if (currentFilter !== "All") {
    result = result.filter((c) => c.status === currentFilter);
  }

  // 2. ძებნა (სახელით ან კომპანიით)
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (searchQuery !== "") {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery) ||
        (c.company && c.company.toLowerCase().includes(searchQuery)),
    );
  }

  // 3. სორტირება (Sort Select)
  const sortVal = document.getElementById("sortSelect").value;
  if (sortVal === "Newest") {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortVal === "AZ") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortVal === "ValueHighLow") {
    result.sort(
      (a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0),
    );
  }

  renderClientsList(result);
}

// P4.3 - კლიენტების სიის რენდერი ეკრანზე
function renderClientsList(list) {
  const container = document.getElementById("clientsList");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="no-results">No clients found.</p>`;
    return;
  }

  container.innerHTML = list
    .map(
      (c) => `
        <div class="client-card" data-id="${c.id}">
            <div class="client-card-info" onclick="openDetailsModal(${c.id})">
                <img src="${c.image || "https://dummyjson.com/assets/default-avatar.png"}" alt="avatar" class="client-avatar">
                <div>
                    <h3>${c.name}</h3>
                    <p class="client-meta">${c.company || "Independent LLC"} · ${c.email}</p>
                    <p class="client-value">$${(Number(c.dealValue) || 0).toLocaleString()}</p>
                </div>
            </div>
            <div class="client-card-actions">
                <select class="status-select-inline" onchange="updateClientStatus(${c.id}, this.value)">
                    <option value="Lead" ${c.status === "Lead" ? "selected" : ""}>Lead</option>
                    <option value="Contacted" ${c.status === "Contacted" ? "selected" : ""}>Contacted</option>
                    <option value="Won" ${c.status === "Won" ? "selected" : ""}>Won</option>
                    <option value="Lost" ${c.status === "Lost" ? "selected" : ""}>Lost</option>
                </select>
                <button class="btn-delete" onclick="deleteClient(${c.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

// P4.6 - ბარათიდან სტატუსის დინამიური შეცვლა
function updateClientStatus(id, newStatus) {
  clientsState = clientsState.map((c) =>
    c.id === id ? { ...c, status: newStatus } : c,
  );
  localStorage.setItem("crm_clients", JSON.stringify(clientsState));
  applyFiltersAndRender();
}

// P4.5 - კლიენტის წაშლა (Fake DELETE იძახებს API-ს)
async function deleteClient(id) {
  if (!confirm("Delete this client? This cannot be undone.")) return;

  try {
    // DummyJSON API-ზე გაგზავნა (P4.5 წესით 404-საც ვითვალისწინებთ)
    await fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" });
  } catch (err) {
    console.log("API Delete simulated");
  }

  clientsState = clientsState.filter((c) => c.id !== id);
  localStorage.setItem("crm_clients", JSON.stringify(clientsState));
  applyFiltersAndRender();
}

// საძიებო, სორტირებისა და ფილტრების ივენთები
function initEventListeners() {
  // ② ძებნა
  document
    .getElementById("searchInput")
    .addEventListener("input", applyFiltersAndRender);

  // ④ სორტირება
  document
    .getElementById("sortSelect")
    .addEventListener("change", applyFiltersAndRender);

  // ③ ჩიპებით გაფილტვრა
  const chips = document.querySelectorAll(".filter-chips .chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", function () {
      chips.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.getAttribute("data-status");
      applyFiltersAndRender();
    });
  });

  // ① მოდალის გაღება/დაკეტვა
  const addModal = document.getElementById("addClientModal");
  document.getElementById("addClientBtn").onclick = () => {
    addModal.style.display = "block";
    clearFormErrors();
  };
  document.getElementById("closeAddModal").onclick = () =>
    (addModal.style.display = "none");

  // P4.4 - ფორმის გაგზავნა და ვალიდაცია
  document.getElementById("addClientForm").onsubmit = async function (e) {
    e.preventDefault();
    if (validateAddClientForm()) {
      const newClient = {
        id: Date.now(),
        name: document.getElementById("clientName").value.trim(),
        email: document.getElementById("clientEmail").value.trim(),
        phone:
          document.getElementById("clientPhone").value.trim() ||
          "+995 555 00 00 00",
        company:
          document.getElementById("clientCompany").value.trim() ||
          "Independent LLC",
        dealValue: document.getElementById("clientDealValue").value.trim(),
        status: document.getElementById("clientStatus").value,
        notes: [],
        createdAt: new Date().toISOString(),
      };

      clientsState.unshift(newClient); // ახალი კლიენტი სიის თავში
      localStorage.setItem("crm_clients", JSON.stringify(clientsState));

      applyFiltersAndRender();
      addModal.style.display = "none";
      this.reset();
    }
  };
}

// P4.4 - ვალიდაციის წესები ზუსტი ტექსტებით
function validateAddClientForm() {
  clearFormErrors();
  let isValid = true;

  const name = document.getElementById("clientName").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const dealValue = document.getElementById("clientDealValue").value.trim();

  if (name.length < 3) {
    showFieldError("nameError", "Name must be at least 3 characters");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFieldError("emailError", "Please enter a valid email address");
    isValid = false;
  } else if (
    clientsState.some((c) => c.email.toLowerCase() === email.toLowerCase())
  ) {
    showFieldError("emailError", "A client with this email already exists");
    isValid = false;
  }

  if (phone !== "" && phone.length < 6) {
    showFieldError("phoneError", "Phone number looks too short");
    isValid = false;
  }

  if (dealValue === "" || isNaN(dealValue) || Number(dealValue) <= 0) {
    showFieldError("dealValueError", "Deal value must be a positive number");
    isValid = false;
  }

  return isValid;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = msg;
    el.style.display = "block";
  }
}

function clearFormErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.style.display = "none"));
}

// P4.8 - კლიენტის დეტალები და შენიშვნების მართვა
function openDetailsModal(id) {
  const client = clientsState.find((c) => c.id === id);
  if (!client) return;

  const modal = document.getElementById("detailsModal");
  const body = document.getElementById("detailsModalBody");

  body.innerHTML = `
        <div class="details-layout">
            <h2>Client Details</h2>
            <p><strong>Name:</strong> ${client.name}</p>
            <p><strong>Company:</strong> ${client.company}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone:</strong> ${client.phone}</p>
            <p><strong>Deal Value:</strong> $${Number(client.dealValue).toLocaleString()}</p>
            <p><strong>Created At:</strong> ${new Date(client.createdAt).toLocaleDateString()}</p>
            
            <hr>
            <h3>⑧ Notes</h3>
            <div id="notesContainer" class="notes-list">
                ${
                  client.notes && client.notes.length > 0
                    ? client.notes
                        .map(
                          (n) =>
                            `<div class="note-item"><p>${n.text}</p><small>${n.date}</small></div>`,
                        )
                        .join("")
                    : "<p>No notes yet.</p>"
                }
            </div>
            
            <div class="add-note-box">
                <input type="text" id="newNoteInput" placeholder="Write a note...">
                <button class="btn-primary" onclick="addNoteToClient(${client.id})">Add Note</button>
            </div>
            <button class="btn-remind" onclick="setOneMinReminder('${client.name}')">⑨ Remind me in 1 min</button>
        </div>
    `;

  modal.style.display = "block";
  document.getElementById("closeDetailsModal").onclick = () =>
    (modal.style.display = "none");
}

function addNoteToClient(id) {
  const input = document.getElementById("newNoteInput");
  const text = input.value.trim();
  if (text === "") return;

  clientsState = clientsState.map((c) => {
    if (c.id === id) {
      const currentNotes = c.notes || [];
      return {
        ...c,
        notes: [
          ...currentNotes,
          { text: text, date: new Date().toLocaleString() },
        ],
      };
    }
    return c;
  });

  localStorage.setItem("crm_clients", JSON.stringify(clientsState));
  input.value = "";
  openDetailsModal(id); // განვაახლოთ მოდალი
}

// ⑨ შეხსენების ტაიმაუტი
function setOneMinReminder(name) {
  alert("Reminder set ✓");
  setTimeout(() => {
    alert(`⏰ Follow up: ${name}`);
  }, 60000);
}
