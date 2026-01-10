export const studentAuthLogic = `
const StudentRegister = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', classLabel: 'SSC', groupLabel: 'Science' });
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegisterRequest = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/student/register-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setStep(2);
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (e) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndCreate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/student/register-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, code: otp })
            });
            const data = await res.json();
            if (data.success) {
                alert('Account Created Successfully! Please Login.');
                onNavigate('login');
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (e) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Join Freeducation for free</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Full Name</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="student@example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Password</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Class</label>
                                <select className="w-full mt-1 p-3 border border-slate-200 rounded-lg bg-white"
                                    value={formData.classLabel} onChange={e => {
                                        const nextClass = e.target.value;
                                        setFormData({
                                            ...formData,
                                            classLabel: nextClass,
                                            groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? formData.groupLabel : ''
                                        });
                                    }}>
                                    <option value="SSC">SSC</option>
                                    <option value="HSC">HSC</option>
                                    <option value="6-8">Class 6-8</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Group</label>
                                <select className="w-full mt-1 p-3 border border-slate-200 rounded-lg bg-white"
                                    value={formData.groupLabel} onChange={e => setFormData({...formData, groupLabel: e.target.value})} disabled={!(formData.classLabel === 'SSC' || formData.classLabel === 'HSC')}>
                                    <option value="Science">Science</option>
                                    <option value="Humanities">Humanities</option>
                                    <option value="Business Studies">Business</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleRegisterRequest} disabled={isLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-200">
                            {isLoading ? 'Sending OTP...' : 'Continue'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Check your Email</h3>
                            <p className="text-sm text-slate-500 mt-1">We sent a code to {formData.email}</p>
                        </div>
                        <input className="w-full text-center text-3xl tracking-[0.5em] font-bold p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                            maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" />
                        
                        <button onClick={handleVerifyAndCreate} disabled={isLoading} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition shadow-lg shadow-emerald-200">
                            {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>
                        <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 underline">Wrong email?</button>
                    </div>
                )}
                
                <div className="mt-6 text-center border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">Already have an account? <button onClick={() => onNavigate('login')} className="text-indigo-600 font-semibold hover:underline">Login</button></p>
                </div>
            </div>
        </div>
    );
};
`;
