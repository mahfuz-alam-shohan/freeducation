export const scienceHscBiologyViews = `
{view === 'public-hsc-biology-1st' && (
    <PublicScienceShell
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        title="Biology 1st Paper অধ্যায়সমূহ"
        subtitle="HSC Biology 1st Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Biology 1st Paper"
            chapters={hscBiology1stChapters}
            recentRoute="public-hsc-biology-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Biology 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-biology-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-biology-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-biology-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-biology-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-biology-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-biology-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-biology-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd' && (
    <PublicScienceShell
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        title="Biology 2nd Paper অধ্যায়সমূহ"
        subtitle="HSC Biology 2nd Paper এর অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Biology 2nd Paper"
            chapters={hscBiology2ndChapters}
            recentRoute="public-hsc-biology-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Biology 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-biology-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-biology-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-biology-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-biology-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-biology-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-biology-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-biology-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;
