/**
 * ===================================
   LAYOUT CONTROLLER COMPONENT
   ===================================
 */

import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';
import { ProfileComponent } from '../profile/profile';
import { NotificationComponent } from '../notification/notification';

interface LayoutState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  isAuthenticated: boolean;
  user: any;
  currentPage: string;
  loading: boolean;
  error: string | null;
}

interface LayoutConfig {
  onPageChange: (page: string) => void;
  onAuthChange: (isAuthenticated: boolean, user: any) => void;
}

export class LayoutController {
  private state: LayoutState;
  private config: LayoutConfig;
  private components: {
    header: HeaderComponent;
    sidebar: SidebarComponent;
    profile: ProfileComponent;
    notification: NotificationComponent;
  };
  private elements: {
    layoutContainer: HTMLElement | null;
    headerComponent: HTMLElement | null;
    sidebarComponent: HTMLElement | null;
    contentWrapper: HTMLElement | null;
    mobileOverlay: HTMLElement | null;
    profileDropdown: HTMLElement | null;
    notificationDropdown: HTMLElement | null;
    mobileNotification: HTMLElement | null;
  };

  constructor(config: LayoutConfig) {
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
      contentWrapper: null,
      mobileOverlay: null,
      profileDropdown: null,
      notificationDropdown: null,
      mobileNotification: null
    };

    this.components = {
      header: new HeaderComponent({
        onSidebarToggle: () => this.handleSidebarToggle(),
        onNotificationToggle: () => this.handleNotificationToggle(),
        onProfileToggle: () => this.handleProfileToggle()
      }),
      sidebar: new SidebarComponent({
        onNavigation: (item) => this.handleNavigation(item),
        onCloseMobile: () => this.handleCloseMobile()
      }),
      profile: new ProfileComponent({
        onLogin: () => this.handleLogin(),
        onLogout: () => this.handleLogout()
      }),
      notification: new NotificationComponent({
        onClose: () => this.handleCloseNotifications()
      })
    };
  }

  /**
   * Initialize the layout controller
   */
  async init(): Promise<void> {
    this.cacheElements();
    this.initializeComponents();
    this.bindEvents();
    await this.loadInitialState();
    console.log('Layout controller initialized');
  }

  /**
   * Cache DOM elements
   */
  private cacheElements(): void {
    this.elements.layoutContainer = document.querySelector('[data-layout-container]');
    this.elements.headerComponent = document.querySelector('[data-header-component]');
    this.elements.sidebarComponent = document.querySelector('[data-sidebar-component]');
    this.elements.contentWrapper = document.querySelector('[data-content-wrapper]');
    this.elements.mobileOverlay = document.querySelector('[data-mobile-overlay]');
    this.elements.profileDropdown = document.querySelector('[data-profile-dropdown]');
    this.elements.notificationDropdown = document.querySelector('[data-notification-dropdown]');
    this.elements.mobileNotification = document.querySelector('[data-mobile-notification]');
  }

  /**
   * Initialize all components
   */
  private initializeComponents(): void {
    // Initialize header
    this.components.header.init();
    
    // Initialize sidebar
    this.components.sidebar.init();
    
    // Initialize profile
    this.components.profile.init();
    
    // Initialize notification
    this.components.notification.init();
  }

  /**
   * Bind global events
   */
  private bindEvents(): void {
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Handle mobile overlay click
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.addEventListener('click', () => {
        this.closeMobileSidebar();
        this.closeNotifications();
      });
    }

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileSidebar();
        this.closeNotifications();
      }
    });
  }

  /**
   * Load initial state
   */
  private async loadInitialState(): Promise<void> {
    this.setLoading(true);
    
    try {
      // Check if admin setup is needed
      const setupResponse = await fetch('/api/v1/admin/setup/check');
      const setupData = await setupResponse.json();
      
      if (setupData.needsSetup) {
        this.loadPage('setup');
        return;
      }
    } catch (error) {
      console.log('Could not check admin setup status');
    }

    // Check authentication state
    const isAuthenticated = await this.checkAuthState();
    
    if (isAuthenticated) {
      await this.loadUserData();
    } else {
      this.setAuthState(false, null);
    }

    // Load initial page
    this.loadPage('home');
  }

  /**
   * Check authentication state
   */
  private async checkAuthState(): Promise<boolean> {
    try {
      const response = await fetch('/api/v1/auth/me');
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Load user data
   */
  private async loadUserData(): Promise<void> {
    try {
      const response = await fetch('/api/v1/auth/me');
      const user = await response.json();
      this.setAuthState(true, user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      this.setAuthState(false, null);
    }
  }

  /**
   * Load a page
   */
  private async loadPage(pageName: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // Dynamic import of page module
      const pageModule = await import(`/pages/${pageName}/${pageName}.js`);
      const PageClass = pageModule[`${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page`];
      
      if (PageClass) {
        const page = new PageClass({
          layout: this,
          user: this.state.user,
          isAuthenticated: this.state.isAuthenticated
        });
        
        await page.init();
        this.setCurrentPage(pageName);
      } else {
        throw new Error(`Page class not found: ${pageName}`);
      }
    } catch (error) {
      console.error(`Failed to load page ${pageName}:`, error);
      this.setError(`Failed to load page: ${pageName}`);
      this.showPageError();
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Show page error
   */
  private showPageError(): void {
    if (!this.elements.contentWrapper) return;
    
    this.elements.contentWrapper.innerHTML = `
      <div class="page-error">
        <div class="page-error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="page-error-title">Page Not Found</h2>
        <p class="page-error-message">${this.state.error || 'An error occurred while loading the page.'}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  }

  /**
   * Handle sidebar toggle
   */
  private handleSidebarToggle(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      this.state.mobileSidebarOpen = !this.state.mobileSidebarOpen;
      this.components.sidebar.setMobileOpen(this.state.mobileSidebarOpen);
    } else {
      this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
      this.components.sidebar.setCollapsed(this.state.sidebarCollapsed);
    }
    
    this.updateMainContentMargin();
  }

  /**
   * Handle notification toggle
   */
  private handleNotificationToggle(): void {
    this.components.notification.open();
  }

  /**
   * Handle profile toggle
   */
  private handleProfileToggle(): void {
    this.components.profile.open();
  }

  /**
   * Handle navigation
   */
  private handleNavigation(item: any): void {
    console.log('Navigate to:', item.href);
    this.loadPage(item.id.replace('-', ''));
  }

  /**
   * Handle close mobile
   */
  private handleCloseMobile(): void {
    this.closeMobileSidebar();
  }

  /**
   * Handle login
   */
  private handleLogin(): void {
    console.log('Login requested');
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    this.setAuthState(false, null);
    this.config.onAuthChange(false, null);
    this.loadPage('home');
  }

  /**
   * Handle close notifications
   */
  private handleCloseNotifications(): void {
    this.components.notification.close();
  }

  /**
   * Close mobile sidebar
   */
  private closeMobileSidebar(): void {
    this.state.mobileSidebarOpen = false;
    this.components.sidebar.setMobileOpen(false);
    this.hideMobileOverlay();
  }

  /**
   * Close notifications
   */
  private closeNotifications(): void {
    this.components.notification.close();
  }

  /**
   * Show mobile overlay
   */
  private showMobileOverlay(): void {
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.classList.add('show');
    }
  }

  /**
   * Hide mobile overlay
   */
  private hideMobileOverlay(): void {
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.classList.remove('show');
    }
  }

  /**
   * Update main content margin based on sidebar state
   */
  private updateMainContentMargin(): void {
    if (!this.elements.contentWrapper) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.elements.contentWrapper.parentElement!.style.marginLeft = '0';
    } else {
      this.elements.contentWrapper.parentElement!.style.marginLeft = this.state.sidebarCollapsed 
        ? 'var(--sidebar-width-collapsed, 64px)' 
        : 'var(--sidebar-width-expanded, 256px)';
    }
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    this.updateMainContentMargin();
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
    
    this.config.onAuthChange(isAuthenticated, user);
  }

  /**
   * Set current page
   */
  public setCurrentPage(page: string): void {
    this.state.currentPage = page;
    this.config.onPageChange(page);
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
  }

  /**
   * Get content wrapper
   */
  public getContentWrapper(): HTMLElement | null {
    return this.elements.contentWrapper;
  }

  /**
   * Get current state
   */
  public getState(): LayoutState {
    return { ...this.state };
  }

  /**
   * Destroy the layout controller
   */
  public destroy(): void {
    // Destroy all components
    this.components.header.destroy();
    this.components.sidebar.destroy();
    this.components.profile.destroy();
    this.components.notification.destroy();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.removeEventListener('click', this.handleCloseMobile.bind(this));
    }
  }
}
