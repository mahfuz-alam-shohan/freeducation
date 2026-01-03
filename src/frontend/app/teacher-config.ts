export const teacherConfig = `
            const teacherSubjectRoutes = {
                SSC: {
                    'bangla 1st paper': {
                        route: 'bangla-ssc-1st-paper',
                        views: [
                            'bangla-ssc-1st-paper',
                            'bangla-ssc-shahitto',
                            'bangla-ssc-shohopath',
                            'bangla-ssc-goddo',
                            'bangla-ssc-poddo',
                            'bangla-ssc-item',
                            'bangla-ssc-srijonshil-types',
                            'bangla-ssc-srijonshil-questions',
                            'bangla-ssc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'information and communication technology': {
                        route: 'admin-ssc-ict',
                        views: ['admin-ssc-ict', 'admin-ssc-ict-mcq'],
                        description: 'Manage ICT chapters and MCQ uploads.'
                    },
                    physics: {
                        route: 'admin-ssc-physics',
                        views: [
                            'admin-ssc-physics',
                            'admin-ssc-physics-topics',
                            'admin-ssc-physics-topic',
                            'admin-ssc-physics-cq-types',
                            'admin-ssc-physics-cq-questions',
                            'admin-ssc-physics-mcq'
                        ],
                        description: 'Manage SSC Physics chapters, topics, and questions.'
                    },
                    chemistry: {
                        route: 'admin-ssc-chemistry',
                        views: [
                            'admin-ssc-chemistry',
                            'admin-ssc-chemistry-topics',
                            'admin-ssc-chemistry-topic',
                            'admin-ssc-chemistry-cq-types',
                            'admin-ssc-chemistry-cq-questions',
                            'admin-ssc-chemistry-mcq'
                        ],
                        description: 'Manage SSC Chemistry chapters, topics, and questions.'
                    },
                    biology: {
                        route: 'admin-ssc-biology',
                        views: [
                            'admin-ssc-biology',
                            'admin-ssc-biology-topics',
                            'admin-ssc-biology-topic',
                            'admin-ssc-biology-cq-types',
                            'admin-ssc-biology-cq-questions',
                            'admin-ssc-biology-mcq'
                        ],
                        description: 'Manage SSC Biology chapters, topics, and questions.'
                    },
                    'bangladesh and global studies': {
                        route: 'admin-ssc-bangladesh-global-studies',
                        views: [
                            'admin-ssc-bangladesh-global-studies',
                            'admin-ssc-bangladesh-global-studies-topics',
                            'admin-ssc-bangladesh-global-studies-topic',
                            'admin-ssc-bangladesh-global-studies-cq-types',
                            'admin-ssc-bangladesh-global-studies-cq-questions',
                            'admin-ssc-bangladesh-global-studies-mcq'
                        ],
                        description: 'Manage Bangladesh and Global Studies chapters, topics, and questions.'
                    },
                    'religion and moral education': {
                        route: 'admin-ssc-religion',
                        views: [
                            'admin-ssc-religion',
                            'admin-ssc-religion-chapters',
                            'admin-ssc-religion-topics',
                            'admin-ssc-religion-topic',
                            'admin-ssc-religion-cq-types',
                            'admin-ssc-religion-cq-questions',
                            'admin-ssc-religion-mcq'
                        ],
                        description: 'Manage Religion and Moral Education chapters, topics, and questions.'
                    }
                },
                HSC: {
                    'bangla 1st paper': {
                        route: 'bangla-hsc-1st-paper',
                        views: [
                            'bangla-hsc-1st-paper',
                            'bangla-hsc-shahitto',
                            'bangla-hsc-shohopath',
                            'bangla-hsc-goddo',
                            'bangla-hsc-poddo',
                            'bangla-hsc-item',
                            'bangla-hsc-srijonshil-types',
                            'bangla-hsc-srijonshil-questions',
                            'bangla-hsc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'english 1st paper': {
                        route: 'english-hsc-1st-paper',
                        views: [
                            'english-hsc-1st-paper',
                            'english-hsc-reading',
                            'english-hsc-writing',
                            'english-hsc-subtypes',
                            'english-hsc-questions'
                        ],
                        description: 'Manage English reading and writing question content.'
                    },
                    'physics 1st paper': {
                        route: 'admin-hsc-physics-1st',
                        views: [
                            'admin-hsc-physics-1st',
                            'admin-hsc-physics-1st-topics',
                            'admin-hsc-physics-1st-topic',
                            'admin-hsc-physics-1st-cq-types',
                            'admin-hsc-physics-1st-cq-questions',
                            'admin-hsc-physics-1st-mcq'
                        ],
                        description: 'Manage HSC Physics 1st Paper chapters, topics, and questions.'
                    },
                    'physics 2nd paper': {
                        route: 'admin-hsc-physics-2nd',
                        views: [
                            'admin-hsc-physics-2nd',
                            'admin-hsc-physics-2nd-topics',
                            'admin-hsc-physics-2nd-topic',
                            'admin-hsc-physics-2nd-cq-types',
                            'admin-hsc-physics-2nd-cq-questions',
                            'admin-hsc-physics-2nd-mcq'
                        ],
                        description: 'Manage HSC Physics 2nd Paper chapters, topics, and questions.'
                    },
                    'chemistry 1st paper': {
                        route: 'admin-hsc-chemistry-1st',
                        views: [
                            'admin-hsc-chemistry-1st',
                            'admin-hsc-chemistry-1st-topics',
                            'admin-hsc-chemistry-1st-topic',
                            'admin-hsc-chemistry-1st-cq-types',
                            'admin-hsc-chemistry-1st-cq-questions',
                            'admin-hsc-chemistry-1st-mcq'
                        ],
                        description: 'Manage HSC Chemistry 1st Paper chapters, topics, and questions.'
                    },
                    'chemistry 2nd paper': {
                        route: 'admin-hsc-chemistry-2nd',
                        views: [
                            'admin-hsc-chemistry-2nd',
                            'admin-hsc-chemistry-2nd-topics',
                            'admin-hsc-chemistry-2nd-topic',
                            'admin-hsc-chemistry-2nd-cq-types',
                            'admin-hsc-chemistry-2nd-cq-questions',
                            'admin-hsc-chemistry-2nd-mcq'
                        ],
                        description: 'Manage HSC Chemistry 2nd Paper chapters, topics, and questions.'
                    },
                    'biology 1st paper': {
                        route: 'admin-hsc-biology-1st',
                        views: [
                            'admin-hsc-biology-1st',
                            'admin-hsc-biology-1st-topics',
                            'admin-hsc-biology-1st-topic',
                            'admin-hsc-biology-1st-cq-types',
                            'admin-hsc-biology-1st-cq-questions',
                            'admin-hsc-biology-1st-mcq'
                        ],
                        description: 'Manage HSC Biology 1st Paper chapters, topics, and questions.'
                    },
                    'biology 2nd paper': {
                        route: 'admin-hsc-biology-2nd',
                        views: [
                            'admin-hsc-biology-2nd',
                            'admin-hsc-biology-2nd-topics',
                            'admin-hsc-biology-2nd-topic',
                            'admin-hsc-biology-2nd-cq-types',
                            'admin-hsc-biology-2nd-cq-questions',
                            'admin-hsc-biology-2nd-mcq'
                        ],
                        description: 'Manage HSC Biology 2nd Paper chapters, topics, and questions.'
                    },
                    'information and communication technology': {
                        route: 'admin-hsc-ict',
                        views: ['admin-hsc-ict', 'admin-hsc-ict-mcq'],
                        description: 'Manage HSC ICT chapters and MCQ uploads.'
                    }
                }
            };
            const getTeacherSubjectConfig = (assignment) => {
                if (!assignment) return null;
                const level = String(assignment.level || '').toUpperCase();
                const subjectKey = String(assignment.subject || '').trim().toLowerCase();
                const config = teacherSubjectRoutes[level]?.[subjectKey];
                if (!config) return null;
                return { ...config, level, subject: assignment.subject };
            };
            const getTeacherAllowedViews = (assignment) => {
                const config = getTeacherSubjectConfig(assignment);
                return new Set(['dashboard', 'admin-settings', ...(config?.views || [])]);
            };
            const isDashboardView = (targetView) =>
                targetView === 'dashboard' ||
                targetView === 'admin-settings' ||
                targetView.startsWith('admin-') ||
                targetView.startsWith('bangla-') ||
                targetView.startsWith('english-');
`;
