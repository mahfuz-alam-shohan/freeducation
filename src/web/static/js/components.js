// Component-specific JavaScript

// Header Component
const HeaderComponent = {
    render: () => {
        return `
            <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
                <div class="flex items-center justify-between h-full px-4">
                    <!-- Sidebar Toggle -->
                    <button onclick="SidebarManager.toggle()" class="btn-scale p-2 rounded-lg hover:bg-gray-100 focus-ring">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    
                    <!-- Brand Logo -->
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <span class="text-xl font-bold text-gray-900">freeducation</span>
                    </div>
                    
                    <!-- User Area -->
                    <div id="user-area" class="flex items-center space-x-3">
                        ${UserArea.render()}
                    </div>
                </div>
            </header>
        `;
    }
};

// User Area Component
const UserArea = {
    render: () => {
        if (Utils.isMobile()) {
            return `
                <!-- Notification Bell -->
                <button class="btn-scale p-2 rounded-lg hover:bg-gray-100 focus-ring relative">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    ${AppState.notifications.length > 0 ? `
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    ` : ''}
                </button>
            `;
        } else {
            if (AppState.user) {
                return `
                    <!-- Notification Bell -->
                    <button class="btn-scale p-2 rounded-lg hover:bg-gray-100 focus-ring relative">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        ${AppState.notifications.length > 0 ? `
                            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        ` : ''}
                    </button>
                    
                    <!-- User Profile Dropdown -->
                    <div class="relative">
                        <button onclick="UserArea.toggleDropdown()" class="btn-scale flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus-ring">
                            <img src="${AppState.user.avatar || '/static/images/default-avatar.png'}" alt="${AppState.user.name}" class="w-8 h-8 rounded-full">
                            <span class="text-sm font-medium text-gray-700">${AppState.user.firstName} ${AppState.user.lastName}</span>
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden">
                            <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                            <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                            <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                            <hr class="my-1 border-gray-200">
                            <button onclick="UserArea.logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <button onclick="window.location.href='/login'" class="btn-scale px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
                        Login
                    </button>
                    <button onclick="window.location.href='/register'" class="btn-scale px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 focus-ring">
                        Register
                    </button>
                `;
            }
        }
    },
    
    update: () => {
        const userArea = document.getElementById('user-area');
        if (userArea) {
            userArea.innerHTML = UserArea.render();
        }
    },
    
    toggleDropdown: () => {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    },
    
    logout: () => {
        localStorage.removeItem('auth_token');
        AppState.user = null;
        UserArea.update();
        Utils.showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }
};

// Sidebar Component
const SidebarComponent = {
    render: () => {
        const isMobile = Utils.isMobile();
        const sidebarClasses = isMobile 
            ? 'fixed inset-y-0 left-0 w-72 bg-white shadow-xl border-r border-gray-200 z-50 transform -translate-x-full sidebar-transition'
            : `fixed inset-y-0 left-0 bg-white shadow-sm border-r border-gray-200 z-20 sidebar-transition ${AppState.sidebarOpen ? 'w-64' : 'w-16'}`;
        
        return `
            <aside id="sidebar" class="${sidebarClasses}">
                ${SidebarHeader.render()}
                ${SidebarContent.render()}
            </aside>
        `;
    }
};

// Sidebar Header Component
const SidebarHeader = {
    render: () => {
        const isMobile = Utils.isMobile();
        
        if (isMobile) {
            return `
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <span class="text-lg font-bold text-gray-900">freeducation</span>
                    </div>
                    <button onclick="SidebarManager.closeMobile()" class="btn-scale p-1 rounded-lg hover:bg-gray-100 focus-ring">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                ${SidebarUserSection.render()}
            `;
        } else {
            return `
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        ${AppState.sidebarOpen ? '<span class="text-lg font-bold text-gray-900">freeducation</span>' : ''}
                    </div>
                </div>
            `;
        }
    }
};

// Sidebar User Section Component
const SidebarUserSection = {
    render: () => {
        if (AppState.user) {
            return `
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center space-x-3">
                        <img src="${AppState.user.avatar || '/static/images/default-avatar.png'}" alt="${AppState.user.name}" class="w-10 h-10 rounded-full">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">${AppState.user.firstName} ${AppState.user.lastName}</p>
                            <p class="text-xs text-gray-500 truncate">${AppState.user.email}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="p-4 border-b border-gray-200 space-y-2">
                    <button onclick="window.location.href='/login'" class="btn-scale w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus-ring rounded-lg">
                        Login
                    </button>
                    <button onclick="window.location.href='/register'" class="btn-scale w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 focus-ring rounded-lg">
                        Register
                    </button>
                </div>
            `;
        }
    }
};

// Sidebar Content Component
const SidebarContent = {
    render: () => {
        const isMobile = Utils.isMobile();
        const isCollapsed = !Utils.isMobile() && !AppState.sidebarOpen;
        
        const menuItems = [
            { icon: 'home', label: 'Home', href: '/', active: AppState.currentPage === 'home' },
            { icon: 'book', label: 'Subjects', href: '/subjects', active: AppState.currentPage === 'subjects' },
            { icon: 'academic-cap', label: 'Classes', href: '/classes', active: AppState.currentPage === 'classes' },
            { icon: 'clipboard-list', label: 'Assessments', href: '/assessments', active: AppState.currentPage === 'assessments' },
            { icon: 'users', label: 'Community', href: '/community', active: AppState.currentPage === 'community', comingSoon: true },
            { icon: 'pencil', label: 'Writers', href: '/writers', active: AppState.currentPage === 'writers', comingSoon: true },
            { icon: 'building', label: 'Publishers', href: '/publishers', active: AppState.currentPage === 'publishers', comingSoon: true },
        ];
        
        if (AppState.user) {
            menuItems.push(
                { icon: 'user', label: 'My Profile', href: '/profile', active: AppState.currentPage === 'profile' },
                { icon: 'chart-bar', label: 'My Progress', href: '/progress', active: AppState.currentPage === 'progress' }
            );
        }
        
        if (AppState.user && AppState.user.role === 'admin') {
            menuItems.push({ icon: 'cog', label: 'Admin', href: '/admin', active: AppState.currentPage === 'admin' });
        }
        
        menuItems.push({ icon: 'cog', label: 'Settings', href: '/settings', active: AppState.currentPage === 'settings' });
        
        if (AppState.user) {
            menuItems.push({ icon: 'logout', label: 'Logout', href: '#', action: 'UserArea.logout()' });
        }
        
        return `
            <nav class="p-4 space-y-1">
                ${menuItems.map(item => MenuItem.render(item, isCollapsed)).join('')}
            </nav>
        `;
    }
};

// Menu Item Component
const MenuItem = {
    render: (item, isCollapsed) => {
        const icon = MenuItem.getIcon(item.icon);
        const activeClass = item.active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
        const comingSoonClass = item.comingSoon ? 'opacity-60 cursor-not-allowed' : '';
        
        if (item.action) {
            return `
                <button onclick="${item.action}" class="btn-scale w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${activeClass} ${comingSoonClass} focus-ring">
                    ${icon}
                    ${!isCollapsed ? `
                        <span>${item.label}</span>
                        ${item.comingSoon ? '<span class="text-xs opacity-75">(Coming Soon)</span>' : ''}
                    ` : ''}
                </button>
            `;
        } else {
            return `
                <a href="${item.href}" class="btn-scale flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${activeClass} ${comingSoonClass} focus-ring">
                    ${icon}
                    ${!isCollapsed ? `
                        <span>${item.label}</span>
                        ${item.comingSoon ? '<span class="text-xs opacity-75">(Coming Soon)</span>' : ''}
                    ` : ''}
                </a>
            `;
        }
    },
    
    getIcon: (iconName) => {
        const icons = {
            home: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
            book: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
            'academic-cap': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>',
            'clipboard-list': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
            users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
            pencil: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>',
            building: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
            user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
            'chart-bar': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
            cog: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
            logout: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>'
        };
        return icons[iconName] || icons.home;
    }
};

// Export components for use
window.HeaderComponent = HeaderComponent;
window.UserArea = UserArea;
window.SidebarComponent = SidebarComponent;
