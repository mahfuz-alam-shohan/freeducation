import type { SubjectTemplate } from "../types";

export const englishTemplate: SubjectTemplate = {
  slug: "english",
  name: "English",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "9-10",
      stream: "core",
      isOptional: false,
    },
    {
      slug: "11-12",
      stream: "core",
      isOptional: false,
    },
  ],
};
