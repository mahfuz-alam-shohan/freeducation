export const landingViews = `
{view === 'landing' && <StudentLanding onNavigate={navigate} />}
{view === 'public-videos' && (
    <PublicVideoList
        context={selectedVideoContext}
        videosByItem={videosByItem}
        onBack={
            selectedVideoContext?.backRoute
                ? () => navigate(selectedVideoContext.backRoute)
                : null
        }
        onNavigate={navigate}
        onSelectVideo={(video, context) => {
            setSelectedVideoId(video.id);
            if (context) {
                setSelectedVideoContext(context);
            }
            navigate('public-video-player');
        }}
    />
)}
{view === 'public-video-player' && (
    <PublicVideoDetail
        context={selectedVideoContext}
        videoId={selectedVideoId}
        videosByItem={videosByItem}
        onBack={() => navigate('public-videos')}
        onNavigate={navigate}
    />
)}
{view === 'ssc-subjects' && (
    <SubjectIndexPage classLabel="SSC" subjects={sscSubjects} onNavigate={navigate} />
)}
{view === 'hsc-subjects' && (
    <SubjectIndexPage classLabel="HSC" subjects={hscSubjects} onNavigate={navigate} />
)}
`;
