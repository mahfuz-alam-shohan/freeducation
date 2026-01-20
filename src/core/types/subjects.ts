export type SubjectTemplate = {
  slug: string;
  name: string;
  structure: {
    hasChapters: boolean;
    hasTopics: boolean;
    contentScope: "chapter" | "topic";
  };
  classGroups: Array<{
    slug: string;
    stream: string;
    isOptional: boolean;
  }>;
};
