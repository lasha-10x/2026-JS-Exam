async function loadClients() {
  // get info from localStorage
  const savedClients = localStorage.getItem("crm_clients");

  //if clients already exists we turn it into array
  if (savedClients) {
    return JSON.parse(savedClients);
  }
  // If there are no saved clients fetch 30 users from the API
  const response = await fetch("https://dummyjson.com/users?limit=30");
  // Stop the function if the API request was not successful
  if (!response.ok) {
    throw new Error("could not load clients");
  }
  // Convert info from API into a JavaScript object
  const data = await response.json();

  // Statuses that will be assigned to clients in order
  const statuses = ["Lead", "Contacted", "Won", "Lost"];

  // Convert API users into CRM client objects
  const clients = data.users.map(function (user, index) {
    return {
      id: user.id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company.name,
      image: user.image,
      // index % statuses.length repeats the statuses in order
      status: statuses[index % statuses.length],
      // Create a different deal value for every client
      dealValue: (index + 1) * 1000,
      // Every client starts with an empty notes array
      notes: [],
      // Give each client a different creation date
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    };
  });
  // Save the converted clients in localStorage
  localStorage.setItem("crm_clients", JSON.stringify(clients));

  // Return the final clients array
  return clients;
}
