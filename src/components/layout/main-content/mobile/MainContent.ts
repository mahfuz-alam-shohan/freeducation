import { MainContentProps } from '../MainContent';

export class MobileMainContent {
  render(props: MainContentProps): string {
    return `
      <div class="flex-1 overflow-y-auto pt-16">
        ${props.children}
      </div>
    `;
  }
}
