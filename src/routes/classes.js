// Classes and academic content API routes

import { authenticate, requireAdmin, defaultHeaders, logUserAction } from '../auth/auth.js';

export const classRoutes = {
  // Get classes
  '/api/classes': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    if (request.method === 'GET') {
      const classes = await env.DB.prepare(`
        SELECT classes.id, classes.name, 
               GROUP_CONCAT(class_groups.name) as groups
        FROM classes
        LEFT JOIN class_groups ON class_groups.class_id = classes.id
        GROUP BY classes.id, classes.name
        ORDER BY classes.name
      `).all();

      const formattedClasses = (classes.results || []).map(cls => ({
        id: cls.id,
        name: cls.name,
        groups: cls.groups ? cls.groups.split(',') : []
      }));

      return Response.json({ success: true, classes: formattedClasses }, { headers: defaultHeaders });
    }

    return null;
  },

  // Get subjects for a class
  '/api/subjects': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    const url = new URL(request.url);
    const classLabel = url.searchParams.get('class');

    if (request.method === 'GET') {
      if (!classLabel) {
        return Response.json({ success: false, error: "Class parameter is required." }, { status: 400, headers: defaultHeaders });
      }

      // This would typically come from a content store or curriculum data
      // For now, returning a basic structure based on the class
      const subjects = {
        'SSC': {
          'Science': [
            'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
            'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Bangladesh and World Geography',
            'History and Social Science', 'Islam and Moral Education', 'Information and Communication Technology'
          ],
          'Humanities': [
            'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
            'General Mathematics', 'History and Social Science', 'Bangladesh and World Geography',
            'Economics', 'Civics and Citizenship', 'Islam and Moral Education', 'Information and Communication Technology'
          ],
          'Business Studies': [
            'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
            'General Mathematics', 'Business Entrepreneurship', 'Finance and Banking',
            'Accounting', 'History and Social Science', 'Islam and Moral Education', 'Information and Communication Technology'
          ]
        },
        'HSC': {
          'Science': [
            'Bangla', 'English', 'Information and Communication Technology',
            'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper',
            'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper'
          ],
          'Humanities': [
            'Bangla', 'English', 'Information and Communication Technology',
            'History 1st Paper', 'History 2nd Paper', 'Islamic History and Culture 1st Paper', 'Islamic History and Culture 2nd Paper',
            'Islamic Studies 1st Paper', 'Islamic Studies 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'
          ],
          'Business Studies': [
            'Bangla', 'English', 'Information and Communication Technology',
            'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper',
            'Finance 1st Paper', 'Finance 2nd Paper', 'Accounting 1st Paper', 'Accounting 2nd Paper',
            'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper'
          ]
        }
      };

      const classSubjects = subjects[classLabel] || {};

      return Response.json({ 
        success: true, 
        subjects: classSubjects 
      }, { headers: defaultHeaders });
    }

    return null;
  },

  // Get chapters for a subject
  '/api/chapters': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    const url = new URL(request.url);
    const classLabel = url.searchParams.get('class');
    const subject = url.searchParams.get('subject');

    if (request.method === 'GET') {
      if (!classLabel || !subject) {
        return Response.json({ success: false, error: "Class and subject parameters are required." }, { status: 400, headers: defaultHeaders });
      }

      // This would typically come from a content store or curriculum database
      // For now, returning a basic chapter structure
      const generateChapters = (subjectName, totalChapters = 10) => {
        return Array.from({ length: totalChapters }, (_, i) => ({
          id: `chapter-${i + 1}`,
          title: `Chapter ${i + 1}`,
          description: `Content for ${subjectName} - Chapter ${i + 1}`
        }));
      };

      const chapters = generateChapters(subject);

      return Response.json({ 
        success: true, 
        chapters 
      }, { headers: defaultHeaders });
    }

    return null;
  },

  // Get chapter content
  '/api/chapter-content': async (request, env, ctx) => {
    const user = await authenticate(request, env);
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
    }

    const url = new URL(request.url);
    const chapterId = url.searchParams.get('chapter');

    if (request.method === 'GET') {
      if (!chapterId) {
        return Response.json({ success: false, error: "Chapter ID is required." }, { status: 400, headers: defaultHeaders });
      }

      // Get content from content store
      const content = await env.DB.prepare("SELECT data FROM content_store WHERE key = ?")
        .bind(`chapter:${chapterId}`).first();

      if (content) {
        return Response.json({ 
          success: true, 
          content: JSON.parse(content.data) 
        }, { headers: defaultHeaders });
      }

      // Return default content if not found
      return Response.json({ 
        success: true, 
        content: {
          title: `Chapter ${chapterId}`,
          body: `<p>Content for ${chapterId} will be available soon.</p>`,
          exercises: [],
          resources: []
        }
      }, { headers: defaultHeaders });
    }

    if (request.method === 'POST') {
      if (!requireAdmin(user)) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: defaultHeaders });
      }

      const { chapter, content } = await request.json();

      if (!chapter || !content) {
        return Response.json({ success: false, error: "Chapter and content are required." }, { status: 400, headers: defaultHeaders });
      }

      await env.DB.prepare(`
        INSERT INTO content_store (key, data) 
        VALUES (?, ?) 
        ON CONFLICT(key) DO UPDATE SET 
          data = excluded.data, 
          updated_at = CURRENT_TIMESTAMP
      `).bind(`chapter:${chapter}`, JSON.stringify(content)).run();

      await logUserAction(env.DB, user.id, "Chapter content updated", { chapter });

      return Response.json({ success: true }, { headers: defaultHeaders });
    }

    return null;
  }
};
