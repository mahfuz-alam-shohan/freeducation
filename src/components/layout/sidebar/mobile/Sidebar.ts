export interface MobileSidebarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
  currentPath?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export class MobileSidebar {
  render(props: MobileSidebarProps): string {
    const { user, currentPath = '/', isOpen = false } = props;
    
    if (!user) return '';

    const menuItems = this.getMenuItems(user.role);
    
    return `
      <!-- Full Screen Overlay Sidebar -->
      <div x-show="${isOpen}" 
           x-transition:enter="transition ease-in-out duration-300"
           x-transition:enter-start="opacity-0"
           x-transition:enter-end="opacity-100"
           x-transition:leave="transition ease-in-out duration-300"
           x-transition:leave-start="opacity-100"
           x-transition:leave-end="opacity-0"
           @click="sidebarOpen = false"
           class="fixed inset-0 z-50 flex">
        
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Sidebar Panel -->
        <div x-show="${isOpen}"
             x-transition:enter="transition ease-in-out duration-300"
             x-transition:enter-start="transform -translate-x-full"
             x-transition:enter-end="transform translate-x-0"
             x-transition:leave="transition ease-in-out duration-300"
             x-transition:leave-start="transform translate-x-0"
             x-transition:leave-end="transform -translate-x-full"
             @click.stop
             class="relative w-80 max-w-full bg-white shadow-xl h-full overflow-y-auto">
          
          <!-- Close Button -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
            <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
            <button @click="sidebarOpen = false" 
                    class="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="p-4">
            <!-- User Info -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-gray-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">${user.name}</p>
                  <p class="text-xs text-gray-500 capitalize">${user.role}</p>
                </div>
              </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="space-y-2">
              ${menuItems.map(item => this.renderMenuItem(item, currentPath)).join('')}
            </nav>

            <!-- Bottom Actions -->
            <div class="mt-8 pt-6 border-t border-gray-200 space-y-2">
              <a href="/settings" 
                 @click="sidebarOpen = false"
                 class="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <i class="fas fa-cog w-5"></i>
                <span>Settings</span>
              </a>
              
              <a href="/logout" 
                 @click="sidebarOpen = false"
                 class="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
                <i class="fas fa-sign-out-alt w-5"></i>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getMenuItems(role: string) {
    const baseItems = [
      { icon: 'fas fa-home', label: 'Dashboard', href: '/dashboard' },
      { icon: 'fas fa-book', label: 'My Subjects', href: '/subjects' },
      { icon: 'fas fa-calendar', label: 'Schedule', href: '/schedule' },
      { icon: 'fas fa-chart-line', label: 'Progress', href: '/progress' },
    ];

    const roleSpecificItems = {
      admin: [
        { icon: 'fas fa-users', label: 'Users', href: '/admin/users' },
        { icon: 'fas fa-cog', label: 'Settings', href: '/admin/settings' },
        { icon: 'fas fa-chart-bar', label: 'Analytics', href: '/admin/analytics' },
      ],
      teacher: [
        { icon: 'fas fa-chalkboard', label: 'My Classes', href: '/teacher/classes' },
        { icon: 'fas fa-tasks', label: 'Assignments', href: '/teacher/assignments' },
        { icon: 'fas fa-graduation-cap', label: 'Students', href: '/teacher/students' },
      ],
      student: [
        { icon: 'fas fa-book-open', label: 'Study Materials', href: '/student/materials' },
        { icon: 'fas fa-clipboard-list', label: 'Assignments', href: '/student/assignments' },
        { icon: 'fas fa-trophy', label: 'Achievements', href: '/student/achievements' },
      ],
      writer: [
        { icon: 'fas fa-pen', label: 'My Content', href: '/writer/content' },
        { icon: 'fas fa-folder', label: 'Drafts', href: '/writer/drafts' },
        { icon: 'fas fa-chart-pie', label: 'Analytics', href: '/writer/analytics' },
      ],
      publisher: [
        { icon: 'fas fa-book', label: 'Publications', href: '/publisher/publications' },
        { icon: 'fas fa-dollar-sign', label: 'Revenue', href: '/publisher/revenue' },
        { icon: 'fas fa-users', label: 'Authors', href: '/publisher/authors' },
      ]
    };

    return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
  }

  private renderMenuItem(item: any, currentPath?: string): string {
    const isActive = currentPath === item.href;
    return `
      <a href="${item.href}" 
         @click="sidebarOpen = false"
         class="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      } transition">
        <i class="${item.icon} w-5 text-center"></i>
        <span>${item.label}</span>
      </a>
    `;
  }
}
