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
            const data = await response.json();

            // 🎯 Lưu token và user vào localStorage nếu có
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
    
            return data;
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
        const userStr = localStorage.getItem('user');
        
        // Kiểm tra cả token và user data
        if (!token || !userStr) {
            // Nếu thiếu một trong hai, xóa cả hai
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }

        try {
            // Kiểm tra token với server
            const response = await fetch('http://localhost:5000/api/auth/check', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                // Nếu token không hợp lệ, xóa cả token và user
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return false;
            }

            // Kiểm tra user data có hợp lệ không
            try {
                const user = JSON.parse(userStr);
                if (!user || !user.id || !user.username) {
                    throw new Error('Invalid user data');
                }
            } catch (e) {
                // Nếu user data không hợp lệ, xóa cả token và user
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            // Nếu có lỗi kết nối, xóa cả token và user
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = './index.html';
    }
}; 