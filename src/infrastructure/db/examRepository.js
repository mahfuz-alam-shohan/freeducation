function toIsoNow() {
  return new Date().toISOString();
}

export async function createExamSession(db, {
  userId,
  subjectId,
  scopeType,
  nodeId = 0,
  chapterId = 0,
  topicId = 0,
  timed = false,
  durationSeconds = 0,
  questionCount = 0,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_exam_sessions
      (user_id, subject_id, scope_type, node_id, chapter_id, topic_id, timed, duration_seconds,
       question_count, status, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'active', ?10, ?10)`,
  ).bind(
    userId,
    subjectId,
    scopeType,
    nodeId || 0,
    chapterId || 0,
    topicId || 0,
    timed ? 1 : 0,
    durationSeconds || 0,
    questionCount || 0,
    now,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function findExamSessionById(db, { sessionId }) {
  return db.prepare(
    `SELECT id, user_id, subject_id, scope_type, node_id, chapter_id, topic_id, timed, duration_seconds,
            question_count, status, created_at, updated_at, submitted_at, exited_at
     FROM freeducation_exam_sessions
     WHERE id = ?1`,
  ).bind(sessionId).first();
}

export async function updateExamSessionStatus(db, { sessionId, status, submittedAt = "", exitedAt = "" }) {
  const now = toIsoNow();
  await db.prepare(
    `UPDATE freeducation_exam_sessions
     SET status = ?1,
         submitted_at = ?2,
         exited_at = ?3,
         updated_at = ?4
     WHERE id = ?5`,
  ).bind(status, submittedAt || "", exitedAt || "", now, sessionId).run();
}

export async function createExamSessionQuestion(db, {
  sessionId,
  subjectId,
  sourceItemId,
  questionBody,
  questionImageKey,
  originalOptionsJson,
  originalCorrectOption,
  sortOrder,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_exam_session_questions
      (session_id, subject_id, source_item_id, question_body, question_image_key,
       original_options_json, original_correct_option, sort_order, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
  ).bind(
    sessionId,
    subjectId,
    sourceItemId,
    questionBody || "",
    questionImageKey || "",
    originalOptionsJson || "[]",
    originalCorrectOption || "",
    sortOrder || 0,
    now,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function listExamSessionQuestions(db, { sessionId }) {
  const result = await db.prepare(
    `SELECT id, session_id, subject_id, source_item_id, question_body, question_image_key,
            original_options_json, original_correct_option, sort_order, created_at
     FROM freeducation_exam_session_questions
     WHERE session_id = ?1
     ORDER BY sort_order ASC, id ASC`,
  ).bind(sessionId).all();
  return result.results || [];
}

export async function createExamAttempt(db, {
  sessionId,
  userId,
  attemptIndex,
  timed,
  durationSeconds,
  totalQuestions,
  expiresAt,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_exam_attempts
      (session_id, user_id, attempt_index, status, started_at, expires_at,
       score, correct_count, answered_count, total_questions, timed, duration_seconds,
       submitted_at, exited_at, created_at, updated_at)
     VALUES (?1, ?2, ?3, 'active', ?4, ?5, 0, 0, 0, ?6, ?7, ?8, '', '', ?4, ?4)`,
  ).bind(
    sessionId,
    userId,
    attemptIndex,
    now,
    expiresAt || "",
    totalQuestions || 0,
    timed ? 1 : 0,
    durationSeconds || 0,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function listExamAttemptsBySession(db, { sessionId, userId }) {
  const result = await db.prepare(
    `SELECT id, session_id, user_id, attempt_index, status, started_at, expires_at,
            submitted_at, exited_at, score, correct_count, answered_count, total_questions,
            timed, duration_seconds, created_at, updated_at
     FROM freeducation_exam_attempts
     WHERE session_id = ?1 AND user_id = ?2
     ORDER BY attempt_index ASC, id ASC`,
  ).bind(sessionId, userId).all();
  return result.results || [];
}

export async function findExamAttemptById(db, { attemptId }) {
  return db.prepare(
    `SELECT id, session_id, user_id, attempt_index, status, started_at, expires_at,
            submitted_at, exited_at, score, correct_count, answered_count, total_questions,
            timed, duration_seconds, created_at, updated_at
     FROM freeducation_exam_attempts
     WHERE id = ?1`,
  ).bind(attemptId).first();
}

export async function findLatestActiveExamAttemptByUser(db, { userId }) {
  return db.prepare(
    `SELECT a.id, a.session_id, a.user_id, a.attempt_index, a.status, a.started_at, a.expires_at,
            a.submitted_at, a.exited_at, a.score, a.correct_count, a.answered_count, a.total_questions,
            a.timed, a.duration_seconds, a.created_at, a.updated_at,
            s.subject_id, s.scope_type, s.node_id, s.chapter_id, s.topic_id, s.status AS session_status
     FROM freeducation_exam_attempts a
     JOIN freeducation_exam_sessions s ON s.id = a.session_id
     WHERE a.user_id = ?1 AND a.status = 'active' AND s.status = 'active'
     ORDER BY datetime(a.created_at) DESC, a.id DESC
     LIMIT 1`,
  ).bind(userId).first();
}

export async function countExamAttemptsForSession(db, { sessionId }) {
  const row = await db.prepare(
    `SELECT COALESCE(MAX(attempt_index), 0) AS max_attempt
     FROM freeducation_exam_attempts
     WHERE session_id = ?1`,
  ).bind(sessionId).first();
  return Number(row?.max_attempt || 0);
}

export async function updateExamAttemptStatus(db, {
  attemptId,
  status,
  score,
  correctCount,
  answeredCount,
  totalQuestions,
  submittedAt = "",
  exitedAt = "",
}) {
  const now = toIsoNow();
  await db.prepare(
    `UPDATE freeducation_exam_attempts
     SET status = ?1,
         score = ?2,
         correct_count = ?3,
         answered_count = ?4,
         total_questions = ?5,
         submitted_at = ?6,
         exited_at = ?7,
         updated_at = ?8
     WHERE id = ?9`,
  ).bind(
    status,
    score || 0,
    correctCount || 0,
    answeredCount || 0,
    totalQuestions || 0,
    submittedAt || "",
    exitedAt || "",
    now,
    attemptId,
  ).run();
}

export async function createExamAttemptAnswer(db, {
  attemptId,
  sessionQuestionId,
  questionOrder,
  shuffledOptionsJson,
  correctOption,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_exam_attempt_answers
      (attempt_id, session_question_id, question_order, shuffled_options_json, correct_option,
       selected_option, is_correct, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, '', 0, ?6, ?6)`,
  ).bind(
    attemptId,
    sessionQuestionId,
    questionOrder || 0,
    shuffledOptionsJson || "[]",
    correctOption || "",
    now,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function listAttemptAnswers(db, { attemptId }) {
  const result = await db.prepare(
    `SELECT id, attempt_id, session_question_id, question_order, shuffled_options_json,
            correct_option, selected_option, is_correct, created_at, updated_at
     FROM freeducation_exam_attempt_answers
     WHERE attempt_id = ?1
     ORDER BY question_order ASC, id ASC`,
  ).bind(attemptId).all();
  return result.results || [];
}

export async function listAttemptAnswersWithQuestions(db, { attemptId }) {
  const result = await db.prepare(
    `SELECT a.id, a.attempt_id, a.session_question_id, a.question_order, a.shuffled_options_json,
            a.correct_option, a.selected_option, a.is_correct,
            q.question_body, q.question_image_key, q.source_item_id
     FROM freeducation_exam_attempt_answers a
     JOIN freeducation_exam_session_questions q ON q.id = a.session_question_id
     WHERE a.attempt_id = ?1
     ORDER BY a.question_order ASC, a.id ASC`,
  ).bind(attemptId).all();
  return result.results || [];
}

export async function findAttemptAnswerByQuestion(db, { attemptId, sessionQuestionId }) {
  return db.prepare(
    `SELECT id, attempt_id, session_question_id, question_order, shuffled_options_json,
            correct_option, selected_option, is_correct, created_at, updated_at
     FROM freeducation_exam_attempt_answers
     WHERE attempt_id = ?1 AND session_question_id = ?2`,
  ).bind(attemptId, sessionQuestionId).first();
}

export async function updateExamAttemptAnswer(db, {
  attemptId,
  sessionQuestionId,
  selectedOption,
  isCorrect,
}) {
  const now = toIsoNow();
  await db.prepare(
    `UPDATE freeducation_exam_attempt_answers
     SET selected_option = ?1,
         is_correct = ?2,
         updated_at = ?3
     WHERE attempt_id = ?4 AND session_question_id = ?5`,
  ).bind(selectedOption || "", isCorrect ? 1 : 0, now, attemptId, sessionQuestionId).run();
}

export async function listUserExamSessions(db, { userId, limit = 60 }) {
  const safeLimit = Math.max(1, Math.min(200, Number(limit || 60)));
  const result = await db.prepare(
    `SELECT id, user_id, subject_id, scope_type, node_id, chapter_id, topic_id, timed, duration_seconds,
            question_count, status, created_at, updated_at, submitted_at, exited_at
     FROM freeducation_exam_sessions
     WHERE user_id = ?1
     ORDER BY datetime(created_at) DESC, id DESC
     LIMIT ?2`,
  ).bind(userId, safeLimit).all();
  return result.results || [];
}
