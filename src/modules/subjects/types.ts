import type { DeviceType } from "../../core/types/layout";
import type { AdminSession } from "../../core/security/session";
import type { Env } from "../../app/env";
import type { SubjectTemplate } from "../../core/types/subjects";

export type SubjectModule = {
  template: SubjectTemplate;
  adminRoutes?: (request: Request, env: Env, context: { device: DeviceType; session: AdminSession | null; nonce?: string }) => Promise<Response | null>;
};

export const defineSubjectModule = (subjectModule: SubjectModule): SubjectModule => subjectModule;

export type { SubjectTemplate };
