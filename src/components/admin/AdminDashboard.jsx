// Admin Dashboard Components

export const AdminPageHeader = ({ title, subtitle }) => (
  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  </header>
);

export const AdminClassesManagement = ({ onNavigate }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) { 
          setLoading(false); 
          return; 
        }
        
        const response = await fetch('/api/classes', { 
          headers: { 'Authorization': 'Bearer ' + token } 
        });
        const data = await response.json();
        if (data.success) { 
          setClasses(data.classes || []); 
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSaveClass = async () => {
    if (!editingClass?.name) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/classes', {
        method: editingClass.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingClass)
      });

      const data = await response.json();
      if (data.success) {
        setClasses(prev => 
          editingClass.id 
            ? prev.map(c => c.id === editingClass.id ? data.class : c)
            : [...prev, data.class]
        );
        setEditingClass(null);
      }
    } catch (error) {
      console.error('Failed to save class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await response.json();
      if (data.success) {
        setClasses(prev => prev.filter(c => c.id !== classId));
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
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
      <AdminPageHeader 
        title="Classes Management" 
        subtitle="Manage academic classes and subjects" 
      />

      {/* Classes List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Classes</h3>
            <button
              onClick={() => setEditingClass({ name: '' })}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Class
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{classItem.name}</h4>
                    {classItem.groups && (
                      <p className="text-sm text-slate-600">
                        Groups: {classItem.groups.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingClass(classItem)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit/Add Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingClass.id ? 'Edit Class' : 'Add New Class'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={editingClass.name || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., SSC, HSC"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingClass(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClass}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {editingClass.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminUserManagement = ({ onNavigate }) => {
  const [users, setUsers] = useState({ admins: [], teachers: [], students: [] });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/users', { 
          headers: { 'Authorization': 'Bearer ' + token } 
        });
        const data = await response.json();
        if (data.success) { 
          setUsers(data); 
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Management" 
        subtitle="Manage all platform users" 
      />

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-indigo-600"></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Admins</h3>
              <p className="text-2xl font-bold text-indigo-600">{users.admins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chalkboard-teacher text-green-600"></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Teachers</h3>
              <p className="text-2xl font-bold text-green-600">{users.teachers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-purple-600"></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Students</h3>
              <p className="text-2xl font-bold text-purple-600">{users.students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Lists */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">All Users</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Add User
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.admins.map(admin => (
                  <tr key={admin.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">{admin.name}</td>
                    <td className="py-3 px-4">{admin.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        Admin
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedUser(admin)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {users.teachers.map(teacher => (
                  <tr key={teacher.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">{teacher.name}</td>
                    <td className="py-3 px-4">{teacher.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Teacher
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedUser(teacher)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {users.students.map(student => (
                  <tr key={student.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">{student.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        Student
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedUser(student)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
