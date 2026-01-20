import type { DeviceType } from "../types/layout";

export const getDeviceType = (userAgent: string | null): DeviceType => {
  const agent = userAgent?.toLowerCase() ?? "";
  if (/mobi|android|iphone|ipod/.test(agent)) {
    return "mobile";
  }
  if (/ipad|tablet/.test(agent)) {
    return "tablet";
  }
  return "desktop";
};
