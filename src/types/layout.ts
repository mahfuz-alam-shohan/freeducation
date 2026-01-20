import type { AdminSession } from "../services/security/session";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type PageLayoutProps = {
  device: DeviceType;
  content: string;
  session: AdminSession | null;
};
