export interface MainContentProps {
  children: string;
  hasSidebar: boolean;
}

export class MobileMainContent {
  render(props: MainContentProps): string {
    return `
      <div class="flex-1 overflow-y-auto pt-16">
        ${props.children}
      </div>
    `;
  }
}

export class TabletMainContent {
  render(props: MainContentProps): string {
    return `
      <div class="flex-1 overflow-y-auto ml-64 pt-16">
        ${props.children}
      </div>
    `;
  }
}

export class DesktopMainContent {
  render(props: MainContentProps): string {
    return `
      <div class="flex-1 overflow-y-auto ml-64 pt-16">
        ${props.children}
      </div>
    `;
  }
}
