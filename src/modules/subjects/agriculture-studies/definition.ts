import type { SubjectTemplate } from "../types";

export const agriculture_studiesTemplate: SubjectTemplate = {
  slug: "agriculture-studies",
  name: "Agriculture Studies",
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
