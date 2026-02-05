import type {
  ChapterRecord,
  NoteRecord,
  QuestionRecord,
  SubjectNodeRecord,
  SubjectRecord,
  TopicNoteRecord,
  TopicQuestionRecord,
  TopicRecord,
  TopicVideoRecord,
  VideoRecord
} from '../domain/subject.types';
import { ChaptersRepository } from './repositories/chapters.repository';
import { LabelsRepository } from './repositories/labels.repository';
import { NotesRepository } from './repositories/notes.repository';
import { QuestionsRepository } from './repositories/questions.repository';
import { SubjectNodesRepository } from './repositories/subject-nodes.repository';
import { SubjectsRepository } from './repositories/subjects.repository';
import { TopicsRepository } from './repositories/topics.repository';
import { VideosRepository } from './repositories/videos.repository';

export class SubjectRepository {
  private subjectsRepo: SubjectsRepository;
  private nodesRepo: SubjectNodesRepository;
  private chaptersRepo: ChaptersRepository;
  private topicsRepo: TopicsRepository;
  private notesRepo: NotesRepository;
  private videosRepo: VideosRepository;
  private questionsRepo: QuestionsRepository;
  private labelsRepo: LabelsRepository;

  constructor(db: D1Database) {
    this.subjectsRepo = new SubjectsRepository(db);
    this.nodesRepo = new SubjectNodesRepository(db);
    this.chaptersRepo = new ChaptersRepository(db);
    this.topicsRepo = new TopicsRepository(db);
    this.notesRepo = new NotesRepository(db);
    this.videosRepo = new VideosRepository(db);
    this.questionsRepo = new QuestionsRepository(db);
    this.labelsRepo = new LabelsRepository(db);
  }

  listSubjects(): Promise<SubjectRecord[]> {
    return this.subjectsRepo.listSubjects();
  }

  createSubject(name: string, templateId: number): Promise<SubjectRecord> {
    return this.subjectsRepo.createSubject(name, templateId);
  }

  findSubjectById(id: number): Promise<SubjectRecord | null> {
    return this.subjectsRepo.findSubjectById(id);
  }

  updateSubject(id: number, updates: { name?: string; isActive?: boolean }): Promise<SubjectRecord | null> {
    return this.subjectsRepo.updateSubject(id, updates);
  }

  deleteSubject(id: number): Promise<boolean> {
    return this.subjectsRepo.deleteSubject(id);
  }

  listTemplateNodesForSubject(subjectId: number, templateId: number): Promise<SubjectNodeRecord[]> {
    return this.nodesRepo.listTemplateNodesForSubject(subjectId, templateId);
  }

  upsertNodeOverride(subjectId: number, nodeId: number, displayName: string | null, imageKey: string | null): Promise<void> {
    return this.nodesRepo.upsertNodeOverride(subjectId, nodeId, displayName, imageKey);
  }

  listChapters(subjectId: number, nodeId: number): Promise<ChapterRecord[]> {
    return this.chaptersRepo.listChapters(subjectId, nodeId);
  }

  createChapter(subjectId: number, nodeId: number, name: string, imageKey: string | null): Promise<ChapterRecord> {
    return this.chaptersRepo.createChapter(subjectId, nodeId, name, imageKey);
  }

  updateChapter(chapterId: number, updates: { name?: string; imageKey?: string | null }): Promise<ChapterRecord | null> {
    return this.chaptersRepo.updateChapter(chapterId, updates);
  }

  deleteChapter(chapterId: number): Promise<boolean> {
    return this.chaptersRepo.deleteChapter(chapterId);
  }

  findChapterById(chapterId: number): Promise<ChapterRecord | null> {
    return this.chaptersRepo.findChapterById(chapterId);
  }

  listTopics(chapterId: number): Promise<TopicRecord[]> {
    return this.topicsRepo.listTopics(chapterId);
  }

  createTopic(chapterId: number, name: string, imageKey: string | null): Promise<TopicRecord> {
    return this.topicsRepo.createTopic(chapterId, name, imageKey);
  }

  updateTopic(topicId: number, updates: { name?: string; imageKey?: string | null }): Promise<TopicRecord | null> {
    return this.topicsRepo.updateTopic(topicId, updates);
  }

  deleteTopic(topicId: number): Promise<boolean> {
    return this.topicsRepo.deleteTopic(topicId);
  }

  findTopicById(topicId: number): Promise<TopicRecord | null> {
    return this.topicsRepo.findTopicById(topicId);
  }

  listNotes(chapterId: number): Promise<NoteRecord[]> {
    return this.notesRepo.listNotes(chapterId);
  }

  addNote(chapterId: number, note: string, imageKey: string | null): Promise<NoteRecord> {
    return this.notesRepo.addNote(chapterId, note, imageKey);
  }

  deleteNote(noteId: number): Promise<boolean> {
    return this.notesRepo.deleteNote(noteId);
  }

  listTopicNotes(topicId: number): Promise<TopicNoteRecord[]> {
    return this.notesRepo.listTopicNotes(topicId);
  }

  addTopicNote(topicId: number, note: string, imageKey: string | null): Promise<TopicNoteRecord> {
    return this.notesRepo.addTopicNote(topicId, note, imageKey);
  }

  deleteTopicNote(noteId: number): Promise<boolean> {
    return this.notesRepo.deleteTopicNote(noteId);
  }

  listVideos(chapterId: number): Promise<VideoRecord[]> {
    return this.videosRepo.listVideos(chapterId);
  }

  addVideo(chapterId: number, payload: { mode: VideoRecord['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<VideoRecord> {
    return this.videosRepo.addVideo(chapterId, payload);
  }

  deleteVideo(videoId: number): Promise<boolean> {
    return this.videosRepo.deleteVideo(videoId);
  }

  listTopicVideos(topicId: number): Promise<TopicVideoRecord[]> {
    return this.videosRepo.listTopicVideos(topicId);
  }

  addTopicVideo(topicId: number, payload: { mode: TopicVideoRecord['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<TopicVideoRecord> {
    return this.videosRepo.addTopicVideo(topicId, payload);
  }

  deleteTopicVideo(videoId: number): Promise<boolean> {
    return this.videosRepo.deleteTopicVideo(videoId);
  }

  listQuestions(chapterId: number): Promise<QuestionRecord[]> {
    return this.questionsRepo.listQuestions(chapterId);
  }

  addQuestion(chapterId: number, payload: { typeKey: QuestionRecord['typeKey']; sectionKey?: QuestionRecord['sectionKey'] | null; questionText: string; answerText: string }): Promise<QuestionRecord> {
    return this.questionsRepo.addQuestion(chapterId, payload);
  }

  updateQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<QuestionRecord | null> {
    return this.questionsRepo.updateQuestion(questionId, payload);
  }

  deleteQuestion(questionId: number): Promise<boolean> {
    return this.questionsRepo.deleteQuestion(questionId);
  }

  findQuestionById(questionId: number): Promise<QuestionRecord | null> {
    return this.questionsRepo.findQuestionById(questionId);
  }

  listTopicQuestions(topicId: number): Promise<TopicQuestionRecord[]> {
    return this.questionsRepo.listTopicQuestions(topicId);
  }

  addTopicQuestion(topicId: number, payload: { typeKey: TopicQuestionRecord['typeKey']; sectionKey?: TopicQuestionRecord['sectionKey'] | null; questionText: string; answerText: string }): Promise<TopicQuestionRecord> {
    return this.questionsRepo.addTopicQuestion(topicId, payload);
  }

  updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<TopicQuestionRecord | null> {
    return this.questionsRepo.updateTopicQuestion(questionId, payload);
  }

  deleteTopicQuestion(questionId: number): Promise<boolean> {
    return this.questionsRepo.deleteTopicQuestion(questionId);
  }

  findTopicQuestionById(questionId: number): Promise<TopicQuestionRecord | null> {
    return this.questionsRepo.findTopicQuestionById(questionId);
  }

  getQuestionTypeLabels(subjectId: number): Promise<Record<string, string | null>> {
    return this.labelsRepo.getQuestionTypeLabels(subjectId);
  }

  getCqSectionLabels(subjectId: number): Promise<Record<string, string | null>> {
    return this.labelsRepo.getCqSectionLabels(subjectId);
  }

  setQuestionTypeLabel(subjectId: number, typeKey: 'CQ' | 'MCQ', displayName: string | null): Promise<void> {
    return this.labelsRepo.setQuestionTypeLabel(subjectId, typeKey, displayName);
  }

  setCqSectionLabel(subjectId: number, sectionKey: 'KNOWLEDGE' | 'TWO' | 'THREE' | 'FOUR', displayName: string | null): Promise<void> {
    return this.labelsRepo.setCqSectionLabel(subjectId, sectionKey, displayName);
  }
}
