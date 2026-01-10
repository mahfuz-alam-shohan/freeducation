export const authHandlers = `
            // FIX: We now accept an object { username, password }
            const handleLogin = async ({ username, password }) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('auth_token', data.token);
                    setUser({
                        username: data.username,
                        role: data.role,
                        permissions: data.permissions || [],
                        assignment: data.assignment || null
                    });
                    navigate('dashboard');
                } else {
                    alert(data.error || 'Login failed');
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                navigate('landing');
            };

            const handleRegister = async ({ username, password }) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Account created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };
`;
