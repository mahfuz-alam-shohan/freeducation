import type { SubjectTemplate } from "../types";

export const geography_and_environmentTemplate: SubjectTemplate = {
  slug: "geography-and-environment",
  name: "Geography and Environment",
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
