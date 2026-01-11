export const scienceHscBiologyViews = `
{view === 'admin-hsc-biology-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapters={hscBiology1stChapters}
        onAdd={addChapterItem(setHscBiology1stChapters)}
        onUpdate={updateChapterItem(setHscBiology1stChapters)}
        onDelete={removeChapterItem(setHscBiology1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Biology 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-biology-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-biology-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscBiology1stChapters)}
        onUpdateTopic={updateTopicItem(setHscBiology1stChapters)}
        onDeleteTopic={removeTopicItem(setHscBiology1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-biology-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-biology-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-biology-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-biology-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-biology-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-biology-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-biology-1st-topic"
        questionRoute="admin-hsc-biology-1st-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-1st-cq-questions' && (
    selectedScienceCqType?.key === 'scenario' ? (
        <SrijonshilScenarioList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            typeRoute="admin-hsc-biology-1st-cq-types"
            onNavigate={navigate}
        />
    ) : (
        <SrijonshilQuestionList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            typeRoute="admin-hsc-biology-1st-cq-types"
            onNavigate={navigate}
        />
    )
)}
{view === 'admin-hsc-biology-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-biology-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapters={hscBiology2ndChapters}
        onAdd={addChapterItem(setHscBiology2ndChapters)}
        onUpdate={updateChapterItem(setHscBiology2ndChapters)}
        onDelete={removeChapterItem(setHscBiology2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Biology 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-biology-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-biology-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscBiology2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscBiology2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscBiology2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-biology-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-biology-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-biology-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-biology-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-biology-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-biology-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-biology-2nd-topic"
        questionRoute="admin-hsc-biology-2nd-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd-cq-questions' && (
    selectedScienceCqType?.key === 'scenario' ? (
        <SrijonshilScenarioList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            typeRoute="admin-hsc-biology-2nd-cq-types"
            onNavigate={navigate}
        />
    ) : (
        <SrijonshilQuestionList
            classLabel="HSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            )}
            typeRoute="admin-hsc-biology-2nd-cq-types"
            onNavigate={navigate}
        />
    )
)}
{view === 'admin-hsc-biology-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-biology-2nd-topic"
        onNavigate={navigate}
    />
)}
`;
