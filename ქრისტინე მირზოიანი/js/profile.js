// P5 — Profile Page (User info, Edit profile, Change password, Reset CRM data)
class ProfilePage {
    constructor() {
        if (!document.getElementById('profileNameDisplay')) return;

        this.session = Storage.getSession();
        this.users = Storage.getUsers();
        this.currentUser = this.users.find(u => u.email === this.session?.email);

        if (!this.currentUser) return;

        this.renderUserInfo();
        this.bindEvents();
    }

    renderUserInfo() {
        const user = this.currentUser;

        // Initials avatar
        const initials = user.fullName
            ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
            : 'U';
        
        const avatarEl = document.getElementById('profileAvatar');
        if (avatarEl) avatarEl.innerText = initials;

        document.getElementById('profileNameDisplay').innerText = user.fullName;
        document.getElementById('profileEmailDisplay').innerText = user.email;
        document.getElementById('profileCompanyDisplay').innerText = user.company || 'N/A';
        
        const dateStr = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '05/07/2026';
        document.getElementById('profileMemberSince').innerText = `Member since ${dateStr}`;

        // Fill form fields
        const editName = document.getElementById('editFullName');
        if (editName) editName.value = user.fullName;

        const editCompany = document.getElementById('editCompany');
        if (editCompany) editCompany.value = user.company || '';
    }

    bindEvents() {
        // A. Save Changes
        document.getElementById('editProfileForm')?.addEventListener('submit', (e) => this.handleSaveProfile(e));

        // B. Change Password
        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => this.handleChangePassword(e));

        // C. Reset CRM Data
        document.getElementById('resetCrmDataBtn')?.addEventListener('click', () => this.handleResetData());
    }

    handleSaveProfile(e) {
        e.preventDefault();
        FormErrors.clear();

        const name = document.getElementById('editFullName').value.trim();
        const company = document.getElementById('editCompany').value.trim();

        if (name.length < 3) {
            FormErrors.show('editFullName', 'errEditName', 'Full name must be at least 3 characters');
            return;
        }

        this.currentUser.fullName = name;
        this.currentUser.company = company;

        Storage.saveUsers(this.users);
        this.renderUserInfo();
        Toast.show('Profile updated ✓', 'success');
    }

    handleChangePassword(e) {
        e.preventDefault();
        FormErrors.clear();

        const currentPass = document.getElementById('currPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
        let valid = true;

        if (currentPass !== this.currentUser.password) {
            FormErrors.show('currPassword', 'errCurrPass', 'Current password is incorrect');
            valid = false;
        }

        if (!passwordRegex.test(newPass) || newPass === currentPass) {
            FormErrors.show('newPassword', 'errNewPass', 'Password must be at least 8 characters, contain a letter & number, and be different from current');
            valid = false;
        }

        if (newPass !== confirmPass) {
            FormErrors.show('confirmNewPassword', 'errConfirmPass', 'Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        this.currentUser.password = newPass;
        Storage.saveUsers(this.users);
        
        document.getElementById('changePasswordForm').reset();
        Toast.show('Password changed ✓', 'success');
    }

    async handleResetData() {
        if (!confirm('Are you sure you want to reset all CRM client data back to default initial state?')) return;

        Storage.remove(Storage.KEYS.CLIENTS);

        try {
            const response = await fetch('https://dummyjson.com/users?limit=30');
            const data = await response.json();
            
            const initialClients = data.users.map(u => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                phone: u.phone,
                company: u.company?.name || 'Acme Corp',
                image: u.image,
                status: 'Lead',
                dealValue: Math.floor(Math.random() * 9500) + 500,
                notes: [],
                createdAt: new Date().toISOString()
            }));

            Storage.saveClients(initialClients);
            Toast.show('CRM Data reset to initial state ✓', 'success');
        } catch (err) {
            Toast.show('Failed to reset data from API', 'error');
        }
    }
}
