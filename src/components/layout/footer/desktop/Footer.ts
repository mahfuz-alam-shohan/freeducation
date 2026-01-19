export interface DesktopFooterProps {
  showFullFooter?: boolean;
}

export class DesktopFooter {
  render(props: DesktopFooterProps): string {
    const { showFullFooter = true } = props;
    
    return `
      <footer class="bg-white border-t border-gray-200 py-8">
        <div class="px-8">
          ${showFullFooter ? this.renderFullFooter() : this.renderSimpleFooter()}
        </div>
      </footer>
    `;
  }

  private renderFullFooter(): string {
    return `
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
        <!-- Company Info -->
        <div class="col-span-2 lg:col-span-1">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-graduation-cap text-white"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Free Education</h3>
              <p class="text-sm text-gray-500">Bangladesh Platform</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            Empowering Bangladesh's students with quality, accessible education for all.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-blue-600 transition">
              <i class="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-blue-600 transition">
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-blue-600 transition">
              <i class="fab fa-linkedin text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-blue-600 transition">
              <i class="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>
        
        <!-- Platform -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
          <ul class="space-y-3">
            <li><a href="/about" class="text-sm text-gray-600 hover:text-gray-900 transition">About Us</a></li>
            <li><a href="/features" class="text-sm text-gray-600 hover:text-gray-900 transition">Features</a></li>
            <li><a href="/pricing" class="text-sm text-gray-600 hover:text-gray-900 transition">Pricing</a></li>
            <li><a href="/careers" class="text-sm text-gray-600 hover:text-gray-900 transition">Careers</a></li>
          </ul>
        </div>
        
        <!-- Learning -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Learning</h3>
          <ul class="space-y-3">
            <li><a href="/subjects" class="text-sm text-gray-600 hover:text-gray-900 transition">Subjects</a></li>
            <li><a href="/courses" class="text-sm text-gray-600 hover:text-gray-900 transition">Courses</a></li>
            <li><a href="/resources" class="text-sm text-gray-600 hover:text-gray-900 transition">Resources</a></li>
            <li><a href="/certificates" class="text-sm text-gray-600 hover:text-gray-900 transition">Certificates</a></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Support</h3>
          <ul class="space-y-3">
            <li><a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition">Help Center</a></li>
            <li><a href="/contact" class="text-sm text-gray-600 hover:text-gray-900 transition">Contact Us</a></li>
            <li><a href="/faq" class="text-sm text-gray-600 hover:text-gray-900 transition">FAQ</a></li>
            <li><a href="/feedback" class="text-sm text-gray-600 hover:text-gray-900 transition">Feedback</a></li>
          </ul>
        </div>
        
        <!-- Legal -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
          <ul class="space-y-3">
            <li><a href="/privacy" class="text-sm text-gray-600 hover:text-gray-900 transition">Privacy Policy</a></li>
            <li><a href="/terms" class="text-sm text-gray-600 hover:text-gray-900 transition">Terms of Service</a></li>
            <li><a href="/cookies" class="text-sm text-gray-600 hover:text-gray-900 transition">Cookie Policy</a></li>
            <li><a href="/accessibility" class="text-sm text-gray-600 hover:text-gray-900 transition">Accessibility</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Newsletter -->
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <div class="max-w-2xl mx-auto text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
          <p class="text-sm text-gray-600 mb-4">Get the latest updates and educational resources delivered to your inbox.</p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" 
                   class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="border-t border-gray-200 pt-8">
        <div class="flex flex-col lg:flex-row justify-between items-center">
          <p class="text-sm text-gray-500 mb-4 lg:mb-0">
            © 2026 Free Education Platform. All rights reserved. Empowering Bangladesh's students.
          </p>
          <div class="flex items-center space-x-6">
            <span class="text-sm text-gray-500">Made in Bangladesh 🇧🇩</span>
            <div class="flex items-center space-x-2">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2QjNEIi8+CjxwYXRoIGQ9Ik0wIDhMMTIgMEwyNCA4VjE2SDBWOFoiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSIzIiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPgo=" alt="Bangladesh" class="h-4 w-6">
            </div>
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
