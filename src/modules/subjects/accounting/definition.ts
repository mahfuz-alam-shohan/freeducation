import type { SubjectTemplate } from "../types";

export const accountingTemplate: SubjectTemplate = {
  slug: "accounting",
  name: "Accounting",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
};
