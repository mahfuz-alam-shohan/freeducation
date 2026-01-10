export const englishViews = `
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
