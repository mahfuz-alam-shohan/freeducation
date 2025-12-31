export const settingsComponents = `
        const AdminSettings = ({ onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [isResetting, setIsResetting] = useState(false);

            const handleReset = async () => {
                const confirmed = window.confirm('Reset settings? This will restore default classes and clear uploaded fonts.');
                if (!confirmed) return;
                setIsResetting(true);
                setStatusMessage(null);

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('You must be logged in to reset settings.');
                    setIsResetting(false);
                    return;
                }

                try {
                    const response = await fetch('/api/settings/reset', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ confirm: true })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setStatusMessage('Settings reset completed.');
                        onNavigate('dashboard');
                    } else {
                        setStatusMessage(data.error || 'Reset failed.');
                    }
                } catch (error) {
                    setStatusMessage('Reset failed. Please try again.');
                } finally {
                    setIsResetting(false);
                }
            };

            return (
                <AdminShell
                    title="Settings"
                    subtitle="Manage system preferences and maintenance actions."
                    activeTab="settings"
                    onNavigate={onNavigate}
                >
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:text-gray-400"
                        >
                            <span>Reset settings</span>
                            <span className="text-xs text-gray-400">{isResetting ? 'Working...' : ''}</span>
                        </button>
                    </div>
                    {statusMessage && (
                        <div className="text-sm text-gray-500">{statusMessage}</div>
                    )}
                </AdminShell>
            );
        };
`;
