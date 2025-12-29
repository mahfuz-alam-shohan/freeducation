export const authComponents = `
        function AuthForm({ mode, onSubmit }) {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            return (
                <div className="flex items-center justify-center flex-grow p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-gray-800">
                                {mode === 'login' ? 'Welcome Back' : 'System Setup'}
                            </h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(username, password); }}>
                            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                            <Button className="w-full mt-2" size="md">{mode === 'login' ? 'Sign In' : 'Create Admin'}</Button>
                        </form>
                    </div>
                </div>
            );
        }
`;
