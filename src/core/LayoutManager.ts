import { MobileHeader } from '../components/layout/header/mobile/Header';
import { TabletHeader } from '../components/layout/header/tablet/Header';
import { DesktopHeader } from '../components/layout/header/desktop/Header';
import { MobileSidebar } from '../components/layout/sidebar/mobile/Sidebar';
import { TabletSidebar } from '../components/layout/sidebar/tablet/Sidebar';
import { DesktopSidebar } from '../components/layout/sidebar/desktop/Sidebar';
import { MobileMainContent } from '../components/layout/main-content/mobile/MainContent';
import { TabletMainContent } from '../components/layout/main-content/tablet/MainContent';
import { DesktopMainContent } from '../components/layout/main-content/desktop/MainContent';
import { TabletFooter } from '../components/layout/footer/tablet/Footer';
import { DesktopFooter } from '../components/layout/footer/desktop/Footer';

export interface LayoutData {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
  currentPath?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  showFooter?: boolean;
  footerType?: 'simple' | 'full';
  menuItems?: any[];
  notifications?: any[];
}

export class LayoutManager {
  private mobileHeader = new MobileHeader();
  private tabletHeader = new TabletHeader();
  private desktopHeader = new DesktopHeader();
  private mobileSidebar = new MobileSidebar();
  private tabletSidebar = new TabletSidebar();
  private desktopSidebar = new DesktopSidebar();
  private mobileMainContent = new MobileMainContent();
  private tabletMainContent = new TabletMainContent();
  private desktopMainContent = new DesktopMainContent();
  private tabletFooter = new TabletFooter();
  private desktopFooter = new DesktopFooter();

  async getLayoutData(request: Request, env: any, user: any): Promise<LayoutData> {
    const deviceType = this.detectDeviceType(request.headers.get('user-agent') || '');
    const currentPath = new URL(request.url).pathname;

    // Fetch layout-specific data
    const menuItems = await this.getMenuItems(user?.role, env);
    const notifications = await this.getNotifications(user?.id, env);

    return {
      user,
      currentPath,
      deviceType,
      showFooter: true,
      footerType: 'full',
      menuItems,
      notifications
    };
  }

  render(layoutData: LayoutData, pageContent: string, pageData: any): string {
    const { 
      user, 
      currentPath = '/', 
      deviceType = 'desktop',
      showFooter = true,
      footerType = 'full',
      menuItems = [],
      notifications = []
    } = layoutData;

    // Get device-specific components
    const header = this.getHeader(deviceType);
    const sidebar = this.getSidebar(deviceType);
    const mainContent = this.getMainContent(deviceType);
    const footer = this.getFooter(deviceType, footerType);

    // Determine if sidebar should be shown
    const hasSidebar = user && deviceType !== 'mobile';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageData.title || 'Free Education - Bangladesh'}</title>
        <meta name="description" content="${pageData.description || 'Access quality NCTB curriculum content for Classes 6-12'}">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
        ${pageData.styles ? `<style>${pageData.styles.join('\n')}</style>` : ''}
        <script>
          // Device detection
          window.deviceType = '${deviceType}';
          window.isMobile = window.deviceType === 'mobile';
          window.isTablet = window.deviceType === 'tablet';
          window.isDesktop = window.deviceType === 'desktop';
          
          // Page data
          window.pageData = ${JSON.stringify(pageData.metadata || {})};
          window.layoutData = ${JSON.stringify({ user, currentPath, deviceType, menuItems, notifications })};
        </script>
      </head>
      <body class="bg-gray-50 min-h-screen" x-data="{ 
        sidebarOpen: false,
        userMenuOpen: false,
        notificationsOpen: false,
        deviceType: '${deviceType}'
      }">
        ${header.render({ user, onMenuToggle: () => {}, menuItems, notifications })}
        
        <div class="flex h-screen pt-16">
          ${deviceType === 'mobile' ? 
            sidebar.render({ user, currentPath, isOpen: false, menuItems }) :
            sidebar.render({ user, currentPath, menuItems })
          }
          
          ${mainContent.render({ children: pageContent, hasSidebar })}
        </div>
        
        ${showFooter && footer ? footer.render({ showFullFooter: footerType === 'full' }) : ''}
        
        ${this.renderScripts(pageData.scripts)}
      </body>
      </html>
    `;
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private getHeader(deviceType: string) {
    switch (deviceType) {
      case 'mobile':
        return this.mobileHeader;
      case 'tablet':
        return this.tabletHeader;
      case 'desktop':
      default:
        return this.desktopHeader;
    }
  }

  private getSidebar(deviceType: string) {
    switch (deviceType) {
      case 'mobile':
        return this.mobileSidebar;
      case 'tablet':
        return this.tabletSidebar;
      case 'desktop':
      default:
        return this.desktopSidebar;
    }
  }

  private getMainContent(deviceType: string) {
    switch (deviceType) {
      case 'mobile':
        return this.mobileMainContent;
      case 'tablet':
        return this.tabletMainContent;
      case 'desktop':
      default:
        return this.desktopMainContent;
    }
  }

  private getFooter(deviceType: string, footerType: string) {
    switch (deviceType) {
      case 'mobile':
        return null; // No footer for mobile (no bottom navigation)
      case 'tablet':
        return this.tabletFooter;
      case 'desktop':
      default:
        return this.desktopFooter;
    }
  }

  private async getMenuItems(userRole: string, env: any): Promise<any[]> {
    if (!userRole) return [];

    // Fetch menu items from API or database
    try {
      const response = await fetch(`${env?.API_URL || ''}/api/menu?role=${userRole}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      // Fallback menu items
      return this.getDefaultMenuItems(userRole);
    }
  }

  private async getNotifications(userId: string, env: any): Promise<any[]> {
    if (!userId) return [];

    // Fetch notifications from API or database
    try {
      const response = await fetch(`${env?.API_URL || ''}/api/notifications?user_id=${userId}`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      // Return empty notifications on error
      return [];
    }
  }

  private getDefaultMenuItems(role: string): any[] {
    const baseItems = [
      { id: 'home', label: 'Home', icon: 'fas fa-home', href: '/' },
      { id: 'subjects', label: 'Subjects', icon: 'fas fa-book', href: '/subjects' },
      { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar', href: '/schedule' },
      { id: 'progress', label: 'Progress', icon: 'fas fa-chart-line', href: '/progress' }
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'users', label: 'Users', icon: 'fas fa-users', href: '/admin/users' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog', href: '/admin/settings' },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar', href: '/admin/analytics' }
      ],
      teacher: [
        { id: 'classes', label: 'My Classes', icon: 'fas fa-chalkboard', href: '/teacher/classes' },
        { id: 'assignments', label: 'Assignments', icon: 'fas fa-tasks', href: '/teacher/assignments' },
        { id: 'students', label: 'Students', icon: 'fas fa-graduation-cap', href: '/teacher/students' }
      ],
      student: [
        { id: 'materials', label: 'Study Materials', icon: 'fas fa-book-open', href: '/student/materials' },
        { id: 'assignments', label: 'Assignments', icon: 'fas fa-clipboard-list', href: '/student/assignments' },
        { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy', href: '/student/achievements' }
      ],
      writer: [
        { id: 'content', label: 'My Content', icon: 'fas fa-pen', href: '/writer/content' },
        { id: 'drafts', label: 'Drafts', icon: 'fas fa-folder', href: '/writer/drafts' },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-pie', href: '/writer/analytics' }
      ],
      publisher: [
        { id: 'publications', label: 'Publications', icon: 'fas fa-book', href: '/publisher/publications' },
        { id: 'revenue', label: 'Revenue', icon: 'fas fa-dollar-sign', href: '/publisher/revenue' },
        { id: 'authors', label: 'Authors', icon: 'fas fa-users', href: '/publisher/authors' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
  }

  private renderScripts(scripts?: string[]): string {
    const defaultScripts = `
      <script>
        // Global app state and utilities
        window.App = {
          api: async (endpoint, options = {}) => {
            const response = await fetch(endpoint, {
              headers: {
                'Content-Type': 'application/json',
                ...options.headers
              },
              ...options
            });
            return response.json();
          },
          
          showToast: (message, type = 'info') => {
            // Toast notification implementation
            console.log('Toast:', message, type);
          },
          
          // Device detection utilities
          isMobile: () => window.innerWidth < 768,
          isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
          isDesktop: () => window.innerWidth >= 1024,
          
          // Responsive utilities
          onDeviceChange: (callback) => {
            window.addEventListener('resize', () => {
              const width = window.innerWidth;
              let deviceType = 'desktop';
              if (width < 768) deviceType = 'mobile';
              else if (width < 1024) deviceType = 'tablet';
              
              if (deviceType !== window.deviceType) {
                window.deviceType = deviceType;
                callback(deviceType);
              }
            });
          },
          
          // Navigation utilities
          navigate: (path) => {
            window.location.href = path;
          },
          
          // Auth utilities
          logout: async () => {
            try {
              await App.api('/api/auth/logout', { method: 'POST' });
              App.navigate('/login');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        };
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', () => {
          console.log('Free Education Platform initialized');
          console.log('Device type:', window.deviceType);
          console.log('Page data:', window.pageData);
        });
      </script>
    `;

    const customScripts = scripts ? scripts.join('\n') : '';
    
    return defaultScripts + customScripts;
  }
}
