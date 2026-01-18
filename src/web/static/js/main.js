// Global state management
const AppState = {
    user: null,
    sidebarOpen: false,
    mobileSidebarOpen: false,
    notifications: [],
    currentPage: 'home'
};

// Utility functions
const Utils = {
    // Generate unique ID
    generateId: () => '_' + Math.random().toString(36).substr(2, 9),
    
    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if mobile
    isMobile: () => {
        return window.innerWidth < 768;
    },
    
    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = {
            id: Utils.generateId(),
            message,
            type,
            timestamp: Date.now()
        };
        
        AppState.notifications.push(notification);
        NotificationManager.add(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            NotificationManager.remove(notification.id);
        }, 5000);
    },
    
    // API helper
    api: {
        get: async (url) => {
            try {
                const response = await fetch(url);
                return await response.json();
            } catch (error) {
                Utils.showNotification('Network error occurred', 'error');
                throw error;
            }
        },
        
        post: async (url, data) => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                return await response.json();
            } catch (error) {
                Utils.showNotification('Network error occurred', 'error');
                throw error;
            }
        }
    }
};

// Sidebar management
const SidebarManager = {
    toggle: () => {
        if (Utils.isMobile()) {
            SidebarManager.toggleMobile();
        } else {
            SidebarManager.toggleDesktop();
        }
    },
    
    toggleDesktop: () => {
        AppState.sidebarOpen = !AppState.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (AppState.sidebarOpen) {
            sidebar.classList.remove('w-16');
            sidebar.classList.add('w-64');
            mainContent.classList.remove('ml-16');
            mainContent.classList.add('ml-64');
        } else {
            sidebar.classList.remove('w-64');
            sidebar.classList.add('w-16');
            mainContent.classList.remove('ml-64');
            mainContent.classList.add('ml-16');
        }
    },
    
    toggleMobile: () => {
        AppState.mobileSidebarOpen = !AppState.mobileSidebarOpen;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (AppState.mobileSidebarOpen) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },
    
    closeMobile: () => {
        AppState.mobileSidebarOpen = false;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    },
    
    init: () => {
        // Close mobile sidebar when clicking overlay
        document.getElementById('sidebar-overlay').addEventListener('click', SidebarManager.closeMobile);
        
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (!Utils.isMobile() && AppState.mobileSidebarOpen) {
                SidebarManager.closeMobile();
            }
        }, 250));
    }
};

// Notification management
const NotificationManager = {
    add: (notification) => {
        const container = document.getElementById('notification-container');
        const notificationEl = document.createElement('div');
        
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        }[notification.type] || 'bg-gray-500';
        
        notificationEl.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        notificationEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-sm">${notification.message}</span>
                <button onclick="NotificationManager.remove('${notification.id}')" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        container.appendChild(notificationEl);
        
        // Animate in
        setTimeout(() => {
            notificationEl.classList.remove('translate-x-full');
        }, 10);
    },
    
    remove: (id) => {
        const notificationEl = document.querySelector(`[data-notification-id="${id}"]`);
        if (notificationEl) {
            notificationEl.classList.add('translate-x-full');
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }
        
        AppState.notifications = AppState.notifications.filter(n => n.id !== id);
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    SidebarManager.init();
    
    // Check for existing user session
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Validate token and get user info
        Utils.api.get('/api/v1/auth/me')
            .then(user => {
                AppState.user = user;
                UserArea.update();
            })
            .catch(() => {
                localStorage.removeItem('auth_token');
            });
    }
    
    // Setup global error handling
    window.addEventListener('error', (event) => {
        Utils.showNotification('An unexpected error occurred', 'error');
        console.error(event.error);
    });
});

// Global functions for inline event handlers
window.SidebarManager = SidebarManager;
window.Utils = Utils;
window.NotificationManager = NotificationManager;
