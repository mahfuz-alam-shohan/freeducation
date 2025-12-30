export const uiComponents = `
        const LogoMark = ({ className = '', textClassName = '', subtitle = 'Learning that feels effortless.', compact = false }) => (
            <div className={\`flex items-center gap-3 \${className}\`}>
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                        <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                        <path d="M20.5 9.7V14" />
                        <path d="M21.5 14h-2" />
                    </svg>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className={\`text-lg sm:text-xl font-bold \${textClassName || 'text-gray-900'}\`}>Freeducation</span>
                    {!compact && (
                        <span className={\`text-[11px] uppercase tracking-[0.2em] \${textClassName ? 'text-white/70' : 'text-gray-500'}\`}>{subtitle}</span>
                    )}
                </div>
            </div>
        );

        const Loading = () => (
            <div className="flex items-center justify-center h-screen text-blue-600">
                <i className="fas fa-circle-notch fa-spin text-3xl"></i>
            </div>
        );

        const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md', ...props }) => {
            const variants = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
                secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
                ghost: "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            };
            const sizes = {
                sm: "px-3 py-1.5 text-xs",
                md: "px-4 py-2 text-sm",
                lg: "px-5 py-3 text-base"
            };
            return (
                <button 
                    onClick={onClick} 
                    className={\`rounded-lg font-medium transition-all transform active:scale-95 \${variants[variant]} \${sizes[size]} \${className}\`} 
                    {...props}
                >
                    {children}
                </button>
            );
        };

        const Input = ({ label, ...props }) => (
            <div className="mb-3">
                {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
                <input 
                    {...props} 
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white" 
                />
            </div>
        );

        const Modal = ({ isOpen, onClose, title, children }) => {
            if (!isOpen) return null;
            return (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-md font-bold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            );
        };
`;
