import { requireAuth } from "./guard.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { loadClients, addClientToApi, deleteClientFromApi } from "./data.js";
import { saveClients } from "./storage.js";
import { isValidName, isValidEmail } from "./validators.js";
import {
  showToast,
  showFieldError,
  clearErrors,
  clearErrorOnInput,
  openModal,
  closeModal,
} from "./ui.js";

//APP state
let clients = []; //here will be stored 30 clients
//======Toolbar state =====
let currentStatus = "All";   // which filter chip is active
let searchTerm = "";         // text in the search box
let currentSort = "newest";  // selected sort option

//DOM things
const clientsList = document.querySelector("#clients-list");
const addClientBtn = document.querySelector("#add-client-btn");
const addClientModal = document.querySelector("#add-client-modal");
const addClientForm = document.querySelector("#add-client-form");
//search/sort/chips
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const chips = document.querySelectorAll(".chip");
//details modal
// ==== Details modal=====
const detailsModal = document.querySelector("#details-modal");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const remindBtn = document.querySelector("#remind-btn");

let currentClientId = null;   // which client's details are open

//helper funciton for visual(money format)
function formatMoney(value) {
  return `$${value.toLocaleString("en-US")}`;
}

//show single centered message in list area
//used for loading clients... and no clients foun!
function showMessage(text) {
  clientsList.innerHTML = `<p class="clients__message">${text}</p>`;
}

/**
 * create an element with a class and (optionally) safe text.
 * textContent NEVER parses HTML, it inserts the string as literal text.
 */

//build one card element from one client object 
//no innerHTML - helper function for createClientCard function:)))
function el(tag, className, text = "") {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

//CREATING one card element for one client object (in total 30 such ones:)
function createClientCard(client) {
  const card = el("article", "client-card");
  card.dataset.id = client.id;

  //TOP avatar and name and company
  const top = el("div", "client-card__top");

  const avatar = el("img", "client-card__avatar");
  avatar.src = client.image;
  avatar.alt = "";

  const info = document.createElement("div"); //here again div for flex (avatar and info goes in top)
  info.append(
    el("h2", "client-card__name", client.name),
    el("p", "client-card__company", client.company),
  );
  top.append(avatar, info);

  //EMAIL
  const email = el("p", "client-card__email", client.email);

  //status badge
  const badge = el(
    "span",
    `badge badge--${client.status.toLowerCase()}`,
    client.status,
  );

    // STATUS dropdown after lead badge
  const statusSelect = el("select", "client-card__status");
  ["Lead", "Contacted", "Won", "Lost"].forEach((statusOption) => {
    const option = el("option", "", statusOption);
    option.value = statusOption;
    if (statusOption === client.status) option.selected = true;   // preselect current
    statusSelect.append(option);
  });



  //FOOTER!!(deal value + delete btn)
  const footer = el("div", "client-card__footer"); 
  const deal = el("span", "client-card__deal", formatMoney(client.dealValue));

  const deleteBtn = el("button", "client-card__delete", "🗑");
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", "Delete client");

  footer.append(deal, deleteBtn);

  //assemble
  card.append(top, email, badge, statusSelect, footer);
  return card;
}

//RENDER a list of clients (clients cards) into page
//with append it's a bit heavy, we could use DocumentFragment instead:) could we?. 
function renderClients(list) {
  clientsList.innerHTML = ""; //clear the container

  if (list.length === 0) {
    showMessage("No clients found.");
    return;
  }

  list.forEach((client) => {
    clientsList.append(createClientCard(client)); //  build + insert each card
  });
}

//error state, message + retry button that re-runs
function showError() {
  clientsList.innerHTML = `
    <div class="clients__message">
      <p>Could not load clients. Check your connection and try again.</p>
      <button id="retry-btn" class="btn btn--primary" type="button">Retry</button>
    </div>
  `;

  document.querySelector("#retry-btn").addEventListener("click", loadAndRender);
}


//LOAD CLIENTS (localStorage first, else API) and render them
//execute function renderClients(clients) HERE!!!!
async function loadAndRender() {
  showMessage("Loading clients...");

  try {
    clients = await loadClients(); // fill the state
    // renderClients(clients); // paint the screen
    refresh();
  } catch (error) {
    console.error(error);
    showError();
  }
}


//+ADD CLIENT / modal-open/close and submit
function initAddClient() {
  clearErrorOnInput(addClientForm);

  //OPEN -reset form so old values/errors don't bother
  addClientBtn.addEventListener("click", () => {
    addClientForm.reset();
    clearErrors(addClientForm);
    openModal(addClientModal);
  });

  //CLOSE - X button (data-close-modal)
  addClientModal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(addClientModal));
  });

  //SUBMIT
  addClientForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors(addClientForm);

    //use of .elements
    //but here could be used obj Destructuring!!!!!!!
    const fields = addClientForm.elements;

    const name = fields.name.value.trim();
    const email = fields.email.value.trim().toLowerCase();
    const phone = fields.phone.value.trim();
    const company = fields.company.value.trim();
    const dealValueRaw = fields.dealValue.value.trim();
    const status = fields.status.value;

    let isValid = true;

    //CHECKING
    //name
    if (!isValidName(name)) {
      showFieldError("client-name", "Name must be at least 3 characters");
      isValid = false;
    }

    //email
    if (!isValidEmail(email)) {
      showFieldError("client-email", "Please enter a valid email address");
      isValid = false;
    } else if (clients.some((client) => client.email.toLowerCase() === email)) {
      showFieldError("client-email", "A client with this email already exists");
      isValid = false;
    }

    //PHONE (optional but it must be at least 6 char)
    if (phone !== "" && phone.length < 6) {
      showFieldError("client-phone", "Phone number looks too short");
      isValid = false;
    }

    //DEAL VALUE (must be positive number)
    const dealValue = Number(dealValueRaw);
    if (dealValueRaw === "" || isNaN(dealValue) || dealValue <= 0) {
      showFieldError("client-deal", "Deal value must be a positive number");
      isValid = false;
    }

    if (!isValid) return;

    //build CLIENT object (no id yet- server gives it to us)
    const newClient = {
      name,
      email,
      phone,
      company,
      image: `https://dummyjson.com/icon/${encodeURIComponent(name)}/128`,
      status,
      dealValue,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await addClientToApi(newClient); //POST to the api
      const savedClient = { ...newClient, id: created.id }; //keep my fields but get id from server

      clients.unshift(savedClient); //= newest on top
      saveClients(clients);
      // renderClients(clients);
      refresh();

      closeModal(addClientModal);
      showToast("Client added ✓", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not add client. Please try again.", "error");
    }
  });
}

//one listener on the container handles every card's delete btn
//event delegation
function initClientActions() {
    clientsList.addEventListener("click", async (event) => {
    // if not clicked on the card, stop actions
    const card = event.target.closest(".client-card");
    if (!card) return;
    const id = Number(card.dataset.id);

    // DELETE logic
    if (event.target.closest(".client-card__delete")) {
      if (!confirm("Delete this client? This cannot be undone.")) return;
      try {
        await deleteClientFromApi(id);
      } catch (error) {
        console.error(error);
      }
      clients = clients.filter((client) => client.id !== id);
      saveClients(clients);
      refresh();
      showToast("Client deleted", "success");
      return;
    }

    //STATUS dropdown in case client clicked on that and not on card fully 
    if (event.target.closest(".client-card__status")) return;

    // Otherwise -> open the details modal (if not clicked on delete or status badge)
    const client = clients.find((c) => c.id === id);
    if (client) openDetails(client);
  });
    // STATUS CHANGE /separate listener; the 'change' event bubbles too
  clientsList.addEventListener("change", (event) => {
    const select = event.target.closest(".client-card__status");
    if (!select) return;

    const card = select.closest(".client-card");
    const id = Number(card.dataset.id);

    const client = clients.find((c) => c.id === id);
    if (!client) return;

    client.status = select.value;   
    saveClients(clients);           
    refresh();                      
  });
}

//=======================FULL features 
/**
 * Apply status filter / search / sort, WITHOUT mutating the original array.
 * Returns a new array ready to render.
 */
function getVisibleClients() {
  let visible = clients;

  // == Status filter (chips)
  if (currentStatus !== "All") {
    visible = visible.filter((client) => client.status === currentStatus);
  }

  // Search by name OR company (case-insensitive)
  if (searchTerm !== "") {
    const term = searchTerm.toLowerCase();
    visible = visible.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.company.toLowerCase().includes(term)
    );
  }

  // Sort--- on a COPY, so the original order is never damaged
  const sorted = [...visible];
  if (currentSort === "newest") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (currentSort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "deal") {
    sorted.sort((a, b) => b.dealValue - a.dealValue);
  }

  return sorted;
}

/**
 * Re-render whatever should currently be visible.
 * Call this after ANY change (toolbar, add, delete).
 */
function refresh() {
  renderClients(getVisibleClients());
}


function initToolbar() {
  // SEARCH -- fires on every keystroke/paste
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    refresh();
  });

  // SORT
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    refresh();
  });

  // FILTER CHIPS
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // move the active class to the clicked chip
      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      currentStatus = chip.dataset.status;   // "All" | "Lead" | ...
      refresh();
    });
  });
}

//===========================DETAILS MODAL 
// rendering NOTES for each client
function renderNotes(client) {
  const notesList = document.querySelector("#notes-list");
  notesList.innerHTML = "";

  if (client.notes.length === 0) {
    notesList.append(el("p", "notes__empty", "No notes yet."));
    return;
  }

  client.notes.forEach((note) => {
    const item = el("li", "notes__item", note.text);
    item.append(el("span", "notes__date", note.date));
    notesList.append(item);
  });
}

/**
 * Fill the details modal from a client object and open it.
 */
function openDetails(client) {
  currentClientId = client.id;

  document.querySelector("#details-avatar").src = client.image;
  document.querySelector("#details-name").textContent = client.name;
  document.querySelector("#details-company").textContent = client.company;
  document.querySelector("#details-email").textContent = client.email;
  document.querySelector("#details-phone").textContent = client.phone || "—";
  document.querySelector("#details-status").textContent = client.status;
  document.querySelector("#details-deal").textContent = formatMoney(client.dealValue);
  document.querySelector("#details-since").textContent =
  new Date(client.createdAt).toLocaleDateString();

  renderNotes(client);
  openModal(detailsModal);
}

function initDetails() {
  // Close (✕ or backdrop)
  detailsModal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(detailsModal));
  });

  // ADD NOTE
  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    if (text === "") return;   // empty notes are ignored

    const client = clients.find((c) => c.id === currentClientId);
    if (!client) return;

    client.notes.push({ text, date: new Date().toLocaleString() }); // add note
    saveClients(clients);                                            // save
    renderNotes(client);                                            // render
    noteForm.reset();
  });

  // REMINDER / fires even if the modal is closed
  remindBtn.addEventListener("click", () => {
    const client = clients.find((c) => c.id === currentClientId);
    if (!client) return;

    const name = client.name;   // capture now, in case they close the modal
    showToast("Reminder set ✓", "success");

    setTimeout(() => {
      showToast(`⏰ Follow up: ${name}`, "success");
    }, 60000); 
  });
}

function initClientsPage() {
  initTheme();
  initNav();
  initToolbar();
  initAddClient();
  initClientActions();
  initDetails();
  loadAndRender();
}

// Protected page
if (requireAuth()) {
  initClientsPage();
}
