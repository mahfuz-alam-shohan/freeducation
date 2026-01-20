import type { SubjectTemplate } from "../types";

export const geographyTemplate: SubjectTemplate = {
  slug: "geography",
  name: "Geography",
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
