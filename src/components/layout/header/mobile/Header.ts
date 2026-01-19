export interface MobileHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
  onMenuToggle?: () => void;
}

export class MobileHeader {
  render(props: MobileHeaderProps): string {
    const { user, onMenuToggle } = props;
    
    return `
      <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div class="px-4">
          <div class="flex justify-between items-center h-16">
            <!-- Menu Toggle Button (Always Visible) -->
            <button @click="${onMenuToggle ? 'sidebarOpen = !sidebarOpen' : ''}" 
                    class="p-2 rounded-md text-gray-600 hover:bg-gray-100 z-50">
              <i class="fas fa-bars text-xl"></i>
            </button>

            <!-- Logo (Center) -->
            <div class="flex-1 flex justify-center">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-graduation-cap text-white text-sm"></i>
                </div>
                <div class="ml-3">
                  <h1 class="text-xl font-bold text-gray-900">Free Edu</h1>
                  <p class="text-xs text-gray-500 hidden sm:block">Bangladesh</p>
                </div>
              </div>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-3">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <i class="fas fa-bell text-lg"></i>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Menu or Auth -->
              ${user ? this.renderUserMenu(user) : this.renderAuthButtons()}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  private renderUserMenu(user: NonNullable<MobileHeaderProps['user']>): string {
    return `
      <div class="relative" @click.outside="userMenuOpen = false">
        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
          <div class="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-gray-600 text-sm"></i>
          </div>
          <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
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
      <div class="flex items-center space-x-2">
        <a href="/login" class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
          Login
        </a>
        <a href="/register" class="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          Sign Up
        </a>
      </div>
    `;
  }
}
