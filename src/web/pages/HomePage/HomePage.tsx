// HomePage Component
const HomePage = {
    render: () => {
        return `
            <div class="min-h-screen">
                <!-- Hero Section -->
                ${HeroSection.render()}
                
                <!-- Features Section -->
                ${FeaturesSection.render()}
                
                <!-- Stats Section -->
                ${StatsSection.render()}
                
                <!-- Content Preview Section -->
                ${ContentPreview.render()}
                
                <!-- CTA Section -->
                ${CTASection.render()}
            </div>
        `;
    }
};

// Hero Section Component
const HeroSection = {
    render: () => {
        return `
            <section class="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Welcome to FreeEducation
                        </h1>
                        <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Learn, Practice, and Connect with our comprehensive educational platform. 
                            Access quality content, take assessments, and join a community of learners.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onclick="window.location.href='/subjects'" class="btn-scale px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 focus-ring">
                                Start Learning
                            </button>
                            <button onclick="window.location.href='/assessments'" class="btn-scale px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary focus-ring">
                                Take Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};

// Features Section Component
const FeaturesSection = {
    render: () => {
        const features = [
            {
                icon: 'book-open',
                title: 'Rich Content',
                description: 'Access comprehensive educational materials across various subjects and class levels.'
            },
            {
                icon: 'clipboard-check',
                title: 'Practice Tests',
                description: 'Improve your knowledge with MCQ tests, previous year questions, and practice assessments.'
            },
            {
                icon: 'trophy',
                title: 'Earn Credits',
                description: 'Get rewarded for your learning progress and use credits to access premium features.'
            },
            {
                icon: 'users',
                title: 'Community',
                description: 'Connect with fellow learners, share knowledge, and collaborate on educational goals.'
            }
        ];

        return `
            <section class="py-20 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose FreeEducation?
                        </h2>
                        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide everything you need for successful learning in one platform.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${features.map(feature => FeatureCard.render(feature)).join('')}
                    </div>
                </div>
            </section>
        `;
    }
};

// Feature Card Component
const FeatureCard = {
    render: (feature) => {
        const icon = FeatureCard.getIcon(feature.icon);
        return `
            <div class="text-center p-6 rounded-lg hover-lift bg-gray-50">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    ${icon}
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${feature.title}</h3>
                <p class="text-gray-600">${feature.description}</p>
            </div>
        `;
    },
    
    getIcon: (iconName) => {
        const icons = {
            'book-open': '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
            'clipboard-check': '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>',
            'trophy': '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>',
            'users': '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
        };
        return icons[iconName] || icons['book-open'];
    }
};

// Stats Section Component
const StatsSection = {
    render: () => {
        return `
            <section class="py-20 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Platform Statistics
                        </h2>
                        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join thousands of learners already benefiting from our platform.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        ${StatCard.render('10,000+', 'Active Learners', 'users')}
                        ${StatCard.render('500+', 'Subjects', 'book')}
                        ${StatCard.render('1,000+', 'Assessments', 'clipboard-list')}
                        ${StatCard.render('50,000+', 'Questions', 'question-mark-circle')}
                    </div>
                </div>
            </section>
        `;
    }
};

// Stat Card Component
const StatCard = {
    render: (number, label, iconName) => {
        const icon = StatCard.getIcon(iconName);
        return `
            <div class="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
                <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    ${icon}
                </div>
                <div class="text-3xl font-bold text-gray-900 mb-2">${number}</div>
                <div class="text-gray-600">${label}</div>
            </div>
        `;
    },
    
    getIcon: (iconName) => {
        const icons = {
            'users': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
            'book': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
            'clipboard-list': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
            'question-mark-circle': '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[iconName] || icons['book'];
    }
};

// Content Preview Section Component
const ContentPreview = {
    render: () => {
        return `
            <section class="py-20 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Explore Our Content
                        </h2>
                        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get started with our most popular subjects and assessments.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        ${ContentPreviewSection.render('Subjects', 'Browse our comprehensive collection of subjects across all class levels.', '/subjects', 'primary')}
                        ${ContentPreviewSection.render('Assessments', 'Test your knowledge with our wide range of practice tests and quizzes.', '/assessments', 'secondary')}
                    </div>
                </div>
            </section>
        `;
    }
};

// Content Preview Section Component
const ContentPreviewSection = {
    render: (title, description, link, color) => {
        const bgColor = color === 'primary' ? 'bg-primary' : 'bg-secondary';
        return `
            <div class="text-center p-8 rounded-lg hover-lift bg-gray-50">
                <div class="w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">${title}</h3>
                <p class="text-gray-600 mb-6">${description}</p>
                <button onclick="window.location.href='${link}'" class="btn-scale px-6 py-3 ${color === 'primary' ? 'bg-primary hover:bg-blue-600' : 'bg-secondary hover:bg-green-600'} text-white font-semibold rounded-lg focus-ring">
                    Explore ${title}
                </button>
            </div>
        `;
    }
};

// CTA Section Component
const CTASection = {
    render: () => {
        return `
            <section class="py-20 bg-gradient-to-r from-primary to-blue-600">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Learning Journey?
                    </h2>
                    <p class="text-xl text-blue-100 mb-8">
                        Join thousands of students who are already learning with FreeEducation. 
                        Create your free account and start exploring today.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="window.location.href='/register'" class="btn-scale px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 focus-ring">
                            Create Free Account
                        </button>
                        <button onclick="window.location.href='/login'" class="btn-scale px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary focus-ring">
                            Sign In
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
};

// Export HomePage component
window.HomePage = HomePage;
window.HeroSection = HeroSection;
window.FeaturesSection = FeaturesSection;
window.FeatureCard = FeatureCard;
window.StatsSection = StatsSection;
window.StatCard = StatCard;
window.ContentPreview = ContentPreview;
window.ContentPreviewSection = ContentPreviewSection;
window.CTASection = CTASection;
