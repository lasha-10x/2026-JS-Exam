//--------------------Protects Clients page to open without log in----------
const session = requireAuth();

//--------------Handles theme changing-------------
initTheme();

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);


//---------------In the Header Active page------
highlightActiveNavLink();



//-----------Loads all client info into the cards-----------
async function renderClients() {

    const status = document.getElementById('loadStatus');
    const container = document.getElementById('clientsList');

    status.textContent = 'Loading clients...';
    status.className = 'status loading';
    container.innerHTML = '';

    try{
        const clients = await getVisibleClients(); //  decleared here, at the 226 line
    
        // --- Success: clear status, render cards ---
        status.textContent = '';
        status.className = 'status';


  //container.innerHTML = ''; // clear before rendering, avoids duplicates on re-render

        clients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'client';
            card.dataset.id = client.id; // useful later for Delete/Edit targeting

        card.innerHTML = `
        <div class="clientInfo">
            <p class="fullName">${client.firstName} ${client.lastName}</p>
            <p class="company">${client.company?.name || client.company || ''}</p>
            <p class="dealValue">${formatCurrency(client.dealValue)}</p>
        </div>
            

            <select class="statusSelect">
              <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
              <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
              <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
            </select>
            
            <button class="deleteBtn">Delete</button>
        `;

            container.appendChild(card);
        });

    } catch{
        // --- Error state ---
        console.error('Error loading clients:', err);
        status.className = 'status error';
        status.innerHTML = `
        <p>Could not load clients. Check your connection and try again.</p>
        <button id="retryBtn">Retry</button>
        `;

        document.getElementById('retryBtn').addEventListener('click', renderClients);
    }
}

renderClients();


//---------------open/close modal logic--------------------------
const modal = document.getElementById('clientModal');
const addClientForm = document.getElementById('addClientForm');

document.getElementById('openModalBtn').addEventListener('click', () => {
  //modal.style.display = 'flex';      ---------------------while style was into HTML file and caused conflict with CSS display: flex
  
  modal.classList.add('show');
});

document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
document.getElementById('clientModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});

function closeModal() {
  //modal.style.display = 'none';                    while style was into HTML file and caused conflict with CSS display: flex
   modal.classList.remove('show');
  addClientForm.reset();
  clearAllValidation(addClientForm);
}


//--------------------------submit client logic------------------------------------
addClientForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = this;
  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const phone = form.elements['phone'].value.trim();
  const company = form.elements['company'].value.trim();
  const dealValueRaw = form.elements['dealValue'].value.trim();
  const status = form.elements['status'].value;

  let isValid = true;

  // --- Name ---
  if (name.length < 3) {
    setError('name', 'Name must be at least 3 characters');
    isValid = false;
  } else {
    setValid('name');
  }

  // --- Email ---
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const clients = await getEnrichedClients();

  if (!emailPattern.test(email)) {
    setError('email', 'Please enter a valid email address');
    isValid = false;
  } else if (clients.some(c => c.email === email)) {
    setError('email', 'A client with this email already exists');
    isValid = false;
  } else {
    setValid('email');
  }

  // --- Phone (optional) ---
  if (phone.length > 0 && phone.length < 6) {
    setError('phone', 'Phone number looks too short');
    isValid = false;
  } else {
    setValid('phone');
  }

  // --- Company (optional, always valid) ---
  setValid('company');

  // --- Deal Value ---
  const dealValue = Number(dealValueRaw);
  if (dealValueRaw === '' || isNaN(dealValue) || dealValue <= 0) {
    setError('dealValue', 'Deal value must be a positive number');
    isValid = false;
  } else {
    setValid('dealValue');
  }

  // --- Status ---
  if (!status) {
    setError('status', 'Please select a status');
    isValid = false;
  } else {
    setValid('status');
  }

  if (!isValid) {
    showToast('Please fix the errors above', 'error');
    return;
  }

  // --- POST to DummyJSON (practice call) ---
  let newClientFromServer;
  try {
    const res = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: name, email, phone, company })
    });
    newClientFromServer = await res.json();
  } catch (err) {
    console.error('DummyJSON POST failed:', err);
    showToast('Could not add client. Try again.', 'error');
    return;
  }

  // --- Build the client object using the server's returned id ---
  const newClient = {
    ...newClientFromServer,
    firstName: name,
    lastName: '',
    email,
    phone,
    company: { name: company },
    dealValue,
    status,
    createdAt: new Date().toISOString()
  };

  clients.unshift(newClient);                                                            // newest on top
  localStorage.setItem('crm_clients', JSON.stringify(clients));

  closeModal();
  renderClients();
  showToast('Client added ✓', 'success');
});



//------------------------Changing client status using client card data---------------
document.getElementById('clientsList').addEventListener('change', async function (e) {
  if (!e.target.classList.contains('statusSelect')) return;

  const card = e.target.closest('.client');
  const id = card.dataset.id;
  const newStatus = e.target.value;

  const clients = await getEnrichedClients();
  const client = clients.find(c => String(c.id) === String(id));

  if (!client) return;

  client.status = newStatus;
  localStorage.setItem('crm_clients', JSON.stringify(clients));

  renderClients(); // re-render so filters/stats reflect the change
  showToast('Status updated', 'success');
});








//-------------Deleting client card by using dinamic way instead of using static delete button on each card---------------------


// --- Event delegation for Delete buttons ---
document.getElementById('clientsList').addEventListener('click', async function (e) {
  if (!e.target.classList.contains('deleteBtn')) return;

  const card = e.target.closest('.client');
  const id = card.dataset.id;

  const confirmed = confirm('Delete this client? This cannot be undone.');
  if (!confirmed) return;

  // --- Practice DELETE call to DummyJSON ---
  try {
    await fetch(`https://dummyjson.com/users/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('DummyJSON DELETE failed:', err);
    showToast('Could not delete client. Try again.', 'error');
    return;
  }

  // --- Real removal: update local state ---
  const clients = await getEnrichedClients();
  const updated = clients.filter(c => String(c.id) !== String(id));

  localStorage.setItem('crm_clients', JSON.stringify(updated));

  renderClients();
  showToast('Client deleted', 'success');
});



//------------------clients search, filter, sort logics---------------------
// --- Current UI state ---
let currentSearch = '';
let currentStatusFilter = 'All';
let currentSort = 'newest';

// --- Core filtering/sorting logic ---
async function getVisibleClients() {
  const clients = await getEnrichedClients();

  let visible = clients;

  // 1. Search filter (matches name, case-insensitive)
  if (currentSearch.trim() !== '') {
    const term = currentSearch.trim().toLowerCase();
    visible = visible.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      return fullName.includes(term);
    });
  }

  // 2. Status filter
  if (currentStatusFilter !== 'All') {
    visible = visible.filter(c => c.status === currentStatusFilter);
  }

  // 3. Sorting
  if (currentSort === 'newest') {
    visible = [...visible].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (currentSort === 'nameAsc') {
    visible = [...visible].sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    );
  } else if (currentSort === 'dealValue') {
    visible = [...visible].sort((a, b) => b.dealValue - a.dealValue);
  }

  return visible;
}


// --- Search input ---
document.getElementById('searchInput').addEventListener('input', async function () {
  currentSearch = this.value;
  await renderClients();
});

// --- Filter chips ---
document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', async function () {
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentStatusFilter = this.dataset.status;
    await renderClients();
  });
});

// --- Sort dropdown ---
document.getElementById('sortSelect').addEventListener('change', async function () {
  currentSort = this.value;
  await renderClients();
});



//----------------------Modal about each Client Details-------------
let currentDetailClientId = null;

document.getElementById('clientsList').addEventListener('click', async function (e) {
  // Ignore clicks on delete button or status dropdown — those have their own handlers
  if (e.target.classList.contains('deleteBtn')) return;
  if (e.target.classList.contains('statusSelect')) return;

  const card = e.target.closest('.client');
  if (!card) return;

  const id = card.dataset.id;
  await openClientDetail(id);
});


//open-close
async function openClientDetail(id) {
  const clients = await getEnrichedClients();
  const client = clients.find(c => String(c.id) === String(id));
  if (!client) return;

  currentDetailClientId = id;

  document.getElementById('detailName').textContent = `${client.firstName} ${client.lastName}`;
  document.getElementById('detailCompany').textContent = client.company?.name || '';
  document.getElementById('detailEmail').textContent = client.email;
  document.getElementById('detailPhone').textContent = client.phone || '—';
  document.getElementById('detailStatus').textContent = client.status;
  document.getElementById('detailDealValue').textContent = formatCurrency(client.dealValue);
  document.getElementById('detailSince').textContent =
    `Client since ${new Date(client.createdAt).toLocaleDateString()}`;

  renderNotes(client.notes || []);

  document.getElementById('clientDetailModal').classList.add('show');
}

function closeClientDetail() {
  document.getElementById('clientDetailModal').classList.remove('show');
  currentDetailClientId = null;
}

document.getElementById('closeDetailBtn').addEventListener('click', closeClientDetail);
document.getElementById('clientDetailModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeClientDetail();
  }
});


//Notes

function renderNotes(notes) {
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="noteText">${note.text}</span> <span class="noteDate">(${note.date})</span>`;
    list.appendChild(li);
  });
}

document.getElementById('addNoteBtn').addEventListener('click', async function () {
  const input = document.getElementById('newNoteInput');
  const text = input.value.trim();

  if (text === '') return; // empty/whitespace-only notes are not saved

  const clients = await getEnrichedClients();
  const client = clients.find(c => String(c.id) === String(currentDetailClientId));
  if (!client) return;

  if (!client.notes) client.notes = [];

  client.notes.push({
    text,
    date: new Date().toLocaleString()
  });

  localStorage.setItem('crm_clients', JSON.stringify(clients));

  renderNotes(client.notes); // old > new, since we always push to the end
  input.value = '';
});


//Reminder
document.getElementById('remindBtn').addEventListener('click', async function () {
  const clients = await getEnrichedClients();
  const client = clients.find(c => String(c.id) === String(currentDetailClientId));
  if (!client) return;

  const clientName = `${client.firstName} ${client.lastName}`;

  showToast('Reminder set ✓', 'success');

  setTimeout(() => {
    showToast(`⏰ Follow up: ${clientName}`, 'success');
  }, 60000); // 60 seconds
});


//-------------------Log Out--------
document.getElementById('logoutBtn').addEventListener('click', logout);

