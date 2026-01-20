import type { SubjectTemplate } from "../types";

export const finance_and_bankingTemplate: SubjectTemplate = {
  slug: "finance-and-banking",
  name: "Finance and Banking",
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
  ],
};
