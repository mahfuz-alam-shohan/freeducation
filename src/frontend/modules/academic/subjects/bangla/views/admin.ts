export const banglaViews = `
{view === 'bangla-ssc-1st-paper' && (
    <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-hsc-1st-paper' && (
    <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-ssc-shahitto' && (
    <BanglaShahitto classLabel="SSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-hsc-shahitto' && (
    <BanglaShahitto classLabel="HSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
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
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-ssc-item' && (
    <BanglaItemDetail
        classLabel="SSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onNavigate={navigate}
    />
)}
{view === 'bangla-hsc-item' && (
    <BanglaItemDetail
        classLabel="HSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
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
`;
