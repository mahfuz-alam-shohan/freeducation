
import { HttpError } from "../../shared/http/errors.js";
import { readBody } from "../../shared/http/request.js";
import {
  findSubjectById,
  findSubjectNodeById,
  findSubjectChapterById,
  findSubjectTopicById,
  listAllSubjectNodes,
  listAllSubjectChaptersBySubject,
  listAllSubjectTopicsBySubject,
  listAllContentItemsBySubject,
} from "../../infrastructure/db/modulesRepository.js";
import {
  countExamAttemptsForSession,
  createExamAttempt,
  createExamAttemptAnswer,
  createExamSession,
  createExamSessionQuestion,
  findExamAttemptById,
  findExamSessionById,
  findLatestActiveExamAttemptByUser,
  findAttemptAnswerByQuestion,
  listAttemptAnswers,
  listAttemptAnswersWithQuestions,
  listExamAttemptsBySession,
  listExamSessionQuestions,
  listUserExamSessions,
  updateExamAttemptAnswer,
  updateExamAttemptStatus,
  updateExamSessionStatus,
} from "../../infrastructure/db/examRepository.js";

const EXAM_SCOPE = new Set(["full", "chapter", "topic"]);
const OPTION_KEYS = ["A", "B", "C", "D"];

function parsePositiveId(value, label) {
  const id = Number.parseInt(String(value || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `Invalid ${label}`);
  return id;
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function parseScope(value) {
  const scope = String(value || "").trim().toLowerCase();
  if (!EXAM_SCOPE.has(scope)) throw new HttpError(400, "Invalid exam scope");
  return scope;
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(String(value || ""));
  } catch {
    return fallback;
  }
}

function imageUrlForKey(key) {
  const normalized = String(key || "").trim();
  if (!normalized) return "";
  return `/api/workspace/files/object?key=${encodeURIComponent(normalized)}`;
}

function normalizeOptionKey(value) {
  const key = String(value || "").trim().toUpperCase();
  if (!key) return "";
  if (!OPTION_KEYS.includes(key)) throw new HttpError(400, "Option must be A, B, C, or D");
  return key;
}

function shuffle(items = []) {
  const next = Array.isArray(items) ? [...items] : [];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = next[i];
    next[i] = next[j];
    next[j] = temp;
  }
  return next;
}

function serializeSubject(row) {
  return {
    id: Number(row?.id || 0),
    name: String(row?.name || ""),
    classId: Number(row?.class_id || 0),
    className: String(row?.class_name || ""),
    templateCode: String(row?.template_code || ""),
  };
}

function serializeNode(row) {
  return {
    id: Number(row?.id || 0),
    subjectId: Number(row?.subject_id || 0),
    parentNodeId: row?.parent_node_id == null ? null : Number(row.parent_node_id),
    serverName: String(row?.server_name || ""),
    displayName: String(row?.display_name || ""),
    sortOrder: Number(row?.sort_order || 0),
  };
}

function serializeChapter(row) {
  return {
    id: Number(row?.id || 0),
    subjectId: Number(row?.subject_id || 0),
    nodeId: Number(row?.node_id || 0),
    chapterNumber: String(row?.chapter_number || row?.sort_order || ""),
    name: String(row?.name || ""),
    sortOrder: Number(row?.sort_order || 0),
  };
}

function serializeTopic(row) {
  return {
    id: Number(row?.id || 0),
    subjectId: Number(row?.subject_id || 0),
    chapterId: Number(row?.chapter_id || 0),
    topicNumber: String(row?.topic_number || ""),
    name: String(row?.name || ""),
    sortOrder: Number(row?.sort_order || 0),
  };
}

function serializeAttemptRow(row) {
  return {
    id: Number(row?.id || 0),
    sessionId: Number(row?.session_id || 0),
    userId: Number(row?.user_id || 0),
    attemptIndex: Number(row?.attempt_index || 0),
    status: String(row?.status || ""),
    startedAt: String(row?.started_at || ""),
    expiresAt: String(row?.expires_at || ""),
    submittedAt: String(row?.submitted_at || ""),
    exitedAt: String(row?.exited_at || ""),
    score: Number(row?.score || 0),
    correctCount: Number(row?.correct_count || 0),
    answeredCount: Number(row?.answered_count || 0),
    totalQuestions: Number(row?.total_questions || 0),
    timed: Number(row?.timed || 0) === 1,
    durationSeconds: Number(row?.duration_seconds || 0),
    createdAt: String(row?.created_at || ""),
    updatedAt: String(row?.updated_at || ""),
  };
}

function serializeSessionRow(row) {
  return {
    id: Number(row?.id || 0),
    userId: Number(row?.user_id || 0),
    subjectId: Number(row?.subject_id || 0),
    scopeType: String(row?.scope_type || "full"),
    nodeId: Number(row?.node_id || 0),
    chapterId: Number(row?.chapter_id || 0),
    topicId: Number(row?.topic_id || 0),
    timed: Number(row?.timed || 0) === 1,
    durationSeconds: Number(row?.duration_seconds || 0),
    questionCount: Number(row?.question_count || 0),
    status: String(row?.status || ""),
    submittedAt: String(row?.submitted_at || ""),
    exitedAt: String(row?.exited_at || ""),
    createdAt: String(row?.created_at || ""),
    updatedAt: String(row?.updated_at || ""),
  };
}

function serializeMcqItem(row) {
  const options = safeJsonParse(row?.options_json, []);
  const normalizedOptions = Array.isArray(options) ? options.map((option) => String(option || "")) : [];
  const correctOption = String(row?.correct_option || "").trim().toUpperCase();
  if (normalizedOptions.length !== 4 || !OPTION_KEYS.includes(correctOption)) return null;
  return {
    id: Number(row?.id || 0),
    contextType: String(row?.context_type || ""),
    contextId: Number(row?.context_id || 0),
    body: String(row?.body || ""),
    imageKey: String(row?.image_key || ""),
    options: normalizedOptions,
    correctOption,
  };
}

function buildQuestionCountOptions(total) {
  const safeTotal = Math.max(0, Number(total || 0));
  const maxSelectable = Math.floor(safeTotal / 5) * 5;
  const options = [];
  for (let n = 5; n <= maxSelectable; n += 5) options.push(n);
  return options;
}

function nowIso() {
  return new Date().toISOString();
}

function isExpired(isoTime) {
  const value = String(isoTime || "").trim();
  if (!value) return false;
  return Date.parse(value) <= Date.now();
}

async function getSubjectOrThrow(db, subjectId) {
  const row = await findSubjectById(db, subjectId);
  if (!row) throw new HttpError(404, "Subject not found");
  return serializeSubject(row);
}

async function collectSubjectContext(db, subjectId) {
  const [nodeRows, chapterRows, topicRows, contentRows] = await Promise.all([
    listAllSubjectNodes(db, { subjectId }),
    listAllSubjectChaptersBySubject(db, { subjectId }),
    listAllSubjectTopicsBySubject(db, { subjectId }),
    listAllContentItemsBySubject(db, { subjectId }),
  ]);

  const nodes = nodeRows.map(serializeNode).sort((a, b) => (a.sortOrder - b.sortOrder) || (a.id - b.id));
  const chapters = chapterRows.map(serializeChapter).sort((a, b) => (a.sortOrder - b.sortOrder) || (a.id - b.id));
  const topics = topicRows.map(serializeTopic).sort((a, b) => (a.sortOrder - b.sortOrder) || (a.id - b.id));
  const mcqs = contentRows
    .filter((item) => String(item?.content_type || "").toLowerCase() === "mcq_bank")
    .map(serializeMcqItem)
    .filter(Boolean);

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));

  return {
    nodes,
    chapters,
    topics,
    mcqs,
    nodeById,
    chapterById,
    topicById,
  };
}

function resolveScopeLabel(session, ctx) {
  if (!session) return "Exam";
  if (session.scopeType === "full") return "Full Subject";
  if (session.scopeType === "topic") {
    const topic = ctx?.topicById?.get(session.topicId);
    const chapter = topic ? ctx?.chapterById?.get(topic.chapterId) : null;
    const base = topic?.name || "Topic";
    return chapter?.name ? `${chapter.name} / ${base}` : base;
  }

  const chapter = ctx?.chapterById?.get(session.chapterId);
  const node = chapter ? ctx?.nodeById?.get(chapter.nodeId) : null;
  if (chapter && node) return `${node.displayName || node.serverName} / ${chapter.name}`;
  return chapter?.name || "Chapter";
}

function filterPoolByScope({ scopeType, chapterId, topicId, mcqs, topicById }) {
  if (scopeType === "full") return mcqs;
  if (scopeType === "topic") {
    return mcqs.filter((mcq) => mcq.contextType === "topic" && mcq.contextId === topicId);
  }
  return mcqs.filter((mcq) => {
    if (mcq.contextType === "chapter") return mcq.contextId === chapterId;
    if (mcq.contextType === "topic") {
      const topic = topicById.get(mcq.contextId);
      return Number(topic?.chapterId || 0) === chapterId;
    }
    return false;
  });
}

async function ensureAttemptBelongsToUser(env, userId, attemptId) {
  const row = await findExamAttemptById(env.DB, { attemptId });
  if (!row) throw new HttpError(404, "Exam attempt not found");
  const attempt = serializeAttemptRow(row);
  if (attempt.userId !== userId) throw new HttpError(403, "Forbidden");
  return attempt;
}

async function ensureSessionBelongsToUser(env, userId, sessionId) {
  const row = await findExamSessionById(env.DB, { sessionId });
  if (!row) throw new HttpError(404, "Exam session not found");
  const session = serializeSessionRow(row);
  if (session.userId !== userId) throw new HttpError(403, "Forbidden");
  return session;
}

async function syncAttemptProgress(env, attempt) {
  const answers = await listAttemptAnswers(env.DB, { attemptId: attempt.id });
  const totalQuestions = answers.length;
  const answeredCount = answers.filter((item) => String(item?.selected_option || "").trim()).length;
  const correctCount = answers.filter((item) => Number(item?.is_correct || 0) === 1).length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  await updateExamAttemptStatus(env.DB, {
    attemptId: attempt.id,
    status: attempt.status,
    score,
    correctCount,
    answeredCount,
    totalQuestions,
    submittedAt: attempt.submittedAt,
    exitedAt: attempt.exitedAt,
  });

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    score,
  };
}

async function finalizeAttempt(env, attempt, reason) {
  if (!attempt || attempt.status !== "active") return attempt;
  const progress = await syncAttemptProgress(env, attempt);
  const endedAt = nowIso();
  const status = reason === "exited" ? "exited" : reason === "expired" ? "expired" : "submitted";

  await updateExamAttemptStatus(env.DB, {
    attemptId: attempt.id,
    status,
    score: progress.score,
    correctCount: progress.correctCount,
    answeredCount: progress.answeredCount,
    totalQuestions: progress.totalQuestions,
    submittedAt: status === "submitted" || status === "expired" ? endedAt : "",
    exitedAt: status === "exited" ? endedAt : "",
  });

  await updateExamSessionStatus(env.DB, {
    sessionId: attempt.sessionId,
    status: status === "exited" ? "exited" : "completed",
    submittedAt: status === "submitted" || status === "expired" ? endedAt : "",
    exitedAt: status === "exited" ? endedAt : "",
  });

  const latest = await findExamAttemptById(env.DB, { attemptId: attempt.id });
  return serializeAttemptRow(latest);
}

async function autoExpireAttemptIfNeeded(env, attempt) {
  if (!attempt || attempt.status !== "active") return attempt;
  if (!attempt.timed) return attempt;
  if (!attempt.expiresAt) return attempt;
  if (!isExpired(attempt.expiresAt)) return attempt;
  return finalizeAttempt(env, attempt, "expired");
}

async function getActiveAttemptRow(env, userId) {
  const row = await findLatestActiveExamAttemptByUser(env.DB, { userId });
  if (!row) return null;
  const attempt = serializeAttemptRow(row);
  const checked = await autoExpireAttemptIfNeeded(env, attempt);
  if (checked.status !== "active") return null;
  return {
    ...checked,
    subjectId: Number(row?.subject_id || 0),
    scopeType: String(row?.scope_type || "full"),
    chapterId: Number(row?.chapter_id || 0),
    topicId: Number(row?.topic_id || 0),
    nodeId: Number(row?.node_id || 0),
  };
}

async function buildAttemptPayload(env, userId, attemptId) {
  let attempt = await ensureAttemptBelongsToUser(env, userId, attemptId);
  attempt = await autoExpireAttemptIfNeeded(env, attempt);
  const session = await ensureSessionBelongsToUser(env, userId, attempt.sessionId);
  const subject = await getSubjectOrThrow(env.DB, session.subjectId);
  const context = await collectSubjectContext(env.DB, subject.id);
  const answers = await listAttemptAnswersWithQuestions(env.DB, { attemptId: attempt.id });

  const questions = answers.map((row) => {
    const options = safeJsonParse(row?.shuffled_options_json, []);
    return {
      sessionQuestionId: Number(row?.session_question_id || 0),
      order: Number(row?.question_order || 0),
      body: String(row?.question_body || ""),
      imageUrl: imageUrlForKey(row?.question_image_key),
      options: Array.isArray(options) ? options.map((item) => String(item || "")) : [],
      selectedOption: String(row?.selected_option || "").toUpperCase(),
      correctOption: String(row?.correct_option || "").toUpperCase(),
      isCorrect: Number(row?.is_correct || 0) === 1,
    };
  });

  const answeredCount = questions.filter((item) => OPTION_KEYS.includes(item.selectedOption)).length;
  const correctCount = questions.filter((item) => item.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    subject,
    session,
    attempt,
    scopeLabel: resolveScopeLabel(session, context),
    questions,
    stats: {
      totalQuestions,
      answeredCount,
      correctCount,
      score,
    },
  };
}

function pickRandomQuestions(pool, count) {
  const ids = new Set();
  const picked = [];
  const shuffled = shuffle(pool);
  for (const item of shuffled) {
    if (ids.has(item.id)) continue;
    ids.add(item.id);
    picked.push(item);
    if (picked.length >= count) break;
  }
  return picked;
}

async function createAttemptFromSession(env, { session, userId }) {
  const sessionQuestions = await listExamSessionQuestions(env.DB, { sessionId: session.id });
  if (!sessionQuestions.length) throw new HttpError(400, "Session has no questions");

  const maxAttempt = await countExamAttemptsForSession(env.DB, { sessionId: session.id });
  const attemptIndex = maxAttempt + 1;
  const expiresAt = session.timed
    ? new Date(Date.now() + (session.durationSeconds * 1000)).toISOString()
    : "";

  const attemptId = await createExamAttempt(env.DB, {
    sessionId: session.id,
    userId,
    attemptIndex,
    timed: session.timed,
    durationSeconds: session.durationSeconds,
    totalQuestions: session.questionCount,
    expiresAt,
  });

  const orderedQuestionIds = shuffle(sessionQuestions.map((item) => Number(item?.id || 0)));
  const questionById = new Map(sessionQuestions.map((item) => [Number(item?.id || 0), item]));

  for (let i = 0; i < orderedQuestionIds.length; i += 1) {
    const sessionQuestionId = orderedQuestionIds[i];
    const question = questionById.get(sessionQuestionId);
    if (!question) continue;

    const options = safeJsonParse(question?.original_options_json, []);
    const normalized = Array.isArray(options) ? options.map((value) => String(value || "")) : [];
    const originalCorrect = String(question?.original_correct_option || "").trim().toUpperCase();
    if (normalized.length !== 4 || !OPTION_KEYS.includes(originalCorrect)) continue;

    const pairs = normalized.map((text, index) => ({
      key: OPTION_KEYS[index],
      text,
    }));
    const shuffledPairs = shuffle(pairs);
    const shuffledOptions = shuffledPairs.map((pair) => pair.text);
    const correctIndex = shuffledPairs.findIndex((pair) => pair.key === originalCorrect);
    const correctOption = correctIndex >= 0 ? OPTION_KEYS[correctIndex] : "";

    await createExamAttemptAnswer(env.DB, {
      attemptId,
      sessionQuestionId,
      questionOrder: i + 1,
      shuffledOptionsJson: JSON.stringify(shuffledOptions),
      correctOption,
    });
  }

  const attemptRow = await findExamAttemptById(env.DB, { attemptId });
  return serializeAttemptRow(attemptRow);
}

export async function getActiveExamAttemptForUser(env, userIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const active = await getActiveAttemptRow(env, userId);
  if (!active) return { attempt: null };
  return {
    attempt: {
      id: active.id,
      sessionId: active.sessionId,
      subjectId: active.subjectId,
      scopeType: active.scopeType,
      startedAt: active.startedAt,
      expiresAt: active.expiresAt,
      timed: active.timed,
    },
  };
}

export async function getExamSetupPayload(env, userIdRaw, subjectIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const active = await getActiveAttemptRow(env, userId);
  if (active) {
    return {
      subject: await getSubjectOrThrow(env.DB, subjectId),
      activeAttempt: {
        id: active.id,
        sessionId: active.sessionId,
        subjectId: active.subjectId,
        redirectUrl: `/exam/${active.id}`,
      },
      options: null,
    };
  }

  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const context = await collectSubjectContext(env.DB, subject.id);

  const fullCount = context.mcqs.length;
  const chapterPools = context.chapters.map((chapter) => {
    const node = context.nodeById.get(chapter.nodeId);
    const count = filterPoolByScope({
      scopeType: "chapter",
      chapterId: chapter.id,
      mcqs: context.mcqs,
      topicById: context.topicById,
    }).length;
    return {
      nodeId: chapter.nodeId,
      chapterId: chapter.id,
      nodeName: node?.displayName || node?.serverName || "Section",
      chapterName: chapter.name,
      chapterNumber: chapter.chapterNumber,
      count,
      questionCountOptions: buildQuestionCountOptions(count),
    };
  }).filter((item) => item.count > 0);

  const topicPools = context.topics.map((topic) => {
    const chapter = context.chapterById.get(topic.chapterId);
    const node = chapter ? context.nodeById.get(chapter.nodeId) : null;
    const count = filterPoolByScope({
      scopeType: "topic",
      topicId: topic.id,
      mcqs: context.mcqs,
      topicById: context.topicById,
    }).length;
    return {
      topicId: topic.id,
      chapterId: topic.chapterId,
      nodeId: Number(chapter?.nodeId || 0),
      nodeName: node?.displayName || node?.serverName || "Section",
      chapterName: chapter?.name || "Chapter",
      topicName: topic.name,
      count,
      questionCountOptions: buildQuestionCountOptions(count),
    };
  }).filter((item) => item.count > 0);

  return {
    subject,
    activeAttempt: null,
    options: {
      full: {
        count: fullCount,
        questionCountOptions: buildQuestionCountOptions(fullCount),
      },
      chapters: chapterPools,
      topics: topicPools,
      hasTopicScope: topicPools.length > 0,
      hasChapterScope: chapterPools.length > 0,
      durations: [5, 10, 15, 20, 30, 45, 60, 90, 120],
    },
  };
}

export async function startSubjectExam(request, env, userIdRaw, subjectIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");

  const active = await getActiveAttemptRow(env, userId);
  if (active) {
    return {
      ok: true,
      resumed: true,
      attemptId: active.id,
      redirectUrl: `/exam/${active.id}`,
    };
  }

  const body = await readBody(request, { maxBodySize: 120_000 });
  const scopeType = parseScope(body?.scopeType);
  const timed = parseBoolean(body?.timed);
  const durationMinutesRaw = Number.parseInt(String(body?.durationMinutes || "0"), 10);
  const durationMinutes = timed ? durationMinutesRaw : 0;
  if (timed && (!Number.isInteger(durationMinutes) || durationMinutes <= 0 || durationMinutes > 180)) {
    throw new HttpError(400, "Duration must be between 1 and 180 minutes");
  }

  const requestedQuestionCount = Number.parseInt(String(body?.questionCount || "0"), 10);
  if (!Number.isInteger(requestedQuestionCount) || requestedQuestionCount <= 0 || requestedQuestionCount % 5 !== 0) {
    throw new HttpError(400, "Question count must be a positive multiple of 5");
  }

  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const context = await collectSubjectContext(env.DB, subject.id);

  let nodeId = 0;
  let chapterId = 0;
  let topicId = 0;

  if (scopeType === "chapter") {
    chapterId = parsePositiveId(body?.chapterId, "chapter id");
    const chapter = context.chapterById.get(chapterId);
    if (!chapter) throw new HttpError(404, "Chapter not found");
    nodeId = chapter.nodeId;
  }

  if (scopeType === "topic") {
    topicId = parsePositiveId(body?.topicId, "topic id");
    const topic = context.topicById.get(topicId);
    if (!topic) throw new HttpError(404, "Topic not found");
    chapterId = topic.chapterId;
    const chapter = context.chapterById.get(chapterId);
    nodeId = Number(chapter?.nodeId || 0);
  }

  const pool = filterPoolByScope({
    scopeType,
    chapterId,
    topicId,
    mcqs: context.mcqs,
    topicById: context.topicById,
  });

  if (pool.length < 5) {
    throw new HttpError(400, "At least 5 MCQs are required for this exam scope");
  }

  const maxSelectable = Math.floor(pool.length / 5) * 5;
  if (requestedQuestionCount > maxSelectable) {
    throw new HttpError(400, `Question count exceeds available MCQs. Max allowed is ${maxSelectable}`);
  }

  const selectedQuestions = pickRandomQuestions(pool, requestedQuestionCount);
  if (selectedQuestions.length < requestedQuestionCount) {
    throw new HttpError(400, "Unable to pick enough unique questions");
  }

  const durationSeconds = durationMinutes * 60;
  const sessionId = await createExamSession(env.DB, {
    userId,
    subjectId,
    scopeType,
    nodeId,
    chapterId,
    topicId,
    timed,
    durationSeconds,
    questionCount: requestedQuestionCount,
  });

  for (let index = 0; index < selectedQuestions.length; index += 1) {
    const question = selectedQuestions[index];
    await createExamSessionQuestion(env.DB, {
      sessionId,
      subjectId,
      sourceItemId: question.id,
      questionBody: question.body,
      questionImageKey: question.imageKey,
      originalOptionsJson: JSON.stringify(question.options),
      originalCorrectOption: question.correctOption,
      sortOrder: index + 1,
    });
  }

  const session = await ensureSessionBelongsToUser(env, userId, sessionId);
  const attempt = await createAttemptFromSession(env, { session, userId });

  return {
    ok: true,
    resumed: false,
    attemptId: attempt.id,
    redirectUrl: `/exam/${attempt.id}`,
  };
}

export async function getExamAttemptPagePayload(env, userIdRaw, attemptIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const attemptId = parsePositiveId(attemptIdRaw, "attempt id");
  return buildAttemptPayload(env, userId, attemptId);
}

export async function saveExamAttemptAnswer(request, env, userIdRaw, attemptIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const attemptId = parsePositiveId(attemptIdRaw, "attempt id");
  let attempt = await ensureAttemptBelongsToUser(env, userId, attemptId);
  attempt = await autoExpireAttemptIfNeeded(env, attempt);
  if (attempt.status !== "active") {
    throw new HttpError(409, "Exam is no longer active");
  }

  const body = await readBody(request, { maxBodySize: 80_000 });
  const sessionQuestionId = parsePositiveId(body?.sessionQuestionId, "session question id");
  const selectedOption = normalizeOptionKey(body?.selectedOption);
  const answer = await findAttemptAnswerByQuestion(env.DB, { attemptId, sessionQuestionId });
  if (!answer) throw new HttpError(404, "Question not found in attempt");

  const correctOption = String(answer?.correct_option || "").trim().toUpperCase();
  const isCorrect = Boolean(selectedOption) && selectedOption === correctOption;

  await updateExamAttemptAnswer(env.DB, {
    attemptId,
    sessionQuestionId,
    selectedOption,
    isCorrect,
  });

  const progress = await syncAttemptProgress(env, attempt);
  return {
    ok: true,
    stats: {
      totalQuestions: progress.totalQuestions,
      answeredCount: progress.answeredCount,
      correctCount: progress.correctCount,
      score: progress.score,
    },
  };
}

export async function submitExamAttempt(env, userIdRaw, attemptIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const attemptId = parsePositiveId(attemptIdRaw, "attempt id");
  let attempt = await ensureAttemptBelongsToUser(env, userId, attemptId);
  attempt = await autoExpireAttemptIfNeeded(env, attempt);
  if (attempt.status === "active") {
    attempt = await finalizeAttempt(env, attempt, "submitted");
  }

  return {
    ok: true,
    attemptId: attempt.id,
    sessionId: attempt.sessionId,
    status: attempt.status,
    redirectUrl: `/results/${attempt.sessionId}?attempt=${attempt.id}`,
  };
}

export async function exitExamAttempt(env, userIdRaw, attemptIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const attemptId = parsePositiveId(attemptIdRaw, "attempt id");
  let attempt = await ensureAttemptBelongsToUser(env, userId, attemptId);
  attempt = await autoExpireAttemptIfNeeded(env, attempt);
  if (attempt.status === "active") {
    attempt = await finalizeAttempt(env, attempt, "exited");
  }

  const session = await ensureSessionBelongsToUser(env, userId, attempt.sessionId);
  return {
    ok: true,
    attemptId: attempt.id,
    sessionId: attempt.sessionId,
    status: attempt.status,
    redirectUrl: `/subjects/${session.subjectId}`,
  };
}

export async function getExamResultsOverview(env, userIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const sessions = (await listUserExamSessions(env.DB, { userId, limit: 80 })).map(serializeSessionRow);

  const subjectCache = new Map();
  const nodeCache = new Map();
  const chapterCache = new Map();
  const topicCache = new Map();

  const fetchSubject = async (subjectId) => {
    if (!subjectCache.has(subjectId)) {
      subjectCache.set(subjectId, await findSubjectById(env.DB, subjectId));
    }
    return subjectCache.get(subjectId);
  };

  const fetchNode = async (subjectId, nodeId) => {
    const key = `${subjectId}:${nodeId}`;
    if (!nodeCache.has(key)) {
      nodeCache.set(key, await findSubjectNodeById(env.DB, { subjectId, nodeId }));
    }
    return nodeCache.get(key);
  };

  const fetchChapter = async (subjectId, chapterId) => {
    const key = `${subjectId}:${chapterId}`;
    if (!chapterCache.has(key)) {
      chapterCache.set(key, await findSubjectChapterById(env.DB, { subjectId, chapterId }));
    }
    return chapterCache.get(key);
  };

  const fetchTopic = async (subjectId, topicId) => {
    const key = `${subjectId}:${topicId}`;
    if (!topicCache.has(key)) {
      topicCache.set(key, await findSubjectTopicById(env.DB, { subjectId, topicId }));
    }
    return topicCache.get(key);
  };

  const rows = [];
  for (const session of sessions) {
    const subjectRow = await fetchSubject(session.subjectId);
    const attempts = (await listExamAttemptsBySession(env.DB, { sessionId: session.id, userId })).map(serializeAttemptRow);
    const latest = attempts[attempts.length - 1] || null;
    const bestScore = attempts.reduce((best, attempt) => Math.max(best, Number(attempt?.score || 0)), 0);

    let scopeLabel = "Full Subject";
    if (session.scopeType === "chapter") {
      const chapter = await fetchChapter(session.subjectId, session.chapterId);
      const node = chapter ? await fetchNode(session.subjectId, Number(chapter?.node_id || 0)) : null;
      scopeLabel = chapter
        ? `${String(node?.display_name || node?.server_name || "Section")} / ${String(chapter?.name || "Chapter")}`
        : "Chapter";
    } else if (session.scopeType === "topic") {
      const topic = await fetchTopic(session.subjectId, session.topicId);
      const chapter = topic ? await fetchChapter(session.subjectId, Number(topic?.chapter_id || 0)) : null;
      scopeLabel = topic
        ? `${String(chapter?.name || "Chapter")} / ${String(topic?.name || "Topic")}`
        : "Topic";
    }

    rows.push({
      sessionId: session.id,
      subjectId: session.subjectId,
      subjectName: String(subjectRow?.name || `Subject ${session.subjectId}`),
      scopeLabel,
      timed: session.timed,
      durationSeconds: session.durationSeconds,
      questionCount: session.questionCount,
      status: session.status,
      attemptsCount: attempts.length,
      bestScore,
      latestScore: Number(latest?.score || 0),
      latestCorrectCount: Number(latest?.correctCount || 0),
      latestTotalQuestions: Number(latest?.totalQuestions || session.questionCount || 0),
      latestAttemptId: Number(latest?.id || 0),
      latestAttemptStatus: String(latest?.status || ""),
      createdAt: session.createdAt,
    });
  }

  return { sessions: rows };
}

export async function getExamResultDetail(env, userIdRaw, sessionIdRaw, attemptIdRaw = null) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const sessionId = parsePositiveId(sessionIdRaw, "session id");
  const session = await ensureSessionBelongsToUser(env, userId, sessionId);
  const subject = await getSubjectOrThrow(env.DB, session.subjectId);
  const context = await collectSubjectContext(env.DB, subject.id);

  const attempts = (await listExamAttemptsBySession(env.DB, { sessionId, userId })).map(serializeAttemptRow);
  if (!attempts.length) throw new HttpError(404, "No attempts found for this exam");

  const selectedAttemptId = attemptIdRaw ? parsePositiveId(attemptIdRaw, "attempt id") : attempts[attempts.length - 1].id;
  const selectedAttempt = attempts.find((attempt) => attempt.id === selectedAttemptId) || attempts[attempts.length - 1];
  const payload = await buildAttemptPayload(env, userId, selectedAttempt.id);

  const progressSeries = attempts.map((attempt) => ({
    attemptId: attempt.id,
    attemptIndex: attempt.attemptIndex,
    score: attempt.score,
    status: attempt.status,
    correctCount: attempt.correctCount,
    totalQuestions: attempt.totalQuestions,
    startedAt: attempt.startedAt,
  }));

  return {
    subject,
    session,
    scopeLabel: resolveScopeLabel(session, context),
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      attemptIndex: attempt.attemptIndex,
      status: attempt.status,
      score: attempt.score,
      correctCount: attempt.correctCount,
      answeredCount: attempt.answeredCount,
      totalQuestions: attempt.totalQuestions,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      exitedAt: attempt.exitedAt,
    })),
    selectedAttempt: {
      id: payload.attempt.id,
      status: payload.attempt.status,
      score: payload.stats.score,
      correctCount: payload.stats.correctCount,
      answeredCount: payload.stats.answeredCount,
      totalQuestions: payload.stats.totalQuestions,
      questions: payload.questions,
    },
    progressSeries,
  };
}

export async function retakeExamSession(env, userIdRaw, sessionIdRaw) {
  const userId = parsePositiveId(userIdRaw, "user id");
  const sessionId = parsePositiveId(sessionIdRaw, "session id");

  const active = await getActiveAttemptRow(env, userId);
  if (active) {
    return {
      ok: true,
      resumed: true,
      attemptId: active.id,
      redirectUrl: `/exam/${active.id}`,
    };
  }

  const session = await ensureSessionBelongsToUser(env, userId, sessionId);
  const questions = await listExamSessionQuestions(env.DB, { sessionId: session.id });
  if (!questions.length) throw new HttpError(400, "Cannot retake an empty exam session");

  await updateExamSessionStatus(env.DB, {
    sessionId: session.id,
    status: "active",
    submittedAt: "",
    exitedAt: "",
  });

  const attempt = await createAttemptFromSession(env, { session, userId });
  return {
    ok: true,
    resumed: false,
    attemptId: attempt.id,
    redirectUrl: `/exam/${attempt.id}`,
  };
}
