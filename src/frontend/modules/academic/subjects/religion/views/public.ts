export const religionViews = `
{view === 'public-ssc-religion' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title="Religion and Moral Education"
        subtitle="ধর্ম নির্বাচন করুন।"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicReligionOptionList
            options={religionOptions}
            onSelect={(option) => {
                setSelectedReligion(option);
                setSelectedScienceChapter(null);
                setSelectedScienceTopic(null);
                navigate('public-ssc-religion-chapters');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-chapters' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title="Religion & Moral Education অধ্যায়সমূহ"
        subtitle={selectedReligion?.subtitle || 'ধর্ম নির্বাচন করুন'}
        onBack={() => navigate('public-ssc-religion')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Religion and Moral Education"
            chapters={sscReligionChapters[selectedReligion?.key] || []}
            recentRoute="public-ssc-religion-chapters"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Religion and Moral Education',
                    religionKey: selectedReligion?.key
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-religion-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-topics' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
        subtitle="টপিক নির্বাচন করুন"
        onBack={() => navigate('public-ssc-religion-chapters')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-religion-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-religion-cq')}
        onNavigateMcq={() => navigate('public-ssc-religion-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-religion-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-religion-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-religion-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-ssc-religion-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-religion-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-religion-topic')}
        onNavigate={navigate}
    />
)}
`;
