// UI module
export const ui = {
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    },

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loadingDiv);
    },

    hideLoading() {
        const loadingDiv = document.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    },

    updateNavigation() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const authLinks = document.querySelectorAll('.auth-link');
        const guestLinks = document.querySelectorAll('.guest-link');
        const adminLinks = document.querySelectorAll('.admin-link');
        
        if (token) {
            authLinks.forEach(link => link.style.display = 'block');
            guestLinks.forEach(link => link.style.display = 'none');
            if (user.role === 'admin') {
                adminLinks.forEach(link => link.style.display = 'block');
            } else {
                adminLinks.forEach(link => link.style.display = 'none');
            }
        } else {
            authLinks.forEach(link => link.style.display = 'none');
            guestLinks.forEach(link => link.style.display = 'block');
            adminLinks.forEach(link => link.style.display = 'none');
        }
    }
}; 