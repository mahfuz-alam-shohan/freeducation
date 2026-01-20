import type { SubjectTemplate } from "../types";

export const banglaTemplate: SubjectTemplate = {
  slug: "bangla",
  name: "Bangla",
  structure: {
    hasChapters: true,
    hasTopics: false,
    contentScope: "chapter",
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
