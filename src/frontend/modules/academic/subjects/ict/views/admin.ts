export const ictViews = `
{view === 'admin-ssc-ict' && (
    <IctChapterList
        classLabel="SSC"
        subjectLabel="Information and Communication Technology"
        chapters={sscIctChapters}
        onAdd={addChapterItem(setSscIctChapters)}
        onUpdate={updateChapterItem(setSscIctChapters)}
        onDelete={removeChapterItem(setSscIctChapters)}
        onSelect={(chapter) => {
            setSelectedIctChapter(chapter);
            setSelectedIctClass('SSC');
            navigate('admin-ssc-ict-mcq');
        }}
        onBack={() => navigate('admin-groups-ssc')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-ict-mcq' && (
    <McqQuestionList
        classLabel={selectedIctClass}
        itemName={selectedIctChapter?.name || 'নির্বাচিত অধ্যায়'}
        questions={mcqQuestions[getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        itemRoute={selectedIctClass === 'HSC' ? 'admin-hsc-ict' : 'admin-ssc-ict'}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapters={hscIctChapters}
        onAdd={addChapterItem(setHscIctChapters)}
        onUpdate={updateChapterItem(setHscIctChapters)}
        onDelete={removeChapterItem(setHscIctChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Information and Communication Technology',
                questionKey: 'ICT'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-ict-topics');
        }}
        onBack={() => navigate('admin-groups-hsc')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-ict-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscIctChapters)}
        onUpdateTopic={updateTopicItem(setHscIctChapters)}
        onDeleteTopic={removeTopicItem(setHscIctChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-ict-topic');
        }}
        onBack={() => navigate('admin-hsc-ict')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-ict-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'ICT', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-ict-topics')}
        onNavigateCq={() => navigate('admin-hsc-ict-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-ict-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-ict-topic"
        questionRoute="admin-hsc-ict-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict-cq-questions' && (
    selectedScienceCqType?.key === 'scenario' ? (
        <SrijonshilScenarioList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            itemRoute="admin-hsc-ict-cq-types"
            onNavigate={navigate}
        />
    ) : (
        <SrijonshilQuestionList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            itemRoute="admin-hsc-ict-cq-types"
            onNavigate={navigate}
        />
    )
)}
{view === 'admin-hsc-ict-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        itemRoute="admin-hsc-ict-topic"
        onNavigate={navigate}
    />
)}
`;
