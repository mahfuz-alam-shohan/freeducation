type Env = {
  DB: D1Database;
};

type PracticeTestFilters = {
  release_id: string;
  grade_id?: string;
  subject_id?: string;
  chapter_id?: string;
  outcome_id?: string;
  lesson_ids?: string[];
  difficulty?: string;
};

type AnswerPayload = {
  question_id: string;
  selected_choice_ids?: string[];
  answer_text?: string;
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const parseJson = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const normalizeAnswer = (value: string) => value.trim().toLowerCase();

const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);

const buildFilters = (filters: PracticeTestFilters) => {
  const conditions: string[] = ["cqs.release_id = ?"];
  const params: unknown[] = [filters.release_id];

  if (filters.grade_id) {
    conditions.push("g.id = ?");
    params.push(filters.grade_id);
  }

  if (filters.subject_id) {
    conditions.push("s.id = ?");
    params.push(filters.subject_id);
  }

  if (filters.chapter_id) {
    conditions.push("(ch.id = ? OR cqs.chapter_id = ?)");
    params.push(filters.chapter_id, filters.chapter_id);
  }

  if (filters.outcome_id) {
    conditions.push("(q.outcome_id = ? OR cqs.outcome_id = ?)");
    params.push(filters.outcome_id, filters.outcome_id);
  }

  if (filters.lesson_ids && filters.lesson_ids.length > 0) {
    const placeholders = filters.lesson_ids.map(() => "?").join(", ");
    conditions.push(`lessons.id IN (${placeholders})`);
    params.push(...filters.lesson_ids);
  }

  if (filters.difficulty) {
    conditions.push("cqs.difficulty = ?");
    params.push(filters.difficulty);
  }

  return { conditions, params };
};

const selectQuestionsForPracticeTest = async (
  db: D1Database,
  filters: PracticeTestFilters,
  questionCount: number
) => {
  const { conditions, params } = buildFilters(filters);
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `
    SELECT q.id, q.points
    FROM questions q
    JOIN question_sets qs ON qs.content_item_id = q.question_set_id
    JOIN content_items cqs ON cqs.id = qs.content_item_id
    LEFT JOIN lesson_question_sets lqs ON lqs.question_set_id = cqs.id
    LEFT JOIN content_items lessons ON lessons.id = lqs.lesson_id
    LEFT JOIN chapters ch ON lessons.chapter_id = ch.id
    LEFT JOIN subjects s ON ch.subject_id = s.id
    LEFT JOIN grades g ON s.grade_id = g.id
    ${whereClause}
    ORDER BY RANDOM()
    LIMIT ?
  `;
  const result = await db.prepare(query).bind(...params, questionCount).all<{
    id: string;
    points: number;
  }>();

  return result.results ?? [];
};

const createPracticeTest = async (db: D1Database, payload: Record<string, unknown>) => {
  const filters = payload.filters as PracticeTestFilters | undefined;
  if (!filters?.release_id) {
    return jsonResponse({ error: "release_id is required" }, 400);
  }

  const questionCount = Number(payload.question_count ?? 20);
  const questions = await selectQuestionsForPracticeTest(db, filters, questionCount);

  if (questions.length === 0) {
    return jsonResponse({ error: "No questions matched the filters" }, 404);
  }

  const practiceTestId = crypto.randomUUID();
  const createdBy = typeof payload.created_by === "string" ? payload.created_by : null;
  const title =
    typeof payload.title === "string"
      ? payload.title
      : `Practice Test (${new Date().toISOString()})`;
  const scoringRuleId = typeof payload.scoring_rule_id === "string" ? payload.scoring_rule_id : null;
  const timeLimitSeconds =
    typeof payload.time_limit_seconds === "number" ? payload.time_limit_seconds : null;
  const maxScore = questions.reduce((total, question) => total + (question.points ?? 0), 0);

  const statements: D1PreparedStatement[] = [];
  statements.push(
    db
      .prepare(
        `INSERT INTO practice_tests
        (id, release_id, title, filters_json, scoring_rule_id, time_limit_seconds, question_count, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        practiceTestId,
        filters.release_id,
        title,
        JSON.stringify(filters),
        scoringRuleId,
        timeLimitSeconds,
        questions.length,
        createdBy
      )
  );

  questions.forEach((question, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO practice_test_questions
          (practice_test_id, question_id, sequence)
          VALUES (?, ?, ?)`
        )
        .bind(practiceTestId, question.id, index + 1)
    );
  });

  await db.batch(statements);

  return jsonResponse({
    id: practiceTestId,
    title,
    question_count: questions.length,
    max_score: maxScore,
  });
};

const startPracticeTestAttempt = async (
  db: D1Database,
  practiceTestId: string,
  payload: Record<string, unknown>
) => {
  const practiceTest = await db
    .prepare(
      `SELECT id, time_limit_seconds
       FROM practice_tests
       WHERE id = ?`
    )
    .bind(practiceTestId)
    .first<{ id: string; time_limit_seconds: number | null }>();

  if (!practiceTest) {
    return jsonResponse({ error: "Practice test not found" }, 404);
  }

  const attemptId = crypto.randomUUID();
  const userId = typeof payload.user_id === "string" ? payload.user_id : null;
  const timeLimitSeconds =
    typeof payload.time_limit_seconds === "number"
      ? payload.time_limit_seconds
      : practiceTest.time_limit_seconds;

  await db
    .prepare(
      `INSERT INTO practice_test_attempts
      (id, practice_test_id, user_id, status, time_limit_seconds)
      VALUES (?, ?, ?, 'in_progress', ?)`
    )
    .bind(attemptId, practiceTestId, userId, timeLimitSeconds)
    .run();

  return jsonResponse({ id: attemptId, time_limit_seconds: timeLimitSeconds });
};

const scoreAttempt = (
  question: {
    id: string;
    question_type: string;
    points: number;
    answer_key: string | null;
  },
  choices: { id: string; is_correct: number }[],
  answer: AnswerPayload,
  scoringRule: { rule_type: string; config_json: string }
) => {
  const ruleConfig = (() => {
    try {
      return JSON.parse(scoringRule.config_json ?? "{}");
    } catch {
      return {};
    }
  })();

  const basePoints = question.points ?? 0;
  const selected = ensureArray(answer.selected_choice_ids).map(String);

  const correctChoices = choices.filter((choice) => choice.is_correct === 1).map((choice) => choice.id);
  const isChoiceQuestion = ["single_choice", "multiple_choice", "true_false"].includes(
    question.question_type
  );

  let isCorrect = false;
  if (isChoiceQuestion) {
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correctChoices].sort();
    isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((value, index) => value === sortedCorrect[index]);
  } else if (question.question_type === "short_answer") {
    const answerText = answer.answer_text ? normalizeAnswer(answer.answer_text) : "";
    const normalizedKey = (() => {
      if (!question.answer_key) {
        return [];
      }
      try {
        const parsed = JSON.parse(question.answer_key);
        if (Array.isArray(parsed)) {
          return parsed.map((value) => normalizeAnswer(String(value)));
        }
        if (typeof parsed?.acceptable_answers === "object" && Array.isArray(parsed.acceptable_answers)) {
          return parsed.acceptable_answers.map((value: string) => normalizeAnswer(String(value)));
        }
        if (typeof parsed === "string") {
          return [normalizeAnswer(parsed)];
        }
        return [normalizeAnswer(question.answer_key)];
      } catch {
        return [normalizeAnswer(question.answer_key)];
      }
    })();
    isCorrect = normalizedKey.includes(answerText);
  }

  let awardedPoints = 0;
  if (scoringRule.rule_type === "negative_marking") {
    const penalty = Number(ruleConfig.incorrect_penalty ?? 0.25);
    awardedPoints = isCorrect ? basePoints : -basePoints * penalty;
  } else if (scoringRule.rule_type === "partial_credit" && isChoiceQuestion) {
    const incorrectPenalty = Number(ruleConfig.incorrect_penalty ?? 0);
    const correctSelected = selected.filter((choice) => correctChoices.includes(choice)).length;
    const incorrectSelected = selected.filter((choice) => !correctChoices.includes(choice)).length;
    const ratio = correctChoices.length > 0 ? correctSelected / correctChoices.length : 0;
    awardedPoints = basePoints * ratio - basePoints * incorrectPenalty * incorrectSelected;
    awardedPoints = Math.max(0, Math.min(basePoints, awardedPoints));
    isCorrect = ratio === 1 && incorrectSelected === 0;
  } else {
    awardedPoints = isCorrect ? basePoints : 0;
  }

  return { isCorrect, awardedPoints };
};

const submitPracticeTestAttempt = async (
  db: D1Database,
  practiceTestId: string,
  attemptId: string,
  payload: Record<string, unknown>
) => {
  const answers = ensureArray(payload.answers) as AnswerPayload[];
  if (answers.length === 0) {
    return jsonResponse({ error: "answers are required" }, 400);
  }

  const practiceTest = await db
    .prepare(
      `SELECT pt.id, pt.scoring_rule_id, sr.rule_type, sr.config_json
       FROM practice_tests pt
       LEFT JOIN scoring_rules sr ON sr.id = pt.scoring_rule_id
       WHERE pt.id = ?`
    )
    .bind(practiceTestId)
    .first<{ id: string; scoring_rule_id: string | null; rule_type: string | null; config_json: string | null }>();

  if (!practiceTest) {
    return jsonResponse({ error: "Practice test not found" }, 404);
  }

  const scoringRule = {
    rule_type: practiceTest.rule_type ?? "standard",
    config_json: practiceTest.config_json ?? "{}",
  };

  const questionRows = await db
    .prepare(
      `SELECT q.id, q.question_type, q.points, q.answer_key
       FROM questions q
       JOIN practice_test_questions ptq ON ptq.question_id = q.id
       WHERE ptq.practice_test_id = ?`
    )
    .bind(practiceTestId)
    .all<{ id: string; question_type: string; points: number; answer_key: string | null }>();

  const questions = questionRows.results ?? [];
  if (questions.length === 0) {
    return jsonResponse({ error: "No questions assigned to practice test" }, 404);
  }

  const questionIds = questions.map((question) => question.id);
  const choicePlaceholders = questionIds.map(() => "?").join(", ");
  const choicesResult = await db
    .prepare(
      `SELECT id, question_id, is_correct
       FROM question_choices
       WHERE question_id IN (${choicePlaceholders})`
    )
    .bind(...questionIds)
    .all<{ id: string; question_id: string; is_correct: number }>();

  const choicesByQuestion = new Map<string, { id: string; is_correct: number }[]>();
  (choicesResult.results ?? []).forEach((choice) => {
    const existing = choicesByQuestion.get(choice.question_id) ?? [];
    existing.push(choice);
    choicesByQuestion.set(choice.question_id, existing);
  });

  let totalScore = 0;
  let maxScore = 0;
  const answerStatements: D1PreparedStatement[] = [];

  questions.forEach((question) => {
    maxScore += question.points ?? 0;
    const answer = answers.find((item) => item.question_id === question.id);
    if (!answer) {
      return;
    }
    const choices = choicesByQuestion.get(question.id) ?? [];
    const { isCorrect, awardedPoints } = scoreAttempt(question, choices, answer, scoringRule);
    totalScore += awardedPoints;
    answerStatements.push(
      db
        .prepare(
          `INSERT INTO practice_test_attempt_answers
          (attempt_id, question_id, selected_choice_ids, answer_text, is_correct, awarded_points)
          VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          attemptId,
          question.id,
          answer.selected_choice_ids ? JSON.stringify(answer.selected_choice_ids) : null,
          answer.answer_text ?? null,
          isCorrect ? 1 : 0,
          awardedPoints
        )
    );
  });

  await db.batch(answerStatements);

  await db
    .prepare(
      `UPDATE practice_test_attempts
       SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, score = ?, max_score = ?
       WHERE id = ? AND practice_test_id = ?`
    )
    .bind(totalScore, maxScore, attemptId, practiceTestId)
    .run();

  return jsonResponse({
    attempt_id: attemptId,
    score: totalScore,
    max_score: maxScore,
  });
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === "POST" && pathname === "/practice-tests/generate") {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return createPracticeTest(env.DB, payload as Record<string, unknown>);
    }

    const attemptMatch = pathname.match(/^\/practice-tests\/([^/]+)\/attempts\/?$/);
    if (request.method === "POST" && attemptMatch) {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return startPracticeTestAttempt(env.DB, attemptMatch[1], payload as Record<string, unknown>);
    }

    const submitMatch = pathname.match(/^\/practice-tests\/([^/]+)\/attempts\/([^/]+)\/submit\/?$/);
    if (request.method === "POST" && submitMatch) {
      const payload = await parseJson(request);
      if (!payload) {
        return jsonResponse({ error: "Invalid JSON payload" }, 400);
      }
      return submitPracticeTestAttempt(
        env.DB,
        submitMatch[1],
        submitMatch[2],
        payload as Record<string, unknown>
      );
    }

    return jsonResponse({ error: "Not Found" }, 404);
  },
};
