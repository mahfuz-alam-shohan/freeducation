export type SubjectTemplate = {
  slug: string;
  name: string;
  structure: {
    hasChapters: boolean;
    hasTopics: boolean;
    contentScope: "chapter" | "topic";
  };
};
