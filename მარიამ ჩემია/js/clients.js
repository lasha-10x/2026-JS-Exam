import "./shared.js";
import {initializeClients} from "./clientsData.js";
import { saveClients } from "./storage.js";

const loadingMessageElement = document.getElementById("clients-loading");
const errorMessageElement = document.getElementById("clients-error");
const clientsListElement = document.getElementById("clients-list");

let clients = [];

//load clients and display loading/error messages accordingly
async function loadClients() {
    loadingMessageElement.hidden = false;
    errorMessageElement.hidden = true;

    try {
        clients = await initializeClients();
        loadingMessageElement.hidden = true;
        console.log(clients); //testing
        updateClientList();
    } catch (e) {
        loadingMessageElement.hidden = true;
        errorMessageElement.hidden = false;
        console.log(e);
    }
}


function renderClients(clientArr) {
    clientsListElement.innerHTML = "";
    //if the list is empty
    if (clientArr.length === 0) {
        const emptyMessageElement = document.createElement("p");
        emptyMessageElement.classList.add("clients-message");
        emptyMessageElement.textContent = "No clients found.";

        clientsListElement.append(emptyMessageElement);
        return;
    }

    //if clients exist create a card for each and populate with values
    clientArr.forEach(client => {
        const clientCardElement =  document.createElement("div");
        clientCardElement.classList.add("client-card");
        clientCardElement.dataset.clientId = client.id;

        const clientNameElement = document.createElement("h2");
        clientNameElement.classList.add("client-card-name");
        clientNameElement.textContent = client.fullName;

        const clientCompanyElement = document.createElement("p");
        clientCompanyElement.classList.add("client-card-detail");
        clientCompanyElement.textContent = client.company;

        const clientEmailElement = document.createElement("p");
        clientEmailElement.classList.add("client-card-detail");
        clientEmailElement.textContent = client.email;

        const clientPhoneElement = document.createElement("p");
        clientPhoneElement.classList.add("client-card-detail");
        clientPhoneElement.textContent = client.phone;

        const clientValueElement = document.createElement("p");
        clientValueElement.classList.add("client-card-value");
        clientValueElement.textContent = `$${client.value.toLocaleString()}`;

        const clientAvatarElement = document.createElement("div");
        clientAvatarElement.classList.add("client-card-avatar");
        if (client.image) {
            const clientAvatarImageElement = document.createElement("img");
            clientAvatarImageElement.src = client.image;
            clientAvatarElement.append(clientAvatarImageElement);
        } else {
            clientAvatarElement.textContent = getClientInitials(client.fullName);
        }

        //status dropdown
        const statusWrapperElement = document.createElement("div");
        statusWrapperElement.classList.add("status-select-wrapper");

        const clientStatusElement = document.createElement("select");
        clientStatusElement.classList.add("client-status-select", `status-${client.status.toLowerCase()}`);
        clientStatusElement.dataset.clientId = client.id;
        const statuses = ["Lead", "Contacted", "Won", "Lost"];

        statuses.forEach(status => {
            const optionElement = document.createElement("option");
            optionElement.value = status;
            optionElement.textContent = status;
            optionElement.selected = status === client.status;

            clientStatusElement.append(optionElement);
        })

        //empty span for dropdown arrow 
        const dropdownArrowElement = document.createElement("span");
        dropdownArrowElement.classList.add("dropdown-arrow");
        //dropdownArrowElement.textContent = "▾";

        statusWrapperElement.append( clientStatusElement,dropdownArrowElement);

        //edit and delete buttons
        const clientActionsElement = document.createElement("div");
        clientActionsElement.classList.add("client-card-actions");

        const editClientBtnEelement = document.createElement("button");
        editClientBtnEelement.type = "button";
        editClientBtnEelement.classList.add("edit-client-btn");
        editClientBtnEelement.dataset.clientId = client.id;
        editClientBtnEelement.textContent = "Edit";

        const deleteClientBtnElement = document.createElement("button");
        deleteClientBtnElement.type = "button";
        deleteClientBtnElement.classList.add("delete-client-btn");
        deleteClientBtnElement.dataset.clientId = client.id;
        deleteClientBtnElement.textContent = "Delete";

        clientActionsElement.append(editClientBtnEelement, deleteClientBtnElement);

        clientCardElement.append(clientAvatarElement, clientNameElement, clientCompanyElement, clientEmailElement, clientPhoneElement, clientValueElement, statusWrapperElement, clientActionsElement);

        clientsListElement.append(clientCardElement);

    })
}

loadClients();

//search and filter variables
const searchElement = document.getElementById("client-search");
const filterBtnElements = document.querySelectorAll(".status-filter");
const sortElement = document.getElementById("clients-sort");

let activeStatus = "All"; 

//pagination variables
const prevPgBtnElement = document.getElementById("prev-pg-btn");
const nextPgBtnElement = document.getElementById("next-pg-btn");
const pgInfoElement = document.getElementById("pg-info");

let currentPg = 1;
const clientsPerPg = 9;

//create filtered array and display with renderClienlts()
function updateClientList() {
    const searchTerm = searchElement.value.trim().toLowerCase();
    //filter and search
    const filteredClients = clients.filter (client => {
        const matchSearch = client.fullName.toLowerCase().includes(searchTerm) || client.company.toLowerCase().includes(searchTerm);
        const matchStatus = activeStatus === "All" || client.status === activeStatus;

        return matchSearch && matchStatus;
    })
    //sort
    if (sortElement.value === "newest") {
        filteredClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } 
    
    if (sortElement.value === "name") {
        filteredClients.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } 
    
    if (sortElement.value === "value") {
        filteredClients.sort((a, b) => b.value - a.value);
    }
    //pagination
    const totalPgs = Math.max(1, Math.ceil(filteredClients.length / clientsPerPg));

    if(currentPg > totalPgs) {
        currentPg = totalPgs;
    }

    const startIndex = (currentPg - 1) * clientsPerPg;
    const endIndex = startIndex + clientsPerPg;
    const currentPgClients = filteredClients.slice(startIndex, endIndex);
    //display
    renderClients(currentPgClients);
    pgInfoElement.textContent = `Page ${currentPg} of ${totalPgs}`;

    prevPgBtnElement.disabled = currentPg === 1;
    nextPgBtnElement.disabled = currentPg === totalPgs;
}

//add event listeners to search input element, filter buttons, sort dropdown and pagination buttons
searchElement.addEventListener("input", () => {
    currentPg = 1;
    updateClientList();
});

filterBtnElements.forEach(button => {
    button.addEventListener("click", () => {
        activeStatus = button.dataset.status;
        currentPg = 1;

        filterBtnElements.forEach (btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        updateClientList();
    })
})

sortElement.addEventListener("change", () => {
    currentPg = 1;
    updateClientList();
});

prevPgBtnElement.addEventListener("click", () => {
    if (currentPg > 1) {
        currentPg--;
        updateClientList();
    }
})

nextPgBtnElement.addEventListener("click", () => {
    currentPg++;
    updateClientList();
})

//update status

clientsListElement.addEventListener ("change", event => {
    const statusSelect = event.target.closest(".client-status-select");
     if (!statusSelect) {
        return;
    }
    const clientId = Number(statusSelect.dataset.clientId);
    const clientToUpdate = clients.find(client => client.id === clientId);
      if (!clientToUpdate) {
        return;
    }

    clientToUpdate.status = statusSelect.value;

    saveClients(clients);
    updateClientList();

    showToast("Your changes have been saved.");
})

//open/close modal window 
//add/edit client
const addClientBtnElement = document.getElementById("add-client-btn");
const modalWindowElement = document.getElementById("modal-window");
const modalWindowTitleElement = document.getElementById("modal-title");
const closeModalBtnElement = document.getElementById("close-modal-btn");
const clientFormElement = document.getElementById("client-form");
//client detail modal window
const clientDetailsModalElement = document.getElementById("client-details-modal");
const clientDetailsNameElement = document.getElementById("client-details-name");
const closeClientDetailsBtnElement = document.getElementById("close-client-details-btn");
const clientDetailsAvatarElement = document.getElementById("client-details-avatar");


let editingClientId = null;

function clearClientFormErrors() {
    clientNameErrElement.textContent = "";
    clientEmailErrElement.textContent = "";
    clientPhoneErrElement.textContent = "";
    clientValueErrElement.textContent = "";

    clientNameInputElement.classList.remove("input-error");
    clientEmailInputElement.classList.remove("input-error");
    clientPhoneInputElement.classList.remove("input-error");
    clientValueInputElement.classList.remove("input-error");
}


function openAddClientModal() {
    editingClientId = null;
    modalWindowTitleElement.textContent = "Add Client";
    clientFormElement.reset();
    clearClientFormErrors();
    modalWindowElement.hidden = false;
}

function openEditClientModal(client) {
    editingClientId = client.id;
    modalWindowTitleElement.textContent = "Edit Client";

    clientNameInputElement.value = client.fullName;
    clientEmailInputElement.value = client.email;
    clientPhoneInputElement.value = client.phone;
    clientCompanyInputElement.value = client.company;
    clientStatusInputElement.value = client.status;
    clientValueInputElement.value = client.value;

    clearClientFormErrors();

    modalWindowElement.hidden = false;
}

function closeModalWindow() {
    modalWindowElement.hidden = true;
    editingClientId = null;
}

function closeClientDetailsModal() {
    clientDetailsModalElement.hidden = true;
}

modalWindowElement.addEventListener("click", event => {
    if (event.target === modalWindowElement) {
        closeModalWindow();
    }
})

clientDetailsModalElement.addEventListener("click", event => {
    if (event.target === clientDetailsModalElement) {
        closeClientDetailsModal();
    }
})

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modalWindowElement.hidden) {
        closeModalWindow();
    } else if (event.key === "Escape" && !clientDetailsModalElement.hidden) {
        closeClientDetailsModal();
    }
})

addClientBtnElement.addEventListener("click", openAddClientModal);
closeModalBtnElement.addEventListener("click", closeModalWindow);
closeClientDetailsBtnElement.addEventListener("click", closeClientDetailsModal);


//add client form input fields
const clientNameInputElement = document.getElementById("client-full-name");
const clientEmailInputElement = document.getElementById("client-email");
const clientPhoneInputElement = document.getElementById("client-phone");
const clientCompanyInputElement = document.getElementById("client-company");
const clientStatusInputElement = document.getElementById("client-status");
const clientValueInputElement = document.getElementById("client-value");
//error messages
const clientNameErrElement = document.getElementById("client-name-error");
const clientEmailErrElement = document.getElementById("client-email-error");
const clientPhoneErrElement = document.getElementById("client-phone-error");
const clientValueErrElement = document.getElementById("client-value-error");

//client details modal window data
const clientDetailsEmailElement = document.getElementById("client-details-email");
const clientDetailsPhoneElement = document.getElementById("client-details-phone");
const clientDetailsCompanyElement = document.getElementById("client-details-company");
const clientDetailsStatusElement = document.getElementById("client-details-status");
const clientDetailsValueElement = document.getElementById("client-details-value");
const clientDetailsCreatedAtElement = document.getElementById("client-details-created-at");
const clientNoteFormElement = document.getElementById("client-note-form");
const clientNoteInputElement = document.getElementById("client-note-input");

let activeDetailsClientId = null;
const clientNotesEmptyElement = document.getElementById("client-notes-empty");
const clientNotesListElement = document.getElementById("client-notes-list");

const clientReminderBtnElement = document.getElementById("client-reminder-btn");


clientFormElement.addEventListener("submit", async event => {
    console.log("submit works"); //testing
    event.preventDefault();

    //validation
    let formValid = true;
    const inputtedName = clientNameInputElement.value.trim();
    const inputtedEmail = clientEmailInputElement.value.trim().toLowerCase();
    const inputtedPhone = clientPhoneInputElement.value.trim();
    const inputtedCompany = clientCompanyInputElement.value.trim();
    const inputtedStatus = clientStatusInputElement.value;
    const inputtedValue = clientValueInputElement.value.trim();
    const dealValue = Number(inputtedValue);

    clientNameErrElement.textContent = "";
    clientEmailErrElement.textContent = "";
    clientPhoneErrElement.textContent = "";
    clientValueErrElement.textContent = "";
    clientNameInputElement.classList.remove("input-error");
    clientEmailInputElement.classList.remove("input-error");
    clientPhoneInputElement.classList.remove("input-error");
    clientValueInputElement.classList.remove("input-error");

    //validate name
    if(inputtedName.length < 3) {
        clientNameErrElement.textContent = "Name must be at least 3 characters";
        clientNameInputElement.classList.add("input-error");
        formValid = false;
    }

    //validate email
    const atIndex = inputtedEmail.indexOf("@");
    const dotIndex = inputtedEmail.lastIndexOf(".");
    const validateEmail = atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < inputtedEmail.length - 1;
    const emailExists = clients.some(client => client.email.toLowerCase() === inputtedEmail && client.id !== editingClientId);
    if (!validateEmail) {
        clientEmailErrElement.textContent = "Please enter a valid email address";
        clientEmailInputElement.classList.add("input-error");
        formValid = false;
    } else if (emailExists) {
        clientEmailErrElement.textContent = "A client with this email already exists";
        clientEmailInputElement.classList.add("input-error");
        formValid = false;
    }

    //validate phone
    if (inputtedPhone !== "" && inputtedPhone.length < 6) {
        clientPhoneErrElement.textContent = "Phone number looks too short";
        clientPhoneInputElement.classList.add("input-error");
        formValid = false;
    }

    //validate value
    if (inputtedValue === "" || !Number.isFinite(dealValue) || dealValue <= 0) {
        clientValueErrElement.textContent = "Deal value must be a positive number";
        clientValueInputElement.classList.add("input-error");
        formValid = false;
    }

    if(!formValid) {
        return;
    }

    //extract form data
    const formData = {
        fullName: clientNameInputElement.value.trim(),
        email: clientEmailInputElement.value.trim(),
        phone: clientPhoneInputElement.value.trim(),
        company: clientCompanyInputElement.value.trim(),
        status: clientStatusInputElement.value.trim(),
        value: Number(clientValueInputElement.value),
    }

    //check if the form is for editing or adding
    if (editingClientId === null) {
        try {
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if(!response.ok) {
                throw new Error(`POST request failed: ${response.status}`);
            }

            await response.json();
            
            //create ID locally 
            const highestExistingId = clients.reduce((highestId, client) => {
                return Math.max(highestId, Number(client.id) || 0);
            }, 0)
            const newClientId = highestExistingId + 1;

            const newClient = {
                ...formData, 
                id: newClientId, 
                notes: [], 
                createdAt: new Date().toISOString()
            };

            console.log(newClient); //testing
            clients.unshift(newClient);
            currentPg = 1;

            saveClients(clients);
            updateClientList();
            closeModalWindow();

            showToast("Client added ✓")
        } catch (e) {
            console.error(e);
            showToast("Could not add client. Please try again.", "error");
        }
        return;
    } else {
        const clientIndex = clients.findIndex(client => client.id === editingClientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = {
                ...clients[clientIndex],
                ...formData
            }
        }
    }

    saveClients(clients);
    updateClientList();
    closeModalWindow();

    showToast("Your changes have been saved.");
})


clientsListElement.addEventListener("click", async event => {
    const editButton = event.target.closest(".edit-client-btn");
    const deleteButton = event.target.closest(".delete-client-btn");
    //edit 
    if (editButton) {
        const clientId = Number(editButton.dataset.clientId);
        const clientToEdit = clients.find(client => client.id === clientId);

        if (clientToEdit) {
            openEditClientModal(clientToEdit);
        }

        return;
    }
    //delete
    if(deleteButton) {
        const clientId = Number(deleteButton.dataset.clientId);
        const clientToDelete = clients.find(client => client.id === clientId);
        
        if(!clientToDelete) {
            return;
        }
        const confirmed = window.confirm("Delete this client? This cannot be undone.");

        if (!confirmed) {
            return;
        }

       try {
            const response = await fetch(`https://dummyjson.com/users/${clientId}`,  {
                method: "DELETE"
            });

            if (!response.ok && response.status !== 404 ) {
                throw new Error(response.status);
            }

            clients = clients.filter(client => client.id !== clientId);

            saveClients(clients);
            updateClientList();
            showToast("Client deleted");
       } catch (e) {
            console.error(e);
            showToast("Could not delete client. Please try again.", "error");
       }

       return;
    } 

    //do not upen details modal when using status dropdown
    if (event.target.closest("select, .status-select-wrapper")) {
        return;
    }

    //client details window 
    const clickedCard = event.target.closest(".client-card");

    if(!clickedCard) {
        return;
    }

    activeDetailsClientId = Number(clickedCard.dataset.clientId);
    const selectedClient = clients.find(client => client.id === activeDetailsClientId);

    if (!selectedClient) {
        return;
    }

    clientDetailsAvatarElement.innerHTML = "";
    if (selectedClient.image) {
        const avatarImageElement = document.createElement("img");
        avatarImageElement.src = selectedClient.image;
        clientDetailsAvatarElement.append(avatarImageElement);
    } else {
        clientDetailsAvatarElement.textContent = getClientInitials(selectedClient.fullName);
    }


    clientDetailsNameElement.textContent = selectedClient.fullName;
    clientDetailsEmailElement.textContent = selectedClient.email;
    clientDetailsPhoneElement.textContent = selectedClient.phone;
    clientDetailsCompanyElement.textContent = selectedClient.company || "No Company";
    clientDetailsStatusElement.textContent = selectedClient.status;
    clientDetailsValueElement.textContent = `$${selectedClient.value.toLocaleString()}`;
    clientDetailsCreatedAtElement.textContent = new Date(selectedClient.createdAt).toLocaleDateString();
    displayClientNotes(selectedClient);

    clientDetailsModalElement.hidden = false;
})

//submit note form
clientNoteFormElement.addEventListener("submit", event => {
    event.preventDefault();

    const noteText = clientNoteInputElement.value.trim();
    if (!noteText || activeDetailsClientId === null) {
        return;
    }
    const activeClient = clients.find(client => client.id === activeDetailsClientId);
    if (!activeClient) {
        return;
    }
    if (!activeClient.notes) {
        activeClient.notes = [];
    }

    const newNote = {
        id: Date.now(),
        text: noteText, 
        createdAt: new Date().toISOString()
    }

    activeClient.notes.push(newNote);
    saveClients(clients);
    displayClientNotes(activeClient);
    clientNoteFormElement.reset();

    showToast("Note added successfully.");

})

//timer button
clientReminderBtnElement.addEventListener("click", () => {
    if (activeDetailsClientId === null) {
        return;
    }

    const activeClient = clients.find(client => client.id === activeDetailsClientId);

    if (!activeClient) {
        return;
    }

    const clientName = activeClient.fullName;

    showToast("Reminder set ✓");
    setTimeout(() => {
        showToast(`⏰ Follow up: ${clientName}`);
    }, 60*1000);

})

//retry button
const retryBtnElement = document.getElementById("retry-clients-button");
retryBtnElement.addEventListener("click", loadClients);

//toast
const toastElement = document.getElementById("client-toast");
let toastTimeout;

function showToast(message, type="success") {
    clearTimeout(toastTimeout);
    toastElement.textContent = message;
    toastElement.classList.remove("success", "error");
    toastElement.classList.add(type);
    toastElement.hidden = false;

    toastTimeout = setTimeout(() => {
        toastElement.hidden = true;
    }, 3000);
}

//display notes
function displayClientNotes(client) {
    const notes = client.notes || [];
    clientNotesListElement.innerHTML = "";
    clientNotesEmptyElement.hidden = notes.length > 0;
    notes.forEach(note => {
        const noteItemElement = document.createElement("li");
        noteItemElement.classList.add("client-note-item");
        const noteTextElement = document.createElement("p");
        noteTextElement.textContent = note.text;
        const noteDateElement = document.createElement("time");
        noteDateElement.dateTime = note.createdAt;
        noteDateElement.textContent = new Date (note.createdAt).toLocaleDateString();

        noteItemElement.append(noteTextElement, noteDateElement);
        clientNotesListElement.append(noteItemElement);
    })
}

//get initials
function getClientInitials(fullName) {
    return fullName.trim().split(" ").slice(0, 2).map(a => a[0].toUpperCase()).join("");
}








