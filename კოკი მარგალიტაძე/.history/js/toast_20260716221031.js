window.showToast = function(message, type = 'success') {
    // Erase any existing notification box to prevent stacking layout bugs
    const existingToast = document.getElementById('crm-toast');
    if (existingToast) existingToast.remove();

    // Create a new notification alert element node
    const toast = document.createElement('div');
    toast.id = 'crm-toast';
    
    // Core physical visual layout properties
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '0.375rem';
    toast.style.color = '#ffffff';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
    toast.style.transition = 'all 0.2s ease';
    
    // Toggle color theme token based on standard notification types
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    
    toast.innerText = message;
    document.body.appendChild(toast);

    // Automatically fade out and remove the alert box node after 3 seconds
    setTimeout(() => {
        if (toast) toast.remove();
    }, 3000);
};
