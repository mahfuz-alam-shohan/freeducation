import type { SubjectTemplate } from "../types";

export const logicTemplate: SubjectTemplate = {
  slug: "logic",
  name: "Logic",
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
