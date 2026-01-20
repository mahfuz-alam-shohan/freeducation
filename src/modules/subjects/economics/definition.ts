import type { SubjectTemplate } from "../types";

export const economicsTemplate: SubjectTemplate = {
  slug: "economics",
  name: "Economics",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "9-10",
      stream: "humanities",
      isOptional: false,
    },
    {
      slug: "11-12",
      stream: "humanities",
      isOptional: false,
    },
  ],
};
