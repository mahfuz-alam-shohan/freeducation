import type { SubjectTemplate } from "../types";

export const accountingTemplate: SubjectTemplate = {
  slug: "accounting",
  name: "Accounting",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "9-10",
      stream: "business",
      isOptional: false,
    },
    {
      slug: "11-12",
      stream: "business",
      isOptional: false,
    },
  ],
};
