import type { SubjectTemplate } from "../types";

export const finance_banking_and_insuranceTemplate: SubjectTemplate = {
  slug: "finance-banking-and-insurance",
  name: "Finance, Banking and Insurance",
  structure: {
    hasChapters: true,
    hasTopics: true,
    contentScope: "topic",
  },
  classGroups: [
    {
      slug: "11-12",
      stream: "business",
      isOptional: false,
    },
  ],
};
