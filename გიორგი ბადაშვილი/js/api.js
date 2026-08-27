async function loadClients() {

    const savedClients = Storage.getClients();

    if (savedClients.length > 0) {
    
        console.log("Clients loaded from Local Storage.");
    
        return;
    
    }

    try {
        const response = await fetch("https://dummyjson.com/users?limit=30");

        const data = await response.json();

        const clients = [];

        for (const user of data.users) {

            const client = {
        
                id: user.id,
        
                fullName: `${user.firstName} ${user.lastName}`,
        
                email: user.email,
        
                company: user.company.name,

                dealValue: Math.floor(Math.random() * 9000) + 1000,
        
                phone: user.phone,
        
                status: "lead",
        
                notes: "",
        
                createdAt: new Date().toISOString()
        
            };
        
            clients.push(client);
        
        }

        Storage.saveClients(clients);

        console.log("Clients saved successfully.");
        
        console.log(Storage.getClients());

    } catch (error) {
        console.error(error);
    }
}
function getClients() {
    return Storage.getClients();
}