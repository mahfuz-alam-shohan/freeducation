export interface TabletHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
}

export class TabletHeader {
  render(props: TabletHeaderProps): string {
    const { user } = props;
    
    return `
      <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div class="px-6">
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
            <div class="flex-1 max-w-md mx-8">
              <div class="relative">
                <input type="text" placeholder="Search subjects, lessons..." 
                       class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
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

  private renderUserMenu(user: NonNullable<TabletHeaderProps['user']>): string {
    return `
      <div class="relative" @click.outside="userMenuOpen = false">
        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
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
             class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-user mr-2"></i> Profile
          </a>
          <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-cog mr-2"></i> Settings
          </a>
          <hr class="my-1">
          <a href="/logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <i class="fas fa-sign-out-alt mr-2"></i> Logout
          </a>
        </div>
      </div>
    `;
  }

  private renderAuthButtons(): string {
    return `
      <div class="flex items-center space-x-3">
        <a href="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
          Login
        </a>
        <a href="/register" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          Sign Up
        </a>
      </div>
    `;
  }
}
