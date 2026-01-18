// AdminDashboard Component - Complete and Future-Proof
const AdminDashboard = {
    render: () => {
        return `
            <div class="min-h-screen bg-gray-50">
                <!-- Dashboard Header -->
                <div class="bg-white shadow-sm border-b border-gray-200">
                    <div class="px-4 sm:px-6 lg:px-8 py-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p class="text-gray-600 mt-1">Manage your FreeEducation platform</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button class="btn-scale px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 focus-ring">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Add Content
                                </button>
                                <button class="btn-scale p-2 text-gray-600 hover:text-gray-900 focus-ring">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Overview -->
                <div class="px-4 sm:px-6 lg:px-8 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${AdminDashboard.renderStatCard('Total Users', '12,543', 'users', '+12%', 'text-green-600')}
                        ${AdminDashboard.renderStatCard('Active Students', '8,234', 'academic-cap', '+8%', 'text-green-600')}
                        ${AdminDashboard.renderStatCard('Total Courses', '156', 'book', '+5%', 'text-green-600')}
                        ${AdminDashboard.renderStatCard('Revenue', '$45,678', 'currency-dollar', '+18%', 'text-green-600')}
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="px-4 sm:px-6 lg:px-8 pb-8">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <!-- Left Column - Main Content -->
                        <div class="lg:col-span-2 space-y-6">
                            
                            <!-- Recent Users -->
                            ${AdminDashboard.renderRecentUsers()}
                            
                            <!-- System Health -->
                            ${AdminDashboard.renderSystemHealth()}
                            
                            <!-- Recent Activities -->
                            ${AdminDashboard.renderRecentActivities()}
                            
                        </div>

                        <!-- Right Column - Sidebar -->
                        <div class="space-y-6">
                            
                            <!-- Quick Actions -->
                            ${AdminDashboard.renderQuickActions()}
                            
                            <!-- System Notifications -->
                            ${AdminDashboard.renderNotifications()}
                            
                            <!-- Performance Metrics -->
                            ${AdminDashboard.renderPerformanceMetrics()}
                            
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard: (title, value, icon, change, changeColor) => {
        const iconSvg = AdminDashboard.getIcon(icon);
        return `
            <div class="bg-white rounded-lg shadow-sm p-6 hover-lift">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">${title}</p>
                        <p class="text-2xl font-bold text-gray-900 mt-1">${value}</p>
                        <div class="flex items-center mt-2">
                            <svg class="w-4 h-4 ${changeColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                            <span class="text-sm ${changeColor} ml-1">${change} from last month</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        ${iconSvg}
                    </div>
                </div>
            </div>
        `;
    },

    renderRecentUsers: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Recent Users</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        ${AdminDashboard.renderUserItem('John Doe', 'john@example.com', 'Student', '2 hours ago', 'online')}
                        ${AdminDashboard.renderUserItem('Jane Smith', 'jane@example.com', 'Teacher', '5 hours ago', 'online')}
                        ${AdminDashboard.renderUserItem('Bob Johnson', 'bob@example.com', 'Student', '1 day ago', 'offline')}
                        ${AdminDashboard.renderUserItem('Alice Brown', 'alice@example.com', 'Writer', '2 days ago', 'offline')}
                        ${AdminDashboard.renderUserItem('Charlie Wilson', 'charlie@example.com', 'Student', '3 days ago', 'offline')}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <a href="/admin/users" class="text-sm font-medium text-primary hover:text-blue-600">
                            View all users →
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    renderUserItem: (name, email, role, time, status) => {
        const statusColor = status === 'online' ? 'bg-green-400' : 'bg-gray-300';
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div class="absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${name}</p>
                        <p class="text-xs text-gray-500">${email}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs font-medium text-gray-900">${role}</p>
                    <p class="text-xs text-gray-500">${time}</p>
                </div>
            </div>
        `;
    },

    renderSystemHealth: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">System Health</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        ${AdminDashboard.renderHealthItem('Database', 'Operational', 'success')}
                        ${AdminDashboard.renderHealthItem('API Server', 'Operational', 'success')}
                        ${AdminDashboard.renderHealthItem('Storage', '87% Used', 'warning')}
                        ${AdminDashboard.renderHealthItem('CDN', 'Operational', 'success')}
                        ${AdminDashboard.renderHealthItem('Email Service', 'Operational', 'success')}
                    </div>
                </div>
            </div>
        `;
    },

    renderHealthItem: (service, status, type) => {
        const statusColors = {
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            error: 'bg-red-100 text-red-800'
        };
        
        const color = statusColors[type] || statusColors.success;
        
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span class="text-sm font-medium text-gray-900">${service}</span>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${color}">${status}</span>
            </div>
        `;
    },

    renderRecentActivities: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Recent Activities</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        ${AdminDashboard.renderActivityItem('New user registration', 'John Doe registered as Student', '2 hours ago')}
                        ${AdminDashboard.renderActivityItem('Course created', 'Math 101 was created by Jane Smith', '5 hours ago')}
                        ${AdminDashboard.renderActivityItem('System update', 'Database backup completed successfully', '1 day ago')}
                        ${AdminDashboard.renderActivityItem('Content upload', 'New lesson materials uploaded', '2 days ago')}
                        ${AdminDashboard.renderActivityItem('User reported', 'Inappropriate content flagged', '3 days ago')}
                    </div>
                </div>
            </div>
        `;
    },

    renderActivityItem: (title, description, time) => {
        return `
            <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${title}</p>
                    <p class="text-xs text-gray-500">${description}</p>
                    <p class="text-xs text-gray-400 mt-1">${time}</p>
                </div>
            </div>
        `;
    },

    renderQuickActions: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-3">
                        <button class="btn-scale w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 focus-ring text-sm">
                            Create New Course
                        </button>
                        <button class="btn-scale w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus-ring text-sm">
                            Manage Users
                        </button>
                        <button class="btn-scale w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus-ring text-sm">
                            View Reports
                        </button>
                        <button class="btn-scale w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus-ring text-sm">
                            System Settings
                        </button>
                        <button class="btn-scale w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus-ring text-sm">
                            Send Newsletter
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderNotifications: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-3">
                        ${AdminDashboard.renderNotificationItem('System Update', 'A new system update is available', 'info')}
                        ${AdminDashboard.renderNotificationItem('User Report', '5 users reported inappropriate content', 'warning')}
                        ${AdminDashboard.renderNotificationItem('Storage Alert', 'Storage usage is at 87%', 'warning')}
                        ${AdminDashboard.renderNotificationItem('Success', 'Daily backup completed successfully', 'success')}
                    </div>
                </div>
            </div>
        `;
    },

    renderNotificationItem: (title, message, type) => {
        const typeColors = {
            info: 'bg-blue-100 text-blue-800',
            warning: 'bg-yellow-100 text-yellow-800',
            success: 'bg-green-100 text-green-800',
            error: 'bg-red-100 text-red-800'
        };
        
        const color = typeColors[type] || typeColors.info;
        
        return `
            <div class="p-3 rounded-lg border border-gray-200">
                <div class="flex items-start space-x-2">
                    <div class="w-2 h-2 bg-primary rounded-full mt-1"></div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">${title}</p>
                        <p class="text-xs text-gray-500">${message}</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderPerformanceMetrics: () => {
        return `
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Performance Metrics</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        ${AdminDashboard.renderMetricItem('Server Response Time', '245ms', 'good')}
                        ${AdminDashboard.renderMetricItem('Database Query Time', '89ms', 'good')}
                        ${AdminDashboard.renderMetricItem('Page Load Time', '1.2s', 'warning')}
                        ${AdminDashboard.renderMetricItem('Error Rate', '0.2%', 'good')}
                        ${AdminDashboard.renderMetricItem('Active Sessions', '1,234', 'good')}
                    </div>
                </div>
            </div>
        `;
    },

    renderMetricItem: (name, value, status) => {
        const statusColors = {
            good: 'text-green-600',
            warning: 'text-yellow-600',
            error: 'text-red-600'
        };
        
        const color = statusColors[status] || statusColors.good;
        
        return `
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">${name}</span>
                <span class="text-sm font-medium ${color}">${value}</span>
            </div>
        `;
    },

    getIcon: (iconName) => {
        const icons = {
            users: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
            'academic-cap': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>',
            book: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
            'currency-dollar': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[iconName] || icons.users;
    }
};

// Export for global use
window.AdminDashboard = AdminDashboard;
