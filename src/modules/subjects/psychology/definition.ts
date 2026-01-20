import type { SubjectTemplate } from "../types";

export const psychologyTemplate: SubjectTemplate = {
  slug: "psychology",
  name: "Psychology",
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
