import { ModuleTemplateRepository, type ModuleCategoryRecord, type ModuleTemplateRecord, type ModuleNodeRecord } from '../infrastructure/module-template.repository';

export interface ModuleCategory extends ModuleCategoryRecord {}
export interface ModuleTemplate extends ModuleTemplateRecord {}
export interface ModuleNode extends ModuleNodeRecord {}

export class ModuleTemplateService {
  private repo: ModuleTemplateRepository;

  constructor(db: D1Database) {
    this.repo = new ModuleTemplateRepository(db);
  }

  async listCategories(): Promise<ModuleCategory[]> {
    return await this.repo.listCategories();
  }

  async listSubjectTemplates(): Promise<ModuleTemplate[]> {
    return await this.repo.listTemplatesByCategoryKey('subjects');
  }

  async getSubjectTemplate(id: number): Promise<{ template: ModuleTemplate; nodes: ModuleNode[] } | null> {
    const template = await this.repo.findTemplateById(id);
    if (!template || template.categoryKey !== 'subjects') {
      return null;
    }

    const nodes = await this.repo.listNodesForTemplate(template.id);
    return { template, nodes };
  }
}
