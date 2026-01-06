export const renderPhysics = `
{/* SSC Physics */}
{view === 'public-ssc-physics' && (
    <PublicScienceShell
        subjectLabel="Physics"
        classLabel="SSC"
        title="Physics অধ্যায়সমূহ"
        subtitle="SSC Physics এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('ssc-subjects')}
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
        onBack={() => goBack('public-ssc-physics')}
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
                []
        }}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => goBack('public-ssc-physics-topics')}
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
                []
        }}
        onBack={() => goBack('public-ssc-physics-topic')}
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
        onBack={() => goBack('public-ssc-physics-topic')}
        onNavigate={navigate}
    />
)}

{/* HSC Physics 1st Paper */}
{view === 'public-hsc-physics-1st' && (
    <PublicScienceShell
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        title="Physics 1st Paper অধ্যায়সমূহ"
        subtitle="HSC Physics 1st Paper এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('hsc-subjects')}
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
        onBack={() => goBack('public-hsc-physics-1st')}
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
        onBack={() => goBack('public-hsc-physics-1st-topics')}
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
        onBack={() => goBack('public-hsc-physics-1st-topic')}
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
        onBack={() => goBack('public-hsc-physics-1st-topic')}
        onNavigate={navigate}
    />
)}

{/* HSC Physics 2nd Paper */}
{view === 'public-hsc-physics-2nd' && (
    <PublicScienceShell
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        title="Physics 2nd Paper অধ্যায়সমূহ"
        subtitle="HSC Physics 2nd Paper এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('hsc-subjects')}
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
        onBack={() => goBack('public-hsc-physics-2nd')}
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
        onBack={() => goBack('public-hsc-physics-2nd-topics')}
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
        onBack={() => goBack('public-hsc-physics-2nd-topic')}
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
        onBack={() => goBack('public-hsc-physics-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;
