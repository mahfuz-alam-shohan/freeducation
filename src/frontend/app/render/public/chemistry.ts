export const renderChemistry = `
{/* SSC Chemistry */}
{view === 'public-ssc-chemistry' && (
    <PublicScienceShell
        subjectLabel="Chemistry"
        classLabel="SSC"
        title="Chemistry অধ্যায়সমূহ"
        subtitle="SSC Chemistry এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('ssc-subjects')}
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
        onBack={() => goBack('public-ssc-chemistry')}
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
                []
        }}
        mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => goBack('public-ssc-chemistry-topics')}
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
                []
        }}
        onBack={() => goBack('public-ssc-chemistry-topic')}
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
        onBack={() => goBack('public-ssc-chemistry-topic')}
        onNavigate={navigate}
    />
)}

{/* HSC Chemistry 1st Paper */}
{view === 'public-hsc-chemistry-1st' && (
    <PublicScienceShell
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        title="Chemistry 1st Paper অধ্যায়সমূহ"
        subtitle="HSC Chemistry 1st Paper এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('hsc-subjects')}
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
        onBack={() => goBack('public-hsc-chemistry-1st')}
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
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => goBack('public-hsc-chemistry-1st-topics')}
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
                ] || []
        }}
        onBack={() => goBack('public-hsc-chemistry-1st-topic')}
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
        onBack={() => goBack('public-hsc-chemistry-1st-topic')}
        onNavigate={navigate}
    />
)}

{/* HSC Chemistry 2nd Paper */}
{view === 'public-hsc-chemistry-2nd' && (
    <PublicScienceShell
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        title="Chemistry 2nd Paper অধ্যায়সমূহ"
        subtitle="HSC Chemistry 2nd Paper এর অধ্যায় বেছে নিন।"
        onBack={() => goBack('hsc-subjects')}
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
        onBack={() => goBack('public-hsc-chemistry-2nd')}
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
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => goBack('public-hsc-chemistry-2nd-topics')}
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
                ] || []
        }}
        onBack={() => goBack('public-hsc-chemistry-2nd-topic')}
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
        onBack={() => goBack('public-hsc-chemistry-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;
