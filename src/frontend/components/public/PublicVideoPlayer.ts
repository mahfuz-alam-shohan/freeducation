export const PublicVideoPlayer =`
const PublicVideoPlayer = ({ video, progress, onProgress, onDuration, className }) => {
            const videoRef = useRef(null);
            const embedUrl = video?.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
            const source = getVideoSource(video);
            const frameClassName = className || 'w-full aspect-video rounded-md border border-slate-200';

            useEffect(() => {
                if (!videoRef.current) return;
                const node = videoRef.current;
                const handleLoaded = () => {
                    if (progress?.currentTime && progress.currentTime < node.duration) {
                        node.currentTime = progress.currentTime;
                    }
                };
                node.addEventListener('loadedmetadata', handleLoaded);
                return () => node.removeEventListener('loadedmetadata', handleLoaded);
            }, [video?.id]);

            if (embedUrl) {
                return (
                    <iframe
                        title={video.title}
                        src={embedUrl}
                        className={frameClassName}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            }

            return (
                <video
                    ref={videoRef}
                    src={source}
                    controls
                    playsInline
                    className={frameClassName + ' bg-black'}
                    onLoadedMetadata={(event) => {
                        if (onDuration) {
                            onDuration(event.currentTarget.duration || 0);
                        }
                        if (onProgress) {
                            onProgress(event.currentTarget.currentTime || 0, event.currentTarget.duration || 0);
                        }
                    }}
                    onTimeUpdate={(event) => {
                        if (!onProgress) return;
                        onProgress(event.currentTarget.currentTime, event.currentTarget.duration || 0);
                    }}
                />
            );
        };


`;
