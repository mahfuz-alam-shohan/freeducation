export const landingVideo = `
        const formatDuration = (value) => {
            if (value === null || value === undefined) return '';
            const total = Math.floor(Number(value));
            if (Number.isNaN(total)) return '';
            const minutes = Math.floor(total / 60);
            const seconds = total % 60;
            return String(minutes) + ':' + String(seconds).padStart(2, '0');
        };

        const getYoutubeEmbedUrl = (url) => {
            if (!url) return '';
            const match = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([\\w-]+)/);
            return match ? 'https://www.youtube.com/embed/' + match[1] : '';
        };

        const getVideoSource = (video) => {
            if (!video) return '';
            if (video.sourceType === 'upload') return video.url || (video.fileKey ? '/api/videos/' + encodeURIComponent(video.fileKey) : '');
            return video.url || '';
        };

        const PublicVideoPlayer = ({ video, progress, onProgress, onDuration, className }) => {
            const videoRef = useRef(null);
            const [playbackRate, setPlaybackRate] = useState(1.0);
            const embedUrl = video?.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
            const source = getVideoSource(video);
            const frameClassName = className || 'w-full aspect-video rounded-md border border-slate-200';

            useEffect(() => {
                if (!videoRef.current) return;
                const node = videoRef.current;
                const handleLoaded = () => {
                    if (progress?.currentTime && progress.currentTime < node.duration) { node.currentTime = progress.currentTime; }
                };
                node.addEventListener('loadedmetadata', handleLoaded);
                return () => node.removeEventListener('loadedmetadata', handleLoaded);
            }, [video?.id]);

            // Handle speed change
            useEffect(() => {
                if (videoRef.current) {
                    videoRef.current.playbackRate = playbackRate;
                }
            }, [playbackRate]);

            const cycleSpeed = () => {
                const rates = [1.0, 1.25, 1.5, 2.0];
                const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
                setPlaybackRate(rates[nextIndex]);
            };

            if (embedUrl) return <iframe title={video.title} src={embedUrl} className={frameClassName} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
            
            return (
                <div className="relative group">
                    <video
                        ref={videoRef} src={source} controls playsInline className={frameClassName + ' bg-black'}
                        onLoadedMetadata={(event) => {
                            if (onDuration) { onDuration(event.currentTarget.duration || 0); }
                            if (onProgress) { onProgress(event.currentTarget.currentTime || 0, event.currentTarget.duration || 0); }
                        }}
                        onTimeUpdate={(event) => { if (!onProgress) return; onProgress(event.currentTarget.currentTime, event.currentTarget.duration || 0); }}
                    />
                    {/* Speed Control Overlay Button */}
                    <button 
                        onClick={cycleSpeed}
                        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 flex items-center gap-1"
                        title="Change Playback Speed"
                    >
                        <i className="fa-solid fa-gauge-high"></i>
                        {playbackRate}x
                    </button>
                </div>
            );
        };

        const PublicVideoList = ({ context, videosByItem, onBack, onNavigate, onSelectVideo }) => {
            const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
            const resolvedContext = context || recentVideo?.context;
            const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
            const [durationMap, setDurationMap] = useState({});
            const resolvedBack = onBack || (resolvedContext?.backRoute ? () => onNavigate(resolvedContext.backRoute) : null);
            const handleSelect = (video) => {
                updateVideoProgress({
                    id: video.id, title: video.title, context: resolvedContext, route: 'public-video-player',
                    currentTime: videoProgress?.[video.id]?.currentTime || 0, duration: durationMap[video.id] || videoProgress?.[video.id]?.duration || 0
                });
                if (onSelectVideo) onSelectVideo(video, resolvedContext);
            };
            const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
            const title = resolvedContext?.title || 'ভিডিও';
            const subtitle = resolvedContext?.subtitle || '';
            return (
                <PublicSimpleShell backgroundClass={backgroundClass} title={title} subtitle={subtitle} onBack={resolvedBack} onNavigate={onNavigate}>
                    <div className="space-y-4 font-bangla text-left">
                        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">ভিডিও লিস্ট</div>
                        <div className="space-y-3">
                            {videos.length === 0 && <div className="text-sm text-slate-400">এখনো কোনো ভিডিও যোগ করা হয়নি।</div>}
                            {videos.map((video) => {
                                const progress = videoProgress?.[video.id];
                                const previewUrl = getVideoSource(video);
                                const embedUrl = video.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
                                const durationValue = durationMap[video.id] || progress?.duration || 0;
                                const durationLabel = durationValue ? formatDuration(durationValue) : 'Unavailable';
                                return (
                                    <button key={video.id} onClick={() => handleSelect(video)} className="w-full text-left border-b border-slate-200 last:border-b-0 px-2 py-3 hover:bg-slate-50 transition">
                                        <div className="flex items-start gap-3">
                                            <div className="w-20 h-12 shrink-0">
                                                {embedUrl ? <iframe title={video.title} src={embedUrl} className="w-20 h-12 rounded-md border border-slate-200" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : previewUrl ? <video src={previewUrl} muted playsInline preload="metadata" className="w-20 h-12 rounded-md border border-slate-200 bg-black object-cover" onLoadedMetadata={(event) => { const nextDuration = event.currentTarget.duration || 0; setDurationMap((prev) => ({ ...prev, [video.id]: nextDuration })); }} /> : <div className="w-20 h-12 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">Preview unavailable</div>}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="text-sm font-semibold text-slate-900 truncate">{video.title}</div>
                                                <div className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Channel:</span> {video.channelName ? (video.channelUrl ? <a href={video.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">{video.channelName}</a> : video.channelName) : 'Unavailable'}</div>
                                                <div className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Duration:</span> {durationLabel}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </PublicSimpleShell>
            );
        };

        const PublicVideoDetail = ({ context, videoId, videosByItem, onBack, onNavigate }) => {
            const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
            const resolvedContext = context || recentVideo?.context;
            const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
            const fallbackVideoId = videoId || recentVideo?.id;
            const activeVideo = videos.find((video) => video.id === fallbackVideoId) || videos[0];
            const progress = activeVideo ? videoProgress?.[activeVideo.id] : null;
            const [duration, setDuration] = useState(progress?.duration || 0);
            const resolvedBack = onBack || (() => onNavigate('public-videos'));
            const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
            const title = resolvedContext?.title || 'ভিডিও';
            const subtitle = resolvedContext?.subtitle || '';
            return (
                <PublicSimpleShell backgroundClass={backgroundClass} title={title} subtitle={subtitle} onBack={resolvedBack} onNavigate={onNavigate}>
                    {activeVideo ? (
                        <div className="space-y-4 font-bangla text-left">
                            <div className="space-y-1">
                                <div className="text-base font-semibold text-slate-900">{activeVideo.title}</div>
                                <div className="text-sm text-slate-600"><span className="font-semibold">Channel:</span> {activeVideo.channelName ? (activeVideo.channelUrl ? <a href={activeVideo.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">{activeVideo.channelName}</a> : activeVideo.channelName) : 'Unavailable'}</div>
                                <div className="text-sm text-slate-600"><span className="font-semibold">Duration:</span> {duration ? formatDuration(duration) : 'Unavailable'}</div>
                            </div>
                            <div className="flex justify-center">
                                <PublicVideoPlayer
                                    video={activeVideo} progress={progress} className="w-full max-w-3xl aspect-video rounded-md border border-slate-200"
                                    onDuration={(nextDuration) => { if (nextDuration) setDuration(nextDuration); }}
                                    onProgress={(currentTime, nextDuration) => {
                                        if (nextDuration) setDuration(nextDuration);
                                        updateVideoProgress({ id: activeVideo.id, title: activeVideo.title, context: resolvedContext, route: 'public-video-player', currentTime, duration: nextDuration });
                                    }}
                                />
                            </div>
                        </div>
                    ) : <div className="text-sm text-slate-400 font-bangla">এখনো কোনো ভিডিও যোগ করা হয়নি।</div>}
                </PublicSimpleShell>
            );
        };
`;
