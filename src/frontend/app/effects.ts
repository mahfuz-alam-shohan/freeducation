export const appEffects = `
            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    // A. Check Setup Status
                    await fetch('/api/init', { method: 'POST' });
                    const res = await fetch('/api/setup-status');
                    const data = await res.json();
                    setHasAdmin(data.hasAdmin);

                    // B. Try to Restore Session
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        try {
                            const meRes = await fetch('/api/me', {
                                headers: { 'Authorization': 'Bearer ' + token }
                            });
                            const meData = await meRes.json();
                            if (meData.user) {
                                setUser(meData.user);
                            } else {
                                // Invalid token
                                localStorage.removeItem('auth_token');
                            }
                        } catch (e) {
                            localStorage.removeItem('auth_token');
                        }
                    }

                    if (data.hasAdmin && view === 'register') {
                        navigate('login', { replace: true });
                    }
                    if (!data.hasAdmin && view === 'login') {
                        navigate('register', { replace: true });
                    }
                    if (!token && isDashboardView(view)) {
                        navigate('landing', { replace: true });
                    }
                    setIsLoading(false);
                };
                initSystem();
            }, []);

            useEffect(() => {
                const loadContent = async () => {
                    try {
                        const response = await fetch('/api/content');
                        const data = await response.json();
                        if (data.success && data.content) {
                            applyContentState(data.content);
                        }
                    } catch (e) {
                        console.warn('Failed to load content', e);
                    } finally {
                        setContentLoaded(true);
                    }
                };
                loadContent();
            }, []);

            useEffect(() => {
                if (!contentLoaded) return;
                if (!user) return;
                const canEditContent = user.role === 'admin' || (user.role === 'teacher' && user.assignment);
                if (!canEditContent) return;
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const payload = {
                    sscGoddoItems,
                    sscPoddoItems,
                    hscGoddoItems,
                    hscPoddoItems,
                    sscShohopathItems,
                    hscShohopathItems,
                    sscIctChapters,
                    sscPhysicsChapters,
                    sscChemistryChapters,
                    sscBiologyChapters,
                    hscPhysics1stChapters,
                    hscPhysics2ndChapters,
                    hscChemistry1stChapters,
                    hscChemistry2ndChapters,
                    hscBiology1stChapters,
                    hscBiology2ndChapters,
                    srijonshilQuestions,
                    mcqQuestions,
                    englishQuestions,
                    notesByItem
                };

                const timeout = setTimeout(async () => {
                    try {
                        await fetch('/api/content', {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                    } catch (e) {
                        console.warn('Failed to save content', e);
                    }
                }, 600);

                return () => clearTimeout(timeout);
            }, [
                contentLoaded,
                user,
                sscGoddoItems,
                sscPoddoItems,
                hscGoddoItems,
                hscPoddoItems,
                sscShohopathItems,
                hscShohopathItems,
                sscIctChapters,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                srijonshilQuestions,
                mcqQuestions,
                englishQuestions,
                notesByItem
            ]);
`;
