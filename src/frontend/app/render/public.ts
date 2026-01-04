export const renderPublic = `
{view === 'landing' && <StudentLanding onNavigate={navigate} />}
                        {view === 'public-videos' && (
                            <PublicVideoList
                                context={selectedVideoContext}
                                videosByItem={videosByItem}
                                onBack={
                                    selectedVideoContext?.backRoute
                                        ? () => navigate(selectedVideoContext.backRoute)
                                        : null
                                }
                                onNavigate={navigate}
                                onSelectVideo={(video, context) => {
                                    setSelectedVideoId(video.id);
                                    if (context) {
                                        setSelectedVideoContext(context);
                                    }
                                    navigate('public-video-player');
                                }}
                            />
                        )}
                        {view === 'public-video-player' && (
                            <PublicVideoDetail
                                context={selectedVideoContext}
                                videoId={selectedVideoId}
                                videosByItem={videosByItem}
                                onBack={() => navigate('public-videos')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'ssc-subjects' && (
                            <SubjectIndexPage classLabel="SSC" subjects={sscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'hsc-subjects' && (
                            <SubjectIndexPage classLabel="HSC" subjects={hscSubjects} onNavigate={navigate} />
                        )}
                        {view === 'public-ssc-ict' && (
                            <PublicIctShell
                                title="আইসিটি অধ্যায়সমূহ"
                                subtitle="SSC আইসিটির অধ্যায় বেছে নিন।"
                                classLabel="SSC"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicIctChapterList
                                    classLabel="SSC"
                                    subjectLabel="Information and Communication Technology"
                                    chapters={sscIctChapters}
                                    recentRoute="public-ssc-ict"
                                    onSelectChapter={(chapter) => {
                                        setSelectedIctChapter(chapter);
                                        setSelectedIctClass('SSC');
                                        navigate('public-ssc-ict-mcq');
                                    }}
                                />
                            </PublicIctShell>
                        )}
                        {view === 'public-ssc-ict-mcq' && (
                            <PublicIctMcqDetail
                                classLabel={selectedIctClass}
                                chapter={selectedIctChapter}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onBack={() => navigate('public-ssc-ict')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-ict' && (
                            <PublicScienceShell
                                subjectLabel="Information and Communication Technology"
                                classLabel="HSC"
                                title="আইসিটি অধ্যায়সমূহ"
                                subtitle="HSC আইসিটির অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Information and Communication Technology"
                                    chapters={hscIctChapters}
                                    recentRoute="public-hsc-ict"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'HSC',
                                            subjectLabel: 'Information and Communication Technology',
                                            questionKey: 'ICT'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-ict-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-ict-topics' && (
                            <PublicScienceShell
                                subjectLabel="Information and Communication Technology"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-ict')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-ict-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-ict-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Information and Communication Technology"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'ICT', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-hsc-ict-cq')}
                                onNavigateMcq={() => navigate('public-hsc-ict-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-hsc-ict-topic"
                                cqQuestions={{
                                    gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || []
                                }}
                                mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-hsc-ict-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-ict-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Information and Communication Technology"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || []
                                }}
                                onBack={() => navigate('public-hsc-ict-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-ict-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Information and Communication Technology"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-hsc-ict-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-physics' && (
                            <PublicScienceShell
                                subjectLabel="Physics"
                                classLabel="SSC"
                                title="Physics অধ্যায়সমূহ"
                                subtitle="SSC Physics এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="SSC"
                                    subjectLabel="Physics"
                                    chapters={sscPhysicsChapters}
                                    recentRoute="public-ssc-physics"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'SSC',
                                            subjectLabel: 'Physics'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-ssc-physics-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-physics-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics"
                                classLabel="SSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-ssc-physics')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-ssc-physics-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-physics-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-ssc-physics-cq')}
                                onNavigateMcq={() => navigate('public-ssc-physics-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-ssc-physics-topic"
                                cqQuestions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-physics-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-physics-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                onBack={() => navigate('public-ssc-physics-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-physics-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-physics-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-chemistry' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry"
                                classLabel="SSC"
                                title="Chemistry অধ্যায়সমূহ"
                                subtitle="SSC Chemistry এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
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
                                onBack={() => navigate('public-ssc-chemistry')}
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
                                onBack={() => navigate('public-ssc-chemistry-topics')}
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
                                onBack={() => navigate('public-ssc-chemistry-topic')}
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
                                onBack={() => navigate('public-ssc-chemistry-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-biology' && (
                            <PublicScienceShell
                                subjectLabel="Biology"
                                classLabel="SSC"
                                title="Biology অধ্যায়সমূহ"
                                subtitle="SSC Biology এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="SSC"
                                    subjectLabel="Biology"
                                    chapters={sscBiologyChapters}
                                    recentRoute="public-ssc-biology"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'SSC',
                                            subjectLabel: 'Biology'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-ssc-biology-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-biology-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology"
                                classLabel="SSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-ssc-biology')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-ssc-biology-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-ssc-biology-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-ssc-biology-cq')}
                                onNavigateMcq={() => navigate('public-ssc-biology-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-ssc-biology-topic"
                                cqQuestions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-biology-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-biology-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
                                    onudhabon:
                                        srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
                                        []
                                }}
                                onBack={() => navigate('public-ssc-biology-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-ssc-biology-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology"
                                classLabel="SSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
                                onBack={() => navigate('public-ssc-biology-topic')}
                                onNavigate={navigate}
                            />
                        )}
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
                        {view === 'public-hsc-physics-1st' && (
                            <PublicScienceShell
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                title="Physics 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Physics 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Physics 1st Paper"
                                    chapters={hscPhysics1stChapters}
                                    recentRoute="public-hsc-physics-1st"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'HSC',
                                            subjectLabel: 'Physics 1st Paper'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-physics-1st-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-1st-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-physics-1st')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-physics-1st-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-1st-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-hsc-physics-1st-cq')}
                                onNavigateMcq={() => navigate('public-hsc-physics-1st-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-hsc-physics-1st-topic"
                                cqQuestions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-1st-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-1st-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-physics-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-1st-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                title="Physics 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Physics 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Physics 2nd Paper"
                                    chapters={hscPhysics2ndChapters}
                                    recentRoute="public-hsc-physics-2nd"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'HSC',
                                            subjectLabel: 'Physics 2nd Paper'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-physics-2nd-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-2nd-topics' && (
                            <PublicScienceShell
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-physics-2nd')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-physics-2nd-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-physics-2nd-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-hsc-physics-2nd-cq')}
                                onNavigateMcq={() => navigate('public-hsc-physics-2nd-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-hsc-physics-2nd-topic"
                                cqQuestions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-2nd-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                                        [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-physics-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-physics-2nd-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Physics 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-physics-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-1st' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 1st Paper"
                                classLabel="HSC"
                                title="Chemistry 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Chemistry 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
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
                                onBack={() => navigate('public-hsc-chemistry-1st')}
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
                                onBack={() => navigate('public-hsc-chemistry-1st-topics')}
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
                                onBack={() => navigate('public-hsc-chemistry-1st-topic')}
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
                                onBack={() => navigate('public-hsc-chemistry-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-chemistry-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Chemistry 2nd Paper"
                                classLabel="HSC"
                                title="Chemistry 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Chemistry 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
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
                                onBack={() => navigate('public-hsc-chemistry-2nd')}
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
                                onBack={() => navigate('public-hsc-chemistry-2nd-topics')}
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
                                onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
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
                                onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-1st' && (
                            <PublicScienceShell
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                title="Biology 1st Paper অধ্যায়সমূহ"
                                subtitle="HSC Biology 1st Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Biology 1st Paper"
                                    chapters={hscBiology1stChapters}
                                    recentRoute="public-hsc-biology-1st"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'HSC',
                                            subjectLabel: 'Biology 1st Paper'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-biology-1st-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-1st-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-biology-1st')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-biology-1st-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-1st-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-hsc-biology-1st-cq')}
                                onNavigateMcq={() => navigate('public-hsc-biology-1st-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-hsc-biology-1st-topic"
                                cqQuestions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-1st-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-1st-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-biology-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-1st-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology 1st Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-1st-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd' && (
                            <PublicScienceShell
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                title="Biology 2nd Paper অধ্যায়সমূহ"
                                subtitle="HSC Biology 2nd Paper এর অধ্যায় বেছে নিন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicScienceChapterList
                                    classLabel="HSC"
                                    subjectLabel="Biology 2nd Paper"
                                    chapters={hscBiology2ndChapters}
                                    recentRoute="public-hsc-biology-2nd"
                                    onSelectChapter={(chapter) => {
                                        setSelectedScienceChapter(chapter);
                                        setSelectedScienceSubject({
                                            classLabel: 'HSC',
                                            subjectLabel: 'Biology 2nd Paper'
                                        });
                                        setSelectedScienceTopic(null);
                                        navigate('public-hsc-biology-2nd-topics');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-2nd-topics' && (
                            <PublicScienceShell
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                title={selectedScienceChapter?.name || 'অধ্যায় নির্বাচন করুন'}
                                subtitle="টপিক নির্বাচন করুন"
                                onBack={() => navigate('public-hsc-biology-2nd')}
                                onNavigate={navigate}
                            >
                                <PublicScienceTopicList
                                    topics={selectedScienceChapter?.topics || []}
                                    onSelectTopic={(topic) => {
                                        setSelectedScienceTopic(topic);
                                        navigate('public-hsc-biology-2nd-topic');
                                    }}
                                />
                            </PublicScienceShell>
                        )}
                        {view === 'public-hsc-biology-2nd-topic' && (
                            <PublicScienceTopicDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
                                notesByItem={notesByItem}
                                onNavigateCq={() => navigate('public-hsc-biology-2nd-cq')}
                                onNavigateMcq={() => navigate('public-hsc-biology-2nd-mcq')}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#ecfdf3]'
                                    });
                                    navigate('public-videos');
                                }}
                                backRoute="public-hsc-biology-2nd-topic"
                                cqQuestions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-2nd-topics')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd-cq' && (
                            <PublicScienceCqDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                questions={{
                                    gyan:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                                        ] || [],
                                    onudhabon:
                                        srijonshilQuestions[
                                            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                                        ] || []
                                }}
                                onBack={() => navigate('public-hsc-biology-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-hsc-biology-2nd-mcq' && (
                            <PublicScienceMcqDetail
                                subjectLabel="Biology 2nd Paper"
                                classLabel="HSC"
                                chapterName={selectedScienceChapter?.name}
                                topicName={selectedScienceTopic?.name}
                                mcqList={
                                    mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
                                }
                                onBack={() => navigate('public-hsc-biology-2nd-topic')}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="SSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('ssc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    topics={getBanglaTopics('SSC')}
                                    onNavigate={navigate}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-1st-paper' && (
                            <PublicBanglaShell
                                title="বাংলা ১ম পত্র"
                                subtitle="HSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    topics={getBanglaTopics('HSC')}
                                    onNavigate={navigate}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    topics={getBanglaShahittoTopics('SSC')}
                                    onNavigate={navigate}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shahitto' && (
                            <PublicBanglaShell
                                title="বাংলা সাহিত্য"
                                subtitle="গদ্য ও পদ্য অধ্যায় নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTopicGrid
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    topics={getBanglaShahittoTopics('HSC')}
                                    onNavigate={navigate}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="SSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="গদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="SSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-ssc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="পদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={sscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-goddo' && (
                            <PublicBanglaShell
                                title="গদ্য"
                                subtitle="HSC গদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="গদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscGoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('গদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-poddo' && (
                            <PublicBanglaShell
                                title="পদ্য"
                                subtitle="HSC পদ্য পাঠের তালিকা।"
                                onBack={() => navigate('public-bangla-hsc-shahitto')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaTextList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    categoryLabel="পদ্য"
                                    subtitle="আপনার পছন্দের পাঠ নির্বাচন করুন।"
                                    items={hscPoddoItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item);
                                        setSelectedBanglaCategory('পদ্য');
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="SSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-ssc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    classLabel="SSC"
                                    subjectLabel="Bangla 1st Paper"
                                    items={sscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-ssc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-hsc-shohopath' && (
                            <PublicBanglaShell
                                title="সহপাঠ"
                                subtitle="HSC সহপাঠ তালিকা নির্বাচন করুন।"
                                onBack={() => navigate('public-bangla-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicBanglaShohopathList
                                    classLabel="HSC"
                                    subjectLabel="Bangla 1st Paper"
                                    items={hscShohopathItems}
                                    onSelectItem={(item) => {
                                        setSelectedBanglaItem(item.name);
                                        setSelectedBanglaCategory(item.type);
                                        navigate('public-bangla-hsc-item');
                                    }}
                                />
                            </PublicBanglaShell>
                        )}
                        {view === 'public-bangla-ssc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#fff7ed]'
                                    });
                                    navigate('public-videos');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-item' && (
                            <PublicBanglaItemDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                notesByItem={notesByItem}
                                onOpenVideos={(context) => {
                                    setSelectedVideoContext({
                                        ...context,
                                        backgroundClass: 'bg-[#fff7ed]'
                                    });
                                    navigate('public-videos');
                                }}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-srijonshil' && (
                            <PublicBanglaSrijonshilDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                srijonshilQuestions={srijonshilQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-ssc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="SSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-bangla-hsc-mcq' && (
                            <PublicBanglaMcqDetail
                                classLabel="HSC"
                                itemName={selectedBanglaItem}
                                categoryName={selectedBanglaCategory}
                                mcqQuestions={mcqQuestions}
                                getQuestionKey={getQuestionKey}
                                onNavigate={navigate}
                            />
                        )}
                        {view === 'public-english-hsc-1st-paper' && (
                            <PublicEnglishShell
                                title="English 1st Paper"
                                subtitle="Select Reading or Writing to explore HSC English 1st Paper."
                                onBack={() => navigate('hsc-subjects')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishCardGrid
                                    items={[
                                        {
                                            key: 'reading',
                                            title: 'Reading',
                                            description: 'MCQ, comprehension, and passage-based tasks.',
                                            route: 'public-english-hsc-reading'
                                        },
                                        {
                                            key: 'writing',
                                            title: 'Writing',
                                            description: 'Paragraphs, stories, letters, and analysis tasks.',
                                            route: 'public-english-hsc-writing'
                                        }
                                    ]}
                                    onNavigate={navigate}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-reading' && (
                            <PublicEnglishShell
                                title="Reading"
                                subtitle="Choose a question type from the reading section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishReadingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Reading');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-writing' && (
                            <PublicEnglishShell
                                title="Writing"
                                subtitle="Choose a question type from the writing section."
                                onBack={() => navigate('public-english-hsc-1st-paper')}
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={englishWritingTypes}
                                    onSelect={(item) => {
                                        setSelectedEnglishSection('Writing');
                                        setSelectedEnglishType(item);
                                        setSelectedEnglishSubtype(null);
                                        if (item.children?.length) {
                                            navigate('public-english-hsc-subtypes');
                                        } else {
                                            navigate('public-english-hsc-questions');
                                        }
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-subtypes' && (
                            <PublicEnglishShell
                                title={selectedEnglishType?.label || 'Question type'}
                                subtitle="Select a specific option to view questions."
                                onBack={() =>
                                    navigate(
                                        selectedEnglishSection === 'Writing'
                                            ? 'public-english-hsc-writing'
                                            : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishTypeList
                                    items={selectedEnglishType?.children || []}
                                    onSelect={(child) => {
                                        setSelectedEnglishSubtype(child);
                                        navigate('public-english-hsc-questions');
                                    }}
                                />
                            </PublicEnglishShell>
                        )}
                        {view === 'public-english-hsc-questions' && (
                            <PublicEnglishShell
                                title={englishQuestionTitle}
                                subtitle={englishQuestionSubtitle}
                                onBack={() =>
                                    navigate(
                                        selectedEnglishType?.children?.length
                                            ? 'public-english-hsc-subtypes'
                                            : selectedEnglishSection === 'Writing'
                                                ? 'public-english-hsc-writing'
                                                : 'public-english-hsc-reading'
                                    )
                                }
                                onNavigate={navigate}
                            >
                                <PublicEnglishQuestionList questions={englishQuestionEntries} />
                            </PublicEnglishShell>
                        )}
                        `;
