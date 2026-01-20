import type { SubjectTemplate } from "../types";

export const sociologyTemplate: SubjectTemplate = {
  slug: "sociology",
  name: "Sociology",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "11-12",
      stream: "humanities",
      isOptional: false,
    },
  ],
};
