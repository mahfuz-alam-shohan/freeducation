export const PublicVideoListComponent = `
const PublicVideoList = ({ context, videosByItem, onBack, onNavigate, onSelectVideo }) => {
    // ... (Paste the implementation of PublicVideoList from your original file here)
    // For now, I'll provide a placeholder skeleton if you don't copy-paste it yourself.
    // Ideally, you should copy the exact code you have for this component.

    if (!context) return null;
    const { itemId, title, subtitle, backgroundClass } = context;
    const videos = videosByItem[itemId] || [];

    return (
        <div className={\`min-h-screen \${backgroundClass || 'bg-white'}\`}>
             {/* Header with Back Button */}
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button 
                    onClick={onBack}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-600 mb-8">{subtitle}</p>}

                {/* Video Grid */}
                {videos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No videos available for this topic yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map(video => (
                            <div 
                                key={video.id}
                                onClick={() => onSelectVideo(video, context)}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="aspect-video bg-gray-100 relative">
                                    {video.thumbnailUrl ? (
                                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <i className="fa-brands fa-youtube text-4xl text-red-500 opacity-80 group-hover:opacity-100 transition-opacity"></i>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                                            <i className="fa-solid fa-play text-gray-900 ml-1"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{video.title}</h3>
                                    <p className="text-sm text-gray-500">{video.duration || 'Video Lesson'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
    );
};
`;
