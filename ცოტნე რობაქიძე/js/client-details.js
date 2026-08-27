// Redirect the user to the login page if they are not authenticated
requireAuth();

const clientAvatar = document.getElementById("clientAvatar");
const clientName = document.getElementById("clientName");
const clientCompany = document.getElementById("clientCompany");
const clientStatus = document.getElementById("clientStatus");

const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");
const clientCreatedAt = document.getElementById("clientCreatedAt");
const clientDealValue = document.getElementById("clientDealValue");
const clientStatusText = document.getElementById("clientStatusText");

const notesList = document.getElementById("notesList");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteError = document.getElementById("noteError");

const reminderForm = document.getElementById("reminderForm");
const reminderTextInput = document.getElementById("reminderText");
const reminderSecondsInput = document.getElementById("reminderSeconds");
const reminderError = document.getElementById("reminderError");
const reminderSuccess = document.getElementById("reminderSuccess");
const reminderToast = document.getElementById("reminderToast");

// Get the client ID from the page URL
// Example: client-details.html?id=123
const params = new URLSearchParams(window.location.search);
const clientId = Number(params.get("id"));

// Store all clients so changes can be saved in localStorage
let clients = [];

function renderNotes(client) {
  // Clear old notes before rendering the updated list
  notesList.innerHTML = "";

  // Display a message when the client has no notes
  if (client.notes.length === 0) {
    notesList.textContent = "No notes yet";
  } else {
    // Create one note item for every saved note
    client.notes.forEach(function (note, index) {
      const noteItem = document.createElement("div");
      noteItem.classList.add("note-item");

      const noteText = document.createElement("p");
      noteText.textContent = note.text;

      const noteDate = document.createElement("small");
      noteDate.textContent = new Date(note.createdAt).toLocaleDateString();

      const deleteNoteButton = document.createElement("button");
      deleteNoteButton.classList.add("delete-note-button");
      deleteNoteButton.textContent = "Delete";

      // Delete the selected note after confirmation
      deleteNoteButton.addEventListener("click", function () {
        const isConfirmed = confirm(
          "Are you sure you want to delete this note?",
        );

        // Stop if the user clicks Cancel
        if (!isConfirmed) {
          return;
        }

        // Remove one note at the current index
        client.notes.splice(index, 1);

        // Save the updated clients array and show updated notes
        localStorage.setItem("crm_clients", JSON.stringify(clients));
        renderNotes(client);
      });

      // Add note content date and delete button to the note item
      noteItem.append(noteText, noteDate, deleteNoteButton);
      notesList.append(noteItem);
    });
  }
}

async function initializeClientsDetails() {
  // Load all clients from localStorage or the API
  clients = await loadClients();

  // Find the client whose id matches the id in the URL
  const client = clients.find((oneClient) => {
    return oneClient.id === clientId;
  });

  // Redirect to the clients page if the client does not exist
  if (!client) {
    window.location.href = "../html/clients.html";
    return;
  }

  // Display the selected clients main information
  clientAvatar.src = client.image;
  clientAvatar.alt = client.name;
  clientName.textContent = client.name;
  clientCompany.textContent = client.company;
  clientStatus.textContent = client.status;

  // Display the selected clients contact and deal information
  clientEmail.textContent = client.email;
  clientPhone.textContent = client.phone;
  clientCreatedAt.textContent = new Date(client.createdAt).toLocaleDateString();
  clientDealValue.textContent = `$${client.dealValue.toLocaleString()}`;
  clientStatusText.textContent = client.status;

  // Display the clients saved notes
  renderNotes(client);

  // Add a new note when the form is submitted
  noteForm.addEventListener("submit", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Clear the previous error message
    noteError.textContent = "";

    // Get the note text from the input
    const noteText = noteInput.value.trim();

    // Do not allow an empty note
    if (noteText.length === 0) {
      noteError.textContent = "Note cannot be empty";
      return;
    }

    // Create a new note object
    const newNote = {
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    // Add the new note to this client's notes array
    client.notes.push(newNote);

    // Save all clients including the updated client in localStorage
    localStorage.setItem("crm_clients", JSON.stringify(clients));

    // Render the new notes list and clear the form
    renderNotes(client);
    noteForm.reset();
  });
  //reminder
  reminderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    reminderError.textContent = "";
    reminderSuccess.textContent = "";

    const reminderText = reminderTextInput.value.trim();
    const reminderSeconds = Number(reminderSecondsInput.value);

    if (reminderText.length === 0 || reminderSeconds <= 0) {
      reminderError.textContent =
        "Please enter a reminder message and a valid number of seconds";
      return;
    }

    reminderSuccess.textContent = "Reminder has been set";

    // Convert seconds to milliseconds for setTimeout
    const delay = reminderSeconds * 1000;

    setTimeout(function () {
      reminderToast.textContent = `Reminder for ${client.name}: ${reminderText}`;
      reminderToast.classList.remove("hidden");

      setTimeout(function () {
        reminderToast.classList.add("hidden");
      }, 4000);
    }, delay);

    reminderForm.reset();
  });
}

// Start loading and displaying the client details page
initializeClientsDetails();
