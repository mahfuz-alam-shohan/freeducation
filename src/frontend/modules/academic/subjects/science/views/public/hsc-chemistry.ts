export const scienceHscChemistryViews = `
{view === 'public-hsc-chemistry-1st' && (
    <PublicScienceShell
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        title="Chemistry 1st Paper অধ্যায়সমূহ"
        subtitle="HSC Chemistry 1st Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Chemistry 1st Paper"
            chapters={hscChemistry1stChapters}
            recentRoute="public-hsc-chemistry-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Chemistry 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-chemistry-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-chemistry-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-chemistry-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-chemistry-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-chemistry-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-chemistry-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-chemistry-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd' && (
    <PublicScienceShell
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        title="Chemistry 2nd Paper অধ্যায়সমূহ"
        subtitle="HSC Chemistry 2nd Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Chemistry 2nd Paper"
            chapters={hscChemistry2ndChapters}
            recentRoute="public-hsc-chemistry-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Chemistry 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-chemistry-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-chemistry-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-chemistry-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-chemistry-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-chemistry-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-chemistry-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;
