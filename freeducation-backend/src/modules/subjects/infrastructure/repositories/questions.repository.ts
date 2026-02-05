import type { QuestionRecord, TopicQuestionRecord } from '../../domain/subject.types';

export class QuestionsRepository {
  constructor(private db: D1Database) {}

  async listQuestions(chapterId: number): Promise<QuestionRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text
      FROM subject_questions
      WHERE chapter_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(chapterId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      chapterId: Number(row.chapter_id),
      typeKey: String(row.type_key) as QuestionRecord['typeKey'],
      sectionKey: row.section_key ? String(row.section_key) as QuestionRecord['sectionKey'] : null,
      questionText: String(row.question_text),
      answerText: String(row.answer_text)
    }));
  }

  async addQuestion(chapterId: number, payload: { typeKey: QuestionRecord['typeKey']; sectionKey?: QuestionRecord['sectionKey'] | null; questionText: string; answerText: string }): Promise<QuestionRecord> {
    await this.db.prepare(`
      INSERT INTO subject_questions (chapter_id, type_key, section_key, question_text, answer_text, sort_order)
      VALUES (?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_questions WHERE chapter_id = ?), 1))
    `).bind(
      chapterId,
      payload.typeKey,
      payload.sectionKey ?? null,
      payload.questionText,
      payload.answerText,
      chapterId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text
      FROM subject_questions
      WHERE chapter_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(chapterId).first();

    if (!row) {
      throw new Error('Question creation failed');
    }

    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      typeKey: String((row as any).type_key) as QuestionRecord['typeKey'],
      sectionKey: (row as any).section_key ? String((row as any).section_key) as QuestionRecord['sectionKey'] : null,
      questionText: String((row as any).question_text),
      answerText: String((row as any).answer_text)
    };
  }

  async updateQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<QuestionRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (payload.questionText !== undefined) {
      fields.push('question_text = ?');
      values.push(payload.questionText);
    }

    if (payload.answerText !== undefined) {
      fields.push('answer_text = ?');
      values.push(payload.answerText);
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
      SELECT id, chapter_id, type_key, section_key, question_text, answer_text
      FROM subject_questions WHERE id = ? LIMIT 1
    `).bind(questionId).first();
    if (!row) return null;
    return {
      id: Number((row as any).id),
      chapterId: Number((row as any).chapter_id),
      typeKey: String((row as any).type_key) as QuestionRecord['typeKey'],
      sectionKey: (row as any).section_key ? String((row as any).section_key) as QuestionRecord['sectionKey'] : null,
      questionText: String((row as any).question_text),
      answerText: String((row as any).answer_text)
    };
  }

  async listTopicQuestions(topicId: number): Promise<TopicQuestionRecord[]> {
    const result = await this.db.prepare(`
      SELECT id, topic_id, type_key, section_key, question_text, answer_text
      FROM subject_topic_questions
      WHERE topic_id = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(topicId).all();

    return (result.results || []).map((row: any) => ({
      id: Number(row.id),
      topicId: Number(row.topic_id),
      typeKey: String(row.type_key) as TopicQuestionRecord['typeKey'],
      sectionKey: row.section_key ? String(row.section_key) as TopicQuestionRecord['sectionKey'] : null,
      questionText: String(row.question_text),
      answerText: String(row.answer_text)
    }));
  }

  async addTopicQuestion(topicId: number, payload: { typeKey: TopicQuestionRecord['typeKey']; sectionKey?: TopicQuestionRecord['sectionKey'] | null; questionText: string; answerText: string }): Promise<TopicQuestionRecord> {
    await this.db.prepare(`
      INSERT INTO subject_topic_questions (topic_id, type_key, section_key, question_text, answer_text, sort_order)
      VALUES (?, ?, ?, ?, ?, COALESCE((SELECT MAX(sort_order) + 1 FROM subject_topic_questions WHERE topic_id = ?), 1))
    `).bind(
      topicId,
      payload.typeKey,
      payload.sectionKey ?? null,
      payload.questionText,
      payload.answerText,
      topicId
    ).run();

    const row = await this.db.prepare(`
      SELECT id, topic_id, type_key, section_key, question_text, answer_text
      FROM subject_topic_questions
      WHERE topic_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).bind(topicId).first();

    if (!row) {
      throw new Error('Topic question creation failed');
    }

    return {
      id: Number((row as any).id),
      topicId: Number((row as any).topic_id),
      typeKey: String((row as any).type_key) as TopicQuestionRecord['typeKey'],
      sectionKey: (row as any).section_key ? String((row as any).section_key) as TopicQuestionRecord['sectionKey'] : null,
      questionText: String((row as any).question_text),
      answerText: String((row as any).answer_text)
    };
  }

  async updateTopicQuestion(questionId: number, payload: { questionText?: string; answerText?: string }): Promise<TopicQuestionRecord | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (payload.questionText !== undefined) {
      fields.push('question_text = ?');
      values.push(payload.questionText);
    }

    if (payload.answerText !== undefined) {
      fields.push('answer_text = ?');
      values.push(payload.answerText);
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
      SELECT id, topic_id, type_key, section_key, question_text, answer_text
      FROM subject_topic_questions WHERE id = ? LIMIT 1
    `).bind(questionId).first();
    if (!row) return null;
    return {
      id: Number((row as any).id),
      topicId: Number((row as any).topic_id),
      typeKey: String((row as any).type_key) as TopicQuestionRecord['typeKey'],
      sectionKey: (row as any).section_key ? String((row as any).section_key) as TopicQuestionRecord['sectionKey'] : null,
      questionText: String((row as any).question_text),
      answerText: String((row as any).answer_text)
    };
  }
}
