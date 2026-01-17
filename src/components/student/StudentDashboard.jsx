// Student Dashboard Components

export const StudentClassView = ({ classLabel, groupLabel, onNavigate }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailMap, setThumbnailMap] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) { 
          setLoading(false); 
          return; 
        }

        const response = await fetch(`/api/subjects?class=${classLabel}`, { 
          headers: { 'Authorization': 'Bearer ' + token } 
        });
        const data = await response.json();
        if (data.success) { 
          setSubjects(data.subjects || []); 
        }

        // Fetch thumbnails
        const thumbResponse = await fetch('/api/thumbnails', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const thumbData = await thumbResponse.json();
        const map = {};
        thumbData.forEach(thumb => {
          map[thumb.subjectKey] = thumb;
        });
        setThumbnailMap(map);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [classLabel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const subjectGroups = Object.entries(subjects);

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {classLabel} {groupLabel && `(${groupLabel})`}
        </h2>
        <p className="text-slate-600">
          Your learning materials and resources
        </p>
      </div>

      {/* Subject Groups */}
      {subjectGroups.map(([groupName, groupSubjects]) => (
        <div key={groupName} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{groupName}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupSubjects.map((subject, index) => {
              const subjectKey = `${classLabel}-${subject}`;
              const thumbnail = thumbnailMap[subjectKey];
              
              return (
                <SubjectCard
                  key={index}
                  subject={{
                    title: subject,
                    subjectKey,
                    route: `subject-detail/${classLabel}/${subject}`,
                    thumbnailUrl: thumbnail?.url,
                    accent: getSubjectAccent(subject)
                  }}
                  onNavigate={onNavigate}
                  className="flex-none"
                />
              );
            })}
          </div>
        </div>
      ))}

      {subjectGroups.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-book-open text-slate-400 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No subjects available</h3>
          <p className="text-slate-600">
            Subjects for your class will appear here once they are added by administrators.
          </p>
        </div>
      )}
    </div>
  );
};

export const StudentSubjectDetail = ({ classLabel, subjectName, onNavigate, onBack }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterThumbnails, setChapterThumbnails] = useState({});
  const { readMap, markRead } = useReadingProgress();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) { 
          setLoading(false); 
          return; 
        }

        const response = await fetch(`/api/chapters?class=${classLabel}&subject=${subjectName}`, { 
          headers: { 'Authorization': 'Bearer ' + token } 
        });
        const data = await response.json();
        if (data.success) { 
          setChapters(data.chapters || []); 
        }

        // Fetch chapter thumbnails
        const thumbResponse = await fetch('/api/chapter-thumbnails', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const thumbData = await thumbResponse.json();
        const map = {};
        thumbData.forEach(thumb => {
          map[thumb.chapterKey] = thumb;
        });
        setChapterThumbnails(map);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        setLoading(false);
      }
    };

    fetchChapters();
  }, [classLabel, subjectName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{subjectName}</h2>
            <p className="text-slate-600">{classLabel}</p>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chapters.map((chapter) => {
          const chapterKey = makeChapterThumbnailKey(classLabel, subjectName, chapter.id);
          const thumbnail = chapterThumbnails[chapterKey];
          const isRead = readMap[chapterKey];
          
          return (
            <ChapterCard
              key={chapter.id}
              title={chapter.title}
              subtitle={chapter.description}
              thumbnailUrl={thumbnail?.url}
              onClick={() => {
                markRead({ chapterKey, title: chapter.title, subjectName });
                onNavigate(`chapter-detail/${classLabel}/${subjectName}/${chapter.id}`);
              }}
              isRead={isRead}
            />
          );
        })}
      </div>

      {chapters.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-file-alt text-slate-400 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No chapters available</h3>
          <p className="text-slate-600">
            Chapters for this subject will appear here once they are added by teachers.
          </p>
        </div>
      )}
    </div>
  );
};

export const StudentSettings = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    classLabel: '',
    groupLabel: '',
    religion: '',
    dateOfBirth: '',
    batchYear: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) { 
          setLoading(false); 
          return; 
        }

        const response = await fetch('/api/profile', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        if (data.success) { 
          setProfile(data.profile);
          setFormData({
            name: data.profile.name || '',
            email: data.profile.email || '',
            classLabel: data.profile.classLabel || '',
            groupLabel: data.profile.groupLabel || '',
            religion: data.profile.religion || '',
            dateOfBirth: data.profile.dateOfBirth || '',
            batchYear: data.profile.batchYear || ''
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, ...formData }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
              <select
                value={formData.classList}
                onChange={(e) => setFormData({ ...formData, classLabel: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Class</option>
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Group</label>
              <select
                value={formData.groupLabel}
                onChange={(e) => setFormData({ ...formData, groupLabel: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Group</option>
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Business Studies">Business Studies</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Religion</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Batch Year</label>
              <input
                type="text"
                value={formData.batchYear}
                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 2024"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getSubjectAccent = (subject) => {
  const accents = {
    'Bangla': 'bg-red-500',
    'English': 'bg-blue-500',
    'Mathematics': 'bg-green-500',
    'Physics': 'bg-purple-500',
    'Chemistry': 'bg-orange-500',
    'Biology': 'bg-pink-500'
  };
  return accents[subject] || 'bg-slate-500';
};
