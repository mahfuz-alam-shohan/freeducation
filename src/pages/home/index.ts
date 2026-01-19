import { LayoutManager } from '../../components/layout/LayoutManager';
import { getDatabase } from '../../database';

export async function renderHomePage(request: Request, layoutManager: any, user: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative pt-16 pb-32">
            <div class="text-center">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Free Education Platform
                <span class="block text-blue-600">for Bangladesh</span>
              </h1>
              <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Access quality NCTB curriculum content for Classes 6-12. 
                Learn, practice, and excel with our comprehensive educational platform.
              </p>
              <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div class="rounded-md shadow">
                  <a href="/subjects" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Start Learning
                  </a>
                </div>
                <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a href="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">
              Everything You Need to Learn
            </h2>
            <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comprehensive educational resources designed for Bangladeshi students following the NCTB curriculum.
            </p>
          </div>

          <div class="mt-10">
            <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <i class="fas fa-book-open"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">NCTB Curriculum</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Complete curriculum materials for Classes 6-12 following Bangladesh National Curriculum.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <i class="fas fa-users"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Multi-Role Support</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Students, Teachers, Content Writers, and Publishers all have dedicated interfaces.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <i class="fas fa-trophy"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Gamification</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Earn achievements, track progress, and stay motivated with our gamified learning system.
                </p>
              </div>

              <!-- Feature 4 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Mobile First</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Optimized for all devices. Learn anywhere, anytime on your phone, tablet, or desktop.
                </p>
              </div>

              <!-- Feature 5 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <i class="fas fa-comments"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Social Learning</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Connect with peers, share knowledge, and learn together in our community features.
                </p>
              </div>

              <!-- Feature 6 -->
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <i class="fas fa-chart-line"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Progress Tracking</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Monitor your learning journey with detailed analytics and progress reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-blue-600 pt-12 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-3xl font-extrabold text-white">
              Trusted by Students Across Bangladesh
            </h2>
            <p class="mt-4 text-xl text-blue-200">
              Join thousands of students already learning with our platform.
            </p>
          </div>

          <div class="mt-10">
            <div class="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
              <div>
                <p class="text-5xl font-extrabold text-white">15+</p>
                <p class="mt-2 text-lg leading-6 font-medium text-blue-200">Subjects</p>
              </div>
              <div>
                <p class="text-5xl font-extrabold text-white">6-12</p>
                <p class="mt-2 text-lg leading-6 font-medium text-blue-200">Classes</p>
              </div>
              <div>
                <p class="text-5xl font-extrabold text-white">1000+</p>
                <p class="mt-2 text-lg leading-6 font-medium text-blue-200">Lessons</p>
              </div>
              <div>
                <p class="text-5xl font-extrabold text-white">24/7</p>
                <p class="mt-2 text-lg leading-6 font-medium text-blue-200">Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">
              Ready to Start Learning?
            </h2>
            <p class="mt-4 text-xl text-gray-500">
              Join thousands of students already benefiting from quality education.
            </p>
            <div class="mt-8">
              <div class="inline-flex rounded-md shadow">
                <a href="/register" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Get Started Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user,
    deviceType,
    children: content,
    showFooter: true,
    footerType: 'full'
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
