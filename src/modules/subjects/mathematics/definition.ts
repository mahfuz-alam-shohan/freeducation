import type { SubjectTemplate } from "../types";

export const mathematicsTemplate: SubjectTemplate = {
  slug: "mathematics",
  name: "Mathematics",
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
  ],
};
