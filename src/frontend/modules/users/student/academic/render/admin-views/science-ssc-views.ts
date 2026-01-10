export const scienceSscViews = `
{view === 'admin-ssc-physics' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Physics"
        chapters={sscPhysicsChapters}
        onAdd={addChapterItem(setSscPhysicsChapters)}
        onUpdate={updateChapterItem(setSscPhysicsChapters)}
        onDelete={removeChapterItem(setSscPhysicsChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Physics'
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-physics-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-physics-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Physics"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setSscPhysicsChapters)}
        onUpdateTopic={updateTopicItem(setSscPhysicsChapters)}
        onDeleteTopic={removeTopicItem(setSscPhysicsChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-physics-topic');
        }}
        onBack={() => navigate('admin-ssc-physics')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-physics-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Physics"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-physics-topics')}
        onNavigateCq={() => navigate('admin-ssc-physics-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-physics-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-physics-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-ssc-physics-topic"
        questionRoute="admin-ssc-physics-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-physics-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-ssc-physics-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-physics-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
        itemRoute="admin-ssc-physics-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-chemistry' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Chemistry"
        chapters={sscChemistryChapters}
        onAdd={addChapterItem(setSscChemistryChapters)}
        onUpdate={updateChapterItem(setSscChemistryChapters)}
        onDelete={removeChapterItem(setSscChemistryChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Chemistry'
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-chemistry-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-chemistry-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Chemistry"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setSscChemistryChapters)}
        onUpdateTopic={updateTopicItem(setSscChemistryChapters)}
        onDeleteTopic={removeTopicItem(setSscChemistryChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-chemistry-topic');
        }}
        onBack={() => navigate('admin-ssc-chemistry')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-chemistry-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Chemistry"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-chemistry-topics')}
        onNavigateCq={() => navigate('admin-ssc-chemistry-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-chemistry-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-chemistry-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-ssc-chemistry-topic"
        questionRoute="admin-ssc-chemistry-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-chemistry-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-ssc-chemistry-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-chemistry-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-chemistry-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-biology' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Biology"
        chapters={sscBiologyChapters}
        onAdd={addChapterItem(setSscBiologyChapters)}
        onUpdate={updateChapterItem(setSscBiologyChapters)}
        onDelete={removeChapterItem(setSscBiologyChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Biology'
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-biology-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-biology-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Biology"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setSscBiologyChapters)}
        onUpdateTopic={updateTopicItem(setSscBiologyChapters)}
        onDeleteTopic={removeTopicItem(setSscBiologyChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-biology-topic');
        }}
        onBack={() => navigate('admin-ssc-biology')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-biology-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Biology"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-biology-topics')}
        onNavigateCq={() => navigate('admin-ssc-biology-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-biology-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-biology-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-ssc-biology-topic"
        questionRoute="admin-ssc-biology-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-biology-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-ssc-biology-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-biology-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-biology-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapters={sscBangladeshGlobalChapters}
        onAdd={addChapterItem(setSscBangladeshGlobalChapters)}
        onUpdate={updateChapterItem(setSscBangladeshGlobalChapters)}
        onDelete={removeChapterItem(setSscBangladeshGlobalChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Bangladesh and Global Studies'
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-bangladesh-global-studies-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setSscBangladeshGlobalChapters)}
        onUpdateTopic={updateTopicItem(setSscBangladeshGlobalChapters)}
        onDeleteTopic={removeTopicItem(setSscBangladeshGlobalChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-bangladesh-global-studies-topic');
        }}
        onBack={() => navigate('admin-ssc-bangladesh-global-studies')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', 'Bangladesh and Global Studies', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-bangladesh-global-studies-topics')}
        onNavigateCq={() => navigate('admin-ssc-bangladesh-global-studies-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-bangladesh-global-studies-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-ssc-bangladesh-global-studies-topic"
        questionRoute="admin-ssc-bangladesh-global-studies-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey(
                    'SSC',
                    'Bangladesh and Global Studies',
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        typeRoute="admin-ssc-bangladesh-global-studies-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[
                getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
            ] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-bangladesh-global-studies-topic"
        onNavigate={navigate}
    />
)}
`;
