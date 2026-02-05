import type { QuestionRecord, TopicQuestionRecord } from '../../domain/subject.types';

export class QuestionsRepository {
  constructor(private db: D1Database) {}

  async listQuestions(chapterId: number): Promise<QuestionRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_questions
      WHERE chapter_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(chapterId).all();

    return (result.results || []).map((row: any) => this.mapChapterQuestion(row));
  }

  async addQuestion(chapterId: number, payload: { typeKey: QuestionRecord['typeKey']; sectionKey?: QuestionRecord['sectionKey'] | null; questionText: string; answerText: string; imageKey?: string | null; options?: string[] | null; correctOption?: string | null }): Promise<QuestionRecord> {
    const options = payload.options || [];
    const optionA = options[0] ?? null;
    const optionB = options[1] ?? null;
    const optionC = options[2] ?? null;
    const optionD = options[3] ?? null;

    await this.db.prepare(`
      INSERT INTO subject_questions (chapter_id, type_key, section_key, question_text, answer_text, image_key, option_a, option_b, option_c, option_d, correct_option, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_questions WHERE chapter_id = ?), 1))
    `).bind(
      chapterId,
      payload.typeKey,
      payload.sectionKey ?? null,
      payload.questionText,
      payload.answerText,
      payload.imageKey ?? null,
      optionA,
      optionB,
      optionC,
      optionD,
      payload.correctOption ?? null,
      chapterId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_questions
      WHERE chapter_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) {
      throw new Error('Question creation failed');
    }

    return this.mapChapterQuestion(row);
  }

  async updateQuestion(questionId: number, payload: { questionText?: string; answerText?: string; imageKey?: string | null; options?: string[] | null; correctOption?: string | null }): Promise<QuestionRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    if (payload.questionText !== undefined) {
      fields.push('question_text = ?');
      values.push(payload.questionText);
    }

    if (payload.answerText !== undefined) {
      fields.push('answer_text = ?');
      values.push(payload.answerText);
    }

    if (payload.imageKey !== undefined) {
      fields.push('image_key = ?');
      values.push(payload.imageKey ?? null);
    }

    if (payload.options !== undefined) {
      const options = payload.options || [];
      fields.push('option_a = ?');
      fields.push('option_b = ?');
      fields.push('option_c = ?');
      fields.push('option_d = ?');
      values.push(options[0] ?? null);
      values.push(options[1] ?? null);
      values.push(options[2] ?? null);
      values.push(options[3] ?? null);
    }

    if (payload.correctOption !== undefined) {
      fields.push('correct_option = ?');
      values.push(payload.correctOption ?? null);
    }

    if (fields.length === 0) {
      return await this.findQuestionById(questionId);
    }

    values.push(questionId);
    await this.db.prepare(`
      UPDATE subject_questions SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findQuestionById(questionId);
  }

  async deleteQuestion(questionId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_questions WHERE id = ?`).bind(questionId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async findQuestionById(questionId: number): Promise<QuestionRecord | null> {
    const row = await this.db.prepare(`
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_questions WHERE id = ? LIMIT 1
    `).bind(questionId).first();
    if (!row) return null;
    return this.mapChapterQuestion(row);
  }

  async listTopicQuestions(topicId: number): Promise<TopicQuestionRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, topic_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_topic_questions
      WHERE topic_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(topicId).all();

    return (result.results || []).map((row: any) => this.mapTopicQuestion(row));
  }

  async addTopicQuestion(topicId: number, payload: { typeKey: TopicQuestionRecord['typeKey']; sectionKey?: TopicQuestionRecord['sectionKey'] | null; questionText: string; answerText: string; imageKey?: string | null; options?: string[] | null; correctOption?: string | null }): Promise<TopicQuestionRecord> {
    const options = payload.options || [];
    const optionA = options[0] ?? null;
    const optionB = options[1] ?? null;
    const optionC = options[2] ?? null;
    const optionD = options[3] ?? null;

    await this.db.prepare(`
      INSERT INTO subject_topic_questions (topic_id, type_key, section_key, question_text, answer_text, image_key, option_a, option_b, option_c, option_d, correct_option, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_topic_questions WHERE topic_id = ?), 1))
    `).bind(
      topicId,
      payload.typeKey,
      payload.sectionKey ?? null,
      payload.questionText,
      payload.answerText,
      payload.imageKey ?? null,
      optionA,
      optionB,
      optionC,
      optionD,
      payload.correctOption ?? null,
      topicId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, topic_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_topic_questions
      WHERE topic_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(topicId).first();

    if (!row) {
      throw new Error('Topic question creation failed');
    }

    return this.mapTopicQuestion(row);
  }

  async updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string; imageKey?: string | null; options?: string[] | null; correctOption?: string | null }): Promise<TopicQuestionRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    if (payload.questionText !== undefined) {
      fields.push('question_text = ?');
      values.push(payload.questionText);
    }

    if (payload.answerText !== undefined) {
      fields.push('answer_text = ?');
      values.push(payload.answerText);
    }

    if (payload.imageKey !== undefined) {
      fields.push('image_key = ?');
      values.push(payload.imageKey ?? null);
    }

    if (payload.options !== undefined) {
      const options = payload.options || [];
      fields.push('option_a = ?');
      fields.push('option_b = ?');
      fields.push('option_c = ?');
      fields.push('option_d = ?');
      values.push(options[0] ?? null);
      values.push(options[1] ?? null);
      values.push(options[2] ?? null);
      values.push(options[3] ?? null);
    }

    if (payload.correctOption !== undefined) {
      fields.push('correct_option = ?');
      values.push(payload.correctOption ?? null);
    }

    if (fields.length === 0) {
      return await this.findTopicQuestionById(questionId);
    }

    values.push(questionId);
    await this.db.prepare(`
      UPDATE subject_topic_questions SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return await this.findTopicQuestionById(questionId);
  }

  async deleteTopicQuestion(questionId: number): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM subject_topic_questions WHERE id = ?`).bind(questionId).run();
    return Number(result?.meta?.changes || 0) > 0;
  }

  async findTopicQuestionById(questionId: number): Promise<TopicQuestionRecord | null> {
    const row = await this.db.prepare(`
      SELECT id, topic_id, type_key, section_key, question_text, answer_text, image_key,
        option_a, option_b, option_c, option_d, correct_option
      FROM subject_topic_questions WHERE id = ? LIMIT 1
    `).bind(questionId).first();
    if (!row) return null;
    return this.mapTopicQuestion(row);
  }

  private mapOptions(row: any): string[] | null {
    const options = [
      row.option_a,
      row.option_b,
      row.option_c,
      row.option_d
    ].map((value) => (value === null || value === undefined ? '' : String(value)));
    const hasOptions = options.some((value) => value.trim().length > 0);
    return hasOptions ? options : null;
  }

  private mapChapterQuestion(row: any): QuestionRecord {
    return {
      id: Number(row.id),
      chapterId: Number(row.chapter_id),
      typeKey: String(row.type_key) as QuestionRecord['typeKey'],
      sectionKey: row.section_key ? String(row.section_key) as QuestionRecord['sectionKey'] : null,
      questionText: String(row.question_text),
      answerText: String(row.answer_text),
      imageKey: row.image_key ? String(row.image_key) : null,
      options: this.mapOptions(row),
      correctOption: row.correct_option ? String(row.correct_option) as QuestionRecord['correctOption'] : null
    };
  }

  private mapTopicQuestion(row: any): TopicQuestionRecord {
    return {
      id: Number(row.id),
      topicId: Number(row.topic_id),
      typeKey: String(row.type_key) as TopicQuestionRecord['typeKey'],
      sectionKey: row.section_key ? String(row.section_key) as TopicQuestionRecord['sectionKey'] : null,
      questionText: String(row.question_text),
      answerText: String(row.answer_text),
      imageKey: row.image_key ? String(row.image_key) : null,
      options: this.mapOptions(row),
      correctOption: row.correct_option ? String(row.correct_option) as TopicQuestionRecord['correctOption'] : null
    };
  }
}
