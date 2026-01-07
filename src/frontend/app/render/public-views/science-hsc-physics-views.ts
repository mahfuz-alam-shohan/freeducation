export const scienceHscPhysicsViews = `
{view === 'public-hsc-physics-1st' && (
    <PublicScienceShell
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        title="Physics 1st Paper অধ্যায়সমূহ"
        subtitle="HSC Physics 1st Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Physics 1st Paper"
            chapters={hscPhysics1stChapters}
            recentRoute="public-hsc-physics-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Physics 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-physics-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-physics-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-physics-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-physics-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-physics-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-physics-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || []
        }}
        onBack={() => navigate('public-hsc-physics-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd' && (
    <PublicScienceShell
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        title="Physics 2nd Paper অধ্যায়সমূহ"
        subtitle="HSC Physics 2nd Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Physics 2nd Paper"
            chapters={hscPhysics2ndChapters}
            recentRoute="public-hsc-physics-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Physics 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-physics-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-physics-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-physics-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-physics-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-physics-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-physics-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || []
        }}
        onBack={() => navigate('public-hsc-physics-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;
