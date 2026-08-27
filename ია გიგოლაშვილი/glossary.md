JavaScript Glossary

Variable

A variable stores data that can be used later in the program.

let clients = [];

Constant

A constant stores a value that should not be reassigned.

const clientSearchInput = document.querySelector("#clientSearch");

Function

A function is a reusable block of code that performs a specific task.

function handleSearch(event) {
  searchTerm = event.target.value.trim().toLowerCase();
}

Parameter

A parameter is a value received by a function.

function renderClients(list) {
  // list is a parameter
}

Return

The return statement sends a value back from a function.

return visibleClients;

Array

An array stores multiple values in one variable.

const clients = [];

Object

An object stores related data using key-value pairs.

const client = {
  id: 1,
  name: "Nino Beridze",
  status: "Lead"
};

DOM

DOM stands for Document Object Model. It allows JavaScript to access andchange HTML elements.

document.querySelector("#clientsContainer");

Event Listener

An event listener waits for a user action such as click, submit, inputor change.

button.addEventListener("click", handleClick);

Local Storage

Local Storage saves data in the browser after refresh.

localStorage.setItem("crm_clients", JSON.stringify(clients));

Fetch API

The Fetch API sends HTTP requests and receives data from a server.

const response = await fetch("https://dummyjson.com/users");

Async / Await

async and await simplify asynchronous code.

const response = await fetch(url);

try...catch

Handles runtime errors.

try {
  const clients = await loadClients();
} catch (error) {
  console.error(error);
}

map

Creates a transformed array.

const names = clients.map(client => client.name);

filter

Returns matching items.

const leads = clients.filter(client => client.status === "Lead");

find

Returns the first matching item.

const client = clients.find(c => c.id === id);

sort

Sorts an array.

clients.sort((a,b)=>a.name.localeCompare(b.name));

Spread Operator

const visibleClients = [...clients];

Template Literal

const message = `Welcome ${name}`;

Optional Chaining

const company = user.company?.name;

setTimeout

setTimeout(() => showToast("Reminder"), 60000);

Authentication

Authentication verifies a user's identity.

State

let clients = [];
let activeStatus = "All";

Render

renderClients(clients);