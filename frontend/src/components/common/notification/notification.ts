/**
 * ===================================
   NOTIFICATION COMPONENT CONTROLLER
   ===================================
 */

export class NotificationComponent {
  private state = {
    isOpen: false,
    notifications: [],
    unreadCount: 0
  };

  constructor(private config: { onClose: () => void }) {}

  init(): void {
    this.cacheElements();
    this.bindEvents();
    this.loadNotifications();
  }

  private cacheElements(): void {
    // Cache DOM elements
  }

  private bindEvents(): void {
    // Handle click outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-notification-section]') && !e.target.closest('[data-notification-panel]')) {
        this.close();
      }
    });
  }

  private async loadNotifications(): Promise<void> {
    try {
      const response = await fetch('/api/v1/notifications');
      if (response.ok) {
        const notifications = await response.json();
        this.state.notifications = notifications;
        this.updateUI();
      }
    } catch (error) {
      console.log('Failed to load notifications');
    }
  }

  private updateUI(): void {
    // Update UI based on state
  }

  public open(): void {
    this.state.isOpen = true;
    this.updateUI();
  }

  public close(): void {
    this.state.isOpen = false;
    this.config.onClose();
    this.updateUI();
  }

  public setNotifications(notifications: any[]): void {
    this.state.notifications = notifications;
    this.state.unreadCount = notifications.filter(n => !n.read).length;
    this.updateUI();
  }

  public getState(): any {
    return { ...this.state };
  }
}
