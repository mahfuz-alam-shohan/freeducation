import type { SubjectTemplate } from "../types";

export const home_scienceTemplate: SubjectTemplate = {
  slug: "home-science",
  name: "Home Science",
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
  ],
};
