// brings user info who is in his/her accaount now
function getCurrentUser() {
    // read who is in (userId-ს)
    const session = JSON.parse(localStorage.getItem('crm_session'));
    if (!session) return null;
    
    // search full info whit userId in crm_users
    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    const currentUser = users.find(u => u.id === session.userId);
    
    return currentUser || null;
}