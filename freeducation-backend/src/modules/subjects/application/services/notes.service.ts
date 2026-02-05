import type { NoteItem, TopicNoteItem } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class NotesService {
  constructor(private repo: SubjectRepository) {}

  async addChapterNote(chapterId: number, note: string, imageKey: string | null): Promise<NoteItem> {
    const trimmed = note.trim();
    if (!trimmed) {
      throw new Error('Note is required');
    }
    return await this.repo.addNote(chapterId, trimmed, imageKey);
  }

  async deleteChapterNote(noteId: number): Promise<boolean> {
    return await this.repo.deleteNote(noteId);
  }

  async addTopicNote(topicId: number, note: string, imageKey: string | null): Promise<TopicNoteItem> {
    const trimmed = note.trim();
    if (!trimmed) {
      throw new Error('Note is required');
    }
    return await this.repo.addTopicNote(topicId, trimmed, imageKey);
  }

  async deleteTopicNote(noteId: number): Promise<boolean> {
    return await this.repo.deleteTopicNote(noteId);
  }
}
