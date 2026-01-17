// Teacher Dashboard Components

export const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
  const hasAssignment = assignment && assignment.level && assignment.subject;
  
  return (
    <TeacherShell title="Teacher Portal" subtitle="Manage your assigned subject content." activeTab="subject" onNavigate={onNavigate}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        {!hasAssignment && (
          <div className="bg-white p-8 border border-slate-300 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-slate-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Subject Assignment</h3>
            <p className="text-slate-600 mb-4">
              You haven't been assigned to any subject yet. Please contact the administrator.
            </p>
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Settings
            </button>
          </div>
        )}

        {hasAssignment && (
          <>
            {/* Assignment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Your Assignment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-1">Class Level</h3>
                  <p className="text-lg font-semibold text-indigo-600">{assignment.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-1">Subject</h3>
                  <p className="text-lg font-semibold text-indigo-600">{assignment.subject}</p>
                </div>
              </div>
            </div>

            {/* Subject Management */}
            <SubjectManagement 
              classLabel={assignment.level}
              subjectName={assignment.subject}
              onNavigate={onNavigate}
            />
          </>
        )}
      </div>
    </TeacherShell>
  );
};

export const SubjectManagement = ({ classLabel, subjectName, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chapterThumbnails, setChapterThumbnails] = useState({});
  const [editingChapter, setEditingChapter] = useState(null);
  const { markRead } = useReadingProgress();

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/chapters?class=${classLabel}&subject=${subjectName}`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        if (data.success) {
          setChapters(data.chapters || []);
        }

        // Fetch thumbnails
        const thumbResponse = await fetch('/api/chapter-thumbnails', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const thumbData = await thumbResponse.json();
        const map = {};
        thumbData.forEach(thumb => {
          map[thumb.chapterKey] = thumb;
        });
        setChapterThumbnails(map);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [classLabel, subjectName]);

  const handleSaveChapter = async (chapterData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/chapter-content', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapter: makeChapterThumbnailKey(classLabel, subjectName, chapterData.id),
          content: chapterData
        })
      });

      const data = await response.json();
      if (data.success) {
        setChapters(prev => 
          prev.map(ch => ch.id === chapterData.id ? { ...ch, ...chapterData } : ch)
        );
        setEditingChapter(null);
      }
    } catch (error) {
      console.error('Failed to save chapter:', error);
    }
  };

  const handleUploadThumbnail = async (chapterId, file) => {
    if (!file) return;

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chapterKey', makeChapterThumbnailKey(classLabel, subjectName, chapterId));

      const response = await fetch('/api/chapter-thumbnails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setChapterThumbnails(prev => ({
          ...prev,
          [data.thumbnail.chapterKey]: data.thumbnail
        }));
      }
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: 'fa-file-alt' },
    { id: 'thumbnails', label: 'Thumbnails', icon: 'fa-image' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'content' && (
          <ChapterContentManagement
            chapters={chapters}
            loading={loading}
            chapterThumbnails={chapterThumbnails}
            onEdit={setEditingChapter}
            onSave={handleSaveChapter}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'thumbnails' && (
          <ThumbnailManagement
            chapters={chapters}
            classLabel={classLabel}
            subjectName={subjectName}
            chapterThumbnails={chapterThumbnails}
            onUpload={handleUploadThumbnail}
          />
        )}

        {activeTab === 'settings' && (
          <SubjectSettings
            classLabel={classLabel}
            subjectName={subjectName}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};

const ChapterContentManagement = ({ chapters, loading, chapterThumbnails, onEdit, onSave, onNavigate }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Chapter Content</h3>
        <button
          onClick={() => onEdit({ id: null, title: '', content: '' })}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Chapter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapters List */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-700">Chapters</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                onClick={() => setSelectedChapter(chapter)}
              >
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">{chapter.title}</h5>
                  {chapter.description && (
                    <p className="text-sm text-slate-600">{chapter.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {chapterThumbnails[makeChapterThumbnailKey(chapter.id)] && (
                    <img
                      src={chapterThumbnails[makeChapterThumbnailKey(chapter.id)]?.url}
                      alt={chapter.title}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(chapter);
                    }}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Editor */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-700">Chapter Editor</h4>
          {selectedChapter ? (
            <ChapterEditor
              chapter={selectedChapter}
              onSave={onSave}
              onCancel={() => setSelectedChapter(null)}
            />
          ) : (
            <div className="text-center py-8 text-slate-500">
              <i className="fas fa-file-alt text-4xl mb-4"></i>
              <p>Select a chapter to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChapterEditor = ({ chapter, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: chapter.title || '',
    description: chapter.description || '',
    content: chapter.content || ''
  });

  const handleSave = () => {
    onSave({ ...chapter, ...formData });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Chapter Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          placeholder="Enter chapter content here..."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ThumbnailManagement = ({ chapters, classLabel, subjectName, chapterThumbnails, onUpload }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Chapter Thumbnails</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chapters.map((chapter) => {
          const chapterKey = makeChapterThumbnailKey(classLabel, subjectName, chapter.id);
          const thumbnail = chapterThumbnails[chapterKey];
          
          return (
            <div key={chapter.id} className="text-center">
              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2">
                {thumbnail ? (
                  <img
                    src={thumbnail.url}
                    alt={chapter.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-image text-slate-400 text-2xl"></i>
                  </div>
                )}
              </div>
              
              <p className="text-sm font-medium text-slate-900 truncate">{chapter.title}</p>
              
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUpload(chapter.id, e.target.files[0])}
                  className="hidden"
                />
                <button className="text-xs text-indigo-600 hover:text-indigo-700">
                  {thumbnail ? 'Change' : 'Upload'} Thumbnail
                </button>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubjectSettings = ({ classLabel, subjectName, onNavigate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Subject Settings</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
          <div>
            <h4 className="font-medium text-yellow-800">Subject Configuration</h4>
            <p className="text-yellow-700 text-sm">
              Settings for {subjectName} in {classLabel} will be available here.
              This includes chapter ordering, visibility settings, and access controls.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={() => onNavigate('settings')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-cog mr-2"></i>
          Advanced Settings
        </button>
      </div>
    </div>
  );
};

// Helper function
const makeChapterThumbnailKey = (classLabel, subjectName, chapterId) => {
  return `${classLabel}-${subjectName}-${chapterId}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};
