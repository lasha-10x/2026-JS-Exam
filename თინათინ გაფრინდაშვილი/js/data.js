async function loadClients() {
    // Check localStorage first
    const session = auth.getSession();
    if(!session){
        window.location.href = "index.html";
        return [];
    }
    const savedClients = localStorage.getItem("crm_clients");

    if (savedClients) {
        return JSON.parse(savedClients);
    }


    try {
        const response = await fetch(
            "https://dummyjson.com/users?limit=30"
        );


        if (!response.ok) {
            throw new Error("Failed to load clients");
        }
        const data = await response.json();
        const clients = data.users.map(user => {

            return {
                id: user.id,

                name: `${user.firstName} ${user.lastName}`,

                email: user.email,

                phone: user.phone,

                company: user.company.name,

                image: user.image,

                status: "Lead",

                dealValue: Math.floor(
                    Math.random() * (10000 - 1000) + 1000
                ),

                notes: [],

                createdAt: new Date().toISOString()
            };

        });


        // Save to localStorage
        localStorage.setItem(
            "crm_clients",
            JSON.stringify(clients)
        );

        return clients;


    } catch(error) {

        console.log(error);

        throw error;

    }
    
}