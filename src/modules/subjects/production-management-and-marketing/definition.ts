import type { SubjectTemplate } from "../types";

export const production_management_and_marketingTemplate: SubjectTemplate = {
  slug: "production-management-and-marketing",
  name: "Production Management and Marketing",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "11-12",
      stream: "business",
      isOptional: false,
    },
  ],
};
