export const englishViews = `
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
`;
