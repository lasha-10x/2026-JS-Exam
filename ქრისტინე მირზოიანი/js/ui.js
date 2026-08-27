// UI Helpers — Toast notifications and Form Error handlers
class Toast {
    static show(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);

        setTimeout(() => toast.remove(), 4000);
    }
}

class FormErrors {
    static clear() {
        document.querySelectorAll('.error-text').forEach(el => el.innerText = '');
        document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));
    }

    static show(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(errorId);
        if (input) input.classList.add('input-error');
        if (errorSpan) errorSpan.innerText = message;
    }
}
