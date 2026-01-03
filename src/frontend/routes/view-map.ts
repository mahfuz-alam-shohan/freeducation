import { adminViewEntries } from "./view-map-admin";
import { publicViewEntries } from "./view-map-public";

export const viewByPath = new Map<string, string>([
  ...publicViewEntries,
  ...adminViewEntries,
]);
