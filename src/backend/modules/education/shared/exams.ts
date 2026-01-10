export interface ExamProvider {
  generateQuestions(): any;
  validateAnswer(submission: any): number;
}
