export interface DesktopHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
}

export class DesktopHeader {
  render(props: DesktopHeaderProps): string {
    const { user } = props;
    
    return `
      <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div class="px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-graduation-cap text-white text-lg"></i>
                </div>
              </div>
              <div class="ml-4">
                <h1 class="text-2xl font-bold text-gray-900">Free Education</h1>
                <p class="text-sm text-gray-500">Bangladesh NCTB Platform</p>
              </div>
            </div>

            <!-- Center - Search Bar -->
            <div class="flex-1 max-w-lg mx-12">
              <div class="relative">
                <input type="text" placeholder="Search subjects, lessons, teachers..." 
                       class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
              </div>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-6">
              <!-- Quick Actions -->
              <div class="hidden lg:flex items-center space-x-4">
                <button class="text-gray-600 hover:text-gray-900 transition">
                  <i class="fas fa-calendar-alt text-lg"></i>
                </button>
                <button class="text-gray-600 hover:text-gray-900 transition">
                  <i class="fas fa-envelope text-lg"></i>
                </button>
              </div>

              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <i class="fas fa-bell text-xl"></i>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Menu -->
              ${user ? this.renderUserMenu(user) : this.renderAuthButtons()}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  private renderUserMenu(user: NonNullable<DesktopHeaderProps['user']>): string {
    return `
      <div class="relative" @click.outside="userMenuOpen = false">
        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-gray-600"></i>
          </div>
          <div class="text-left">
            <p class="text-sm font-medium text-gray-900">${user.name}</p>
            <p class="text-xs text-gray-500 capitalize">${user.role}</p>
          </div>
          <i class="fas fa-chevron-down text-gray-400"></i>
        </button>
        
        <div x-show="userMenuOpen" 
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 transform scale-95"
             x-transition:enter-end="opacity-100 transform scale-100"
             class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">${user.name}</p>
            <p class="text-xs text-gray-500">${user.email}</p>
          </div>
          <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-user mr-3"></i> Profile
          </a>
          <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-cog mr-3"></i> Settings
          </a>
          <a href="/help" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-question-circle mr-3"></i> Help
          </a>
          <hr class="my-1">
          <a href="/logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <i class="fas fa-sign-out-alt mr-3"></i> Logout
          </a>
        </div>
      </div>
    `;
  }

  private renderAuthButtons(): string {
    return `
      <div class="flex items-center space-x-4">
        <a href="/login" class="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
          Login
        </a>
        <a href="/register" class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
          Sign Up
        </a>
      </div>
    `;
  }
}
