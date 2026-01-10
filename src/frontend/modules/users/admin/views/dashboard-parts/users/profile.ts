export const adminStudentProfile = `
    const AdminStudentProfile = ({ onNavigate }) => {
        const [userId, setUserId] = useState(() => Number(sessionStorage.getItem('admin_user_profile_id') || 0));
        const [detailData, setDetailData] = useState(null);
        const [detailForm, setDetailForm] = useState(null);
        const [detailLoading, setDetailLoading] = useState(false);
        const [detailMessage, setDetailMessage] = useState('');
        const [editingField, setEditingField] = useState(null);

        useEffect(() => {
            const stored = Number(sessionStorage.getItem('admin_user_profile_id') || 0);
            if (stored !== userId) setUserId(stored);
        }, []);

        const toggleEditField = (field) => setEditingField((prev) => (prev === field ? null : field));

        const loadUserDetails = async (selectedId) => {
            setDetailLoading(true);
            setDetailMessage('');
            setDetailData(null);
            const token = localStorage.getItem('auth_token');
            if (!token) { setDetailLoading(false); return; }
            try {
                const res = await fetch('/api/users/details?id=' + selectedId, { headers: { Authorization: 'Bearer ' + token } });
                const data = await res.json();
                if (data.success) {
                    setDetailData(data.user);
                    setDetailForm({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        classLabel: data.user.classLabel || '',
                        groupLabel: data.user.groupLabel || '',
                        religion: data.user.religion || '',
                        dateOfBirth: data.user.dateOfBirth || '',
                        batchYear: data.user.batchYear || ''
                    });
                } else {
                    setDetailMessage(data.error || 'Unable to load user.');
                }
            } catch (e) {
                setDetailMessage('Unable to load user.');
            }
            setDetailLoading(false);
        };

        useEffect(() => {
            if (userId) {
                loadUserDetails(userId);
            }
        }, [userId]);

        const handleDetailSave = async () => {
            if (!detailForm?.name || !detailForm?.email) {
                setDetailMessage('Name and email are required.');
                return;
            }
            const token = localStorage.getItem('auth_token');
            if (!token) return;
            setDetailLoading(true);
            setDetailMessage('');
            try {
                const res = await fetch('/api/users/details', {
                    method: 'PUT',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, ...detailForm })
                });
                const data = await res.json();
                if (data.success) {
                    setDetailMessage('Student updated.');
                    loadUserDetails(userId);
                } else {
                    setDetailMessage(data.error || 'Update failed.');
                }
            } catch (e) {
                setDetailMessage('Update failed.');
            }
            setDetailLoading(false);
        };

        const handleUserDelete = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token || !userId) return;
            if (!confirm('Delete this student account? This action cannot be undone.')) return;
            setDetailLoading(true);
            try {
                const res = await fetch('/api/users/delete', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId })
                });
                const data = await res.json();
                if (data.success) {
                    sessionStorage.removeItem('admin_user_profile_id');
                    onNavigate('admin-users');
                } else {
                    setDetailMessage(data.error || 'Delete failed.');
                }
            } catch (e) {
                setDetailMessage('Delete failed.');
            }
            setDetailLoading(false);
        };

        const handleBack = () => {
            sessionStorage.removeItem('admin_user_profile_id');
            onNavigate('admin-users');
        };

        const canSelectGroup = detailForm?.classLabel === 'SSC' || detailForm?.classLabel === 'HSC';

        return (
            <AdminShell title="Student Profile" subtitle="Review and edit student details" activeTab="users" onNavigate={onNavigate}>
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button onClick={handleBack} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back to Users</button>
                        {detailData?.createdAt && !Number.isNaN(Date.parse(detailData.createdAt)) && (
                            <div className="text-xs text-slate-400">Joined {new Date(detailData.createdAt).toLocaleDateString()}</div>
                        )}
                    </div>

                    {!userId && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">Select a student from the users list to view their profile.</div>
                    )}

                    {detailLoading && <div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading...</div>}

                    {!detailLoading && detailForm && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name</label>
                                    <div className="flex items-center gap-2">
                                        <input value={detailForm.name} onChange={e => setDetailForm({ ...detailForm, name: e.target.value })} disabled={editingField !== 'name'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
                                        <button onClick={() => toggleEditField('name')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label>
                                    <div className="flex items-center gap-2">
                                        <input value={detailForm.email} onChange={e => setDetailForm({ ...detailForm, email: e.target.value })} disabled={editingField !== 'email'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
                                        <button onClick={() => toggleEditField('email')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Class</label>
                                    <div className="flex items-center gap-2">
                                        <select value={detailForm.classLabel} onChange={e => {
                                            const nextClass = e.target.value;
                                            setDetailForm({ 
                                                ...detailForm, 
                                                classLabel: nextClass, 
                                                groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? detailForm.groupLabel : '',
                                                batchYear: nextClass === 'SSC' || nextClass === 'HSC' ? detailForm.batchYear : ''
                                            });
                                        }} disabled={editingField !== 'classLabel'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
                                            <option value="">Select</option>
                                            <option value="SSC">SSC</option>
                                            <option value="HSC">HSC</option>
                                            <option value="6">Class 6</option>
                                            <option value="7">Class 7</option>
                                            <option value="8">Class 8</option>
                                        </select>
                                        <button onClick={() => toggleEditField('classLabel')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Group</label>
                                    <div className="flex items-center gap-2">
                                        <select value={detailForm.groupLabel} onChange={e => setDetailForm({ ...detailForm, groupLabel: e.target.value })} disabled={!canSelectGroup || editingField !== 'groupLabel'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
                                            <option value="">Select</option>
                                            <option value="Science">Science</option>
                                            <option value="Humanities">Humanities</option>
                                            <option value="Business Studies">Business Studies</option>
                                        </select>
                                        <button onClick={() => toggleEditField('groupLabel')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Religion</label>
                                    <div className="flex items-center gap-2">
                                        <select value={detailForm.religion} onChange={e => setDetailForm({ ...detailForm, religion: e.target.value })} disabled={editingField !== 'religion'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
                                            <option value="">Select</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Hinduism">Hinduism</option>
                                            <option value="Buddhism">Buddhism</option>
                                            <option value="Christianity">Christianity</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <button onClick={() => toggleEditField('religion')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date of Birth</label>
                                    <div className="flex items-center gap-2">
                                        <input type="date" value={detailForm.dateOfBirth} onChange={e => setDetailForm({ ...detailForm, dateOfBirth: e.target.value })} disabled={editingField !== 'dateOfBirth'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
                                        <button onClick={() => toggleEditField('dateOfBirth')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">SSC/HSC Batch Year</label>
                                    <div className="flex items-center gap-2">
                                        <input value={detailForm.batchYear} onChange={e => setDetailForm({ ...detailForm, batchYear: e.target.value })} disabled={!canSelectGroup || editingField !== 'batchYear'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
                                        <button onClick={() => toggleEditField('batchYear')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="text-xs uppercase tracking-wider text-slate-400">Points</div>
                                <div className="text-lg font-semibold text-slate-800">{detailData?.points || 0}</div>
                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                    {(detailData?.pointLogs || []).length === 0 && <div className="text-xs text-slate-400">No point logs yet.</div>}
                                    {(detailData?.pointLogs || []).map((log, index) => (
                                        <div key={log.createdAt + '-' + index} className="flex items-center justify-between text-xs text-slate-600">
                                            <span>{log.reason === 'profile_complete' ? 'Profile completed' : log.reason}</span>
                                            <span className="font-semibold text-emerald-600">+{log.points}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {detailMessage && <div className="p-3 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-200">{detailMessage}</div>}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={handleDetailSave} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Save Changes</button>
                                <button onClick={handleUserDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">Delete Student</button>
                            </div>
                        </div>
                    )}
                </div>
            </AdminShell>
        );
    };
`;
