/**
 * ===================================
   APPLICATION CONTROLLER
   ===================================
 */

import { HeaderComponent } from '../components/common/header/header';
import { SidebarComponent } from '../components/common/sidebar/sidebar';
import { ProfileComponent } from '../components/common/profile/profile';
import { NotificationComponent } from '../components/common/notification/notification';

interface AppState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  isAuthenticated: boolean;
  user: any;
  currentPage: string;
  loading: boolean;
  error: string | null;
}

interface AppControllerConfig {
  onPageChange?: (page: string) => void;
  onAuthChange?: (isAuthenticated: boolean, user: any) => void;
}

export class AppController {
  private state: AppState;
  private elements: {
    layoutContainer: HTMLElement | null;
    headerComponent: HTMLElement | null;
    sidebarComponent: HTMLElement | null;
    profileDropdown: HTMLElement | null;
    notificationDropdown: HTMLElement | null;
    mobileNotification: HTMLElement | null;
    mobileOverlay: HTMLElement | null;
    contentWrapper: HTMLElement | null;
  };
  private components: {
    header: HeaderComponent;
    sidebar: SidebarComponent;
    profile: ProfileComponent;
    notification: NotificationComponent;
  };
  private config: AppControllerConfig;

  constructor(config: AppControllerConfig = {}) {
    this.config = config;
    this.state = {
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      isAuthenticated: false,
      user: null,
      currentPage: 'home',
      loading: false,
      error: null
    };

    this.elements = {
      layoutContainer: null,
      headerComponent: null,
      sidebarComponent: null,
      profileDropdown: null,
      notificationDropdown: null,
      mobileNotification: null,
      mobileOverlay: null,
      contentWrapper: null
    };

    this.components = {
      header: new HeaderComponent({
        onSidebarToggle: () => this.toggleSidebar(),
        onNotificationToggle: () => this.components.notification.open(),
        onProfileToggle: () => this.components.profile.open()
      }),
      sidebar: new SidebarComponent({
        onNavigation: (item) => this.loadPage(item.id),
        onCloseMobile: () => this.closeMobileSidebar()
      }),
      profile: new ProfileComponent({
        onLogin: () => this.handleLogin(),
        onLogout: () => this.handleLogout()
      }),
      notification: new NotificationComponent({
        onClose: () => this.components.notification.close()
      })
    };
  }

  /**
   * Initialize the application controller
   */
  public async init(): Promise<void> {
    this.cacheElements();
    this.setupEventListeners();
    await this.initializeComponents();
    this.renderInitialState();
  }

  /**
   * Cache DOM elements
   */
  private cacheElements(): void {
    this.elements.layoutContainer = document.querySelector('[data-layout-container]');
    this.elements.headerComponent = document.querySelector('[data-header-component]');
    this.elements.sidebarComponent = document.querySelector('[data-sidebar-component]');
    this.elements.profileDropdown = document.getElementById('profile-dropdown');
    this.elements.notificationDropdown = document.getElementById('notification-dropdown');
    this.elements.mobileNotification = document.getElementById('mobile-notification');
    this.elements.mobileOverlay = document.querySelector('[data-mobile-overlay]');
    this.elements.contentWrapper = document.querySelector('[data-content-wrapper]');
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Handle click outside for dropdowns
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    
    // Handle escape key for mobile overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.mobileSidebarOpen) {
        this.closeMobileSidebar();
      }
    });
  }

  /**
   * Handle login
   */
  private handleLogin(): void {
    console.log('Login requested');
    // TODO: Implement login logic
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    console.log('Logout requested');
    // TODO: Implement logout logic
  }

  /**
   * Initialize all components
   */
  private async initializeComponents(): Promise<void> {
    try {
      // Initialize header component
      if (this.elements.headerComponent) {
        this.components.header.init(this.elements.headerComponent);
      }

      // Initialize sidebar component
      if (this.elements.sidebarComponent) {
        this.components.sidebar.init();
      }

      // Initialize profile component
      if (this.elements.profileDropdown) {
        this.components.profile.init(this.elements.profileDropdown);
      }

      // Initialize notification component
      if (this.elements.notificationDropdown) {
        this.components.notification.init(this.elements.notificationDropdown);
      }

    } catch (error) {
      console.error('Failed to initialize components:', error);
      this.setError('Failed to initialize application');
    }
  }

  /**
   * Render initial state
   */
  private renderInitialState(): void {
    // Set initial sidebar state
    this.updateSidebarState();

    // Load initial page
    this.loadPage(this.state.currentPage);

    // Check authentication status
    this.checkAuthStatus();
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && !this.state.sidebarCollapsed) {
      this.state.sidebarCollapsed = true;
      this.updateSidebarState();
    }
  }

  /**
   * Handle document click for closing dropdowns
   */
  private handleDocumentClick(event: Event): void {
    const target = event.target as Element;
    
    // Close profile dropdown if clicking outside
    if (this.elements.profileDropdown && !target.closest('[data-profile-dropdown]') && !target.closest('[data-profile-trigger]')) {
      this.components.profile.close();
    }

    // Close notification dropdown if clicking outside
    if (this.elements.notificationDropdown && !target.closest('[data-notification-dropdown]') && !target.closest('[data-notification-trigger]')) {
      this.components.notification.close();
    }
  }

  /**
   * Update sidebar state
   */
  private updateSidebarState(): void {
    if (this.elements.layoutContainer) {
      if (this.state.sidebarCollapsed) {
        this.elements.layoutContainer.classList.add('sidebar-collapsed');
      } else {
        this.elements.layoutContainer.classList.remove('sidebar-collapsed');
      }
    }

    // Update sidebar component state
    this.components.sidebar.setCollapsed(this.state.sidebarCollapsed);
  }

  /**
   * Toggle sidebar
   */
  public toggleSidebar(): void {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    this.updateSidebarState();
  }

  /**
   * Open mobile sidebar
   */
  public openMobileSidebar(): void {
    this.state.mobileSidebarOpen = true;
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.classList.remove('hidden');
      this.elements.mobileOverlay.classList.add('show');
    }
    if (this.elements.layoutContainer) {
      this.elements.layoutContainer.classList.add('mobile-sidebar-open');
    }
  }

  /**
   * Close mobile sidebar
   */
  public closeMobileSidebar(): void {
    this.state.mobileSidebarOpen = false;
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.classList.remove('show');
      this.elements.mobileOverlay.classList.add('hidden');
    }
    if (this.elements.layoutContainer) {
      this.elements.layoutContainer.classList.remove('mobile-sidebar-open');
    }
  }

  /**
   * Check authentication status
   */
  private async checkAuthStatus(): Promise<void> {
    try {
      // This would typically make an API call to check auth status
      // For now, we'll simulate it
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const user = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;
      
      this.setAuthState(isAuthenticated, user);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      this.setAuthState(false, null);
    }
  }

  /**
   * Set authentication state
   */
  public setAuthState(isAuthenticated: boolean, user: any): void {
    this.state.isAuthenticated = isAuthenticated;
    this.state.user = user;
    
    // Update all components with auth state
    this.components.header.setAuthState(isAuthenticated, user);
    this.components.profile.setAuthState(isAuthenticated, user);
    
    if (user) {
      this.components.sidebar.setUserRole(user.role);
    }
    
    this.config.onAuthChange?.(isAuthenticated, user);
  }

  /**
   * Load a page
   */
  public async loadPage(page: string): Promise<void> {
    try {
      this.setLoading(true);
      this.state.currentPage = page;

      // This would typically load page content dynamically
      // For now, we'll show a simple page
      const pageContent = this.generatePageContent(page);
      
      if (this.elements.contentWrapper) {
        this.elements.contentWrapper.innerHTML = pageContent;
      }

      this.config.onPageChange?.(page);
    } catch (error) {
      console.error(`Failed to load page ${page}:`, error);
      this.setError(`Failed to load ${page} page`);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Generate page content
   */
  private generatePageContent(page: string): string {
    const pages: Record<string, string> = {
      home: `
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #3b82f6; font-size: 2rem; margin-bottom: 1rem;">Welcome to Freeducation! 🎓</h1>
          <p style="color: #6b7280; font-size: 1.1rem; margin-bottom: 2rem;">Your modular ed-tech platform is ready!</p>
          <div style="background: #f3f4f6; padding: 2rem; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827; margin-bottom: 1rem;">✅ Platform Status</h2>
            <ul style="text-align: left; color: #6b7280; line-height: 1.8;">
              <li>✅ Modular Architecture Implemented</li>
              <li>✅ Component-Based Structure</li>
              <li>✅ Database Connected</li>
              <li>✅ Admin Setup Complete</li>
              <li>✅ App Controller Active</li>
            </ul>
          </div>
        </div>
      `,
      dashboard: `
        <div style="padding: 2rem;">
          <h1 style="color: #3b82f6; margin-bottom: 1rem;">Dashboard</h1>
          <p style="color: #6b7280;">Welcome to your dashboard!</p>
        </div>
      `,
      subjects: `
        <div style="padding: 2rem;">
          <h1 style="color: #3b82f6; margin-bottom: 1rem;">Subjects</h1>
          <p style="color: #6b7280;">Manage your subjects here.</p>
        </div>
      `,
      profile: `
        <div style="padding: 2rem;">
          <h1 style="color: #3b82f6; margin-bottom: 1rem;">Profile</h1>
          <p style="color: #6b7280;">Manage your profile settings.</p>
        </div>
      `
    };

    return pages[page] || pages.home;
  }

  /**
   * Set current page
   */
  public setCurrentPage(page: string): void {
    this.state.currentPage = page;
    this.config.onPageChange?.(page);
  }

  /**
   * Set loading state
   */
  public setLoading(loading: boolean): void {
    this.state.loading = loading;
    
    if (this.elements.contentWrapper) {
      if (loading) {
        this.elements.contentWrapper.innerHTML = `
          <div class="page-loading">
            <div class="page-loading-spinner"></div>
          </div>
        `;
      }
    }
  }

  /**
   * Set error state
   */
  public setError(error: string | null): void {
    this.state.error = error;
    
    if (error && this.elements.contentWrapper) {
      this.elements.contentWrapper.innerHTML = `
        <div class="page-error">
          <div class="page-error-icon">⚠️</div>
          <h2 class="page-error-title">Error</h2>
          <p class="page-error-message">${error}</p>
        </div>
      `;
    }
  }

  /**
   * Get current state
   */
  public getState(): AppState {
    return { ...this.state };
  }

  /**
   * Destroy the application controller
   */
  public destroy(): void {
    // Clean up components (remove optional chaining for now)
    if (this.components.header.destroy) this.components.header.destroy();
    if (this.components.sidebar.destroy) this.components.sidebar.destroy();
    if (this.components.profile.destroy) this.components.profile.destroy();
    if (this.components.notification.destroy) this.components.notification.destroy();

    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }
}
