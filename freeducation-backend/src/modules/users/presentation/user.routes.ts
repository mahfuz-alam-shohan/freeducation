import type { Router, Handler } from '../../../shared/kernel/router';
import { UserService } from '../application/user.service';
import { UserController } from './user.controller';

export function registerUserRoutes(router: Router, userService: UserService, adminGuard: (handler: Handler) => Handler): void {
  const controller = new UserController(userService);

  router.add('GET', '/api/v1/users', adminGuard((ctx) => controller.list(ctx)));
  router.add('POST', '/api/v1/users', adminGuard((ctx) => controller.create(ctx)));
  router.add('GET', '/api/v1/users/:id', adminGuard((ctx) => controller.get(ctx)));
  router.add('PATCH', '/api/v1/users/:id', adminGuard((ctx) => controller.update(ctx)));
}
