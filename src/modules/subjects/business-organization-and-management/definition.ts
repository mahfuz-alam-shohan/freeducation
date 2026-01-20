import type { SubjectTemplate } from "../types";

export const business_organization_and_managementTemplate: SubjectTemplate = {
  slug: "business-organization-and-management",
  name: "Business Organization and Management",
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
