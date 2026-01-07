export const dashboardUsers = `
    const AdminUserList = ({ onNavigate }) => {
        const [users, setUsers] = useState({ admins: [], teachers: [], students: [] });
        const [activeTab, setActiveTab] = useState('students');
        const [isLoading, setIsLoading] = useState(true);
        
        // --- Selection & Actions ---
        const [selectedUser, setSelectedUser] = useState(null);
        const [actionType, setActionType] = useState(null); // 'reveal', 'reset'
        const [adminPass, setAdminPass] = useState('');
        const [newPass, setNewPass] = useState('');
        const [modalMessage, setModalMessage] = useState('');

        // --- Create User Form State ---
        const [isCreateOpen, setIsCreateOpen] = useState(false);
        const [createForm, setCreateForm] = useState({
            name: '', email: '', password: '', 
            classLabel: 'SSC', groupLabel: 'Science', // Student specific
            level: 'SSC', subject: '', permissions: [] // Teacher specific
        });

        // Hardcoded subject list for teachers (simplified)
        const subjectsList = ['Bangla 1st', 'Bangla 2nd', 'English 1st', 'English 2nd', 'Math', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Religion'];

        useEffect(() => { fetchUsers(); }, []);

        const fetchUsers = async () => {
            const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }});
            const data = await res.json();
            if (data.success) setUsers(data);
            setIsLoading(false);
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
                if (actionType === 'reveal') setModalMessage('Hash: ' + data.hash.substring(0, 20) + '...');
                else { setModalMessage('Success!'); setTimeout(() => { setSelectedUser(null); setAdminPass(''); }, 1500); }
            } else setModalMessage('Error: ' + data.error);
        };

        const handleCreateUser = async () => {
            if (!createForm.name || !createForm.email || !createForm.password) return alert('Fill required fields');
            
            // Prepare body based on role
            const body = {
                role: activeTab === 'students' ? 'student' : (activeTab === 'teachers' ? 'teacher' : 'admin'),
                name: createForm.name,
                email: createForm.email,
                password: createForm.password
            };

            if (activeTab === 'students') {
                body.classLabel = createForm.classLabel;
                body.groupLabel = createForm.groupLabel;
            } else if (activeTab === 'teachers') {
                body.level = createForm.level;
                body.subject = createForm.subject;
                body.permissions = ['structure']; // Default permission
            } else if (activeTab === 'admins') {
                body.permissions = ['dashboard', 'classes', 'settings', 'users']; // Default full access
            }

            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                setIsCreateOpen(false);
                setCreateForm({ name: '', email: '', password: '', classLabel: 'SSC', groupLabel: 'Science', level: 'SSC', subject: '', permissions: [] });
                fetchUsers();
            } else {
                alert(data.error);
            }
        };

        const renderTable = (list) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                                    <button onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"><i className="fa-solid fa-eye"></i></button>
                                    <button onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><i className="fa-solid fa-key"></i></button>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">No users found.</td></tr>}
                    </tbody>
                </table>
            </div>
        );

        return (
            <AdminShell title="User Management" subtitle="Manage students, teachers, and admins." activeTab="users" onNavigate={onNavigate}>
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                            {['students', 'teachers', 'admins'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition \${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}\`}>{tab}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-200 transition">
                            <i className="fa-solid fa-plus mr-2"></i> Add {activeTab.slice(0, -1)}
                        </button>
                    </div>

                    {isLoading ? <div className="text-center py-12"><i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-xl"></i></div> : renderTable(users[activeTab] || [])}

                    {/* --- REVEAL / RESET MODAL --- */}
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

                    {/* --- CREATE USER MODAL --- */}
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
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Class</label><select value={createForm.classLabel} onChange={e => setCreateForm({...createForm, classLabel: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option>SSC</option><option>HSC</option></select></div>
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Group</label><select value={createForm.groupLabel} onChange={e => setCreateForm({...createForm, groupLabel: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option>Science</option><option>Humanities</option><option>Business Studies</option></select></div>
                                        </div>
                                    )}

                                    {/* Teacher Fields */}
                                    {activeTab === 'teachers' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Level</label><select value={createForm.level} onChange={e => setCreateForm({...createForm, level: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option>SSC</option><option>HSC</option></select></div>
                                            <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label><select value={createForm.subject} onChange={e => setCreateForm({...createForm, subject: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option value="">Select...</option>{subjectsList.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
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
