export const PublicVideoDetailComponent = `
const PublicVideoDetail = ({ context, videoId, videosByItem, onBack, onNavigate }) => {
    // ... (Paste implementation of PublicVideoDetail here)
    // Placeholder skeleton:
    
    if (!context || !videoId) return null;
    const videos = videosByItem[context.itemId] || [];
    const video = videos.find(v => v.id === videoId);

    if (!video) return <div>Video not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button 
                    onClick={onBack}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back to List
                </button>

                <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video mb-6">
                     {/* Replace with actual video player implementation */}
                     <iframe 
                        className="w-full h-full"
                        src={\`https://www.youtube.com/embed/\${video.url}?autoplay=1\`} 
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                <p className="text-gray-600">{video.description}</p>
            </div>
        </div>
    );
};
`;
