import type { Router, Handler } from '../../../shared/kernel/router';
import { ModuleTemplateService } from '../application/module-template.service';
import { ModuleTemplateController } from './module-template.controller';

export function registerModuleTemplateRoutes(
  router: Router,
  service: ModuleTemplateService,
  adminGuard: (handler: Handler) => Handler
): void {
  const controller = new ModuleTemplateController(service);

  router.add('GET', '/api/v1/admin/modules/categories', adminGuard((ctx) => controller.listCategories(ctx)));
  router.add('GET', '/api/v1/admin/modules/subjects', adminGuard((ctx) => controller.listSubjectTemplates(ctx)));
  router.add('GET', '/api/v1/admin/modules/subjects/:id', adminGuard((ctx) => controller.getSubjectTemplate(ctx)));
}
