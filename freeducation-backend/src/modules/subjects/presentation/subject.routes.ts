import type { Router, Handler } from '../../../shared/kernel/router';
import { SubjectService } from '../application/subject.service';
import { ChaptersController } from './controllers/chapters.controller';
import { SubjectsController } from './controllers/subjects.controller';
import { TopicsController } from './controllers/topics.controller';

export function registerSubjectRoutes(router: Router, subjectService: SubjectService, adminGuard: (handler: Handler) => Handler): void {
  const subjectsController = new SubjectsController(subjectService);
  const chaptersController = new ChaptersController(subjectService);
  const topicsController = new TopicsController(subjectService);

  router.add('GET', '/api/v1/admin/subjects', adminGuard((ctx) => subjectsController.list(ctx)));
  router.add('POST', '/api/v1/admin/subjects', adminGuard((ctx) => subjectsController.create(ctx)));
  router.add('GET', '/api/v1/admin/subjects/:id', adminGuard((ctx) => subjectsController.get(ctx)));
  router.add('PATCH', '/api/v1/admin/subjects/:id', adminGuard((ctx) => subjectsController.update(ctx)));
  router.add('DELETE', '/api/v1/admin/subjects/:id', adminGuard((ctx) => subjectsController.remove(ctx)));

  router.add('PUT', '/api/v1/admin/subjects/:id/nodes/:nodeId', adminGuard((ctx) => subjectsController.updateNode(ctx)));

  router.add('GET', '/api/v1/admin/subjects/:id/chapters', adminGuard((ctx) => chaptersController.list(ctx)));
  router.add('POST', '/api/v1/admin/subjects/:id/chapters', adminGuard((ctx) => chaptersController.create(ctx)));
  router.add('PATCH', '/api/v1/admin/subjects/:id/chapters/:chapterId', adminGuard((ctx) => chaptersController.update(ctx)));
  router.add('DELETE', '/api/v1/admin/subjects/:id/chapters/:chapterId', adminGuard((ctx) => chaptersController.remove(ctx)));

  router.add('GET', '/api/v1/admin/chapters/:chapterId', adminGuard((ctx) => chaptersController.get(ctx)));
  router.add('POST', '/api/v1/admin/chapters/:chapterId/notes', adminGuard((ctx) => chaptersController.addNote(ctx)));
  router.add('DELETE', '/api/v1/admin/chapters/:chapterId/notes/:noteId', adminGuard((ctx) => chaptersController.deleteNote(ctx)));
  router.add('POST', '/api/v1/admin/chapters/:chapterId/videos', adminGuard((ctx) => chaptersController.addVideo(ctx)));
  router.add('DELETE', '/api/v1/admin/chapters/:chapterId/videos/:videoId', adminGuard((ctx) => chaptersController.deleteVideo(ctx)));
  router.add('POST', '/api/v1/admin/chapters/:chapterId/questions', adminGuard((ctx) => chaptersController.addQuestion(ctx)));
  router.add('PATCH', '/api/v1/admin/chapters/:chapterId/questions/:questionId', adminGuard((ctx) => chaptersController.updateQuestion(ctx)));
  router.add('DELETE', '/api/v1/admin/chapters/:chapterId/questions/:questionId', adminGuard((ctx) => chaptersController.deleteQuestion(ctx)));

  router.add('GET', '/api/v1/admin/chapters/:chapterId/topics', adminGuard((ctx) => topicsController.list(ctx)));
  router.add('POST', '/api/v1/admin/chapters/:chapterId/topics', adminGuard((ctx) => topicsController.create(ctx)));
  router.add('PATCH', '/api/v1/admin/chapters/:chapterId/topics/:topicId', adminGuard((ctx) => topicsController.update(ctx)));
  router.add('DELETE', '/api/v1/admin/chapters/:chapterId/topics/:topicId', adminGuard((ctx) => topicsController.remove(ctx)));

  router.add('GET', '/api/v1/admin/topics/:topicId', adminGuard((ctx) => topicsController.get(ctx)));
  router.add('POST', '/api/v1/admin/topics/:topicId/notes', adminGuard((ctx) => topicsController.addNote(ctx)));
  router.add('DELETE', '/api/v1/admin/topics/:topicId/notes/:noteId', adminGuard((ctx) => topicsController.deleteNote(ctx)));
  router.add('POST', '/api/v1/admin/topics/:topicId/videos', adminGuard((ctx) => topicsController.addVideo(ctx)));
  router.add('DELETE', '/api/v1/admin/topics/:topicId/videos/:videoId', adminGuard((ctx) => topicsController.deleteVideo(ctx)));
  router.add('POST', '/api/v1/admin/topics/:topicId/questions', adminGuard((ctx) => topicsController.addQuestion(ctx)));
  router.add('PATCH', '/api/v1/admin/topics/:topicId/questions/:questionId', adminGuard((ctx) => topicsController.updateQuestion(ctx)));
  router.add('DELETE', '/api/v1/admin/topics/:topicId/questions/:questionId', adminGuard((ctx) => topicsController.deleteQuestion(ctx)));

  router.add('PUT', '/api/v1/admin/subjects/:id/question-labels', adminGuard((ctx) => subjectsController.updateLabels(ctx)));
}
