export const religionViews = `
{view === 'admin-ssc-religion' && (
    <ReligionSelectionList
        classLabel="SSC"
        options={religionOptions}
        onSelect={(option) => {
            setSelectedReligion(option);
            setSelectedScienceChapter(null);
            setSelectedScienceTopic(null);
            navigate('admin-ssc-religion-chapters');
        }}
        onBack={() => navigate('admin-groups-ssc')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-chapters' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapters={sscReligionChapters[selectedReligion?.key] || []}
        onBack={() => navigate('admin-ssc-religion')}
        onAdd={(chapter) =>
            selectedReligion?.key &&
            addReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapter)
        }
        onUpdate={(chapterId, name) =>
            selectedReligion?.key &&
            updateReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapterId, name)
        }
        onDelete={(chapterId) =>
            selectedReligion?.key &&
            removeReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapterId)
        }
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Religion and Moral Education',
                religionKey: selectedReligion?.key
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-religion-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-religion-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapter={selectedScienceChapter}
        onAddTopic={(chapterId, topic) =>
            selectedReligion?.key &&
            addReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topic)
        }
        onUpdateTopic={(chapterId, topicId, name) =>
            selectedReligion?.key &&
            updateReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topicId, name)
        }
        onDeleteTopic={(chapterId, topicId) =>
            selectedReligion?.key &&
            removeReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topicId)
        }
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-religion-topic');
        }}
        onBack={() => navigate('admin-ssc-religion-chapters')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-religion-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-religion-topics')}
        onNavigateCq={() => navigate('admin-ssc-religion-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-religion-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        itemRoute="admin-ssc-religion-topic"
        questionRoute="admin-ssc-religion-cq-questions"
        title="CQ প্রশ্ন"
        subtitle={(selectedScienceTopic?.name || 'নির্বাচিত টপিক') + ' এর প্রশ্নের ধরন নির্বাচন করুন।'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-cq-questions' && (
    selectedScienceCqType?.key === 'scenario' ? (
        <SrijonshilScenarioList
            classLabel="SSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey(
                        'SSC',
                        getReligionSubjectKey(selectedReligion),
                        activeScienceTopicKey,
                        selectedScienceCqType?.key
                    )
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            typeRoute="admin-ssc-religion-cq-types"
            onNavigate={navigate}
        />
    ) : (
        <SrijonshilQuestionList
            classLabel="SSC"
            itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
            typeLabel={selectedScienceCqType?.label || 'CQ প্রশ্ন'}
            questions={
                srijonshilQuestions[
                    getQuestionKey(
                        'SSC',
                        getReligionSubjectKey(selectedReligion),
                        activeScienceTopicKey,
                        selectedScienceCqType?.key
                    )
                ] || []
            }
            onAdd={addQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            onUpdate={updateQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            onDelete={removeQuestionEntry(
                setSrijonshilQuestions,
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            )}
            typeRoute="admin-ssc-religion-cq-types"
            onNavigate={navigate}
        />
    )
)}
{view === 'admin-ssc-religion-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || 'নির্বাচিত টপিক'}
        questions={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-religion-topic"
        onNavigate={navigate}
    />
)}
`;
