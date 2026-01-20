import type { SubjectTemplate } from "../types";

export const physicsTemplate: SubjectTemplate = {
  slug: "physics",
  name: "Physics",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "9-10",
      stream: "science",
      isOptional: false,
    },
    {
      slug: "11-12",
      stream: "science",
      isOptional: false,
    },
  ],
};
