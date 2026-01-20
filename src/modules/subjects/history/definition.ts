import type { SubjectTemplate } from "../types";

export const historyTemplate: SubjectTemplate = {
  slug: "history",
  name: "History",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
};
