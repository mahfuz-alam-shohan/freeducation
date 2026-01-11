export const ictViews = `
{view === 'public-ssc-ict' && (
    <PublicIctShell
        title="আইসিটি অধ্যায়সমূহ"
        subtitle="SSC আইসিটির অধ্যায় বেছে নিন।"
        classLabel="SSC"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicIctChapterList
            classLabel="SSC"
            subjectLabel="Information and Communication Technology"
            chapters={sscIctChapters}
            recentRoute="public-ssc-ict"
            onSelectChapter={(chapter) => {
                setSelectedIctChapter(chapter);
                setSelectedIctClass('SSC');
                navigate('public-ssc-ict-mcq');
            }}
        />
    </PublicIctShell>
)}
{view === 'public-ssc-ict-mcq' && (
    <PublicIctMcqDetail
        classLabel={selectedIctClass}
        chapter={selectedIctChapter}
        mcqQuestions={mcqQuestions}
        getQuestionKey={getQuestionKey}
        onBack={() => navigate('public-ssc-ict')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict' && (
    <PublicScienceShell
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        title="আইসিটি অধ্যায়সমূহ"
        subtitle="HSC আইসিটির অধ্যায় বেছে নিন।"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Information and Communication Technology"
            chapters={hscIctChapters}
            recentRoute="public-hsc-ict"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Information and Communication Technology',
                    questionKey: 'ICT'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-ict-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-ict-topics' && (
    <PublicScienceShell
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-hsc-ict')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-ict-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-ict-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'ICT', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-ict-cq')}
        onNavigateMcq={() => navigate('public-hsc-ict-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-ict-topic"
        cqQuestions={{
            gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || [],
            scenario:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'scenario')] || []
        }}
        mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-hsc-ict-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || []
        }}
        onBack={() => navigate('public-hsc-ict-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-hsc-ict-topic')}
        onNavigate={navigate}
    />
)}
`;
