export const authViews = `
{view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} onNavigate={navigate} />}

{/* Only show Admin Registration if no admin exists */}
{view === 'register' && !hasAdmin && <AuthForm mode="register" onSubmit={handleRegister} />}

{/* Block Admin Registration if admin exists */}
{view === 'register' && hasAdmin && (
    <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Registration Closed</h2>
            <p className="text-slate-500 mb-6">Admin account already exists.</p>
            <button onClick={() => navigate('student-register')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                Create Student Account
            </button>
        </div>
    </div>
)}
`;
