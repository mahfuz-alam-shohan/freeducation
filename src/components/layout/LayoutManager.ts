import { MobileHeader } from './header/mobile/Header';
import { TabletHeader } from './header/tablet/Header';
import { DesktopHeader } from './header/desktop/Header';
import { MobileSidebar } from './sidebar/mobile/Sidebar';
import { TabletSidebar } from './sidebar/tablet/Sidebar';
import { DesktopSidebar } from './sidebar/desktop/Sidebar';
import { MobileMainContent } from './main-content/mobile/MainContent';
import { TabletMainContent } from './main-content/tablet/MainContent';
import { DesktopMainContent } from './main-content/desktop/MainContent';
import { TabletFooter } from './footer/tablet/Footer';
import { DesktopFooter } from './footer/desktop/Footer';

export interface LayoutManagerProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'teacher' | 'writer' | 'publisher';
    avatar?: string;
  };
  currentPath?: string;
  children: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  showFooter?: boolean;
  footerType?: 'simple' | 'full';
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

  render(props: LayoutManagerProps): string {
    const { 
      user, 
      currentPath = '/', 
      children, 
      deviceType = 'desktop',
      showFooter = true,
      footerType = 'full'
    } = props;

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
        <title>Free Education - Bangladesh</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
        <script>
          // Device detection
          window.deviceType = '${deviceType}';
          window.isMobile = window.deviceType === 'mobile';
          window.isTablet = window.deviceType === 'tablet';
          window.isDesktop = window.deviceType === 'desktop';
        </script>
      </head>
      <body class="bg-gray-50 min-h-screen" x-data="{ 
        sidebarOpen: false, 
        userMenuOpen: false,
        deviceType: '${deviceType}'
      }">
        ${header.render({ user, onMenuToggle: () => {} })}
        
        <div class="flex h-screen pt-16">
          ${deviceType === 'mobile' ? 
            sidebar.render({ user, currentPath, isOpen: false }) :
            sidebar.render({ user, currentPath })
          }
          
          ${mainContent.render({ children, hasSidebar })}
        </div>
        
        ${showFooter && footer ? footer.render({ showFullFooter: footerType === 'full' }) : ''}
        
        ${this.renderScripts()}
      </body>
      </html>
    `;
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

  private renderScripts(): string {
    return `
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
              callback(deviceType);
            });
          }
        };

        // Initialize device detection
        document.addEventListener('DOMContentLoaded', () => {
          const updateDeviceClass = () => {
            const width = window.innerWidth;
            document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
            
            if (width < 768) {
              document.body.classList.add('device-mobile');
            } else if (width < 1024) {
              document.body.classList.add('device-tablet');
            } else {
              document.body.classList.add('device-desktop');
            }
          };
          
          updateDeviceClass();
          window.addEventListener('resize', updateDeviceClass);
        });
      </script>
    `;
  }
}
