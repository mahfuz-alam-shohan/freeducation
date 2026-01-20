import type { SubjectTemplate } from "../types";

export const social_workTemplate: SubjectTemplate = {
  slug: "social-work",
  name: "Social Work",
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
