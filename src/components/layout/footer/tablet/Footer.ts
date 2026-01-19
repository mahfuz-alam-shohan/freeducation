export interface TabletFooterProps {
  showFullFooter?: boolean;
}

export class TabletFooter {
  render(props: TabletFooterProps): string {
    const { showFullFooter = true } = props;
    
    return `
      <footer class="bg-white border-t border-gray-200 py-6">
        <div class="px-6">
          ${showFullFooter ? this.renderFullFooter() : this.renderSimpleFooter()}
        </div>
      </footer>
    `;
  }

  private renderFullFooter(): string {
    return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <!-- Platform -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Platform</h3>
          <ul class="space-y-2">
            <li><a href="/about" class="text-sm text-gray-600 hover:text-gray-900">About Us</a></li>
            <li><a href="/features" class="text-sm text-gray-600 hover:text-gray-900">Features</a></li>
            <li><a href="/pricing" class="text-sm text-gray-600 hover:text-gray-900">Pricing</a></li>
          </ul>
        </div>
        
        <!-- Learning -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Learning</h3>
          <ul class="space-y-2">
            <li><a href="/subjects" class="text-sm text-gray-600 hover:text-gray-900">Subjects</a></li>
            <li><a href="/courses" class="text-sm text-gray-600 hover:text-gray-900">Courses</a></li>
            <li><a href="/resources" class="text-sm text-gray-600 hover:text-gray-900">Resources</a></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Support</h3>
          <ul class="space-y-2">
            <li><a href="/help" class="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
            <li><a href="/contact" class="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
            <li><a href="/faq" class="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
          </ul>
        </div>
        
        <!-- Legal -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
          <ul class="space-y-2">
            <li><a href="/privacy" class="text-sm text-gray-600 hover:text-gray-900">Privacy</a></li>
            <li><a href="/terms" class="text-sm text-gray-600 hover:text-gray-900">Terms</a></li>
            <li><a href="/cookies" class="text-sm text-gray-600 hover:text-gray-900">Cookies</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">© 2026 Free Education Platform. Empowering Bangladesh's students.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-gray-600">
              <i class="fab fa-facebook text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-600">
              <i class="fab fa-twitter text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-600">
              <i class="fab fa-linkedin text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-600">
              <i class="fab fa-youtube text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  private renderSimpleFooter(): string {
    return `
      <div class="text-center">
        <p class="text-sm text-gray-500">© 2026 Free Education Platform. Empowering Bangladesh's students.</p>
      </div>
    `;
  }
}
