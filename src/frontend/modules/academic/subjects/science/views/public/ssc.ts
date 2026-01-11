export const scienceSscViews = `
{view === 'public-ssc-physics' && (
    <PublicScienceShell
        subjectLabel="Physics"
        classLabel="SSC"
        title="Physics অধ্যায়সমূহ"
        subtitle="SSC Physics এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Physics"
            chapters={sscPhysicsChapters}
            recentRoute="public-ssc-physics"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Physics'
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-physics-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-physics-topics' && (
    <PublicScienceShell
        subjectLabel="Physics"
        classLabel="SSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-ssc-physics')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-physics-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-physics-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Physics"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-physics-cq')}
        onNavigateMcq={() => navigate('public-ssc-physics-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-physics-topic"
        cqQuestions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'scenario')] || []
        }}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-physics-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-physics-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Physics"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'scenario')] || []
        }}
        onBack={() => navigate('public-ssc-physics-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-physics-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Physics"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-physics-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-chemistry' && (
    <PublicScienceShell
        subjectLabel="Chemistry"
        classLabel="SSC"
        title="Chemistry অধ্যায়সমূহ"
        subtitle="SSC Chemistry এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Chemistry"
            chapters={sscChemistryChapters}
            recentRoute="public-ssc-chemistry"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Chemistry'
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-chemistry-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-chemistry-topics' && (
    <PublicScienceShell
        subjectLabel="Chemistry"
        classLabel="SSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-ssc-chemistry')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-chemistry-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-chemistry-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Chemistry"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-chemistry-cq')}
        onNavigateMcq={() => navigate('public-ssc-chemistry-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-chemistry-topic"
        cqQuestions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'scenario')] || []
        }}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-chemistry-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-chemistry-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Chemistry"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'scenario')] || []
        }}
        onBack={() => navigate('public-ssc-chemistry-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-chemistry-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Chemistry"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-chemistry-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-biology' && (
    <PublicScienceShell
        subjectLabel="Biology"
        classLabel="SSC"
        title="Biology অধ্যায়সমূহ"
        subtitle="SSC Biology এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Biology"
            chapters={sscBiologyChapters}
            recentRoute="public-ssc-biology"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Biology'
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-biology-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-biology-topics' && (
    <PublicScienceShell
        subjectLabel="Biology"
        classLabel="SSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-ssc-biology')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-biology-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-biology-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Biology"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-biology-cq')}
        onNavigateMcq={() => navigate('public-ssc-biology-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-biology-topic"
        cqQuestions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'scenario')] || []
        }}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-biology-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-biology-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Biology"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
                [],
            scenario:
                srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'scenario')] || []
        }}
        onBack={() => navigate('public-ssc-biology-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-biology-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Biology"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-ssc-biology-topic')}
        onNavigate={navigate}
    />
)}
`;
