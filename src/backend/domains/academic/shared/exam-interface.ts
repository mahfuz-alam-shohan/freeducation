export interface ExamProvider {
  generateQuestions(topicId: string): Promise<any>;
  validateAnswer(questionId: string, answer: any): number;
  renderExamUI(): string;
}
