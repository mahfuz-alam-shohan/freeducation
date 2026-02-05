import type {
  Chapter,
  NoteItem,
  QuestionItem,
  SectionKey,
  Subject,
  SubjectNode,
  Topic,
  TopicNoteItem,
  TopicQuestionItem,
  TopicVideoItem,
  VideoItem
} from '../domain/subject.types';
import { SubjectRepository } from '../infrastructure/subject.repository';
import { ChaptersService } from './services/chapters.service';
import { LabelsService } from './services/labels.service';
import { NodesService } from './services/nodes.service';
import { NotesService } from './services/notes.service';
import { QuestionsService } from './services/questions.service';
import { SubjectsService } from './services/subjects.service';
import { TopicsService } from './services/topics.service';
import { VideosService } from './services/videos.service';

export class SubjectService {
  private repo: SubjectRepository;
  private subjectsService: SubjectsService;
  private nodesService: NodesService;
  private chaptersService: ChaptersService;
  private topicsService: TopicsService;
  private notesService: NotesService;
  private videosService: VideosService;
  private questionsService: QuestionsService;
  private labelsService: LabelsService;

  constructor(db: D1Database) {
    this.repo = new SubjectRepository(db);
    this.subjectsService = new SubjectsService(this.repo);
    this.nodesService = new NodesService(this.repo);
    this.chaptersService = new ChaptersService(this.repo);
    this.topicsService = new TopicsService(this.repo);
    this.notesService = new NotesService(this.repo);
    this.videosService = new VideosService(this.repo);
    this.questionsService = new QuestionsService(this.repo);
    this.labelsService = new LabelsService(this.repo);
  }

  async listSubjects(): Promise<Subject[]> {
    return await this.subjectsService.listSubjects();
  }

  async createSubject(name: string, templateId: number): Promise<Subject> {
    return await this.subjectsService.createSubject(name, templateId);
  }

  async updateSubject(id: number, updates: { name?: string; isActive?: boolean }): Promise<Subject | null> {
    return await this.subjectsService.updateSubject(id, updates);
  }

  async deleteSubject(id: number): Promise<boolean> {
    return await this.subjectsService.deleteSubject(id);
  }

  async getSubjectDetail(id: number): Promise<{ subject: Subject; nodes: SubjectNode[]; labels: { types: Record<string, string>; sections: Record<string, string> } } | null> {
    const subject = await this.repo.findSubjectById(id);
    if (!subject) return null;

    const nodes = await this.repo.listTemplateNodesForSubject(subject.id, subject.templateId);
    const labels = await this.labelsService.getLabels(subject.id);

    return { subject, nodes, labels };
  }

  async updateNodeOverride(subjectId: number, nodeId: number, displayName: string | null, imageKey: string | null): Promise<void> {
    await this.nodesService.updateNodeOverride(subjectId, nodeId, displayName, imageKey);
  }

  async listChapters(subjectId: number, nodeId: number): Promise<Chapter[]> {
    return await this.chaptersService.listChapters(subjectId, nodeId);
  }

  async createChapter(subjectId: number, nodeId: number, name: string, imageKey: string | null): Promise<Chapter> {
    return await this.chaptersService.createChapter(subjectId, nodeId, name, imageKey);
  }

  async updateChapter(chapterId: number, updates: { name?: string; imageKey?: string | null }): Promise<Chapter | null> {
    return await this.chaptersService.updateChapter(chapterId, updates);
  }

  async deleteChapter(chapterId: number): Promise<boolean> {
    return await this.chaptersService.deleteChapter(chapterId);
  }

  async getChapterDetail(chapterId: number): Promise<{
    chapter: Chapter;
    subject: Subject;
    node: { id: number; nodeKey: string; serverName: string };
    labels: { types: Record<string, string>; sections: Record<string, string> };
    sectionKeys: SectionKey[];
    notes: NoteItem[];
    videos: VideoItem[];
    questions: QuestionItem[];
  } | null> {
    const chapter = await this.repo.findChapterById(chapterId);
    if (!chapter) return null;

    const subject = await this.repo.findSubjectById(chapter.subjectId);
    if (!subject) return null;

    const nodes = await this.repo.listTemplateNodesForSubject(subject.id, subject.templateId);
    const node = nodes.find((item) => item.id === chapter.nodeId);
    if (!node) return null;

    const labels = await this.labelsService.getLabels(subject.id);
    const sectionKeys = this.deriveCqSectionKeys(nodes);
    const [notes, videos, questions] = await Promise.all([
      this.repo.listNotes(chapterId),
      this.repo.listVideos(chapterId),
      this.repo.listQuestions(chapterId)
    ]);

    return {
      chapter,
      subject,
      node: { id: node.id, nodeKey: node.nodeKey, serverName: node.serverName },
      labels,
      sectionKeys,
      notes,
      videos,
      questions
    };
  }

  async addNote(chapterId: number, note: string, imageKey: string | null): Promise<NoteItem> {
    return await this.notesService.addChapterNote(chapterId, note, imageKey);
  }

  async deleteNote(noteId: number): Promise<boolean> {
    return await this.notesService.deleteChapterNote(noteId);
  }

  async listTopics(chapterId: number): Promise<Topic[]> {
    return await this.topicsService.listTopics(chapterId);
  }

  async createTopic(chapterId: number, name: string, imageKey: string | null): Promise<Topic> {
    return await this.topicsService.createTopic(chapterId, name, imageKey);
  }

  async updateTopic(topicId: number, updates: { name?: string; imageKey?: string | null }): Promise<Topic | null> {
    return await this.topicsService.updateTopic(topicId, updates);
  }

  async deleteTopic(topicId: number): Promise<boolean> {
    return await this.topicsService.deleteTopic(topicId);
  }

  async getTopicDetail(topicId: number): Promise<{
    topic: Topic;
    chapter: Chapter;
    subject: Subject;
    node: { id: number; nodeKey: string; serverName: string };
    labels: { types: Record<string, string>; sections: Record<string, string> };
    sectionKeys: SectionKey[];
    notes: TopicNoteItem[];
    videos: TopicVideoItem[];
    questions: TopicQuestionItem[];
  } | null> {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) return null;

    const chapter = await this.repo.findChapterById(topic.chapterId);
    if (!chapter) return null;

    const subject = await this.repo.findSubjectById(chapter.subjectId);
    if (!subject) return null;

    const nodes = await this.repo.listTemplateNodesForSubject(subject.id, subject.templateId);
    const node = nodes.find((item) => item.id === chapter.nodeId);
    if (!node) return null;

    const labels = await this.labelsService.getLabels(subject.id);
    const sectionKeys = this.deriveCqSectionKeys(nodes);
    const [notes, videos, questions] = await Promise.all([
      this.repo.listTopicNotes(topicId),
      this.repo.listTopicVideos(topicId),
      this.repo.listTopicQuestions(topicId)
    ]);

    return {
      topic,
      chapter,
      subject,
      node: { id: node.id, nodeKey: node.nodeKey, serverName: node.serverName },
      labels,
      sectionKeys,
      notes,
      videos,
      questions
    };
  }

  async addTopicNote(topicId: number, note: string, imageKey: string | null): Promise<TopicNoteItem> {
    return await this.notesService.addTopicNote(topicId, note, imageKey);
  }

  async deleteTopicNote(noteId: number): Promise<boolean> {
    return await this.notesService.deleteTopicNote(noteId);
  }

  async addTopicVideo(topicId: number, payload: { mode: TopicVideoItem['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<TopicVideoItem> {
    return await this.videosService.addTopicVideo(topicId, payload);
  }

  async deleteTopicVideo(videoId: number): Promise<boolean> {
    return await this.videosService.deleteTopicVideo(videoId);
  }

  async addTopicQuestion(topicId: number, payload: { typeKey: TopicQuestionItem['typeKey']; sectionKey?: TopicQuestionItem['sectionKey'] | null; questionText: string; answerText: string }): Promise<TopicQuestionItem> {
    return await this.questionsService.addTopicQuestion(topicId, payload);
  }

  async updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<TopicQuestionItem | null> {
    return await this.questionsService.updateTopicQuestion(questionId, payload);
  }

  async deleteTopicQuestion(questionId: number): Promise<boolean> {
    return await this.questionsService.deleteTopicQuestion(questionId);
  }

  async addVideo(chapterId: number, payload: { mode: VideoItem['mode']; title: string; url?: string | null; author?: string | null; fileKey?: string | null }): Promise<VideoItem> {
    return await this.videosService.addChapterVideo(chapterId, payload);
  }

  async deleteVideo(videoId: number): Promise<boolean> {
    return await this.videosService.deleteChapterVideo(videoId);
  }

  async addQuestion(chapterId: number, payload: { typeKey: QuestionItem['typeKey']; sectionKey?: QuestionItem['sectionKey'] | null; questionText: string; answerText: string }): Promise<QuestionItem> {
    return await this.questionsService.addChapterQuestion(chapterId, payload);
  }

  async updateQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<QuestionItem | null> {
    return await this.questionsService.updateChapterQuestion(questionId, payload);
  }

  async deleteQuestion(questionId: number): Promise<boolean> {
    return await this.questionsService.deleteChapterQuestion(questionId);
  }

  async updateQuestionLabels(subjectId: number, typeLabels: Record<string, string>, sectionLabels: Record<string, string>): Promise<void> {
    await this.labelsService.updateLabels(subjectId, typeLabels, sectionLabels);
  }

  private deriveCqSectionKeys(nodes: SubjectNode[]): SectionKey[] {
    const sectionOrders = new Map<SectionKey, number>();
    nodes.forEach((node) => {
      const match = node.nodeKey.match(/_CQ_(KNOWLEDGE|TWO|THREE|FOUR)$/);
      if (!match) return;
      const key = match[1] as SectionKey;
      const existing = sectionOrders.get(key);
      if (existing === undefined || node.sortOrder < existing) {
        sectionOrders.set(key, node.sortOrder);
      }
    });

    if (sectionOrders.size === 0) {
      return ['KNOWLEDGE', 'TWO', 'THREE', 'FOUR'];
    }

    return Array.from(sectionOrders.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([key]) => key);
  }
}
