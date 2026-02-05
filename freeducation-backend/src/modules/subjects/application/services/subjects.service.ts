import type { Subject } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class SubjectsService {
  constructor(private repo: SubjectRepository) {}

  async listSubjects(): Promise<Subject[]> {
    return await this.repo.listSubjects();
  }

  async createSubject(name: string, templateId: number): Promise<Subject> {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      throw new Error('Subject name is too short');
    }
    if (!Number.isFinite(templateId)) {
      throw new Error('Template is required');
    }
    return await this.repo.createSubject(trimmed, templateId);
  }

  async updateSubject(id: number, updates: { name?: string; isActive?: boolean }): Promise<Subject | null> {
    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
      if (updates.name.length < 2) {
        throw new Error('Subject name is too short');
      }
    }
    return await this.repo.updateSubject(id, updates);
  }

  async deleteSubject(id: number): Promise<boolean> {
    return await this.repo.deleteSubject(id);
  }
}
