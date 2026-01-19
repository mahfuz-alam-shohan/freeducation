import { MainContentProps } from '../MainContent';

export class DesktopMainContent {
  render(props: MainContentProps): string {
    return `
      <div class="flex-1 overflow-y-auto ml-64 pt-16">
        ${props.children}
      </div>
    `;
  }
}
