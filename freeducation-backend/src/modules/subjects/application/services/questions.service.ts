import type { QuestionItem, McqOptionKey, TopicQuestionItem } from '../../domain/subject.types';
import { SubjectRepository } from '../../infrastructure/subject.repository';

type QuestionPayload = {
  typeKey: QuestionItem['typeKey'];
  sectionKey?: QuestionItem['sectionKey'] | null;
  questionText: string;
  answerText: string;
  imageKey?: string | null;
  options?: string[] | null;
  correctOption?: McqOptionKey | null;
};

export class QuestionsService {
  constructor(private repo: SubjectRepository) {}

  async addChapterQuestion(chapterId: number, payload: QuestionPayload): Promise<QuestionItem> {
    const questionText = payload.questionText.trim();
    let answerText = payload.answerText ? payload.answerText.trim() : '';
    if (!questionText) {
      throw new Error('Question is required');
    }
    if (payload.typeKey === 'CQ' && !payload.sectionKey) {
      throw new Error('CQ section is required');
    }
    if (payload.typeKey === 'CQ' && !answerText) {
      throw new Error('Answer is required');
    }
    const normalized = this.normalizeMcqPayload(payload);
    if (normalized) {
      answerText = normalized.answerText;
    }
    return await this.repo.addQuestion(chapterId, {
      ...payload,
      questionText,
      answerText,
      options: normalized ? normalized.options : payload.options ?? null,
      correctOption: normalized ? normalized.correctOption : payload.correctOption ?? null,
      imageKey: payload.imageKey ?? null
    });
  }

  async updateChapterQuestion(questionId: number, payload: { questionText?: string; answerText?: string; imageKey?: string | null; options?: string[] | null; correctOption?: McqOptionKey | null }): Promise<QuestionItem | null> {
    if (payload.questionText !== undefined && !payload.questionText.trim()) {
      throw new Error('Question is required');
    }
    if (payload.answerText !== undefined && !payload.answerText.trim()) {
      throw new Error('Answer is required');
    }
    const normalized = this.normalizeMcqUpdate(payload);
    return await this.repo.updateQuestion(questionId, {
      questionText: payload.questionText?.trim(),
      answerText: normalized?.answerText ?? payload.answerText?.trim(),
      imageKey: payload.imageKey,
      options: payload.options !== undefined ? normalized?.options : undefined,
      correctOption: payload.correctOption !== undefined ? normalized?.correctOption : undefined
    });
  }

  async deleteChapterQuestion(questionId: number): Promise<boolean> {
    return await this.repo.deleteQuestion(questionId);
  }

  async addTopicQuestion(topicId: number, payload: QuestionPayload): Promise<TopicQuestionItem> {
    const questionText = payload.questionText.trim();
    let answerText = payload.answerText ? payload.answerText.trim() : '';
    if (!questionText) {
      throw new Error('Question is required');
    }
    if (payload.typeKey === 'CQ' && !payload.sectionKey) {
      throw new Error('CQ section is required');
    }
    if (payload.typeKey === 'CQ' && !answerText) {
      throw new Error('Answer is required');
    }
    const normalized = this.normalizeMcqPayload(payload);
    if (normalized) {
      answerText = normalized.answerText;
    }
    return await this.repo.addTopicQuestion(topicId, {
      ...payload,
      questionText,
      answerText,
      options: normalized ? normalized.options : payload.options ?? null,
      correctOption: normalized ? normalized.correctOption : payload.correctOption ?? null,
      imageKey: payload.imageKey ?? null
    });
  }

  async updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string; imageKey?: string | null; options?: string[] | null; correctOption?: McqOptionKey | null }): Promise<TopicQuestionItem | null> {
    if (payload.questionText !== undefined && !payload.questionText.trim()) {
      throw new Error('Question is required');
    }
    if (payload.answerText !== undefined && !payload.answerText.trim()) {
      throw new Error('Answer is required');
    }
    const normalized = this.normalizeMcqUpdate(payload);
    return await this.repo.updateTopicQuestion(questionId, {
      questionText: payload.questionText?.trim(),
      answerText: normalized?.answerText ?? payload.answerText?.trim(),
      imageKey: payload.imageKey,
      options: payload.options !== undefined ? normalized?.options : undefined,
      correctOption: payload.correctOption !== undefined ? normalized?.correctOption : undefined
    });
  }

  async deleteTopicQuestion(questionId: number): Promise<boolean> {
    return await this.repo.deleteTopicQuestion(questionId);
  }

  private normalizeMcqPayload(payload: QuestionPayload): { options: string[]; correctOption: McqOptionKey; answerText: string } | null {
    if (payload.typeKey !== 'MCQ') return null;
    const options = (payload.options || []).map((option) => String(option || '').trim());
    if (options.length !== 4 || options.some((option) => !option)) {
      throw new Error('MCQ requires four answer options');
    }
    const correctOption = payload.correctOption || null;
    if (!correctOption) {
      throw new Error('MCQ correct option is required');
    }
    const index = ['A', 'B', 'C', 'D'].indexOf(correctOption);
    if (index < 0) {
      throw new Error('Invalid MCQ correct option');
    }
    const answerText = payload.answerText?.trim() || options[index];
    return { options, correctOption, answerText };
  }

  private normalizeMcqUpdate(payload: { options?: string[] | null; correctOption?: McqOptionKey | null; answerText?: string | null }): { options?: string[]; correctOption?: McqOptionKey; answerText?: string } | null {
    const optionsProvided = payload.options !== undefined;
    const correctProvided = payload.correctOption !== undefined;
    if (!optionsProvided && !correctProvided) {
      return null;
    }

    let options: string[] | undefined;
    if (optionsProvided) {
      const normalizedOptions = (payload.options || []).map((option) => String(option || '').trim());
      if (normalizedOptions.length !== 4 || normalizedOptions.some((option) => !option)) {
        throw new Error('MCQ requires four answer options');
      }
      options = normalizedOptions;
    }

    let correctOption: McqOptionKey | undefined;
    if (correctProvided) {
      if (!payload.correctOption) {
        throw new Error('MCQ correct option is required');
      }
      const index = ['A', 'B', 'C', 'D'].indexOf(payload.correctOption);
      if (index < 0) {
        throw new Error('Invalid MCQ correct option');
      }
      correctOption = payload.correctOption;
    } else if (optionsProvided) {
      throw new Error('MCQ correct option is required');
    }

    const answerText = payload.answerText?.trim() || (options && correctOption ? options[['A', 'B', 'C', 'D'].indexOf(correctOption)] : undefined);
    return { options, correctOption, answerText };
  }
}
