export const uiComponents = `
        const LogoMark = ({ className = '', textClassName = '', subtitle = 'Learning that feels effortless.', compact = false }) => (
            <div className={\`flex items-center gap-3 \${className}\`}>
                <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                        <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                        <path d="M20.5 9.7V14" />
                        <path d="M21.5 14h-2" />
                    </svg>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className={\`text-base sm:text-lg font-bold \${textClassName || 'text-gray-900'}\`}>Freeducation</span>
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

        const makeThumbnailKey = (subject, classLabel) =>
            (classLabel + '-' + subject)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterKey) =>
            (classLabel + '-' + subjectLabel + '-' + chapterKey)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
`;
