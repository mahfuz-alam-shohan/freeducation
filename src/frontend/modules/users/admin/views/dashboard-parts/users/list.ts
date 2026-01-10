export const adminUserList = `
    const AdminUserList = ({ onNavigate }) => {
        const [users, setUsers] = useState({ admins: [], teachers: [], students: [] });
        const [activeTab, setActiveTab] = useState('students');
        const [isLoading, setIsLoading] = useState(true);
        
        // Modal & Selection States
        const [selectedUser, setSelectedUser] = useState(null);
        const [actionType, setActionType] = useState(null); // 'reveal' or 'reset'
        const [adminPass, setAdminPass] = useState('');
        const [newPass, setNewPass] = useState('');
        const [modalMessage, setModalMessage] = useState('');

        // Create User Form State
        const [isCreateOpen, setIsCreateOpen] = useState(false);
        const [createForm, setCreateForm] = useState({
            name: '', email: '', password: '', 
            classLabel: 'SSC', groupLabel: 'Science', // For Students
            level: 'SSC', subject: '', permissions: [] // For Teachers
        });

        // FULL SUBJECT MAP (Matches Settings)
        const adminSubjectGroups = {
            SSC: {
                Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'],
                Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'],
                'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education']
            },
            HSC: {
                Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper', 'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'],
                Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper', 'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper', 'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'],
                'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper', 'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper', 'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper', 'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper']
            }
        };

        // Compute available subjects for Teacher Dropdown based on selected Level
        const getTeacherSubjects = (level) => {
            if (!level) return [];
            const groups = adminSubjectGroups[level] || {};
            // Flatten all subjects from all groups in that level, remove duplicates
            const allSubjects = new Set();
            Object.values(groups).forEach(list => list.forEach(sub => allSubjects.add(sub)));
            return Array.from(allSubjects).sort();
        };

        useEffect(() => {
            fetchUsers();
            const interval = setInterval(fetchUsers, 30000);
            return () => clearInterval(interval);
        }, []);

        const fetchUsers = async () => {
            const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }});
            const data = await res.json();
            if (data.success) setUsers(data);
            setIsLoading(false);
        };

        const openUserProfile = (userId) => {
            sessionStorage.setItem('admin_user_profile_id', String(userId));
            onNavigate('admin-user-profile');
        };

        const handleAction = async () => {
            const endpoint = actionType === 'reveal' ? '/api/users/reveal' : '/api/users/reset';
            const body = { 
                adminPassword: adminPass, targetId: selectedUser.id,
                ...(actionType === 'reset' && { newPassword: newPass })
            };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                if (actionType === 'reveal') setModalMessage('Hash: ' + data.hash.substring(0, 20) + '... (Hidden)');
                else { setModalMessage('Success!'); setTimeout(() => { setSelectedUser(null); setAdminPass(''); }, 1500); }
            } else setModalMessage('Error: ' + data.error);
        };

        const handleCreateUser = async () => {
            if (!createForm.name || !createForm.email || !createForm.password) return;
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') },
                body: JSON.stringify({ role: activeTab.slice(0, -1), ...createForm })
            });
            const data = await res.json();
            if (data.success) { fetchUsers(); setIsCreateOpen(false); }
            else alert(data.error);
        };

        const renderTable = (list) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                {activeTab === 'students' ? <th className="p-4 font-semibold">Class/Group</th> : <th className="p-4 font-semibold">Access</th>}
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {list.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-medium text-slate-900">{u.name}</td>
                                    <td className="p-4 text-slate-600">{u.email}</td>
                                    {activeTab === 'students' ? (
                                        <td className="p-4 text-slate-600"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold mr-2">{u.classLabel}</span><span className="text-xs">{u.groupLabel}</span></td>
                                    ) : (
                                        <td className="p-4 text-slate-600 text-xs">{activeTab === 'teachers' ? (u.level + ' - ' + u.subject) : 'Full Admin'}</td>
                                    )}
                                    <td className="p-4 text-right space-x-2">
                                        {activeTab === 'students' && (
                                            <button onClick={() => openUserProfile(u.id)} className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg">See Profile</button>
                                        )}
                                        <button onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"><i className="fa-solid fa-eye"></i></button>
                                        <button onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><i className="fa-solid fa-key"></i></button>
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">No users found.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE CARD VIEW (Hidden on PC) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {list.map(u => (
                        <div key={u.id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-slate-900 truncate">{u.name}</div>
                                    <div className="text-xs text-slate-500 truncate">{u.email}</div>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    {activeTab === 'students' && (
                                        <button onClick={() => openUserProfile(u.id)} className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg shadow-sm"><i className="fa-solid fa-user"></i></button>
                                    )}
                                    <button onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg shadow-sm"><i className="fa-solid fa-eye"></i></button>
                                    <button onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg shadow-sm"><i className="fa-solid fa-key"></i></button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                {activeTab === 'students' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{u.classLabel}</span>
                                        <span className="text-xs font-medium text-slate-600">{u.groupLabel}</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mr-1">Access:</span>
                                        {activeTab === 'teachers' ? (u.level + ' • ' + u.subject) : 'Full Admin'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {list.length === 0 && <div className="p-8 text-center text-slate-400">No users found.</div>}
                </div>
            </div>
        );

        return (
            <AdminShell title="User Management" subtitle="Manage students, teachers, and admins." activeTab="users" onNavigate={onNavigate}>
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
                            {['students', 'teachers', 'admins'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap \${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}\`}>{tab}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-200 transition">
                            <i className="fa-solid fa-plus mr-2"></i> Add {activeTab.slice(0, -1)}
                        </button>
                    </div>

                    {isLoading ? <div className="text-center py-12"><i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-xl"></i></div> : renderTable(users[activeTab] || [])}

                    {/* REVEAL / RESET MODAL */}
                    {selectedUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">{actionType === 'reveal' ? 'Security Check' : 'Reset Password'}</h3>
                                <p className="text-sm text-slate-500 mb-4">Action for user: <span className="font-semibold text-slate-900">{selectedUser.name}</span></p>
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Admin Password</label><input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Confirm your identity" /></div>
                                    {actionType === 'reset' && <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Password</label><input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Enter new password" /></div>}
                                    {modalMessage && <div className="p-3 bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 break-all font-mono">{modalMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={handleAction} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">Confirm</button>
                                        <button onClick={() => setSelectedUser(null)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CREATE USER MODAL */}
                    {isCreateOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-900">Add New {activeTab.slice(0, -1)}</h3>
                                    <button onClick={() => setIsCreateOpen(false)}><i className="fa-solid fa-xmark text-slate-400 hover:text-slate-600 text-xl"></i></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name</label><input value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>
                                        <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label><input value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label><input type="password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>
                                    
                                    {/* Student Fields */}
                                    {activeTab === 'students' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Class</label>
                                                <select value={createForm.classLabel} onChange={e => {
                                                    const nextClass = e.target.value;
                                                    setCreateForm({
                                                        ...createForm,
                                                        classLabel: nextClass,
                                                        groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? createForm.groupLabel : ''
                                                    });
                                                }} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
                                                    <option>SSC</option>
                                                    <option>HSC</option>
                                                    <option value="6">Class 6</option>
                                                    <option value="7">Class 7</option>
                                                    <option value="8">Class 8</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Group</label>
                                                <select value={createForm.groupLabel} onChange={e => setCreateForm({...createForm, groupLabel: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white" disabled={!(createForm.classLabel === 'SSC' || createForm.classLabel === 'HSC')}>
                                                    <option>Science</option>
                                                    <option>Humanities</option>
                                                    <option>Business Studies</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Teacher Fields */}
                                    {activeTab === 'teachers' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Level</label><select value={createForm.level} onChange={e => setCreateForm({...createForm, level: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option>SSC</option><option>HSC</option></select></div>
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
                                                <select value={createForm.subject} onChange={e => setCreateForm({...createForm, subject: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
                                                    <option value="">Select...</option>
                                                    {getTeacherSubjects(createForm.level).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={handleCreateUser} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition mt-4">Create Account</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AdminShell>
        );
    };
`;
