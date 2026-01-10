export const appEffects = `
            // Ref to track if we are currently fetching data (to prevent auto-save loops)
            const isFetchingRef = useRef(false);

            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    // A. Check Setup Status
                    const res = await fetch(statusEndpoint);
                    const data = await res.json();
                    const initialized = Boolean(data.initialized);
                    setHasAdmin(initialized);

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

                    if (initialized && view === 'register') {
                        navigate('login', { replace: true });
                    }
                    if (!initialized && view !== 'setup') {
                        navigate('setup', { replace: true });
                    }
                    if (!token && isDashboardView(view)) {
                        navigate('landing', { replace: true });
                    }
                    setIsLoading(false);
                };
                initSystem();
            }, []);

            // 2. Smart Background Refresh
            useEffect(() => {
                const loadContent = async () => {
                    // BUSY CHECK: If user is typing in a form, skip this refresh cycle
                    const active = document.activeElement;
                    const isUserBusy = active && (
                        active.tagName === 'INPUT' || 
                        active.tagName === 'TEXTAREA' || 
                        active.tagName === 'SELECT' ||
                        active.isContentEditable
                    );

                    if (isUserBusy) {
                        // User is busy, simply return and try again next cycle
                        return;
                    }

                    try {
                        const response = await fetch('/api/content');
                        const data = await response.json();
                        if (data.success && data.content) {
                            // Mark as fetching so the "Save" effect knows to ignore this change
                            isFetchingRef.current = true;
                            applyContentState(data.content);
                            
                            // Reset the flag after a short delay (longer than the save debounce)
                            setTimeout(() => {
                                isFetchingRef.current = false;
                            }, 1000);
                        }
                    } catch (e) {
                        console.warn('Failed to load content', e);
                    } finally {
                        setContentLoaded(true);
                    }
                };
                
                // Initial load
                loadContent();

                // Auto-refresh every 15 seconds
                const interval = setInterval(loadContent, 15000);
                return () => clearInterval(interval);
            }, []);

            const getScienceChapterList = (selection) => {
                if (!selection) return null;
                const { classLabel, subjectLabel, religionKey } = selection;
                if (classLabel === 'SSC' && subjectLabel === 'Physics') return sscPhysicsChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Chemistry') return sscChemistryChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Biology') return sscBiologyChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Bangladesh and Global Studies') return sscBangladeshGlobalChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Religion and Moral Education')
                    return (sscReligionChapters || {})[religionKey] || [];
                if (classLabel === 'HSC' && subjectLabel === 'Physics 1st Paper') return hscPhysics1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Physics 2nd Paper') return hscPhysics2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Chemistry 1st Paper') return hscChemistry1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Chemistry 2nd Paper') return hscChemistry2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Biology 1st Paper') return hscBiology1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Biology 2nd Paper') return hscBiology2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Information and Communication Technology') return hscIctChapters;
                return null;
            };

            useEffect(() => {
                if (!selectedScienceChapter || !selectedScienceSubject) return;
                const chapters = getScienceChapterList(selectedScienceSubject);
                if (!chapters) return;
                const refreshedChapter = chapters.find((chapter) => chapter.id === selectedScienceChapter.id);
                if (!refreshedChapter) {
                    setSelectedScienceChapter(null);
                    setSelectedScienceTopic(null);
                    return;
                }
                if (refreshedChapter !== selectedScienceChapter) {
                    setSelectedScienceChapter(refreshedChapter);
                }
                if (!selectedScienceTopic) return;
                const refreshedTopic = (refreshedChapter.topics || []).find(
                    (topic) => topic.id === selectedScienceTopic.id
                );
                if (!refreshedTopic) {
                    setSelectedScienceTopic(null);
                    return;
                }
                if (refreshedTopic !== selectedScienceTopic) {
                    setSelectedScienceTopic(refreshedTopic);
                }
            }, [
                selectedScienceChapter,
                selectedScienceTopic,
                selectedScienceSubject,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                sscBangladeshGlobalChapters,
                sscReligionChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                hscIctChapters
            ]);

            useEffect(() => {
                if (!contentLoaded) return;
                if (!user) return;
                const canEditContent = user.role === 'admin' || (user.role === 'teacher' && user.assignment);
                if (!canEditContent) return;
                
                // If this change was caused by a background fetch, do NOT save it back to server
                if (isFetchingRef.current) return;

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
                    hscIctChapters,
                    sscPhysicsChapters,
                    sscChemistryChapters,
                    sscBiologyChapters,
                    sscBangladeshGlobalChapters,
                    sscReligionChapters,
                    hscPhysics1stChapters,
                    hscPhysics2ndChapters,
                    hscChemistry1stChapters,
                    hscChemistry2ndChapters,
                    hscBiology1stChapters,
                    hscBiology2ndChapters,
                    srijonshilQuestions,
                    mcqQuestions,
                    englishQuestions,
                    notesByItem,
                    videosByItem
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
                }, 300);

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
                hscIctChapters,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                sscBangladeshGlobalChapters,
                sscReligionChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                srijonshilQuestions,
                mcqQuestions,
                englishQuestions,
                notesByItem,
                videosByItem
            ]);
`;
