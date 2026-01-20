import type { SubjectTemplate } from "../types";

export const information_and_communication_technologyTemplate: SubjectTemplate = {
  slug: "information-and-communication-technology",
  name: "Information and Communication Technology",
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
    {
      slug: "11-12",
      stream: "core",
      isOptional: false,
    },
  ],
};
