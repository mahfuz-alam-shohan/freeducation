/**
 * ===================================
   HOME PAGE CONTROLLER
   ===================================
 */

import { HeaderComponent } from '../../components/common/header/header';
import { SidebarComponent } from '../../components/common/sidebar/sidebar';

export class HomePage {
  private header: HeaderComponent;
  private sidebar: SidebarComponent;
  private elements: {
    headerContainer: HTMLElement | null;
    sidebarContainer: HTMLElement | null;
    mainContent: HTMLElement | null;
    contentContainer: HTMLElement | null;
    mobileOverlay: HTMLElement | null;
  };

  constructor() {
    this.elements = {
      headerContainer: null,
      sidebarContainer: null,
      mainContent: null,
      contentContainer: null,
      mobileOverlay: null
    };
  }

  /**
   * Initialize the home page
   */
  async init(): Promise<void> {
    this.cacheElements();
    this.initializeComponents();
    this.bindEvents();
    await this.loadPageContent();
    console.log('Home page initialized');
  }

  /**
   * Cache DOM elements
   */
  private cacheElements(): void {
    this.elements.headerContainer = document.getElementById('header-container');
    this.elements.sidebarContainer = document.getElementById('sidebar-container');
    this.elements.mainContent = document.querySelector('[data-main-content]');
    this.elements.contentContainer = document.querySelector('.content-container');
    this.elements.mobileOverlay = document.querySelector('[data-mobile-overlay]');
  }

  /**
   * Initialize components
   */
  private initializeComponents(): void {
    // Initialize header component
    this.header = new HeaderComponent({
      onSidebarToggle: () => this.handleSidebarToggle(),
      onNotificationToggle: () => this.handleNotificationToggle(),
      onProfileToggle: () => this.handleProfileToggle()
    });

    // Initialize sidebar component
    this.sidebar = new SidebarComponent({
      onNavigation: (item) => this.handleNavigation(item),
      onCloseMobile: () => this.handleCloseMobile()
    });

    // Initialize components
    this.header.init();
    this.sidebar.init();
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
      });
    }
  }

  /**
   * Load page content based on auth state
   */
  private async loadPageContent(): Promise<void> {
    try {
      // Check if admin setup is needed
      const setupResponse = await fetch('/api/v1/admin/setup/check');
      const setupData = await setupResponse.json();
      
      if (setupData.needsSetup) {
        this.showAdminSetupPrompt();
        return;
      }
    } catch (error) {
      console.log('Could not check admin setup status');
    }

    // Load content based on authentication
    const isAuthenticated = await this.checkAuthState();
    
    if (isAuthenticated) {
      await this.loadAuthenticatedContent();
    } else {
      this.loadPublicContent();
    }
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
   * Load authenticated content
   */
  private async loadAuthenticatedContent(): Promise<void> {
    if (!this.elements.contentContainer) return;

    try {
      const userResponse = await fetch('/api/v1/auth/me');
      const user = await userResponse.json();
      
      this.elements.contentContainer.innerHTML = `
        <div class="authenticated-content">
          <div class="welcome-section">
            <h1 class="welcome-title">Welcome back, ${user.name}!</h1>
            <p class="welcome-subtitle">Ready to continue your learning journey?</p>
          </div>
          
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <h3>Your Progress</h3>
              <div class="stats">
                <div class="stat">
                  <span class="stat-number">--</span>
                  <span class="stat-label">Courses</span>
                </div>
                <div class="stat">
                  <span class="stat-number">--</span>
                  <span class="stat-label">Completed</span>
                </div>
                <div class="stat">
                  <span class="stat-number">--</span>
                  <span class="stat-label">Achievements</span>
                </div>
              </div>
            </div>
            
            <div class="dashboard-card">
              <h3>Quick Actions</h3>
              <div class="action-buttons">
                <button class="btn btn-primary">Browse Subjects</button>
                <button class="btn btn-ghost">Take Exam</button>
                <button class="btn btn-ghost">Join Challenge</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Update header with user info
      this.header.setAuthState(true, user);
      
      // Update sidebar with user role
      this.sidebar.setUserRole(user.role);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      this.loadPublicContent();
    }
  }

  /**
   * Load public content
   */
  private loadPublicContent(): void {
    if (!this.elements.contentContainer) return;

    this.elements.contentContainer.innerHTML = `
      <div class="public-content">
        <div class="hero-section">
          <h1 class="hero-title">Welcome to Freeducation</h1>
          <p class="hero-subtitle">A comprehensive educational platform where teachers and students come together to learn, share, and grow.</p>
          <div class="cta-buttons">
            <button class="btn btn-primary btn-lg">Get Started</button>
            <button class="btn btn-ghost btn-lg">Learn More</button>
          </div>
        </div>
        
        <div class="features-section">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Rich Content</h3>
              <p>Access comprehensive learning materials across academic and non-academic subjects.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>Community</h3>
              <p>Join discussions, ask questions, and collaborate with learners worldwide.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>Assessments</h3>
              <p>Test your knowledge with exams and track your progress over time.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Challenges</h3>
              <p>Participate in problem-solving challenges and see how you rank globally.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Update header for logged out state
    this.header.setAuthState(false);
    
    // Update sidebar for student role (default)
    this.sidebar.setUserRole('student');
  }

  /**
   * Show admin setup prompt
   */
  private showAdminSetupPrompt(): void {
    if (!this.elements.contentContainer) return;

    this.elements.contentContainer.innerHTML = `
      <div class="admin-setup-prompt">
        <div class="setup-card">
          <div class="setup-icon">⚙️</div>
          <h2>Welcome to Freeducation!</h2>
          <p>This appears to be a new installation. Let's set up your administrator account to get started.</p>
          <button class="btn btn-primary" onclick="window.location.href='/setup'">
            Set Up Admin Account
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Handle sidebar toggle
   */
  private handleSidebarToggle(): void {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      const currentState = this.sidebar.getState().mobileOpen;
      this.sidebar.setMobileOpen(!currentState);
    } else {
      const currentState = this.sidebar.getState().collapsed;
      this.sidebar.setCollapsed(!currentState);
    }
    
    this.updateMainContentMargin();
  }

  /**
   * Handle notification toggle
   */
  private handleNotificationToggle(): void {
    // Toggle notification dropdown/panel
    console.log('Toggle notifications');
  }

  /**
   * Handle profile toggle
   */
  private handleProfileToggle(): void {
    // Toggle profile dropdown
    console.log('Toggle profile');
  }

  /**
   * Handle navigation
   */
  private handleNavigation(item: any): void {
    console.log('Navigate to:', item.href);
    // Handle navigation logic here
  }

  /**
   * Handle close mobile
   */
  private handleCloseMobile(): void {
    this.sidebar.setMobileOpen(false);
    this.hideMobileOverlay();
  }

  /**
   * Close mobile sidebar
   */
  private closeMobileSidebar(): void {
    this.sidebar.setMobileOpen(false);
    this.hideMobileOverlay();
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
    if (!this.elements.mainContent) return;

    const sidebarState = this.sidebar.getState();
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.elements.mainContent.style.marginLeft = '0';
    } else {
      this.elements.mainContent.style.marginLeft = sidebarState.collapsed 
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
   * Destroy the page
   */
  destroy(): void {
    if (this.header) this.header.destroy();
    if (this.sidebar) this.sidebar.destroy();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    if (this.elements.mobileOverlay) {
      this.elements.mobileOverlay.removeEventListener('click', this.handleCloseMobile.bind(this));
    }
  }
}
