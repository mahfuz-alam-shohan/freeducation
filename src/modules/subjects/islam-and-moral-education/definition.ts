import type { SubjectTemplate } from "../types";

export const islam_and_moral_educationTemplate: SubjectTemplate = {
  slug: "islam-and-moral-education",
  name: "Islam and Moral Education",
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
