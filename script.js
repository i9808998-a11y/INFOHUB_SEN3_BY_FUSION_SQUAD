document.addEventListener('DOMContentLoaded', function() {
    
    // --- UTILITY FUNCTIONS ---
    const getLoggedInUser = () => JSON.parse(localStorage.getItem('loggedInUser'));
    const setLoggedInUser = (user) => localStorage.setItem('loggedInUser', JSON.stringify(user));
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
    const setPosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));
    const getLikes = () => JSON.parse(localStorage.getItem('likes')) || {};
    const setLikes = (likes) => localStorage.setItem('likes', JSON.stringify(likes));
    const getWebsiteContent = () => JSON.parse(localStorage.getItem('websiteContent')) || {
        about: {
            title: "About InfoHub",
            content: "Your trusted source for daily news, educational updates, announcements, and general information."
        },
        contact: {
            email: "info@infohub.com",
            phone: "(123) 456-7890",
            address: "123 Info Street, Info City, 12345"
        },
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#",
            linkedin: "#"
        },
        settings: {
            siteName: "InfoHub",
            siteTagline: "Your Daily Updates",
            heroTitle: "Your Daily Source for Updates",
            heroDescription: "Stay informed with the latest news, educational updates, announcements, and more from our community.",
            allowRegistration: true,
            requireApproval: false
        }
    };
    const setWebsiteContent = (content) => localStorage.setItem('websiteContent', JSON.stringify(content));

    // --- INITIALIZATION ---
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
            { id: 2, username: 'user1', password: 'password', isAdmin: false },
            { id: 3, username: 'immu', password: 'immu', isAdmin: true },
        ];
        setUsers(defaultUsers);
    }
    if (!localStorage.getItem('posts')) {
        const defaultPosts = [
            { id: 1, authorId: 1, authorName: 'admin', category: 'news', title: 'Welcome to InfoHub!', content: 'This is a platform for community updates. Feel free to sign up and contribute.', date: new Date().toISOString(), image: null },
            { id: 2, authorId: 2, authorName: 'user1', category: 'education', title: 'How to Learn Effectively Online', content: 'Online learning requires discipline and a good strategy. Here are some tips...', date: new Date().toISOString(), image: null }
        ];
        setPosts(defaultPosts);
    }

    // --- DARK MODE ---
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const initDarkMode = () => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if(darkModeSwitch) darkModeSwitch.checked = true;
        }
    };
    initDarkMode();

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };
    if(darkModeSwitch) darkModeSwitch.addEventListener('change', toggleDarkMode);

    // --- POPUP ---
    const showPopup = (message) => {
        const popup = document.getElementById('successPopup');
        const popupMessage = document.getElementById('popupMessage');
        if (popup && popupMessage) {
            popupMessage.textContent = message;
            popup.classList.add('show');
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Hide after 3 seconds
        }
    };

    // --- MODAL ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Close modal when clicking close button
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // --- AUTHENTICATION ---
    function login(username, password) {
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password && u.isAdmin === false);
        if (user) {
            setLoggedInUser(user);
            return user;
        }
        return null;
    }

    function adminLogin(username, password) {
        const users = getUsers();
        const adminUser = users.find(u => u.username === username && u.password === password && u.isAdmin === true);
        if (adminUser) {
            setLoggedInUser(adminUser);
            return adminUser;
        }
        return null;
    }

    function signup(username, password) {
        const users = getUsers();
        if (users.some(u => u.username === username)) {
            alert('Username already exists!');
            return false;
        }
        const newUser = { id: Date.now(), username, password, isAdmin: false };
        users.push(newUser);
        setUsers(users);
        return true;
    }

    function logout() {
        localStorage.removeItem('loggedInUser');
        updateNavigation();
        window.location.href = 'index.html';
    }

    function checkAuth(isAdminPage = false) {
        const user = getLoggedInUser();
        if (!user || (isAdminPage && !user.isAdmin)) {
            alert('You must be logged in to view this page.');
            window.location.href = 'login.html';
            return null;
        }
        return user;
    }

    // --- UI & DYNAMIC CONTENT ---
    function updateNavigation() {
        const mainNav = document.getElementById('mainNav');
        const usernameDisplay = document.getElementById('username-display');
        const user = getLoggedInUser();
        if (!mainNav) return;

        let navHTML = '<ul>';
        if (user) {
            navHTML += `<li><a href="index.html">Home</a></li>`;
            navHTML += `<li><a href="profile.html">Profile</a></li>`;
            if (user.isAdmin) {
                navHTML += `<li><a href="admin.html">Admin</a></li>`;
            }
            navHTML += `<li><a href="#" onclick="logout()">Logout</a></li>`;
        } else {
            navHTML += `<li><a href="index.html">Home</a></li>`;
            navHTML += `<li><a href="login.html">Login</a></li>`;
            navHTML += `<li><a href="signup.html">Sign Up</a></li>`;
        }
        navHTML += '</ul>';
        mainNav.innerHTML = navHTML;

        if (usernameDisplay) {
            usernameDisplay.textContent = user ? `Hi, ${user.username}` : '';
        }
    }
    
    function renderPost(post, container, showActions = true, isAdmin = false) {
        const article = document.createElement('article');
        article.className = `content-item ${post.category}`;
        
        const likes = getLikes();
        const postLikes = likes[post.id] || [];
        const currentUser = getLoggedInUser();
        const isLiked = currentUser ? postLikes.includes(currentUser.id) : false;
        
        let actionsHTML = '';
        if (showActions) {
            if (isAdmin) {
                actionsHTML = `
                    <div class="admin-actions">
                        <button class="btn btn-sm btn-primary" onclick="editPost(${post.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                `;
            } else {
                actionsHTML = `
                    <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                        <i class="fas fa-heart"></i> ${postLikes.length}
                    </button>
                    <span style="font-size: 0.9rem; color: var(--secondary-text-color);">By: ${post.authorName}</span>
                `;
            }
        }
        
        article.innerHTML = `
            <div class="item-image">
                <img src="${post.image ? post.image : `https://picsum.photos/seed/${post.id}/600/400.jpg`}" alt="${post.category} image">
            </div>
            <div class="item-content">
                <div class="item-meta">
                    <span class="category">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
                    <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 120)}...</p>
                <div class="item-actions">
                    ${actionsHTML}
                </div>
            </div>
        `;
        container.appendChild(article);
    }

    function renderMyPost(post, container, user) {
        const article = document.createElement('article');
        article.className = `content-item ${post.category}`;
        article.innerHTML = `
            <div class="item-content" style="padding: 20px;">
                <div class="item-meta">
                    <span class="category">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
                    <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 120)}...</p>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        container.appendChild(article);
    }
    
    // --- PAGE-SPECIFIC LOGIC ---
    let currentPage = window.location.pathname.split('/').pop();
if (currentPage === "" || currentPage === "/") {
    currentPage = "index.html";
}


    // Index Page Logic
    if (currentPage === 'index.html') {
        updateNavigation();
        const contentGrid = document.getElementById('contentGrid');
        const posts = getPosts();
        posts.forEach(post => renderPost(post, contentGrid));
        
        // Update footer content from websiteContent
        updateFooterContent();
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if(searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const items = contentGrid.querySelectorAll('.content-item');
                items.forEach(item => {
                    const title = item.querySelector('h3').textContent.toLowerCase();
                    const content = item.querySelector('p').textContent.toLowerCase();
                    if (title.includes(searchTerm) || content.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                const items = contentGrid.querySelectorAll('.content-item');
                items.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Login Page Logic
    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('loginForm');
        if(loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const user = login(username, password);
                if (user) {
                    showPopup('Login Successful! Redirecting...');
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    alert('Invalid username or password.');
                }
            });
        }
    }
    
    // Admin Login Page Logic
    if (currentPage === 'admin-login.html') {
        const adminLoginForm = document.getElementById('adminLoginForm');
        if(adminLoginForm) {
            adminLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;
                const user = adminLogin(username, password);
                if (user) {
                    showPopup('Admin Login Successful! Redirecting...');
                    setTimeout(() => window.location.href = 'admin.html', 1500);
                } else {
                    alert('Invalid admin credentials.');
                }
            });
        }
    }

    // Signup Page Logic
    if (currentPage === 'signup.html') {
        // Check if registration is allowed
        const websiteContent = getWebsiteContent();
        if (!websiteContent.settings.allowRegistration) {
            document.querySelector('.auth-container').innerHTML = `
                <div class="auth-form-wrapper card">
                    <div class="auth-header">
                        <h2>Registration Closed</h2>
                        <p>New user registration is currently disabled. Please contact the administrator for assistance.</p>
                    </div>
                </div>
            `;
        } else {
            const signupForm = document.getElementById('signupForm');
            if(signupForm) {
                signupForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const username = document.getElementById('new-username').value;
                    const password = document.getElementById('new-password').value;
                    if (signup(username, password)) {
                        showPopup('Signup Successful! Please login.');
                        setTimeout(() => window.location.href = 'login.html', 2000);
                    }
                });
            }
        }
    }

    // Profile Page Logic
    if (currentPage === 'profile.html') {
        const user = checkAuth();
        if (!user) return;
        
        updateNavigation();
        const profileUsername = document.getElementById('profileUsername');
        const profileAvatar = document.getElementById('profileAvatar');
        const userStats = document.getElementById('userStats');
        if(profileUsername) profileUsername.innerText = user.username;
        if(profileAvatar) profileAvatar.innerText = user.username.charAt(0).toUpperCase();

        // Update user stats
        const posts = getPosts();
        const userPosts = posts.filter(p => p.authorId === user.id);
        if(userStats) userStats.innerText = `Member since ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | ${userPosts.length} Posts`;

        // Display user's posts
        const myPostsGrid = document.getElementById('myPostsGrid');
        if (myPostsGrid) {
            if (userPosts.length === 0) {
                myPostsGrid.innerHTML = '<p>You have not created any updates yet.</p>';
            } else {
                userPosts.forEach(post => renderMyPost(post, myPostsGrid, user));
            }
        }
        
        // Image upload logic
        const postImageInput = document.getElementById('postImage');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const imagePreview = document.getElementById('imagePreview');
        let uploadedImageBase64 = null;

        if(postImageInput && imagePreviewContainer && imagePreview) {
            postImageInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        uploadedImageBase64 = e.target.result;
                        imagePreview.src = uploadedImageBase64;
                        imagePreviewContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

                // Create new post form
        const createPostForm = document.getElementById('createPostForm');
        if(createPostForm) {
            createPostForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('postTitle').value;
                const category = document.getElementById('postCategory').value;
                const content = document.getElementById('postContent').value;
                
                const newPost = {
                    id: Date.now(),
                    authorId: user.id,
                    authorName: user.username,
                    category,
                    title,
                    content,
                    date: new Date().toISOString(),
                    image: uploadedImageBase64
                };
                
                const allPosts = getPosts();
                allPosts.push(newPost);
                setPosts(allPosts);
                
                showPopup('Update published successfully!');
                createPostForm.reset();
                if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';
                uploadedImageBase64 = null;

                // Re-render posts
                if(myPostsGrid) {
                    myPostsGrid.innerHTML = '';
                    const updatedPosts = getPosts().filter(p => p.authorId === user.id);
                    updatedPosts.forEach(post => renderMyPost(post, myPostsGrid, user));
                }
            });
        }
    }
    
    // Admin Page Logic
    if (currentPage === 'admin.html') {
        const user = checkAuth(true);
        if (!user) return;

        updateNavigation();
        
        // Initialize admin tabs
        initAdminTabs();
        
        // Load posts data
        loadPostsData();
        
        // Load users data
        loadUsersData();
        
        // Load website content
        loadWebsiteContent();
        
        // Initialize post search and filter
        initPostSearchAndFilter();
        
        // Initialize user search
        initUserSearch();
        
        // Initialize form handlers
        initFormHandlers();
    }
    
    // --- ADMIN FUNCTIONS ---
    function initAdminTabs() {
        const tabButtons = document.querySelectorAll('.admin-tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    function loadPostsData() {
        const allPostsGrid = document.getElementById('allPostsGrid');
        if(allPostsGrid) {
            const posts = getPosts();
            if (posts.length === 0) {
                allPostsGrid.innerHTML = '<p>No posts found.</p>';
            } else {
                allPostsGrid.innerHTML = '';
                posts.forEach(post => renderPost(post, allPostsGrid, true, true));
            }
        }
    }
    
    function loadUsersData() {
        const userTableBody = document.getElementById('userTableBody');
        if(userTableBody) {
            const users = getUsers();
            const posts = getPosts();
            
            userTableBody.innerHTML = '';
            users.forEach(u => {
                const userPosts = posts.filter(p => p.authorId === u.id);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.isAdmin ? 'Admin' : 'User'}</td>
                    <td>${userPosts.length}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        }
    }
    
    function loadWebsiteContent() {
        const websiteContent = getWebsiteContent();
        
        // Load about content
        document.getElementById('aboutTitle').value = websiteContent.about.title;
        document.getElementById('aboutContent').value = websiteContent.about.content;
        
        // Load contact info
        document.getElementById('contactEmail').value = websiteContent.contact.email;
        document.getElementById('contactPhone').value = websiteContent.contact.phone;
        document.getElementById('contactAddress').value = websiteContent.contact.address;
        
        // Load social links
        document.getElementById('facebookLink').value = websiteContent.social.facebook;
        document.getElementById('twitterLink').value = websiteContent.social.twitter;
        document.getElementById('instagramLink').value = websiteContent.social.instagram;
        document.getElementById('linkedinLink').value = websiteContent.social.linkedin;
        
        // Load settings
        document.getElementById('siteName').value = websiteContent.settings.siteName;
        document.getElementById('siteTagline').value = websiteContent.settings.siteTagline;
        document.getElementById('heroTitle').value = websiteContent.settings.heroTitle;
        document.getElementById('heroDescription').value = websiteContent.settings.heroDescription;
        document.getElementById('allowRegistration').checked = websiteContent.settings.allowRegistration;
        document.getElementById('requireApproval').checked = websiteContent.settings.requireApproval;
    }
    
    function initPostSearchAndFilter() {
        const postSearchInput = document.getElementById('postSearchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (postSearchInput) {
            postSearchInput.addEventListener('input', filterPosts);
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterPosts);
        }
    }
    
    function filterPosts() {
        const searchTerm = document.getElementById('postSearchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const allPostsGrid = document.getElementById('allPostsGrid');
        const posts = getPosts();
        
        let filteredPosts = posts;
        
        // Filter by search term
        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.content.toLowerCase().includes(searchTerm) ||
                post.authorName.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by category
        if (categoryFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
        }
        
        // Render filtered posts
        allPostsGrid.innerHTML = '';
        if (filteredPosts.length === 0) {
            allPostsGrid.innerHTML = '<p>No posts found matching your criteria.</p>';
        } else {
            filteredPosts.forEach(post => renderPost(post, allPostsGrid, true, true));
        }
    }
    
    function initUserSearch() {
        const userSearchInput = document.getElementById('userSearchInput');
        
        if (userSearchInput) {
            userSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const userTableBody = document.getElementById('userTableBody');
                const rows = userTableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const username = row.cells[1].textContent.toLowerCase();
                    const role = row.cells[2].textContent.toLowerCase();
                    
                    if (username.includes(searchTerm) || role.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    }
    
    function initFormHandlers() {
        // About form
        const aboutForm = document.getElementById('aboutForm');
        if (aboutForm) {
            aboutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const websiteContent = getWebsiteContent();
                websiteContent.about.title = document.getElementById('aboutTitle').value;
                websiteContent.about.content = document.getElementById('aboutContent').value;
                setWebsiteContent(websiteContent);
                showPopup('About information updated successfully!');
            });
        }
        
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const websiteContent = getWebsiteContent();
                websiteContent.contact.email = document.getElementById('contactEmail').value;
                websiteContent.contact.phone = document.getElementById('contactPhone').value;
                websiteContent.contact.address = document.getElementById('contactAddress').value;
                setWebsiteContent(websiteContent);
                showPopup('Contact information updated successfully!');
            });
        }
        
        // Social form
        const socialForm = document.getElementById('socialForm');
        if (socialForm) {
            socialForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const websiteContent = getWebsiteContent();
                websiteContent.social.facebook = document.getElementById('facebookLink').value;
                websiteContent.social.twitter = document.getElementById('twitterLink').value;
                websiteContent.social.instagram = document.getElementById('instagramLink').value;
                websiteContent.social.linkedin = document.getElementById('linkedinLink').value;
                setWebsiteContent(websiteContent);
                showPopup('Social media links updated successfully!');
            });
        }
        
        // General settings form
        const generalSettingsForm = document.getElementById('generalSettingsForm');
        if (generalSettingsForm) {
            generalSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const websiteContent = getWebsiteContent();
                websiteContent.settings.siteName = document.getElementById('siteName').value;
                websiteContent.settings.siteTagline = document.getElementById('siteTagline').value;
                websiteContent.settings.heroTitle = document.getElementById('heroTitle').value;
                websiteContent.settings.heroDescription = document.getElementById('heroDescription').value;
                setWebsiteContent(websiteContent);
                showPopup('General settings updated successfully!');
            });
        }
        
        // Registration settings form
        const registrationSettingsForm = document.getElementById('registrationSettingsForm');
        if (registrationSettingsForm) {
            registrationSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const websiteContent = getWebsiteContent();
                websiteContent.settings.allowRegistration = document.getElementById('allowRegistration').checked;
                websiteContent.settings.requireApproval = document.getElementById('requireApproval').checked;
                setWebsiteContent(websiteContent);
                showPopup('Registration settings updated successfully!');
            });
        }
        
        // Edit post form
        const editPostForm = document.getElementById('editPostForm');
        if (editPostForm) {
            editPostForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const postId = parseInt(document.getElementById('editPostId').value);
                const posts = getPosts();
                const postIndex = posts.findIndex(p => p.id === postId);
                
                if (postIndex !== -1) {
                    posts[postIndex].title = document.getElementById('editPostTitle').value;
                    posts[postIndex].category = document.getElementById('editPostCategory').value;
                    posts[postIndex].content = document.getElementById('editPostContent').value;
                    posts[postIndex].date = new Date().toISOString(); // Update date to reflect edit
                    
                    setPosts(posts);
                    closeModal('editPostModal');
                    loadPostsData(); // Reload posts data
                    showPopup('Post updated successfully!');
                }
            });
        }
        
        // Edit user form
        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const userId = parseInt(document.getElementById('editUserId').value);
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === userId);
                
                if (userIndex !== -1) {
                    users[userIndex].username = document.getElementById('editUsername').value;
                    
                    const newPassword = document.getElementById('editPassword').value;
                    if (newPassword) {
                        users[userIndex].password = newPassword;
                    }
                    
                    users[userIndex].isAdmin = document.getElementById('editUserRole').value === 'true';
                    
                    setUsers(users);
                    closeModal('editUserModal');
                    loadUsersData(); // Reload users data
                    showPopup('User updated successfully!');
                }
            });
        }
        
        // Add user form
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('newUsername').value;
                const password = document.getElementById('newPassword').value;
                const isAdmin = document.getElementById('newUserRole').value === 'true';
                
                const users = getUsers();
                
                // Check if username already exists
                if (users.some(u => u.username === username)) {
                    alert('Username already exists!');
                    return;
                }
                
                const newUser = {
                    id: Date.now(),
                    username,
                    password,
                    isAdmin
                };
                
                users.push(newUser);
                setUsers(users);
                closeModal('addUserModal');
                loadUsersData(); // Reload users data
                showPopup('User added successfully!');
            });
        }
        
        // Add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                openModal('addUserModal');
            });
        }
        
        // Confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                const itemType = document.getElementById('deleteItemType').textContent;
                const itemId = parseInt(document.getElementById('confirmDelete').getAttribute('data-id'));
                const reason = document.getElementById('deleteReason').value;
                
                if (itemType === 'post') {
                    deletePostById(itemId, reason);
                } else if (itemType === 'user') {
                    deleteUserById(itemId, reason);
                }
                
                closeModal('deleteModal');
            });
        }
    }
    
    function updateFooterContent() {
        const websiteContent = getWebsiteContent();
        
        // Update footer sections if they exist
        const aboutSection = document.querySelector('.footer-section h3');
        if (aboutSection && aboutSection.textContent === 'About InfoHub') {
            const aboutContent = aboutSection.nextElementSibling;
            if (aboutContent) {
                aboutContent.textContent = websiteContent.about.content;
            }
        }
        
        const contactSection = Array.from(document.querySelectorAll('.footer-section h3')).find(h3 => h3.textContent === 'Contact Us');
        if (contactSection) {
            const contactInfo = contactSection.nextElementSibling;
            if (contactInfo) {
                contactInfo.innerHTML = `
                    <p>Email: ${websiteContent.contact.email}</p>
                    <p>Phone: ${websiteContent.contact.phone}</p>
                    <p>Address: ${websiteContent.contact.address}</p>
                    <div class="social-links">
                        <a href="${websiteContent.social.facebook}"><i class="fab fa-facebook"></i></a>
                        <a href="${websiteContent.social.twitter}"><i class="fab fa-twitter"></i></a>
                        <a href="${websiteContent.social.instagram}"><i class="fab fa-instagram"></i></a>
                        <a href="${websiteContent.social.linkedin}"><i class="fab fa-linkedin"></i></a>
                    </div>
                `;
            }
        }
    }
    
    // --- GLOBAL FUNCTIONS ---
    window.deletePost = function(postId) {
        document.getElementById('deleteItemType').textContent = 'post';
        document.getElementById('confirmDelete').setAttribute('data-id', postId);
        openModal('deleteModal');
    };
    
    function deletePostById(postId, reason) {
        let posts = getPosts();
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            // Store notification for the post author
            const notifications = JSON.parse(localStorage.getItem('notifications')) || {};
            if (!notifications[post.authorId]) {
                notifications[post.authorId] = [];
            }
            
            notifications[post.authorId].push({
                type: 'post_deleted',
                postId: postId,
                postTitle: post.title,
                reason: reason,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Remove the post
            posts = posts.filter(p => p.id !== postId);
            setPosts(posts);
            
            showPopup('Post deleted successfully!');
            loadPostsData(); // Reload posts data
        }
    }
    
    window.editPost = function(postId) {
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.getElementById('editPostId').value = post.id;
            document.getElementById('editPostTitle').value = post.title;
            document.getElementById('editPostCategory').value = post.category;
            document.getElementById('editPostContent').value = post.content;
            
            openModal('editPostModal');
        }
    };
    
    window.deleteUser = function(userId) {
        document.getElementById('deleteItemType').textContent = 'user';
        document.getElementById('confirmDelete').setAttribute('data-id', userId);
        openModal('deleteModal');
    };
    
    function deleteUserById(userId, reason) {
        let users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
            // Store notification for the user
            const notifications = JSON.parse(localStorage.getItem('notifications')) || {};
            if (!notifications[userId]) {
                notifications[userId] = [];
            }
            
            notifications[userId].push({
                type: 'account_deleted',
                reason: reason,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Remove the user
            users = users.filter(u => u.id !== userId);
            setUsers(users);
            
            // Also remove all posts by this user
            let posts = getPosts();
            posts = posts.filter(p => p.authorId !== userId);
            setPosts(posts);
            
            showPopup('User deleted successfully!');
            loadUsersData(); // Reload users data
        }
    }
    
    window.editUser = function(userId) {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editUserRole').value = user.isAdmin ? 'true' : 'false';
            
            openModal('editUserModal');
        }
    };
    
    window.toggleLike = function(postId) {
        const currentUser = getLoggedInUser();
        if (!currentUser) {
            alert('Please login to like posts.');
            return;
        }
        let likes = getLikes();
        if (!likes[postId]) {
            likes[postId] = [];
        }
        const postLikes = likes[postId];
        const userIndex = postLikes.indexOf(currentUser.id);

        if (userIndex > -1) {
            postLikes.splice(userIndex, 1); // Unlike
        } else {
            postLikes.push(currentUser.id); // Like
        }
        
        setLikes(likes);
        // Re-render the entire grid to update like counts
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.innerHTML = '';
            getPosts().forEach(post => renderPost(post, contentGrid));
        }
    };
    
    window.logout = logout;

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});
