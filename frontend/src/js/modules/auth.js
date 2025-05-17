// Authentication module
export const auth = {
    async login(username, password) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(username, email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/check', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = './index.html';
    }
}; 