import type { SubjectTemplate } from "../types";

export const statisticsTemplate: SubjectTemplate = {
  slug: "statistics",
  name: "Statistics",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "11-12",
      stream: "science",
      isOptional: false,
    },
  ],
};
