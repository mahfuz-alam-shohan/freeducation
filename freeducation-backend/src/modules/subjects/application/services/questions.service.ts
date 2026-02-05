import type { QuestionItem, TopicQuestionItem } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

export class QuestionsService {
  constructor(private repo: SubjectRepository) {}

  async addChapterQuestion(chapterId: number, payload: { typeKey: QuestionItem['typeKey']; sectionKey?: QuestionItem['sectionKey'] | null; questionText: string; answerText: string }): Promise<QuestionItem> {
    const questionText = payload.questionText.trim();
    const answerText = payload.answerText.trim();
    if (!questionText || !answerText) {
      throw new Error('Question and answer are required');
    }
    if (payload.typeKey === 'CQ' && !payload.sectionKey) {
      throw new Error('CQ section is required');
    }
    return await this.repo.addQuestion(chapterId, { ...payload, questionText, answerText });
  }

  async updateChapterQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<QuestionItem | null> {
    if (payload.questionText !== undefined && !payload.questionText.trim()) {
      throw new Error('Question is required');
    }
    if (payload.answerText !== undefined && !payload.answerText.trim()) {
      throw new Error('Answer is required');
    }
    return await this.repo.updateQuestion(questionId, {
      questionText: payload.questionText?.trim(),
      answerText: payload.answerText?.trim()
    });
  }

  async deleteChapterQuestion(questionId: number): Promise<boolean> {
    return await this.repo.deleteQuestion(questionId);
  }

  async addTopicQuestion(topicId: number, payload: { typeKey: TopicQuestionItem['typeKey']; sectionKey?: TopicQuestionItem['sectionKey'] | null; questionText: string; answerText: string }): Promise<TopicQuestionItem> {
    const questionText = payload.questionText.trim();
    const answerText = payload.answerText.trim();
    if (!questionText || !answerText) {
      throw new Error('Question and answer are required');
    }
    if (payload.typeKey === 'CQ' && !payload.sectionKey) {
      throw new Error('CQ section is required');
    }
    return await this.repo.addTopicQuestion(topicId, { ...payload, questionText, answerText });
  }

  async updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<TopicQuestionItem | null> {
    if (payload.questionText !== undefined && !payload.questionText.trim()) {
      throw new Error('Question is required');
    }
    if (payload.answerText !== undefined && !payload.answerText.trim()) {
      throw new Error('Answer is required');
    }
    return await this.repo.updateTopicQuestion(questionId, {
      questionText: payload.questionText?.trim(),
      answerText: payload.answerText?.trim()
    });
  }

  async deleteTopicQuestion(questionId: number): Promise<boolean> {
    return await this.repo.deleteTopicQuestion(questionId);
  }
}
