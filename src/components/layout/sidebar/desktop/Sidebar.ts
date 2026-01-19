export interface DesktopSidebarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
  currentPath?: string;
}

export class DesktopSidebar {
  render(props: DesktopSidebarProps): string {
    const { user, currentPath = '/' } = props;
    
    if (!user) return '';

    const menuItems = this.getMenuItems(user.role);
    
    return `
      <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16">
        <div class="flex flex-col h-full">
          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            ${menuItems.map(item => this.renderMenuItem(item, currentPath)).join('')}
          </nav>
          
          <!-- User Info Card -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-gray-600"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${user.name}</p>
                <p class="text-xs text-gray-500 capitalize">${user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
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
      <a href="${item.href}" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }">
        <i class="${item.icon} w-5"></i>
        <span>${item.label}</span>
      </a>
    `;
  }
}
