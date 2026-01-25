/**
 * ===================================
   FRONTEND RENDERER
   ===================================
 */

interface FrontendRendererConfig {
  env: any;
}

export class FrontendRenderer {
  private env: any;

  constructor(config: FrontendRendererConfig) {
    this.env = config.env;
  }

  /**
   * Handle frontend requests
   */
  async handleRequest(path: string): Promise<Response> {
    // For now, just serve the main app
    // In a real app, you'd check if admin setup is needed here
    return this.serveMainApp();
  }

  /**
   * Serve the main application page
   */
  private serveMainApp(): Response {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation</title>
    <style>
/* ===================================
   LAYOUT CONTROLLER STYLES
   =================================== */

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background, #ffffff);
  position: relative;
}

.main-content {
  margin-top: var(--header-height, 64px);
  margin-left: var(--sidebar-width-expanded, 256px);
  min-height: calc(100vh - var(--header-height, 64px));
  transition: var(--sidebar-transition, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  position: relative;
}

.main-content.sidebar-collapsed {
  margin-left: var(--sidebar-width-collapsed, 64px);
}

.content-wrapper {
  padding: var(--spacing-6, 1.5rem);
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

/* ===================================
   RESPONSIVE BEHAVIOR
   =================================== */

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: var(--spacing-4, 1rem);
  }
}

/* ===================================
   MOBILE OVERLAY
   =================================== */

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop, 1040);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* ===================================
   DROPDOWN POSITIONING
   =================================== */

#profile-dropdown,
#notification-dropdown {
  position: fixed;
  top: var(--header-height, 64px);
  right: 0;
  z-index: var(--z-dropdown, 1000);
}

#mobile-notification {
  position: fixed;
  top: var(--header-height, 64px);
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-background, #ffffff);
  border-left: 1px solid var(--color-border, #e5e7eb);
  z-index: var(--z-modal, 1050);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#mobile-notification.open {
  transform: translateX(0);
}

/* ===================================
   LOADING STATES
   =================================== */

.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.page-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border, #e5e7eb);
  border-top: 3px solid var(--color-primary, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-4, 1rem);
  text-align: center;
}

.page-error-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-4, 1rem);
  color: var(--color-error, #ef4444);
}

.page-error-title {
  font-size: var(--text-xl, 1.25rem);
  font-weight: 600;
  color: var(--color-text-primary, #111827);
  margin-bottom: var(--spacing-2, 0.5rem);
}

.page-error-message {
  font-size: var(--text-base, 1rem);
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: var(--spacing-4, 1rem);
}

/* ===================================
   CSS CUSTOM PROPERTIES
   =================================== */

:root {
  --header-height: 64px;
  --sidebar-width-expanded: 256px;
  --sidebar-width-collapsed: 64px;
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --z-modal-backdrop: 1040;
  --z-dropdown: 1000;
  --z-modal: 1050;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --text-base: 1rem;
  --text-xl: 1.25rem;
  
  /* Colors */
  --color-background: #ffffff;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-primary: #3b82f6;
  --color-error: #ef4444;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-border: #334155;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: #cbd5e1;
    --color-error: #ef4444;
  }
}
    </style>
</head>
<body>
    <!-- ===================================
         LAYOUT CONTAINER
         =================================== -->
    <div class="layout-container" data-layout-container>
        
        <!-- Header Component -->
        <div id="header-component" data-header-component></div>
        
        <!-- Sidebar Component -->
        <div id="sidebar-component" data-sidebar-component></div>
        
        <!-- Main Content Area -->
        <main class="main-content" data-main-content>
            <div class="content-wrapper" data-content-wrapper>
                <!-- Page content will be dynamically loaded here -->
            </div>
        </main>
        
        <!-- Mobile Overlay -->
        <div class="mobile-overlay hidden" data-mobile-overlay></div>
        
        <!-- Dropdown Containers -->
        <div id="profile-dropdown" data-profile-dropdown></div>
        <div id="notification-dropdown" data-notification-dropdown></div>
        <div id="mobile-notification" data-mobile-notification></div>
    </div>
    
    <!-- ===================================
         APP CONTROLLER SCRIPT
         =================================== -->
    <script type="module">
        import { AppController } from '/core/AppController.js';
        
        // Initialize the app controller
        const appController = new AppController({
            onPageChange: (page) => {
                console.log('Page changed to:', page);
            },
            onAuthChange: (isAuthenticated, user) => {
                console.log('Auth state changed:', { isAuthenticated, user });
            }
        });
        
        appController.init();
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}
