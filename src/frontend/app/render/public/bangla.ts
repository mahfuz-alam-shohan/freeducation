export const renderBangla = `
{view === 'public-bangla-ssc-1st-paper' && (
    <PublicBanglaShell
        title="বাংলা ১ম পত্র"
        subtitle="SSC শ্রেণির পাঠ তালিকা নির্বাচন করুন।"
        onBack={() => goBack('ssc-subjects')}
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
        onBack={() => goBack('hsc-subjects')}
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
        onBack={() => goBack('public-bangla-ssc-1st-paper')}
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
        onBack={() => goBack('public-bangla-hsc-1st-paper')}
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
        onBack={() => goBack('public-bangla-ssc-shahitto')}
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
        onBack={() => goBack('public-bangla-ssc-shahitto')}
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
        onBack={() => goBack('public-bangla-hsc-shahitto')}
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
        onBack={() => goBack('public-bangla-hsc-shahitto')}
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
        onBack={() => goBack('public-bangla-ssc-1st-paper')}
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
        onBack={() => goBack('public-bangla-hsc-1st-paper')}
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
        onBack={() => goBack('public-bangla-ssc-shahitto')}
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
        onBack={() => goBack('public-bangla-hsc-shahitto')}
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
        onBack={() => goBack('public-bangla-ssc-item')}
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
        onBack={() => goBack('public-bangla-hsc-item')}
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
        onBack={() => goBack('public-bangla-ssc-item')}
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
        onBack={() => goBack('public-bangla-hsc-item')}
    />
)}
`;
