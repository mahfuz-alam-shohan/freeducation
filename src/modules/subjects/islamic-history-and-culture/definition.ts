import type { SubjectTemplate } from "../types";

export const islamic_history_and_cultureTemplate: SubjectTemplate = {
  slug: "islamic-history-and-culture",
  name: "Islamic History and Culture",
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
