export type QuestionTypeKey = 'CQ' | 'MCQ';
export type SectionKey = 'KNOWLEDGE' | 'TWO' | 'THREE' | 'FOUR';
export type McqOptionKey = 'A' | 'B' | 'C' | 'D';

export interface Subject {
  id: number;
  name: string;
  templateId: number;
  templateName: string;
  templateCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectNode {
  id: number;
  parentId: number | null;
  nodeKey: string;
  serverName: string;
  nodeType: 'book' | 'part';
  hasImage: boolean;
  sortOrder: number;
  displayName: string | null;
  imageKey: string | null;
}

export interface Chapter {
  id: number;
  subjectId: number;
  nodeId: number;
  name: string;
  imageKey: string | null;
  sortOrder: number;
}

export interface NoteItem {
  id: number;
  chapterId: number;
  note: string;
  imageKey: string | null;
}

export interface VideoItem {
  id: number;
  chapterId: number;
  mode: 'link' | 'upload';
  title: string;
  url: string | null;
  author: string | null;
  fileKey: string | null;
}

export interface QuestionItem {
  id: number;
  chapterId: number;
  typeKey: QuestionTypeKey;
  sectionKey: SectionKey | null;
  questionText: string;
  answerText: string;
  imageKey: string | null;
  options: string[] | null;
  correctOption: McqOptionKey | null;
}

export interface Topic {
  id: number;
  chapterId: number;
  name: string;
  imageKey: string | null;
  sortOrder: number;
}

export interface TopicNoteItem {
  id: number;
  topicId: number;
  note: string;
  imageKey: string | null;
}

export interface TopicVideoItem {
  id: number;
  topicId: number;
  mode: 'link' | 'upload';
  title: string;
  url: string | null;
  author: string | null;
  fileKey: string | null;
}

export interface TopicQuestionItem {
  id: number;
  topicId: number;
  typeKey: QuestionTypeKey;
  sectionKey: SectionKey | null;
  questionText: string;
  answerText: string;
  imageKey: string | null;
  options: string[] | null;
  correctOption: McqOptionKey | null;
}

export type SubjectRecord = Subject;
export type SubjectNodeRecord = SubjectNode;
export type ChapterRecord = Chapter;
export type NoteRecord = NoteItem;
export type VideoRecord = VideoItem;
export type QuestionRecord = QuestionItem;
export type TopicRecord = Topic;
export type TopicNoteRecord = TopicNoteItem;
export type TopicVideoRecord = TopicVideoItem;
export type TopicQuestionRecord = TopicQuestionItem;

export const DEFAULT_TYPE_LABELS: Record<QuestionTypeKey, string> = {
  CQ: 'CQ',
  MCQ: 'MCQ'
};

export const DEFAULT_SECTION_LABELS: Record<SectionKey, string> = {
  KNOWLEDGE: 'Knowledge',
  TWO: 'Understanding',
  THREE: 'Application',
  FOUR: 'HOTS'
};
