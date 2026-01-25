/**
 * ===================================
   HEADER COMPONENT CONTROLLER
   ===================================
 */

interface HeaderState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  notificationCount: number;
  isAuthenticated: boolean;
  user: any;
}

interface HeaderConfig {
  onSidebarToggle: () => void;
  onNotificationToggle: () => void;
  onProfileToggle: () => void;
}

export class HeaderComponent {
  private state: HeaderState;
  private config: HeaderConfig;
  private elements: {
    header: HTMLElement | null;
    sidebarToggle: HTMLElement | null;
    menuToggle: HTMLElement | null;
    notificationToggle: HTMLElement | null;
    profileToggle: HTMLElement | null;
    notificationCount: HTMLElement | null;
    userAvatar: HTMLElement | null;
    defaultAvatar: HTMLElement | null;
  };

  constructor(config: HeaderConfig) {
    this.config = config;
    this.state = {
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      notificationCount: 0,
      isAuthenticated: false,
      user: null
    };
    
    this.elements = {
      header: null,
      sidebarToggle: null,
      menuToggle: null,
      notificationToggle: null,
      profileToggle: null,
      notificationCount: null,
      userAvatar: null,
      defaultAvatar: null
    };
  }

  /**
   * Initialize the header component
   */
  init(): void {
    this.cacheElements();
    this.bindEvents();
    this.updateUI();
    console.log('Header component initialized');
  }

  /**
   * Cache DOM elements
   */
  private cacheElements(): void {
    this.elements.header = document.querySelector('[data-header]');
    this.elements.sidebarToggle = document.querySelector('[data-sidebar-toggle]');
    this.elements.menuToggle = document.querySelector('[data-menu-toggle]');
    this.elements.notificationToggle = document.querySelector('[data-notification-toggle]');
    this.elements.profileToggle = document.querySelector('[data-profile-toggle]');
    this.elements.notificationCount = document.querySelector('[data-notification-count]');
    this.elements.userAvatar = document.querySelector('[data-user-avatar]');
    this.elements.defaultAvatar = document.querySelector('[data-default-avatar]');
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    // Sidebar toggle (desktop)
    if (this.elements.sidebarToggle) {
      this.elements.sidebarToggle.addEventListener('click', () => {
        this.config.onSidebarToggle();
      });
    }

    // Menu toggle (mobile)
    if (this.elements.menuToggle) {
      this.elements.menuToggle.addEventListener('click', () => {
        this.config.onSidebarToggle();
      });
    }

    // Notification toggle
    if (this.elements.notificationToggle) {
      this.elements.notificationToggle.addEventListener('click', () => {
        this.config.onNotificationToggle();
      });
    }

    // Profile toggle
    if (this.elements.profileToggle) {
      this.elements.profileToggle.addEventListener('click', () => {
        this.config.onProfileToggle();
      });
    }
  }

  /**
   * Update UI based on current state
   */
  private updateUI(): void {
    this.updateNotificationBadge();
    this.updateProfileDisplay();
    this.updateResponsiveElements();
  }

  /**
   * Update notification badge
   */
  private updateNotificationBadge(): void {
    if (this.elements.notificationCount) {
      if (this.state.notificationCount > 0) {
        this.elements.notificationCount.textContent = 
          this.state.notificationCount > 99 ? '99+' : this.state.notificationCount.toString();
        this.elements.notificationCount.classList.remove('hidden');
      } else {
        this.elements.notificationCount.classList.add('hidden');
      }
    }
  }

  /**
   * Update profile display based on auth state
   */
  private updateProfileDisplay(): void {
    if (this.state.isAuthenticated && this.state.user) {
      // Show logged in view
      if (this.elements.userAvatar) {
        this.elements.userAvatar.classList.remove('hidden');
        const img = this.elements.userAvatar.querySelector('img');
        if (img) {
          img.src = this.state.user.profile_picture_url || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(this.state.user.name)}&background=random`;
        }
      }
      
      if (this.elements.defaultAvatar) {
        this.elements.defaultAvatar.classList.add('hidden');
      }
    } else {
      // Show logged out view
      if (this.elements.userAvatar) {
        this.elements.userAvatar.classList.add('hidden');
      }
      
      if (this.elements.defaultAvatar) {
        this.elements.defaultAvatar.classList.remove('hidden');
      }
    }
  }

  /**
   * Update responsive elements based on viewport
   */
  private updateResponsiveElements(): void {
    const isMobile = window.innerWidth < 768;
    
    // Update visibility of responsive elements
    const desktopElements = document.querySelectorAll('.desktop-hidden');
    const mobileElements = document.querySelectorAll('.mobile-hidden');
    
    desktopElements.forEach(el => {
      if (isMobile) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
    });
    
    mobileElements.forEach(el => {
      if (isMobile) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  /**
   * Set sidebar state
   */
  setSidebarState(collapsed: boolean): void {
    this.state.sidebarCollapsed = collapsed;
  }

  /**
   * Set mobile sidebar state
   */
  setMobileSidebarState(open: boolean): void {
    this.state.mobileSidebarOpen = open;
  }

  /**
   * Set notification count
   */
  setNotificationCount(count: number): void {
    this.state.notificationCount = count;
    this.updateNotificationBadge();
  }

  /**
   * Set authentication state
   */
  setAuthState(isAuthenticated: boolean, user: any = null): void {
    this.state.isAuthenticated = isAuthenticated;
    this.state.user = user;
    this.updateProfileDisplay();
  }

  /**
   * Get current state
   */
  getState(): HeaderState {
    return { ...this.state };
  }

  /**
   * Destroy the component
   */
  destroy(): void {
    // Remove event listeners
    if (this.elements.sidebarToggle) {
      this.elements.sidebarToggle.removeEventListener('click', () => {});
    }
    
    if (this.elements.menuToggle) {
      this.elements.menuToggle.removeEventListener('click', () => {});
    }
    
    if (this.elements.notificationToggle) {
      this.elements.notificationToggle.removeEventListener('click', () => {});
    }
    
    if (this.elements.profileToggle) {
      this.elements.profileToggle.removeEventListener('click', () => {});
    }
    
    // Clear references
    this.elements = {
      header: null,
      sidebarToggle: null,
      menuToggle: null,
      notificationToggle: null,
      profileToggle: null,
      notificationCount: null,
      userAvatar: null,
      defaultAvatar: null
    };
  }
}
