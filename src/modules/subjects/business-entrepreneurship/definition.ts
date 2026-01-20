import type { SubjectTemplate } from "../types";

export const business_entrepreneurshipTemplate: SubjectTemplate = {
  slug: "business-entrepreneurship",
  name: "Business Entrepreneurship",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "9-10",
      stream: "business",
      isOptional: false,
    },
  ],
};
