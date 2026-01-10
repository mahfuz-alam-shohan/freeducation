export const scienceHscViews = `
{view === 'admin-hsc-physics-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapters={hscPhysics1stChapters}
        onAdd={addChapterItem(setHscPhysics1stChapters)}
        onUpdate={updateChapterItem(setHscPhysics1stChapters)}
        onDelete={removeChapterItem(setHscPhysics1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Physics 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-physics-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-physics-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscPhysics1stChapters)}
        onUpdateTopic={updateTopicItem(setHscPhysics1stChapters)}
        onDeleteTopic={removeTopicItem(setHscPhysics1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-physics-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-physics-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-physics-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-physics-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-physics-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-physics-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-physics-1st-topic"
        questionRoute="admin-hsc-physics-1st-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-physics-1st-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-physics-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapters={hscPhysics2ndChapters}
        onAdd={addChapterItem(setHscPhysics2ndChapters)}
        onUpdate={updateChapterItem(setHscPhysics2ndChapters)}
        onDelete={removeChapterItem(setHscPhysics2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Physics 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-physics-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-physics-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscPhysics2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscPhysics2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscPhysics2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-physics-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-physics-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-physics-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-physics-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-physics-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-physics-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-physics-2nd-topic"
        questionRoute="admin-hsc-physics-2nd-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-physics-2nd-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-physics-2nd-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapters={hscChemistry1stChapters}
        onAdd={addChapterItem(setHscChemistry1stChapters)}
        onUpdate={updateChapterItem(setHscChemistry1stChapters)}
        onDelete={removeChapterItem(setHscChemistry1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Chemistry 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-chemistry-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-chemistry-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscChemistry1stChapters)}
        onUpdateTopic={updateTopicItem(setHscChemistry1stChapters)}
        onDeleteTopic={removeTopicItem(setHscChemistry1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-chemistry-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-chemistry-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-chemistry-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-chemistry-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-chemistry-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-chemistry-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-chemistry-1st-topic"
        questionRoute="admin-hsc-chemistry-1st-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-chemistry-1st-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-chemistry-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapters={hscChemistry2ndChapters}
        onAdd={addChapterItem(setHscChemistry2ndChapters)}
        onUpdate={updateChapterItem(setHscChemistry2ndChapters)}
        onDelete={removeChapterItem(setHscChemistry2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Chemistry 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-chemistry-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-chemistry-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscChemistry2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscChemistry2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscChemistry2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-chemistry-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-chemistry-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-chemistry-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-chemistry-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-chemistry-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-chemistry-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-hsc-chemistry-2nd-topic"
        questionRoute="admin-hsc-chemistry-2nd-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-chemistry-2nd-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-chemistry-2nd-topic"
        onNavigate={navigate}
    />
)}
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
