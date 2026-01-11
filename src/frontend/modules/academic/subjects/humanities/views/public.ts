export const humanitiesViews = `
{view === 'public-ssc-bangladesh-global-studies' && (
    <PublicScienceShell
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        title="Bangladesh & Global Studies অধ্যায়সমূহ"
        subtitle="বাংলাদেশ ও বিশ্বপরিচয় বিষয়টির অধ্যায় বেছে নিন।"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Bangladesh and Global Studies"
            chapters={sscBangladeshGlobalChapters}
            recentRoute="public-ssc-bangladesh-global-studies"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Bangladesh and Global Studies'
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-bangladesh-global-studies-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-bangladesh-global-studies-topics' && (
    <PublicScienceShell
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-ssc-bangladesh-global-studies')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-bangladesh-global-studies-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-bangladesh-global-studies-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', 'Bangladesh and Global Studies', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-bangladesh-global-studies-cq')}
        onNavigateMcq={() => navigate('public-ssc-bangladesh-global-studies-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-bangladesh-global-studies-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-bangladesh-global-studies-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-bangladesh-global-studies-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topic')}
        onNavigate={navigate}
    />
)}
`;
