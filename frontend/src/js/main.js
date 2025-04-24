

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
           .then(response => response.json())
           .then(user => {
               document.getElementById("loginBtn").style.display = "none";
               document.getElementById("userSection").style.display = "block";
               document.getElementById("nofication").style.display = "block";
               document.getElementById("profile").style.display = "block";
               document.getElementById("signupBtn").style.display = "none";
               document.getElementById("username").innerText = user.username;
           })
           .catch(error => {
               console.error("Lỗi khi lấy thông tin user:", error);
               localStorage.removeItem("token");
           });
   }

   function redirectToLogin() {
       window.location.href = "login.html";
   }

   function logout() {
       localStorage.removeItem("token");
       window.location.reload();
   }

   function showProfile() {
       window.location.href = "profile.html";
   }

   function redirectToSignup() {
       window.location.href = "register.html";
   }