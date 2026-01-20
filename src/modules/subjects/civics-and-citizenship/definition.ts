import type { SubjectTemplate } from "../types";

export const civics_and_citizenshipTemplate: SubjectTemplate = {
  slug: "civics-and-citizenship",
  name: "Civics and Citizenship",
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
