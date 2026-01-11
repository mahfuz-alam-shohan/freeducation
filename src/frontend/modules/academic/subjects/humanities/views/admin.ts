export const humanitiesAdminViews = `
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
