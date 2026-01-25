/**
 * ===================================
   SIDEBAR COMPONENT CONTROLLER
   ===================================
 */

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles: string[];
}

export class SidebarComponent {
  private state = {
    collapsed: false,
    mobileOpen: false,
    activeItem: 'dashboard',
    userRole: 'student'
  };

  constructor(private config: { onNavigation: (item: MenuItem) => void; onCloseMobile: () => void }) {}

  init(): void {
    this.cacheElements();
    this.bindEvents();
    this.updateUI();
  }

  destroy(): void {
    // Clean up event listeners
    console.log('Sidebar component destroyed');
  }

  setCollapsed(collapsed: boolean): void {
    this.state.collapsed = collapsed;
    this.updateUI();
  }

  setUserRole(role: string): void {
    this.state.userRole = role;
    this.updateUI();
  }

  private cacheElements(): void {
    // Cache DOM elements
    const navItems = document.querySelectorAll('[data-nav-item]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const menuItem: MenuItem = {
          id: item.getAttribute('data-nav-item') || 'unknown',
          label: item.textContent || 'Unknown',
          icon: '📄',
          href: item.getAttribute('href') || '#',
          roles: ['student', 'admin']
        };
        this.config.onNavigation(menuItem);
      });
    });
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.mobileOpen) {
        this.closeMobile();
      }
    });
  }

  private updateUI(): void {
    // Update active item
    const navItems = document.querySelectorAll('[data-nav-item]');
    navItems.forEach(item => {
      const itemId = item.getAttribute('data-nav-item');
      if (itemId === this.state.activeItem) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  private handleResize(): void {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !this.state.collapsed) {
      this.state.collapsed = true;
      this.updateUI();
    }
  }

  private closeMobile(): void {
    this.state.mobileOpen = false;
    this.config.onCloseMobile();
  }

  public setCollapsed(collapsed: boolean): void {
    this.state.collapsed = collapsed;
    this.updateUI();
  }

  public setMobileOpen(open: boolean): void {
    this.state.mobileOpen = open;
    this.updateUI();
  }

  public setUserRole(role: string): void {
    this.state.userRole = role;
    this.renderMenuItems();
  }

  public setActiveItem(itemId: string): void {
    this.state.activeItem = itemId;
    this.renderMenuItems();
  }

  private renderMenuItems(): void {
    const menuItems = this.getMenuItemsForRole(this.state.userRole);
    // Render menu items to DOM
  }

  private getMenuItemsForRole(role: string): MenuItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        href: '/dashboard',
        roles: ['admin', 'teacher', 'student']
      },
      {
        id: 'subjects',
        label: 'Subjects',
        icon: 'book',
        href: '/subjects',
        roles: ['admin', 'teacher', 'student']
      }
    ];
  }

  private handleResize(): void {
    this.updateUI();
  }

  public setCollapsed(collapsed: boolean): void {
    this.state.collapsed = collapsed;
    this.updateUI();
  }

  public setMobileOpen(open: boolean): void {
    this.state.mobileOpen = open;
    this.updateUI();
  }

  public setUserRole(role: string): void {
    this.state.userRole = role;
    this.renderMenuItems();
  }

  public setActiveItem(itemId: string): void {
    this.state.activeItem = itemId;
    this.renderMenuItems();
  }

  private closeMobile(): void {
    this.state.mobileOpen = false;
    this.config.onCloseMobile();
  }
}
