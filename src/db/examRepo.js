function nowIso() {
  return new Date().toISOString();
}

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function resolveLetter(raw) {
  const normalized = String(raw || "").trim().toUpperCase();
  return { A: "A", B: "B", C: "C", D: "D", 1: "A", 2: "B", 3: "C", 4: "D" }[normalized] || "A";
}

function scopeClause({ subjectId, subjectNodeId = null, chapterId = null, topicId = null }) {
  const clauses = ["subject_id = ?1", "subject_node_id = ?2"];
  const params = [subjectId, subjectNodeId];
  if (chapterId) {
    clauses.push(`chapter_id = ?${params.length + 1}`);
    params.push(chapterId);
  }
  if (topicId) {
    clauses.push(`topic_id = ?${params.length + 1}`);
    params.push(topicId);
  }
  return { whereSql: clauses.join(" AND "), params };
}

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function countScopedMcqs(db, scope) {
  const { whereSql, params } = scopeClause(scope);
  const row = await db.prepare(`SELECT COUNT(*) count FROM mcq_bank WHERE ${whereSql}`).bind(...params).first();
  return Number(row?.count || 0);
}

export async function listScopedMcqs(db, scope) {
  const { whereSql, params } = scopeClause(scope);
  const rows = await db
    .prepare(
      `SELECT id, question_html, option_a, option_b, option_c, option_d, correct_option, image_key, chapter_id, topic_id
       FROM mcq_bank
       WHERE ${whereSql}`,
    )
    .bind(...params)
    .all();
  return rows.results || [];
}

export async function createExamSession(db, input) {
  const id = crypto.randomUUID();
  const createdAt = nowIso();
  const expiresAt = Number.isFinite(input.timeLimitMinutes) && input.timeLimitMinutes > 0 ? Date.now() + input.timeLimitMinutes * 60 * 1000 : null;
  await db
    .prepare(
      `INSERT INTO exam_sessions (
        id, parent_exam_id, user_id, subject_id, subject_node_id, chapter_id, topic_id, exam_scope,
        question_count, time_limit_minutes, status, started_at, expires_at, created_at, updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'in_progress', ?11, ?12, ?11, ?11)`,
    )
    .bind(
      id,
      input.parentExamId || null,
      input.userId,
      input.subjectId,
      input.subjectNodeId,
      input.chapterId || null,
      input.topicId || null,
      input.examScope,
      input.questionCount,
      input.timeLimitMinutes || null,
      createdAt,
      expiresAt,
    )
    .run();
  return { id, expiresAt };
}

function shuffleQuestionOptions(question) {
  const options = shuffle([
    { letter: "A", text: question.option_a },
    { letter: "B", text: question.option_b },
    { letter: "C", text: question.option_c },
    { letter: "D", text: question.option_d },
  ]);

  const correctLetter = resolveLetter(question.correct_option);
  const mapped = options.reduce((acc, opt, index) => {
    const nextLetter = ["A", "B", "C", "D"][index];
    acc[nextLetter] = opt.text;
    if (opt.letter === correctLetter) acc.correct = nextLetter;
    return acc;
  }, {});

  return mapped;
}

export async function attachExamQuestions(db, examId, mcqs) {
  let order = 1;
  for (const mcq of mcqs) {
    const mapped = shuffleQuestionOptions(mcq);
    await db
      .prepare(
        `INSERT INTO exam_questions (
          id, exam_id, question_order, mcq_id, question_html, image_key, option_a, option_b, option_c, option_d, correct_option, created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)`,
      )
      .bind(crypto.randomUUID(), examId, order, mcq.id, mcq.question_html, mcq.image_key || null, mapped.A || "", mapped.B || "", mapped.C || "", mapped.D || "", mapped.correct || "A", nowIso())
      .run();
    order += 1;
  }
}

export async function getExamSession(db, examId, userId) {
  return db
    .prepare(
      `SELECT e.*, s.name subject_name, sn.display_name subject_node_name, c.name chapter_name, t.name topic_name
       FROM exam_sessions e
       JOIN subjects s ON s.id = e.subject_id
       JOIN subject_nodes sn ON sn.id = e.subject_node_id
       LEFT JOIN chapters c ON c.id = e.chapter_id
       LEFT JOIN topics t ON t.id = e.topic_id
       WHERE e.id = ?1 AND e.user_id = ?2`,
    )
    .bind(examId, userId)
    .first();
}

export async function getActiveExamByUser(db, userId) {
  const row = await db
    .prepare("SELECT * FROM exam_sessions WHERE user_id = ?1 AND status = 'in_progress' ORDER BY created_at DESC LIMIT 1")
    .bind(userId)
    .first();
  return row || null;
}

export async function listExamQuestionsWithAnswers(db, examId) {
  const rows = await db
    .prepare(
      `SELECT q.question_order, q.question_html, q.image_key, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
              a.selected_option
       FROM exam_questions q
       LEFT JOIN exam_answers a ON a.exam_id = q.exam_id AND a.question_order = q.question_order
       WHERE q.exam_id = ?1
       ORDER BY q.question_order ASC`,
    )
    .bind(examId)
    .all();
  return rows.results || [];
}

export async function saveAnswer(db, examId, questionOrder, selectedOption) {
  const updatedAt = nowIso();
  await db
    .prepare(
      `INSERT INTO exam_answers (id, exam_id, question_order, selected_option, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?5)
       ON CONFLICT(exam_id, question_order) DO UPDATE SET selected_option = excluded.selected_option, updated_at = excluded.updated_at`,
    )
    .bind(crypto.randomUUID(), examId, questionOrder, selectedOption || null, updatedAt)
    .run();
}

export async function submitExam(db, examId, userId, reason = "submit") {
  const questions = await listExamQuestionsWithAnswers(db, examId);
  let attempted = 0;
  let correct = 0;
  for (const q of questions) {
    if (q.selected_option) attempted += 1;
    if (q.selected_option && q.selected_option === q.correct_option) correct += 1;
  }
  const total = questions.length;
  const scorePercent = total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0;
  await db
    .prepare(
      `UPDATE exam_sessions
       SET status = 'submitted', submitted_at = ?3, exit_reason = ?4, score_correct = ?5, score_total = ?6, score_percent = ?7, updated_at = ?3
       WHERE id = ?1 AND user_id = ?2`,
    )
    .bind(examId, userId, nowIso(), reason, correct, total, scorePercent)
    .run();
  return { attempted, correct, total, scorePercent };
}

export async function expireAndSubmitIfNeeded(db, exam, userId) {
  if (!exam || exam.status !== "in_progress" || !exam.expires_at) return exam;
  if (Number(exam.expires_at) > Date.now()) return exam;
  await submitExam(db, exam.id, userId, "time_expired");
  return getExamSession(db, exam.id, userId);
}

export async function listResultRoots(db, userId) {
  const rows = await db
    .prepare(
      `SELECT COALESCE(parent_exam_id, id) root_exam_id,
              MAX(created_at) latest_created_at,
              COUNT(*) attempts,
              MAX(score_percent) best_score_percent,
              MAX(score_correct) best_score_correct,
              MAX(score_total) best_score_total,
              MIN(subject_name) subject_name,
              MIN(scope_label) scope_label
       FROM (
         SELECT e.id, e.parent_exam_id, e.created_at, e.score_percent, e.score_correct, e.score_total,
                s.name subject_name,
                CASE
                  WHEN e.exam_scope = 'subject' THEN 'Full subject'
                  WHEN e.exam_scope = 'chapter' THEN COALESCE(c.name, 'Chapter')
                  ELSE COALESCE(t.name, 'Topic')
                END scope_label
         FROM exam_sessions e
         JOIN subjects s ON s.id = e.subject_id
         LEFT JOIN chapters c ON c.id = e.chapter_id
         LEFT JOIN topics t ON t.id = e.topic_id
         WHERE e.user_id = ?1 AND e.status = 'submitted'
       ) grouped
       GROUP BY root_exam_id
       ORDER BY latest_created_at DESC`,
    )
    .bind(userId)
    .all();
  return rows.results || [];
}

export async function listAttemptsForRoot(db, userId, rootExamId) {
  const ids = [rootExamId];
  const children = await db.prepare("SELECT id FROM exam_sessions WHERE parent_exam_id = ?1 AND user_id = ?2").bind(rootExamId, userId).all();
  for (const child of children.results || []) ids.push(child.id);

  const sets = chunk(ids, 40);
  const results = [];
  for (const group of sets) {
    const placeholders = group.map((_, i) => `?${i + 2}`).join(", ");
    const rows = await db
      .prepare(
        `SELECT e.*, s.name subject_name, sn.display_name subject_node_name, c.name chapter_name, t.name topic_name
         FROM exam_sessions e
         JOIN subjects s ON s.id = e.subject_id
         JOIN subject_nodes sn ON sn.id = e.subject_node_id
         LEFT JOIN chapters c ON c.id = e.chapter_id
         LEFT JOIN topics t ON t.id = e.topic_id
         WHERE e.user_id = ?1 AND e.id IN (${placeholders})
         ORDER BY e.created_at DESC`,
      )
      .bind(userId, ...group)
      .all();
    results.push(...(rows.results || []));
  }
  return results.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export async function getExamQuestionMcqIds(db, examId) {
  const rows = await db.prepare("SELECT mcq_id FROM exam_questions WHERE exam_id = ?1 ORDER BY question_order ASC").bind(examId).all();
  return (rows.results || []).map((r) => r.mcq_id).filter(Boolean);
}

export async function getMcqsByIds(db, ids) {
  if (!ids.length) return [];
  const placeholders = ids.map((_, i) => `?${i + 1}`).join(", ");
  const rows = await db
    .prepare(`SELECT id, question_html, option_a, option_b, option_c, option_d, correct_option, image_key FROM mcq_bank WHERE id IN (${placeholders})`)
    .bind(...ids)
    .all();
  const map = new Map((rows.results || []).map((r) => [r.id, r]));
  return ids.map((id) => map.get(id)).filter(Boolean);
}
