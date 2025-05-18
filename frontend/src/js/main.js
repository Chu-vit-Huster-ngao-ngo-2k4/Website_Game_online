// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem("token");

    if (token) {
        fetch("http://localhost:5000/api/auth/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể lấy thông tin user');
            }
            return response.json();
        })
        .then(user => {
            // Kiểm tra các element có tồn tại không trước khi thay đổi style
            const elements = {
                loginLink: document.querySelector('a[href="login.html"]'),
                registerLink: document.querySelector('a[href="register.html"]'),
                profileLink: document.querySelector('a[href="profile.html"]'),
                logoutBtn: document.getElementById('logoutBtn'),
                adminLink: document.querySelector('a[href="admin.html"]')
            };

            // Kiểm tra và cập nhật style cho từng element
            if (elements.loginLink) elements.loginLink.style.display = "none";
            if (elements.registerLink) elements.registerLink.style.display = "none";
            if (elements.profileLink) elements.profileLink.style.display = "block";
            if (elements.logoutBtn) elements.logoutBtn.style.display = "block";
            
            // Hiển thị link admin nếu user có role admin
            if (elements.adminLink) {
                elements.adminLink.style.display = user.role === 'admin' ? "block" : "none";
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy thông tin user:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Reload trang để cập nhật UI
            window.location.reload();
        });
    }
});

function redirectToLogin() {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
}

function showProfile() {
    window.location.href = "profile.html";
}

function redirectToSignup() {
    window.location.href = "register.html";
}