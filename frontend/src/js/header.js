// Tạo một function để khởi tạo header
function initHeader() {
    // Debug log to check if script is loaded
    console.log('Head script starting...');

    // Load modules
    import('./modules/auth.js').then(module => {
        window.auth = module.auth;
        console.log('Auth module loaded');
        
        // Kiểm tra trạng thái đăng nhập ngay khi load
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Initial auth state:', {
            hasToken: !!token,
            user: user
        });
        
        // Cập nhật navigation sau khi load auth module
        updateNavigation();
    }).catch(error => {
        console.error('Error loading auth module:', error);
    });

    import('./modules/ui.js').then(module => {
        window.ui = module.ui;
        console.log('UI module loaded');
    }).catch(error => {
        console.error('Error loading UI module:', error);
    });

    // Update navigation based on auth status
    function updateNavigation() {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        console.log('Raw user data from localStorage:', userStr);
        
        let user = {};
        try {
            user = JSON.parse(userStr || '{}');
            console.log('Parsed user data:', user);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
        
        // Update auth links visibility
        document.querySelectorAll('.auth-link').forEach(link => {
            link.style.display = token ? 'block' : 'none';
        });
        
        // Update guest links visibility
        document.querySelectorAll('.guest-link').forEach(link => {
            link.style.display = token ? 'none' : 'block';
        });
        
        // Update admin link visibility and setup click handler
        const adminLink = document.querySelector('.admin-link');
        if (adminLink) {
            // Kiểm tra role admin (case insensitive)
            const isAdmin = user && (
                user.role === 'admin' || 
                user.role === 'ADMIN' || 
                user.role === 'Admin'
            );
            
            console.log('Admin check:', {
                userExists: !!user,
                userRole: user.role,
                isAdmin: isAdmin
            });
            
            adminLink.style.display = isAdmin ? 'block' : 'none';
            
            // Remove existing click handlers
            const newAdminLink = adminLink.cloneNode(true);
            adminLink.parentNode.replaceChild(newAdminLink, adminLink);
            
            // Add new click handler
            newAdminLink.addEventListener('click', function(e) {
                if (!isAdmin) {
                    e.preventDefault();
                    alert('Bạn không có quyền truy cập trang quản trị!');
                    return false;
                }
            });
        }
    }

    // Set active link based on current page
    function setActiveLink() {
        console.log('Setting active link...');
        const currentPage = window.location.pathname.split('/').pop();
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Handle logout
    function setupLogout() {
        console.log('Setting up logout...');
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) {
                    window.auth.logout();
                    // Cập nhật lại navigation sau khi logout
                    updateNavigation();
                } else {
                    console.error('Auth module not loaded');
                }
            });
        }
    }

    // Setup search functionality
    function setupSearch() {
        console.log('Setting up search...');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        console.log('Search elements:', { searchInput, searchBtn });

        if (searchInput && searchBtn) {
            console.log('Search elements found, adding event listeners...');

            // Hàm xử lý tìm kiếm
            const handleSearch = () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                console.log('Searching for:', searchTerm);
                
                // Kiểm tra xem có game-list không
                const gameList = document.querySelector('.game-list');
                if (!gameList) {
                    console.error('Game list container not found!');
                    return;
                }
                
                const games = gameList.querySelectorAll('.game-item');
                console.log('Found games:', games.length);
                
                if (games.length === 0) {
                    console.error('No game items found in the game list!');
                    return;
                }

                let hasResults = false;

                games.forEach((game, index) => {
                    const title = game.querySelector('.game-title')?.textContent.toLowerCase() || '';
                    const category = game.querySelector('.game-category')?.textContent.toLowerCase() || '';
                    console.log(`Game ${index + 1}:`, { title, category });
                    
                    if (title.includes(searchTerm) || category.includes(searchTerm)) {
                        game.style.display = 'block';
                        hasResults = true;
                        console.log(`Game ${index + 1} matched search term`);
                    } else {
                        game.style.display = 'none';
                        console.log(`Game ${index + 1} did not match search term`);
                    }
                });

                // Hiển thị thông báo khi không tìm thấy kết quả
                const noResultsMessage = document.querySelector('.no-results-message');
                if (!hasResults && searchTerm !== '') {
                    console.log('No results found, showing message');
                    if (!noResultsMessage) {
                        const message = document.createElement('div');
                        message.className = 'no-results-message';
                        message.innerHTML = `
                            <p>Không tìm thấy game nào phù hợp với "${searchTerm}"</p>
                            <p>Vui lòng thử từ khóa khác</p>
                        `;
                        gameList.appendChild(message);
                    }
                } else if (noResultsMessage) {
                    console.log('Removing no results message');
                    noResultsMessage.remove();
                }

                // Reset category filter khi tìm kiếm
                const categoryButtons = document.querySelectorAll('.category-btn');
                if (categoryButtons.length > 0) {
                    console.log('Resetting category filters');
                    categoryButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    const allCategoryBtn = document.querySelector('.category-btn[data-category="all"]');
                    if (allCategoryBtn) {
                        allCategoryBtn.classList.add('active');
                    }
                }
            };

            // Xử lý sự kiện click nút tìm kiếm
            searchBtn.addEventListener('click', (e) => {
                console.log('Search button clicked');
                e.preventDefault();
                handleSearch();
            });

            // Xử lý sự kiện phím Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    e.preventDefault();
                    handleSearch();
                }
            });

            // Thêm phím tắt
            document.addEventListener('keydown', (e) => {
                // Ctrl + K hoặc Command + K
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });

            // Thêm style cho no-results-message
            const style = document.createElement('style');
            style.textContent = `
                .no-results-message {
                    text-align: center;
                    padding: 20px;
                    color: #888;
                    background: #2a2a3a;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .no-results-message p {
                    margin: 5px 0;
                }
            `;
            document.head.appendChild(style);

            console.log('Search setup completed');
        } else {
            console.error('Search elements not found!');
        }
    }

    // Initialize when DOM is loaded
    function initialize() {
        console.log('Initializing...');
        updateNavigation();
        setActiveLink();
        setupLogout();
        setupSearch();
        setupMenu();
        console.log('Initialization completed');
    }

    // Export functions for other modules to use
    window.updateNavigation = updateNavigation;

    // Add menu toggle functionality
    function setupMenu() {
        console.log('Setting up menu...');
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (!menuToggle || !navLinks) {
            console.error('Menu elements not found!');
            return;
        }

        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        console.log('Menu setup completed');
    }

    // Khởi tạo ngay lập tức
    initialize();
}

// Export function để các file khác có thể gọi
window.initHeader = initHeader;