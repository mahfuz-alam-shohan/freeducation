export const renderAdmin = `
{view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} />}
                        {view === 'register' && <AuthForm mode="register" onSubmit={handleRegister} />}
                        {view === 'dashboard' && user?.role === 'teacher' && (
                            <TeacherDashboard assignment={user.assignment} subjectConfig={teacherSubjectConfig} onNavigate={navigate} />
                        )}
                        {view === 'dashboard' && (!user || user.role !== 'teacher') && (
                            <AdminDashboard onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-ssc' && (
                            <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-groups-hsc' && (
                            <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-science' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-humanities' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-business-studies' && (
                            <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'admin-ssc-ict' && (
                            <IctChapterList
                                chapters={sscIctChapters}
                                onAdd={addChapterItem(setSscIctChapters)}
                                onUpdate={updateChapterItem(setSscIctChapters)}
                                onDelete={removeChapterItem(setSscIctChapters)}
                                onSelect={(chapter) => {
                                    setSelectedIctChapter(chapter);
                                    navigate('admin-ssc-ict-mcq');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-ssc-ict-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedIctChapter?.name || 'নির্বাচিত অধ্যায়'}
                                questions={mcqQuestions[getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'ICT', selectedIctChapter?.id, 'mcq'))}
                                itemRoute="admin-ssc-ict"
                                onNavigate={navigate}
                            />
                        )}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-physics-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-chemistry-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-ssc-biology-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-physics-1st-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-physics-2nd-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-chemistry-1st-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-chemistry-2nd-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-biology-1st-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                                    setSelectedScienceTopic(null);
                                    navigate('admin-hsc-biology-2nd-topics');
                                }}
                                onNavigate={navigate}
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
                                onUpdateNotes={setNotesByItem}
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
                        {view === 'admin-hsc-science' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-humanities' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} />
                        )}
                        {view === 'admin-hsc-business-studies' && (
                            <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-1st-paper' && (
                            <EnglishFirstPaperHome classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'english-hsc-reading' && (
                            <EnglishSectionList
                                title="Reading"
                                subtitle="Select a reading question type."
                                items={englishReadingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Reading');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-writing' && (
                            <EnglishSectionList
                                title="Writing"
                                subtitle="Select a writing question type."
                                items={englishWritingTypes}
                                onBack={() => navigate('english-hsc-1st-paper')}
                                onSelect={(item) => {
                                    setSelectedEnglishSection('Writing');
                                    setSelectedEnglishType(item);
                                    setSelectedEnglishSubtype(null);
                                    if (item.children?.length) {
                                        navigate('english-hsc-subtypes');
                                    } else {
                                        navigate('english-hsc-questions');
                                    }
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-subtypes' && (
                            <EnglishSectionList
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Choose a specific question variation."
                                items={selectedEnglishType?.children || []}
                                onBack={() =>
                                    navigate(selectedEnglishSection === 'Writing' ? 'english-hsc-writing' : 'english-hsc-reading')
                                }
                                onSelect={(child) => {
                                    setSelectedEnglishSubtype(child);
                                    navigate('english-hsc-questions');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'english-hsc-questions' && (
                            <EnglishQuestionList
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                questions={englishQuestionEntries}
                                onAdd={addQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onUpdate={updateQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onDelete={removeQuestionEntry(setEnglishQuestions, englishQuestionKey)}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'english-hsc-writing'
                                                : 'english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-1st-paper' && (
                            <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shahitto' && (
                            <BanglaShahitto classLabel="SSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-hsc-shahitto' && (
                            <BanglaShahitto classLabel="HSC" onNavigate={navigate} />
                        )}
                        {view === 'bangla-ssc-shohopath' && (
                            <BanglaShohopath
                                classLabel="SSC"
                                items={sscShohopathItems}
                                onAddItem={addShohopathItem(setSscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setSscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setSscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-shohopath' && (
                            <BanglaShohopath
                                classLabel="HSC"
                                items={hscShohopathItems}
                                onAddItem={addShohopathItem(setHscShohopathItems)}
                                onUpdateItem={updateShohopathItem(setHscShohopathItems)}
                                onRemoveItem={removeShohopathItem(setHscShohopathItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item.name);
                                    setSelectedBanglaCategory(item.type);
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-goddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="গদ্য"
                                items={sscGoddoItems}
                                onAddItem={addStringItem(setSscGoddoItems)}
                                onUpdateItem={updateStringItem(setSscGoddoItems)}
                                onRemoveItem={removeStringItem(setSscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-poddo' && (
                            <BanglaTextList
                                classLabel="SSC"
                                typeLabel="পদ্য"
                                items={sscPoddoItems}
                                onAddItem={addStringItem(setSscPoddoItems)}
                                onUpdateItem={updateStringItem(setSscPoddoItems)}
                                onRemoveItem={removeStringItem(setSscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-ssc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-goddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="গদ্য"
                                items={hscGoddoItems}
                                onAddItem={addStringItem(setHscGoddoItems)}
                                onUpdateItem={updateStringItem(setHscGoddoItems)}
                                onRemoveItem={removeStringItem(setHscGoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('গদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-hsc-poddo' && (
                            <BanglaTextList
                                classLabel="HSC"
                                typeLabel="পদ্য"
                                items={hscPoddoItems}
                                onAddItem={addStringItem(setHscPoddoItems)}
                                onUpdateItem={updateStringItem(setHscPoddoItems)}
                                onRemoveItem={removeStringItem(setHscPoddoItems)}
                                onSelectItem={(item) => {
                                    setSelectedBanglaItem(item);
                                    setSelectedBanglaCategory('পদ্য');
                                    navigate('bangla-hsc-item');
                                }}
                                onNavigate={navigate}
                                showAdd
                            />
                        )}
                        {view === 'bangla-ssc-item' && (
                            <BanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-item' && (
                            <BanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onUpdateNotes={setNotesByItem}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-types' && (
                            <SrijonshilTypeList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                onSelectType={setSelectedSrijonshilType}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-srijonshil-questions' && (
                            <SrijonshilQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                typeLabel={selectedSrijonshilType?.label || 'সৃজনশীল'}
                                questions={srijonshilQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
                                onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-ssc-mcq' && (
                            <McqQuestionList
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'bangla-hsc-mcq' && (
                            <McqQuestionList
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                questions={mcqQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
                                onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'admin-settings' && user?.role === 'teacher' && <TeacherSettings onNavigate={navigate} />}
                        {view === 'admin-settings' && (!user || user.role !== 'teacher') && <AdminSettings onNavigate={navigate} />}
                    `;
