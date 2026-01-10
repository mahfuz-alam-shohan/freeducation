import { contentKeys } from './data';
import type { ExamProvider } from '../../shared/exam-interface';

export const pickContentSlice = (content: Record<string, unknown>) =>
  Object.fromEntries(contentKeys.map((key) => [key, content[key]]));

export const applyContentSlice = (content: Record<string, unknown>, update: Record<string, unknown>) => {
  const next = { ...content };
  for (const key of contentKeys) {
    if (key in update) {
      next[key] = update[key];
    }
  }
  return next;
};

export class BanglaExam implements ExamProvider {
  async generateQuestions(topicId: string): Promise<any> {
    return { topicId, questions: [] };
  }

  validateAnswer(_questionId: string, _answer: any): number {
    return 0;
  }

  renderExamUI(): string {
    return '<div data-exam=\"bangla\"></div>';
  }
}
