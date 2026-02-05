import { SubjectRepository } from '../../infrastructure/subject.repository';

export class NodesService {
  constructor(private repo: SubjectRepository) {}

  async updateNodeOverride(subjectId: number, nodeId: number, displayName: string | null, imageKey: string | null): Promise<void> {
    await this.repo.upsertNodeOverride(subjectId, nodeId, displayName, imageKey);
  }
}
