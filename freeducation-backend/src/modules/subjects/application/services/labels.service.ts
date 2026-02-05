import { DEFAULT_SECTION_LABELS, DEFAULT_TYPE_LABELS } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class LabelsService {
  constructor(private repo: SubjectRepository) {}

  async getLabels(subjectId: number): Promise<{ types: Record<string, string>; sections: Record<string, string> }> {
    const [typeOverrides, sectionOverrides] = await Promise.all([
      this.repo.getQuestionTypeLabels(subjectId),
      this.repo.getCqSectionLabels(subjectId)
    ]);

    const typeLabels: Record<string, string> = {
      CQ: typeOverrides.CQ || DEFAULT_TYPE_LABELS.CQ,
      MCQ: typeOverrides.MCQ || DEFAULT_TYPE_LABELS.MCQ
    };

    const sectionLabels: Record<string, string> = {
      KNOWLEDGE: sectionOverrides.KNOWLEDGE || DEFAULT_SECTION_LABELS.KNOWLEDGE,
      TWO: sectionOverrides.TWO || DEFAULT_SECTION_LABELS.TWO,
      THREE: sectionOverrides.THREE || DEFAULT_SECTION_LABELS.THREE,
      FOUR: sectionOverrides.FOUR || DEFAULT_SECTION_LABELS.FOUR
    };

    return { types: typeLabels, sections: sectionLabels };
  }

  async updateLabels(subjectId: number, typeLabels: Record<string, string>, sectionLabels: Record<string, string>): Promise<void> {
    await this.repo.setQuestionTypeLabel(subjectId, 'CQ', typeLabels.CQ ?? '');
    await this.repo.setQuestionTypeLabel(subjectId, 'MCQ', typeLabels.MCQ ?? '');

    await this.repo.setCqSectionLabel(subjectId, 'KNOWLEDGE', sectionLabels.KNOWLEDGE ?? '');
    await this.repo.setCqSectionLabel(subjectId, 'TWO', sectionLabels.TWO ?? '');
    await this.repo.setCqSectionLabel(subjectId, 'THREE', sectionLabels.THREE ?? '');
    await this.repo.setCqSectionLabel(subjectId, 'FOUR', sectionLabels.FOUR ?? '');
  }
}
