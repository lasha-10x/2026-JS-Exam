document.addEventListener('DOMContentLoaded', () => {
    // Session check and welcome text
    const activeUserText = localStorage.getItem('crm_session');
    if (!activeUserText) {
        window.location.href = 'index.html';
        return;
    }

    let activeUserObj = {};
    try {
        activeUserObj = JSON.parse(activeUserText) || {};
    } catch (e) {
        console.error("Session parse error", e);
    }

    const welcomeEl = document.getElementById('welcome_user');
    if (welcomeEl) {
        // Full Name
        const fullName = activeUserObj.fullName || `${activeUserObj.firstName || ''} ${activeUserObj.lastName || ''}`.trim() || activeUserObj.email || 'User';
        welcomeEl.textContent = fullName;
    }

    const logoutBtn = document.getElementById('logout_butt');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('crm_session');
            window.location.href = 'index.html';
        });
    }

    // Elements
    let allClients = [];
    let currentStatusFilter = 'All'; // მიმდინარე სტატუსის ფილტრი ქარდებისთვის

    const tableBody = document.getElementById('clients_table_body');
    const searchInput = document.getElementById('search_input');
    const sortSelect = document.getElementById('sortSelect');
    const genderFilter = document.getElementById('gender_filter');
    const analyticsCards = document.querySelectorAll('.analytics-card');

    function updateAnalytics(clientsList) {
    const totalClientsEl = document.getElementById('total_clients_count');
    const totalLeadsEl = document.getElementById('total_leads_count');
    const totalContactedEl = document.getElementById('total_contacted_count');
    const totalWonEl = document.getElementById('total_won_count');
    const totalLostEl = document.getElementById('total_lost_count');

    if (totalClientsEl) totalClientsEl.textContent = clientsList.length;
    if (totalLeadsEl) totalLeadsEl.textContent = clientsList.filter(c => (c.status || 'Lead') === 'Lead').length;
    if (totalContactedEl) totalContactedEl.textContent = clientsList.filter(c => c.status === 'Contacted').length;
    if (totalWonEl) totalWonEl.textContent = clientsList.filter(c => c.status === 'Won').length;
    if (totalLostEl) totalLostEl.textContent = clientsList.filter(c => c.status === 'Lost').length;
}

    // Render table function
    function renderClients(clientsList) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (clientsList.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No clients found.</td></tr>';
            return;
        }

        clientsList.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${client.image || 'https://dummyjson.com/icon/emilys/150'}" width="36" height="36" style="border-radius:50%"></td>
                <td>${client.firstName} ${client.lastName}</td>
                <td>${client.email}</td>
                <td>${client.gender || 'N/A'}</td>
                <td><button class="delete_btn" data-id="${client.id}">Delete</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Filter and sort function
    function filterClients() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedGender = genderFilter ? genderFilter.value : 'all';

        const filtered = allClients.filter(client => {
            const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchText) || (client.email && client.email.toLowerCase().includes(searchText));
            const matchesGender = (selectedGender === 'all') || (client.gender && client.gender.toLowerCase() === selectedGender.toLowerCase());
            
            // სტატუსის შემოწმება ქარდებზე დაწკაპუნების მიხედვით
            const clientStatus = client.status || 'Lead';
            const matchesStatus = (currentStatusFilter === 'All') || (clientStatus === currentStatusFilter);

            return matchesSearch && matchesGender && matchesStatus;
        });

        const sortValue = sortSelect ? sortSelect.value : 'default';
        if (sortValue === 'name-asc') {
            filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else if (sortValue === 'name-desc') {
            filtered.sort((a, b) => b.firstName.localeCompare(a.firstName));
        } else if (sortValue === 'email-asc') {
            filtered.sort((a, b) => a.email.localeCompare(b.email));
        }

        renderClients(filtered);
    }

    // Listeners
    if (searchInput) searchInput.addEventListener('input', filterClients);
    if (sortSelect) sortSelect.addEventListener('change', filterClients);
    if (genderFilter) genderFilter.addEventListener('change', filterClients);

    // ანალიტიკის ქარდებზე დაკლიკების ლოგიკა
    analyticsCards.forEach(card => {
        card.addEventListener('click', () => {
            // ვიზუალური აქტიური ბორდიურის შეცვლა
            analyticsCards.forEach(c => c.style.borderColor = 'transparent');
            card.style.borderColor = '#2563eb';

            currentStatusFilter = card.getAttribute('data-status');
            filterClients();
        });
    });

    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete_btn')) {
                const clientId = e.target.getAttribute('data-id');
                allClients = allClients.filter(c => String(c.id) !== String(clientId));
                localStorage.setItem('crm_clients', JSON.stringify(allClients));
                updateAnalytics(allClients);
                filterClients();
            }
        });
    }

    // Fetch initial data
    async function fetchClients() {
        const savedClients = localStorage.getItem('crm_clients');
        if (savedClients) {
            try {
                allClients = JSON.parse(savedClients);
                updateAnalytics(allClients);
                filterClients();
                return;
            } catch (e) {
                console.error(e);
            }
        }

        try {
            const res = await fetch('https://dummyjson.com/users?limit=20');
            const data = await res.json();
            const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];

            allClients = data.users.map((user, index) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                image: user.image,
                status: statuses[index % statuses.length],
                note: ''
            }));

            localStorage.setItem('crm_clients', JSON.stringify(allClients));
            updateAnalytics(allClients);
            filterClients();
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    fetchClients();
});