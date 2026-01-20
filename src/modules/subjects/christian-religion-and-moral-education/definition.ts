import type { SubjectTemplate } from "../types";

export const christian_religion_and_moral_educationTemplate: SubjectTemplate = {
  slug: "christian-religion-and-moral-education",
  name: "Christian Religion and Moral Education",
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
