export const routerUtilities = `
        const normalizePath = (pathname) => {
            if (!pathname) return '/';
            const trimmed = pathname.replace(/\/+$/, '');
            return trimmed === '' ? '/' : trimmed;
        };

        const parseRoute = (pathname) => {
            const cleanPath = normalizePath(pathname);
            const segments = cleanPath.split('/').filter(Boolean);
            const route = {
                view: 'landing',
                student: {
                    classId: null,
                    subjectId: null,
                    chapterId: null,
                    topicId: null
                },
                admin: {
                    section: 'classes',
                    classId: null,
                    subjectId: null,
                    chapterId: null,
                    topicId: null,
                detailTab: null
                }
            };

            if (segments[0] === 'login') {
                route.view = 'login';
                return route;
            }
            if (segments[0] === 'register') {
                route.view = 'register';
                return route;
            }
            if (segments[0] === 'admin') {
                route.view = 'admin';
                const section = segments[1] || 'structure';
                route.admin.section = section === 'content' ? 'content' : section === 'settings' ? 'settings' : 'classes';
                const getId = (label) => {
                    const idx = segments.indexOf(label);
                    if (idx !== -1 && segments[idx + 1]) return segments[idx + 1];
                    return null;
                };
                route.admin.classId = getId('class');
                route.admin.subjectId = getId('subject');
                route.admin.chapterId = getId('chapter');
                route.admin.topicId = getId('topic');
                if (segments.includes('notes')) route.admin.detailTab = 'notes';
                if (segments.includes('questions')) route.admin.detailTab = 'questions';
                return route;
            }
            if (segments[0] === 'classes') {
                route.view = 'landing';
                route.student.classId = segments[1] || null;
                if (segments[2] === 'subjects') {
                    route.student.subjectId = segments[3] || null;
                }
                if (segments[4] === 'chapters') {
                    route.student.chapterId = segments[5] || null;
                }
                if (segments[6] === 'topics') {
                    route.student.topicId = segments[7] || null;
                }
            }
            return route;
        };

        const buildStudentPath = ({ classId, subjectId, chapterId, topicId }) => {
            if (!classId) return '/';
            let path = '/classes/' + classId;
            if (subjectId) path += '/subjects/' + subjectId;
            if (chapterId) path += '/chapters/' + chapterId;
            if (topicId) path += '/topics/' + topicId;
            return path;
        };

        const buildAdminPath = ({ section = 'classes', classId, subjectId, chapterId, topicId, detailTab }) => {
            const sectionSlug = section === 'content' ? 'content' : section === 'settings' ? 'settings' : 'structure';
            let path = '/admin/' + sectionSlug;
            if (sectionSlug === 'settings') return path;
            if (classId) path += '/class/' + classId;
            if (subjectId) path += '/subject/' + subjectId;
            if (chapterId) path += '/chapter/' + chapterId;
            if (topicId) path += '/topic/' + topicId;
            if (section === 'content' && detailTab === 'notes') path += '/notes';
            if (section === 'content' && detailTab === 'questions') path += '/questions';
            return path;
        };
`;

export function getInitialView(pathname: string) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname === "/login") return "login";
  if (pathname === "/register") return "register";
  return "landing";
}
