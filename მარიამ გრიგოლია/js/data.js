//here everything about client data, API + model
import { getClients, saveClients, hasClients } from "./storage.js";



const API_URL = "https://dummyjson.com/users";

//transfer one raw dummyJSON user into my client model
//this function gets the structure from server as we want
//this transfers website model to our desired model

function mapUserToClient(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`, //coz server splits it
    email: user.email,
    phone: user.phone,
    company: user.company.name,
    image: user.image,
    status: "Lead", //everyone starts as a lead
    dealValue: (Math.floor(Math.random() * 20) + 1) * 500,
    notes: [],
    createdAt: new Date().toISOString(),
  };
}


//GET initial 30 clients from dummyjson
export async function fetchClientsFromApi() {
  const response = await fetch(`${API_URL}?limit=30`);
  //check if response is not okay
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.users.map(mapUserToClient); // array of raw users-array of clients
}

//map sees all 30users and takes them into our mapUserToClient function
//and returns client array as we wrote (model)

//loading rule!!! crm_clients already saved?-then use it don;t call API
//never saved? then fetch, transform, save
export async function loadClients() {
  if (hasClients()) {
    return getClients();
  }
  const clients = await fetchClientsFromApi();
  saveClients(clients);
  return clients;
}

//POST(methid) a new client to API
//dummyjson returns object with fresh id but never stores it
//real persistence is done by localStorage
export async function addClientToApi(client) {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    throw new Error(`Could not add client (status ${response.status})`);
  }

  return response.json(); // the server's version of the object (with its id)
}

//DELETE client on API
//for clients created, dummyjson never really stored them

export async function deleteClientFromApi(id){
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return response.ok;
}