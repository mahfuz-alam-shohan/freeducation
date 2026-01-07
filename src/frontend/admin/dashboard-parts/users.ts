export const dashboardUsers = `
    const AdminUserList = ({ onNavigate }) => {
        const [users, setUsers] = useState({ admins: [], teachers: [], students: [] });
        const [activeTab, setActiveTab] = useState('students');
        const [isLoading, setIsLoading] = useState(true);
        
        // Modal States
        const [selectedUser, setSelectedUser] = useState(null);
        const [actionType, setActionType] = useState(null);
        const [adminPass, setAdminPass] = useState('');
        const [newPass, setNewPass] = useState('');
        const [modalMessage, setModalMessage] = useState('');

        useEffect(() => {
            fetchUsers();
        }, []);

        const fetchUsers = async () => {
            const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }});
            const data = await res.json();
            if (data.success) setUsers(data);
            setIsLoading(false);
        };

        const handleAction = async () => {
            const endpoint = actionType === 'reveal' ? '/api/users/reveal' : '/api/users/reset';
            const body = { 
                adminPassword: adminPass, 
                targetId: selectedUser.id,
                ...(actionType === 'reset' && { newPassword: newPass })
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            
            if (data.success) {
                if (actionType === 'reveal') {
                    setModalMessage('Password Hash: ' + data.hash.substring(0, 20) + '... (Hidden for security)');
                } else {
                    setModalMessage('Password reset successfully!');
                    setTimeout(() => { setSelectedUser(null); setAdminPass(''); setNewPass(''); }, 2000);
                }
            } else {
                setModalMessage('Error: ' + data.error);
            }
        };

        const renderTable = (list) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Role</th>
                            {activeTab === 'students' && <th className="p-4 font-semibold">Class/Group</th>}
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {list.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-medium text-slate-900">{u.name}</td>
                                <td className="p-4 text-slate-600">{u.email}</td>
                                <td className="p-4 text-slate-500 capitalize">{activeTab}</td>
                                {activeTab === 'students' && (
                                    <td className="p-4 text-slate-600">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold mr-2">{u.classLabel}</span>
                                        <span className="text-xs">{u.groupLabel}</span>
                                    </td>
                                )}
                                <td className="p-4 text-right space-x-2">
                                    <button 
                                        onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }}
                                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                                    >
                                        <i className="fa-solid fa-eye mr-1"></i>
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }}
                                        className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium"
                                    >
                                        <i className="fa-solid fa-key mr-1"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No users found.</td></tr>}
                    </tbody>
                </table>
            </div>
        );

        // --- FIX IS HERE: Wrapped in AdminShell ---
        return (
            <AdminShell 
                title="User Management" 
                subtitle="Manage students, teachers, and admins." 
                activeTab="users" 
                onNavigate={onNavigate}
            >
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                            {['students', 'teachers', 'admins'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition \${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}\`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? <div className="text-center py-12"><i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-xl"></i></div> : renderTable(users[activeTab] || [])}

                    {selectedUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">
                                    {actionType === 'reveal' ? 'Security Check' : 'Reset Password'}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Action for user: <span className="font-semibold text-slate-900">{selectedUser.name}</span>
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Admin Password</label>
                                        <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Confirm your identity" />
                                    </div>
                                    
                                    {actionType === 'reset' && (
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Password for User</label>
                                            <input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Enter new password" />
                                        </div>
                                    )}
                                    
                                    {modalMessage && (
                                        <div className="p-3 bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 break-all font-mono">
                                            {modalMessage}
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={handleAction} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-200">Confirm</button>
                                        <button onClick={() => setSelectedUser(null)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AdminShell>
        );
    };
`;
