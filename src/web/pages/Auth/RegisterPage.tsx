// RegisterPage Component - Complete and Future-Proof
const RegisterPage = {
    render: () => {
        return `
            <div class="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-2xl w-full space-y-8">
                    <!-- Header -->
                    <div class="text-center">
                        <div class="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                            <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-white">Create Account</h2>
                        <p class="mt-2 text-blue-100">Join FreeEducation and start your learning journey</p>
                    </div>

                    <!-- Registration Form -->
                    <form id="registerForm" class="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                        <!-- Error/Success Messages -->
                        <div id="registerMessage" class="hidden"></div>
                        
                        <!-- Account Type Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <label class="relative">
                                    <input type="radio" name="role" value="student" checked class="sr-only peer">
                                    <div class="p-3 border-2 rounded-lg cursor-pointer text-center peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary hover:bg-gray-50 transition">
                                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                        </svg>
                                        <span class="text-xs font-medium">Student</span>
                                    </div>
                                </label>
                                
                                <label class="relative">
                                    <input type="radio" name="role" value="teacher" class="sr-only peer">
                                    <div class="p-3 border-2 rounded-lg cursor-pointer text-center peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary hover:bg-gray-50 transition">
                                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        <span class="text-xs font-medium">Teacher</span>
                                    </div>
                                </label>
                                
                                <label class="relative">
                                    <input type="radio" name="role" value="writer" class="sr-only peer">
                                    <div class="p-3 border-2 rounded-lg cursor-pointer text-center peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary hover:bg-gray-50 transition">
                                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                        <span class="text-xs font-medium">Writer</span>
                                    </div>
                                </label>
                                
                                <label class="relative">
                                    <input type="radio" name="role" value="publisher" class="sr-only peer">
                                    <div class="p-3 border-2 rounded-lg cursor-pointer text-center peer-checked:border-primary peer-checked:bg-blue-50 peer-checked:text-primary hover:bg-gray-50 transition">
                                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                        <span class="text-xs font-medium">Publisher</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Name Fields -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName" 
                                    required
                                    class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Enter your first name"
                                    autocomplete="given-name"
                                >
                                <span class="text-xs text-red-500 mt-1 hidden" id="firstNameError">First name is required</span>
                            </div>
                            
                            <div>
                                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName" 
                                    required
                                    class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Enter your last name"
                                    autocomplete="family-name"
                                >
                                <span class="text-xs text-red-500 mt-1 hidden" id="lastNameError">Last name is required</span>
                            </div>
                        </div>

                        <!-- Email Field -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div class="relative">
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required
                                    class="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Enter your email"
                                    autocomplete="email"
                                >
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                    </svg>
                                </div>
                            </div>
                            <span class="text-xs text-red-500 mt-1 hidden" id="emailError">Please enter a valid email address</span>
                        </div>

                        <!-- Username Field -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    required
                                    pattern="[a-zA-Z0-9_]{3,20}"
                                    class="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Choose a username"
                                    autocomplete="username"
                                >
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                            </div>
                            <span class="text-xs text-gray-500 mt-1">3-20 characters, letters, numbers, and underscores only</span>
                            <span class="text-xs text-red-500 mt-1 hidden" id="usernameError">Username must be 3-20 characters and contain only letters, numbers, and underscores</span>
                        </div>

                        <!-- Password Fields -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div class="relative">
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        required
                                        minlength="8"
                                        class="appearance-none relative block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Create a password"
                                        autocomplete="new-password"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <button type="button" id="togglePassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg id="eyeIcon" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <span class="text-xs text-gray-500 mt-1">Minimum 8 characters</span>
                                <span class="text-xs text-red-500 mt-1 hidden" id="passwordError">Password must be at least 8 characters</span>
                            </div>
                            
                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div class="relative">
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        required
                                        class="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Confirm your password"
                                        autocomplete="new-password"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <span class="text-xs text-red-500 mt-1 hidden" id="confirmPasswordError">Passwords do not match</span>
                            </div>
                        </div>

                        <!-- Education Level (for students) -->
                        <div id="educationLevelField">
                            <label for="educationLevel" class="block text-sm font-medium text-gray-700 mb-2">
                                Education Level
                            </label>
                            <select 
                                id="educationLevel" 
                                name="educationLevel"
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="">Select your education level</option>
                                <option value="primary">Primary School</option>
                                <option value="secondary">Secondary School</option>
                                <option value="higher">Higher Education</option>
                                <option value="professional">Professional</option>
                            </select>
                        </div>

                        <!-- Terms and Privacy -->
                        <div class="space-y-3">
                            <div class="flex items-start">
                                <input 
                                    id="agreeTerms" 
                                    name="agreeTerms" 
                                    type="checkbox" 
                                    required
                                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                                >
                                <label for="agreeTerms" class="ml-2 block text-sm text-gray-700">
                                    I agree to the <a href="/terms" class="text-primary hover:text-blue-600">Terms of Service</a> and <a href="/privacy" class="text-primary hover:text-blue-600">Privacy Policy</a>
                                </label>
                            </div>
                            
                            <div class="flex items-start">
                                <input 
                                    id="newsletter" 
                                    name="newsletter" 
                                    type="checkbox" 
                                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                                >
                                <label for="newsletter" class="ml-2 block text-sm text-gray-700">
                                    Send me educational updates and learning tips
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div>
                            <button 
                                type="submit" 
                                id="registerButton"
                                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 btn-scale"
                            >
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-blue-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                    </svg>
                                </span>
                                <span id="registerButtonText">Create Account</span>
                                <div id="registerSpinner" class="hidden">
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <!-- Login Link -->
                        <div class="text-center">
                            <p class="text-sm text-gray-600">
                                Already have an account? 
                                <a href="/login" class="font-medium text-primary hover:text-blue-600">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    init: () => {
        // Form elements
        const form = document.getElementById('registerForm');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const educationLevelSelect = document.getElementById('educationLevel');
        const agreeTermsCheckbox = document.getElementById('agreeTerms');
        const roleRadios = document.querySelectorAll('input[name="role"]');
        const togglePassword = document.getElementById('togglePassword');
        const eyeIcon = document.getElementById('eyeIcon');
        const registerButton = document.getElementById('registerButton');
        const registerButtonText = document.getElementById('registerButtonText');
        const registerSpinner = document.getElementById('registerSpinner');
        const messageDiv = document.getElementById('registerMessage');

        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        });

        // Handle role selection
        roleRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const educationLevelField = document.getElementById('educationLevelField');
                if (radio.value === 'student') {
                    educationLevelField.style.display = 'block';
                    educationLevelSelect.required = true;
                } else {
                    educationLevelField.style.display = 'none';
                    educationLevelSelect.required = false;
                }
            });
        });

        // Real-time validation
        firstNameInput.addEventListener('blur', () => RegisterPage.validateFirstName());
        lastNameInput.addEventListener('blur', () => RegisterPage.validateLastName());
        emailInput.addEventListener('blur', () => RegisterPage.validateEmail());
        usernameInput.addEventListener('blur', () => RegisterPage.validateUsername());
        passwordInput.addEventListener('blur', () => RegisterPage.validatePassword());
        confirmPasswordInput.addEventListener('blur', () => RegisterPage.validateConfirmPassword());

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const isFirstNameValid = RegisterPage.validateFirstName();
            const isLastNameValid = RegisterPage.validateLastName();
            const isEmailValid = RegisterPage.validateEmail();
            const isUsernameValid = RegisterPage.validateUsername();
            const isPasswordValid = RegisterPage.validatePassword();
            const isConfirmPasswordValid = RegisterPage.validateConfirmPassword();
            const areTermsAccepted = agreeTermsCheckbox.checked;
            
            if (!areTermsAccepted) {
                RegisterPage.showMessage('You must agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
                RegisterPage.showMessage('Please fix the errors below', 'error');
                return;
            }

            // Show loading state
            registerButton.disabled = true;
            registerButtonText.classList.add('hidden');
            registerSpinner.classList.remove('hidden');

            try {
                const formData = new FormData(form);
                const registerData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    username: formData.get('username'),
                    password: formData.get('password'),
                    role: formData.get('role'),
                    educationLevel: formData.get('educationLevel') || null,
                    newsletter: formData.get('newsletter') === 'on'
                };

                const response = await Utils.api.post('/api/v1/auth/register', registerData);
                
                if (response.success) {
                    // Show success message
                    RegisterPage.showMessage('Account created successfully! Redirecting to login...', 'success');
                    
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    RegisterPage.showMessage(response.error || 'Registration failed', 'error');
                }
            } catch (error) {
                RegisterPage.showMessage('Network error. Please try again.', 'error');
            } finally {
                // Reset loading state
                registerButton.disabled = false;
                registerButtonText.classList.remove('hidden');
                registerSpinner.classList.add('hidden');
            }
        });
    },

    validateFirstName: () => {
        const input = document.getElementById('firstName');
        const error = document.getElementById('firstNameError');
        const value = input.value.trim();
        
        if (!value) {
            error.textContent = 'First name is required';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    },

    validateLastName: () => {
        const input = document.getElementById('lastName');
        const error = document.getElementById('lastNameError');
        const value = input.value.trim();
        
        if (!value) {
            error.textContent = 'Last name is required';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    },

    validateEmail: () => {
        const input = document.getElementById('email');
        const error = document.getElementById('emailError');
        const value = input.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            error.textContent = 'Email is required';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            error.textContent = 'Please enter a valid email address';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    },

    validateUsername: () => {
        const input = document.getElementById('username');
        const error = document.getElementById('usernameError');
        const value = input.value.trim();
        
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (!value) {
            error.textContent = 'Username is required';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        if (!usernameRegex.test(value)) {
            error.textContent = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    },

    validatePassword: () => {
        const input = document.getElementById('password');
        const error = document.getElementById('passwordError');
        const value = input.value;
        
        if (!value) {
            error.textContent = 'Password is required';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        if (value.length < 8) {
            error.textContent = 'Password must be at least 8 characters';
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    },

    validateConfirmPassword: () => {
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirmPassword');
        const error = document.getElementById('confirmPasswordError');
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        
        if (!confirmPassword) {
            error.textContent = 'Please confirm your password';
            error.classList.remove('hidden');
            confirmInput.classList.add('border-red-500');
            return false;
        }
        
        if (password !== confirmPassword) {
            error.textContent = 'Passwords do not match';
            error.classList.remove('hidden');
            confirmInput.classList.add('border-red-500');
            return false;
        }
        
        error.classList.add('hidden');
        confirmInput.classList.remove('border-red-500');
        return true;
    },

    showMessage: (message, type) => {
        const messageDiv = document.getElementById('registerMessage');
        
        const bgColor = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        const icon = type === 'success' 
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        
        messageDiv.className = `${bgColor} p-4 rounded-lg flex items-center space-x-2`;
        messageDiv.innerHTML = `${icon}<span>${message}</span>`;
        messageDiv.classList.remove('hidden');
        
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
};

// Export for global use
window.RegisterPage = RegisterPage;
