import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { renderLayout } from './components/layout.js';
import { renderDashboard } from './components/dashboard.js';
import { renderUsersTable } from './components/table.js';
import { showToast } from './components/toast.js';
import { renderDatabasePanel } from './components/db.js';
import { renderApiManagementPanel } from './components/api.js';
import { renderModuleCategories } from './components/modules.categories.js';
import { renderSubjectModules } from './components/modules.subjects.js';
import { renderSubjectModuleOverview } from './components/modules.subject.detail.js';
import { renderSubjectModuleCurriculum } from './components/modules.subject.curriculum.js';
import { renderSubjectModuleExam } from './components/modules.subject.exam.js';
import { renderSubjectsList } from './components/subjects.list.js';
import { renderSubjectDetail } from './components/subjects.detail.js';
import { renderSubjectChapters } from './components/subjects.chapters.js';
import { renderSubjectTopics } from './components/subjects.topics.js';
import { renderChapterOverview, renderChapterNotes, renderChapterVideos, renderQuestionBankOverview, renderQuestionCQOverview, renderQuestionCQSection, renderQuestionMCQ } from './components/subjects.chapter.detail.js';
import { renderTopicOverview, renderTopicNotes, renderTopicVideos, renderTopicQuestionBankOverview, renderTopicQuestionCQOverview, renderTopicQuestionCQSection, renderTopicQuestionMCQ } from './components/subjects.topic.detail.js';
import { renderSubjectNode } from './components/subjects.node.js';
import { api } from './app/api/index.js';
import { app } from './app/core/dom.js';
import { DEFAULT_LABELS, state } from './app/core/state.js';
import { CACHE_TTL, cache, invalidateApis, invalidateChapterDetail, invalidateModuleCategories, invalidateSubjectChapters, invalidateSubjectDetail, invalidateSubjectModuleDetail, invalidateSubjectModules, invalidateSubjectTopics, invalidateSubjects, invalidateTableData, invalidateTables, invalidateTopicDetail, invalidateUsers, isFresh, resetCache } from './app/core/cache.js';
import { ensureLoadingOverlay, withLoading } from './app/core/loading.js';
import { getChaptersBackNode, getChildNodes, getNodeById, getSoloChaptersChild, getTopicsNode, isChaptersNode, mediaUrl } from './app/core/helpers.js';
import { parseRoute } from './app/core/router.js';
import { openCreateModal } from './app/modals/users.js';
import { openNodeModal, openSubjectModal } from './app/modals/subjects.js';
import { openChapterModal, openNoteModal, openVideoModal } from './app/modals/chapters.js';
import { openTopicModal } from './app/modals/topics.js';
import { openApiModal } from './app/modals/api.js';


function renderLogin(canBootstrap) {
  const bootstrapPanel = canBootstrap ? `
      <div class="auth-panel">
        <div class="auth-brand">FREEDUCATION</div>
        <h1>First admin setup</h1>
        <p>Create the initial administrator account.</p>
        <form data-form="bootstrap">
          <div class="form-grid">
            <div class="field">
              <label>First name</label>
              <input class="input" name="firstName" required />
            </div>
            <div class="field">
              <label>Last name</label>
              <input class="input" name="lastName" required />
            </div>
            <div class="field">
              <label>Email</label>
              <input class="input" type="email" name="email" required />
            </div>
            <div class="field">
              <label>Password</label>
              <input class="input" type="password" name="password" required />
            </div>
          </div>
          <div style="margin-top:16px; display:flex; justify-content:flex-end;">
            <button class="button secondary" type="submit">Create admin</button>
          </div>
        </form>
      </div>
  ` : '';

  app.innerHTML = `
    <div class="auth-page">
      <header class="auth-header">
        <div class="auth-header-brand">FREEDUCATION</div>
      </header>
      <div class="auth-shell">
        <div class="auth-panel">
          <div class="auth-brand">FREEDUCATION</div>
          <h1>Welcome back</h1>
          <p>Sign in to manage FREEDUCATION.</p>
          <form data-form="login">
            <div class="field">
              <label>Email</label>
              <input class="input" type="email" name="email" required />
            </div>
            <div class="field" style="margin-top:12px;">
              <label>Password</label>
              <input class="input" type="password" name="password" required />
            </div>
            <div style="margin-top:16px; display:flex; justify-content:flex-end;">
              <button class="button" type="submit">Sign in</button>
            </div>
          </form>
        </div>
        ${bootstrapPanel}
      </div>
    </div>
  `;

  const loginForm = app.querySelector('[data-form="login"]');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      await withLoading(async () => {
        const result = await api.login(payload);
        state.user = result.user;
        resetCache();
        await renderApp({ force: true });
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  const bootstrapForm = app.querySelector('[data-form="bootstrap"]');
  if (canBootstrap && bootstrapForm) {
    bootstrapForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(bootstrapForm);
      const payload = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        await withLoading(async () => {
          await api.bootstrap(payload);
          showToast('Admin created, you can sign in now');
          renderLogin(false);
        });
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }
}

function normalizeApi(item) {
  return {
    id: item.id,
    name: item.name,
    method: item.method,
    path: item.path,
    description: item.description || '',
    dataSummary: item.dataSummary || '',
    enabled: Boolean(item.isEnabled),
    public: Boolean(item.isPublic),
    system: Boolean(item.isSystem),
    roles: item.roles || { admin: false, teacher: false, student: false },
    userOverrides: item.userOverrides || { allow: [], deny: [] },
    keys: (item.keys || []).map((key) => ({
      id: key.id,
      label: key.label,
      prefix: key.prefix,
      enabled: Boolean(key.isEnabled),
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt
    }))
  };
}

async function loadUsers(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.users.at, CACHE_TTL.users)) {
    return;
  }
  const data = await api.listUsers();
  state.users = data.data || [];
  state.total = data.pagination?.total || 0;
  cache.users.at = Date.now();
}

async function loadApis(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.apis.at, CACHE_TTL.apis)) {
    return;
  }
  const data = await api.listApiEndpoints();
  state.apis = (data.data || []).map((item) => normalizeApi(item));
  cache.apis.at = Date.now();
}

async function loadModuleCategories(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.moduleCategories.at, CACHE_TTL.moduleCategories)) {
    return;
  }
  const data = await api.listModuleCategories();
  state.moduleCategories = data.data || [];
  cache.moduleCategories.at = Date.now();
}

async function loadSubjectModules(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.subjectModules.at, CACHE_TTL.subjectModules)) {
    return;
  }
  const data = await api.listSubjectModules();
  state.subjectModules = data.data || [];
  cache.subjectModules.at = Date.now();
}

async function loadSubjectModuleDetail(moduleId, options = {}) {
  const { force = false } = options;
  const cached = cache.subjectModuleDetail[moduleId];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.subjectModuleDetail)) {
    state.activeSubjectModule = cached.template;
    state.subjectModuleNodes = cached.nodes;
    return;
  }

  const data = await api.getSubjectModule(moduleId);
  state.activeSubjectModule = data.data.template;
  state.subjectModuleNodes = data.data.nodes || [];
  cache.subjectModuleDetail[moduleId] = {
    template: state.activeSubjectModule,
    nodes: state.subjectModuleNodes,
    at: Date.now()
  };
}

async function loadSubjects(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.subjects.at, CACHE_TTL.subjects)) {
    return;
  }
  const data = await api.listSubjects();
  state.subjects = data.data || [];
  cache.subjects.at = Date.now();
}

async function loadSubjectDetail(subjectId, options = {}) {
  const { force = false } = options;
  const cached = cache.subjectDetail[subjectId];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.subjectDetail)) {
    state.activeSubject = cached.subject;
    state.subjectNodes = cached.nodes;
    state.subjectLabels = cached.labels;
    return;
  }

  const data = await api.getSubject(subjectId);
  state.activeSubject = data.data.subject;
  state.subjectNodes = data.data.nodes || [];
  state.subjectLabels = data.data.labels || DEFAULT_LABELS;
  cache.subjectDetail[subjectId] = {
    subject: state.activeSubject,
    nodes: state.subjectNodes,
    labels: state.subjectLabels,
    at: Date.now()
  };
}

async function loadSubjectChapters(subjectId, nodeId, options = {}) {
  const { force = false } = options;
  const key = `${subjectId}:${nodeId}`;
  const cached = cache.subjectChapters[key];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.subjectChapters)) {
    state.subjectChapters = cached.chapters;
    return;
  }

  const data = await api.listSubjectChapters(subjectId, nodeId);
  state.subjectChapters = data.data || [];
  cache.subjectChapters[key] = { chapters: state.subjectChapters, at: Date.now() };
}

async function loadSubjectTopics(chapterId, options = {}) {
  const { force = false } = options;
  const cached = cache.subjectTopics[chapterId];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.subjectTopics)) {
    state.subjectTopics = cached.topics;
    return;
  }

  const data = await api.listChapterTopics(chapterId);
  state.subjectTopics = data.data || [];
  cache.subjectTopics[chapterId] = { topics: state.subjectTopics, at: Date.now() };
}

async function loadChapterDetail(chapterId, options = {}) {
  const { force = false } = options;
  const cached = cache.chapterDetail[chapterId];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.chapterDetail)) {
    state.chapterDetail = cached.detail;
    return;
  }

  const data = await api.getChapterDetail(chapterId);
  state.chapterDetail = data.data;
  cache.chapterDetail[chapterId] = { detail: state.chapterDetail, at: Date.now() };
}

async function loadTopicDetail(topicId, options = {}) {
  const { force = false } = options;
  const cached = cache.topicDetail[topicId];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.topicDetail)) {
    state.topicDetail = cached.detail;
    return;
  }

  const data = await api.getTopicDetail(topicId);
  state.topicDetail = data.data;
  cache.topicDetail[topicId] = { detail: state.topicDetail, at: Date.now() };
}

async function loadTables(options = {}) {
  const { force = false } = options;
  if (!force && isFresh(cache.tables.at, CACHE_TTL.tables)) {
    return;
  }
  const data = await api.listTables();
  state.tables = data.tables.map((item) => item.name);
  if (!state.selectedTable && state.tables.length > 0) {
    state.selectedTable = state.tables[0];
  }
  cache.tables.at = Date.now();
}

async function loadSelectedTable(options = {}) {
  const { force = false } = options;
  if (!state.selectedTable) {
    state.tableRows = [];
    state.tableColumns = [];
    state.tablePrimaryKey = null;
    state.tableTotal = 0;
    return;
  }

  const cached = cache.tableData[state.selectedTable];
  if (!force && cached && isFresh(cached.at, CACHE_TTL.tableData)) {
    state.tableRows = cached.rows;
    state.tableColumns = cached.columns;
    state.tablePrimaryKey = cached.primaryKey;
    state.tableTotal = cached.total;
    return;
  }

  const data = await api.getTable(state.selectedTable);
  state.tableRows = data.data.rows || [];
  state.tableColumns = data.data.columns || [];
  state.tablePrimaryKey = data.data.primaryKey;
  state.tableTotal = data.data.total || 0;
  cache.tableData[state.selectedTable] = {
    rows: state.tableRows,
    columns: state.tableColumns,
    primaryKey: state.tablePrimaryKey,
    total: state.tableTotal,
    at: Date.now()
  };
}

async function renderApp(options = {}) {
  const { force = false } = options;
  await withLoading(async () => {
    const { route, parts, section } = parseRoute();

    if (route === 'dashboard') {
      try {
        await loadUsers({ force });
      } catch (error) {
        state.users = [];
        state.total = 0;
        showToast(error.message, 'error');
      }

      try {
        await loadSubjectModules({ force });
      } catch (error) {
        state.subjectModules = [];
        showToast(error.message, 'error');
      }

      try {
        await loadSubjects({ force });
      } catch (error) {
        state.subjects = [];
        showToast(error.message, 'error');
      }

      try {
        await loadApis({ force });
      } catch (error) {
        state.apis = [];
        showToast(error.message, 'error');
      }

      try {
        await loadTables({ force });
      } catch (error) {
        state.tables = [];
        showToast(error.message, 'error');
      }
    } else if (route === 'users') {
      await loadUsers({ force });
    }

    if (route === 'database') {
      if (state.selectedTable) {
        await Promise.all([
          loadTables({ force }),
          loadSelectedTable({ force })
        ]);
      } else {
        await loadTables({ force });
        await loadSelectedTable({ force });
      }
    }

    if (route === 'api') {
      try {
        await loadApis({ force });
      } catch (error) {
        state.apis = [];
        showToast(error.message, 'error');
      }
    }

    if (section === 'modules') {
      if (parts[1] === 'subjects') {
        try {
          await loadSubjectModules({ force });
        } catch (error) {
          state.subjectModules = [];
          showToast(error.message, 'error');
        }
      } else {
        try {
          await loadModuleCategories({ force });
        } catch (error) {
          state.moduleCategories = [];
          showToast(error.message, 'error');
        }
      }

      const moduleId = Number(parts[2]);
      if (parts[1] === 'subjects' && Number.isFinite(moduleId)) {
        try {
          await loadSubjectModuleDetail(moduleId, { force });
        } catch (error) {
          state.activeSubjectModule = null;
          state.subjectModuleNodes = [];
          showToast(error.message, 'error');
        }
      }
    }

    if (section === 'subjects') {
      try {
        await Promise.all([
          loadSubjects({ force }),
          loadSubjectModules({ force })
        ]);
      } catch (error) {
        state.subjects = [];
        showToast(error.message, 'error');
      }

      const subjectId = Number(parts[1]);
      if (Number.isFinite(subjectId)) {
        try {
          await loadSubjectDetail(subjectId, { force });
        } catch (error) {
          state.activeSubject = null;
          state.subjectNodes = [];
          state.subjectLabels = DEFAULT_LABELS;
          showToast(error.message, 'error');
        }

        const nodeRouteId = parts[2] === 'node' ? Number(parts[3]) : null;
        const chapterRouteNodeId = parts[2] === 'chapters' ? Number(parts[3]) : null;
        const targetNodeId = Number.isFinite(nodeRouteId) ? nodeRouteId : chapterRouteNodeId;
        const targetNode = targetNodeId ? getNodeById(state.subjectNodes, targetNodeId) : null;
        const chaptersNode = parts[2] === 'chapters'
          ? targetNode
          : (parts[2] === 'node'
            ? (isChaptersNode(targetNode) ? targetNode : (targetNode ? getSoloChaptersChild(state.subjectNodes, targetNode.id) : null))
            : null);

        if (chaptersNode && Number.isFinite(chaptersNode.id)) {
          try {
            await loadSubjectChapters(subjectId, chaptersNode.id, { force });
          } catch (error) {
            state.subjectChapters = [];
            showToast(error.message, 'error');
          }
        }

        if (parts[2] === 'chapters') {
          const chapterId = Number(parts[4]);
          const topicsNode = chaptersNode ? getTopicsNode(state.subjectNodes, chaptersNode) : null;
          const hasTopics = Boolean(topicsNode);
          if (Number.isFinite(chapterId)) {
            if (hasTopics) {
              const topicSegment = parts[5];
              const topicId = topicSegment === 'topics' ? Number(parts[6]) : null;
              state.chapterDetail = null;
              if (topicSegment === 'topics' && Number.isFinite(topicId)) {
                try {
                  await loadTopicDetail(topicId, { force });
                } catch (error) {
                  state.topicDetail = null;
                  showToast(error.message, 'error');
                }
              } else {
                try {
                  await loadSubjectTopics(chapterId, { force });
                } catch (error) {
                  state.subjectTopics = [];
                  showToast(error.message, 'error');
                }
                state.topicDetail = null;
              }
            } else {
              try {
                await loadChapterDetail(chapterId, { force });
              } catch (error) {
                state.chapterDetail = null;
                showToast(error.message, 'error');
              }
              state.topicDetail = null;
            }
          }
        }
      }
    }

    const sidebar = renderSidebar([
      { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
      { id: 'users', label: 'Users', href: '#users' },
      { id: 'modules', label: 'Modules', href: '#modules' },
      { id: 'database', label: 'Database', href: '#database' },
      { id: 'api', label: 'API Management', href: '#api' }
    ], section);

    let title = 'Dashboard';
    let content = '';

    if (route === 'dashboard') {
      title = 'Dashboard';
      content = renderDashboard({
        users: state.users,
        totalUsers: state.total,
        subjectModules: state.subjectModules,
        subjects: state.subjects,
        apis: state.apis,
        tables: state.tables
      });
    } else if (route === 'users') {
      title = 'Users';
      content = renderUsersTable(state.users);
    } else if (section === 'modules') {
      title = 'Modules';
      if (route === 'modules') {
        content = renderModuleCategories(state.moduleCategories);
      } else if (parts[1] === 'subjects' && !parts[2]) {
        content = renderSubjectModules(state.subjectModules);
      } else if (parts[1] === 'subjects' && parts[2]) {
        const moduleId = Number(parts[2]);
        const module = state.subjectModules.find((item) => item.id === moduleId) || state.activeSubjectModule;
        if (!module) {
          content = `<div class="card"><p class="muted">Module not found.</p></div>`;
        } else if (parts[3] === 'curriculum') {
          content = renderSubjectModuleCurriculum(module, state.subjectModuleNodes);
        } else if (parts[3] === 'exam') {
          content = renderSubjectModuleExam(module);
        } else {
          content = renderSubjectModuleOverview(module);
        }
      }
    } else if (section === 'subjects') {
      title = 'Subjects';
      if (route === 'subjects') {
        content = renderSubjectsList(state.subjects, state.subjectModules);
      } else {
        const subjectId = Number(parts[1]);
        if (!Number.isFinite(subjectId) || !state.activeSubject) {
          content = `<div class="card"><p class="muted">Subject not found.</p></div>`;
        } else if (parts[2] === 'node') {
          const nodeId = Number(parts[3]);
          const node = getNodeById(state.subjectNodes, nodeId);
          if (!node) {
            content = `<div class="card"><p class="muted">Section not found.</p></div>`;
          } else {
            const chaptersNode = isChaptersNode(node) ? node : getSoloChaptersChild(state.subjectNodes, node.id);
            if (chaptersNode) {
              const backNode = getChaptersBackNode(state.subjectNodes, chaptersNode);
              content = renderSubjectChapters(state.activeSubject, chaptersNode, state.subjectChapters, mediaUrl, backNode);
            } else {
              const parent = node.parentId ? getNodeById(state.subjectNodes, node.parentId) : null;
              const children = getChildNodes(state.subjectNodes, node.id);
              content = renderSubjectNode(state.activeSubject, node, parent, children, mediaUrl);
            }
          }
        } else if (parts[2] === 'chapters') {
          const nodeId = Number(parts[3]);
          const node = getNodeById(state.subjectNodes, nodeId);
          if (!node) {
            content = `<div class="card"><p class="muted">Section not found.</p></div>`;
          } else if (parts[4]) {
            const chapterId = Number(parts[4]);
            const topicsNode = getTopicsNode(state.subjectNodes, node);
            const hasTopics = Boolean(topicsNode);

            if (hasTopics) {
              const topicSegment = parts[5];
              const topicId = topicSegment === 'topics' ? Number(parts[6]) : null;
              const chapter = state.subjectChapters.find((item) => item.id === chapterId);

              if (!chapter) {
                content = `<div class="card"><p class="muted">Chapter not found.</p></div>`;
              } else if (topicSegment === 'topics' && Number.isFinite(topicId)) {
                const topicSection = parts[7] || 'overview';
                const questionSection = parts[8] || '';
                if (!state.topicDetail) {
                  content = `<div class="card"><p class="muted">Topic not found.</p></div>`;
                } else if (topicSection === 'notes') {
                  content = renderTopicNotes(state.topicDetail, mediaUrl);
                } else if (topicSection === 'videos') {
                  content = renderTopicVideos(state.topicDetail, mediaUrl);
                } else if (topicSection === 'questions') {
                  if (questionSection === 'cq') {
                    const sectionKey = parts[9] || '';
                    const cqMode = parts[10] || '';
                    const cqQuestionId = Number(parts[11]);
                    const cqQuestion = Number.isFinite(cqQuestionId)
                      ? state.topicDetail.questions.find((item) => item.id === cqQuestionId)
                      : null;
                    const cqFormState = cqMode === 'new'
                      ? { mode: 'new', question: null }
                      : (cqMode === 'edit' && cqQuestion ? { mode: 'edit', question: cqQuestion } : null);
                    content = sectionKey
                      ? renderTopicQuestionCQSection(state.topicDetail, sectionKey, cqFormState)
                      : renderTopicQuestionCQOverview(state.topicDetail);
                  } else if (questionSection === 'mcq') {
                    const mcqMode = parts[9] || '';
                    const mcqQuestionId = Number(parts[10]);
                    const mcqQuestion = Number.isFinite(mcqQuestionId)
                      ? state.topicDetail.questions.find((item) => item.id === mcqQuestionId)
                      : null;
                    const mcqFormState = mcqMode === 'new'
                      ? { mode: 'new', question: null }
                      : (mcqMode === 'edit' && mcqQuestion ? { mode: 'edit', question: mcqQuestion } : null);
                    content = renderTopicQuestionMCQ(state.topicDetail, mcqFormState, mediaUrl);
                  } else {
                    content = renderTopicQuestionBankOverview(state.topicDetail);
                  }
                } else {
                  content = renderTopicOverview(state.topicDetail, mediaUrl);
                }
              } else {
                const backHref = `#subjects/${state.activeSubject.id}/chapters/${node.id}`;
                content = renderSubjectTopics(state.activeSubject, node, chapter, state.subjectTopics, mediaUrl, backHref);
              }
            } else {
              const chapterSection = parts[5] || 'overview';
              const questionSection = parts[6] || '';
              if (!state.chapterDetail) {
                content = `<div class="card"><p class="muted">Chapter not found.</p></div>`;
              } else if (chapterSection === 'notes') {
                content = renderChapterNotes(state.chapterDetail, mediaUrl);
              } else if (chapterSection === 'videos') {
                content = renderChapterVideos(state.chapterDetail, mediaUrl);
              } else if (chapterSection === 'questions') {
                if (questionSection === 'cq') {
                  const sectionKey = parts[7] || '';
                  const cqMode = parts[8] || '';
                  const cqQuestionId = Number(parts[9]);
                  const cqQuestion = Number.isFinite(cqQuestionId)
                    ? state.chapterDetail.questions.find((item) => item.id === cqQuestionId)
                    : null;
                  const cqFormState = cqMode === 'new'
                    ? { mode: 'new', question: null }
                    : (cqMode === 'edit' && cqQuestion ? { mode: 'edit', question: cqQuestion } : null);
                  content = sectionKey
                    ? renderQuestionCQSection(state.chapterDetail, sectionKey, cqFormState)
                    : renderQuestionCQOverview(state.chapterDetail);
                } else if (questionSection === 'mcq') {
                  const mcqMode = parts[7] || '';
                  const mcqQuestionId = Number(parts[8]);
                  const mcqQuestion = Number.isFinite(mcqQuestionId)
                    ? state.chapterDetail.questions.find((item) => item.id === mcqQuestionId)
                    : null;
                  const mcqFormState = mcqMode === 'new'
                    ? { mode: 'new', question: null }
                    : (mcqMode === 'edit' && mcqQuestion ? { mode: 'edit', question: mcqQuestion } : null);
                  content = renderQuestionMCQ(state.chapterDetail, mcqFormState, mediaUrl);
                } else {
                  content = renderQuestionBankOverview(state.chapterDetail);
                }
              } else {
                content = renderChapterOverview(state.chapterDetail, mediaUrl);
              }
            }
          } else {
            const backNode = getChaptersBackNode(state.subjectNodes, node);
            content = renderSubjectChapters(state.activeSubject, node, state.subjectChapters, mediaUrl, backNode);
          }
        } else {
          content = renderSubjectDetail(state.activeSubject, state.subjectNodes, mediaUrl);
        }
      }
    } else if (route === 'database') {
      title = 'Database';
      content = renderDatabasePanel(state);
    } else if (route === 'api') {
      title = 'API Management';
      content = renderApiManagementPanel(state.apis);
    }

    const topbar = renderTopbar(title, state.user);
    app.innerHTML = renderLayout({ sidebar, topbar, content });

    wireActions();
  });
}

function wireActions() {
  const { route, parts, section } = parseRoute();
  const refreshBtn = app.querySelector('[data-action="refresh"]');
  const openCreate = app.querySelector('[data-action="open-create"]');
  const logoutBtn = app.querySelector('[data-action="logout"]');
  const navToggle = app.querySelector('[data-action="toggle-nav"]');
  const overlay = app.querySelector('[data-action="close-nav"]');
  const sidebar = app.querySelector('.sidebar');
  const refresh = (options = {}) => renderApp(options);

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await withLoading(async () => {
        await renderApp({ force: true });
      });
    });
  }

  if (openCreate) {
    openCreate.addEventListener('click', () => openCreateModal({ refresh }));
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await withLoading(async () => {
        await api.logout();
        state.user = null;
        state.users = [];
        state.total = 0;
        state.apis = [];
        state.moduleCategories = [];
        state.subjectModules = [];
        state.activeSubjectModule = null;
        state.subjectModuleNodes = [];
        state.subjects = [];
        state.activeSubject = null;
        state.subjectNodes = [];
        state.subjectLabels = DEFAULT_LABELS;
        state.subjectChapters = [];
        state.chapterDetail = null;
        state.subjectTopics = [];
        state.topicDetail = null;
        state.tables = [];
        state.selectedTable = null;
        state.tableRows = [];
        state.tableColumns = [];
        state.tablePrimaryKey = null;
        state.tableTotal = 0;
        state.maintenance = null;
        resetCache();
        renderLogin(false);
      });
    });
  }

  const closeNav = () => {
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }
    if (overlay) {
      overlay.classList.remove('is-active');
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.toggle('is-open');
      }
      if (overlay) {
        overlay.classList.toggle('is-active');
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  app.querySelectorAll('.sidebar a').forEach((link) => {
    link.addEventListener('click', () => closeNav());
  });

  if (route === 'users') {
    app.querySelectorAll('[data-action="toggle"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        if (!id) return;
        const user = state.users.find((item) => String(item.id) === id);
        if (!user) return;

        try {
          await withLoading(async () => {
            await api.updateUser(id, { isActive: !user.isActive });
            invalidateUsers();
            await renderApp({ force: true });
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  }

  if (route === 'database') {
    const refreshTables = app.querySelector('[data-action="db-refresh"]');
    const reloadTable = app.querySelector('[data-action="db-reload"]');
    const truncateTable = app.querySelector('[data-action="db-truncate"]');
    const dropTable = app.querySelector('[data-action="db-drop"]');
    const reconcile = app.querySelector('[data-action="db-reconcile"]');

    if (refreshTables) {
      refreshTables.addEventListener('click', async () => {
        await withLoading(async () => {
          invalidateTables();
          invalidateTableData(state.selectedTable);
          await renderApp({ force: true });
        });
      });
    }

    if (reloadTable) {
      reloadTable.addEventListener('click', async () => {
        await withLoading(async () => {
          invalidateTableData(state.selectedTable);
          await renderApp({ force: true });
        });
      });
    }

    if (truncateTable) {
      truncateTable.addEventListener('click', async () => {
        if (!state.selectedTable) return;
        if (!confirm(`Format table ${state.selectedTable}? This clears all rows.`)) return;
        try {
          await withLoading(async () => {
            await api.truncateTable(state.selectedTable);
            invalidateTableData(state.selectedTable);
            await renderApp({ force: true });
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    if (dropTable) {
      dropTable.addEventListener('click', async () => {
        if (!state.selectedTable) return;
        if (!confirm(`Delete table ${state.selectedTable}? This cannot be undone.`)) return;
        try {
          await withLoading(async () => {
            await api.dropTable(state.selectedTable);
            invalidateTables();
            invalidateTableData(state.selectedTable);
            state.selectedTable = null;
            await renderApp({ force: true });
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    if (reconcile) {
      reconcile.addEventListener('click', async () => {
        try {
          await withLoading(async () => {
            const data = await api.reconcileSchema();
            state.maintenance = data.data;
            invalidateTables();
            invalidateTableData(state.selectedTable);
            await renderApp({ force: true });
            showToast('Schema reconciled');
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    }

    app.querySelectorAll('[data-action="db-select"]').forEach((button) => {
      button.addEventListener('click', async () => {
        state.selectedTable = button.getAttribute('data-table');
        await withLoading(async () => {
          await renderApp();
        });
      });
    });

    app.querySelectorAll('[data-action="db-delete-row"]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!state.selectedTable || !state.tablePrimaryKey) return;
        const value = button.getAttribute('data-pk');
        if (!confirm('Delete this row?')) return;

        try {
          await withLoading(async () => {
            await api.deleteRow(state.selectedTable, state.tablePrimaryKey, value);
            invalidateTableData(state.selectedTable);
            await renderApp({ force: true });
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  }

  if (route === 'api') {
    const refresh = app.querySelector('[data-action="api-refresh"]');
    if (refresh) {
      refresh.addEventListener('click', async () => {
        await withLoading(async () => {
          invalidateApis();
          await renderApp({ force: true });
        });
      });
    }

    app.querySelectorAll('[data-action="api-toggle"]').forEach((input) => {
      input.addEventListener('change', async () => {
        const id = input.getAttribute('data-id');
        if (!id) return;
        try {
          await withLoading(async () => {
            await api.updateApiEndpoint(id, { isEnabled: input.checked });
            invalidateApis();
            await renderApp({ force: true });
          });
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });

    app.querySelectorAll('[data-action="api-manage"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        if (!id) return;
        await openApiModal(id, { refresh });
      });
    });
  }

  if (section === 'subjects') {
    const subjectId = Number(parts[1]);

    if (route === 'subjects') {
      const createBtn = app.querySelector('[data-action="subject-create"]');
      if (createBtn) {
        createBtn.addEventListener('click', () => openSubjectModal(null, { refresh }));
      }

      app.querySelectorAll('[data-action="subject-edit"]').forEach((button) => {
        button.addEventListener('click', () => {
          const id = Number(button.getAttribute('data-id'));
          const subject = state.subjects.find((item) => item.id === id);
          if (subject) {
            openSubjectModal(subject, { refresh });
          }
        });
      });

      app.querySelectorAll('[data-action="subject-delete"]').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = Number(button.getAttribute('data-id'));
          if (!id) return;
          if (!confirm('Delete this subject?')) return;
          try {
            await withLoading(async () => {
              await api.deleteSubject(id);
              invalidateSubjects();
              await renderApp({ force: true });
              showToast('Subject deleted');
            });
          } catch (error) {
            showToast(error.message, 'error');
          }
        });
      });
    } else if (Number.isFinite(subjectId)) {
      const nodeId = parts[2] === 'node' ? Number(parts[3]) : (parts[2] === 'chapters' ? Number(parts[3]) : null);
      const node = Number.isFinite(nodeId) ? getNodeById(state.subjectNodes, nodeId) : null;
      const chaptersNode = parts[2] === 'chapters'
        ? node
        : (parts[2] === 'node'
          ? (isChaptersNode(node) ? node : (node ? getSoloChaptersChild(state.subjectNodes, node.id) : null))
          : null);
      const chaptersMode = Boolean(chaptersNode);

      if (chaptersMode) {
        const chapterId = Number(parts[4]);
        const topicsNode = chaptersNode ? getTopicsNode(state.subjectNodes, chaptersNode) : null;
        const hasTopics = Boolean(topicsNode);
        const chapter = Number.isFinite(chapterId)
          ? state.subjectChapters.find((item) => item.id === chapterId)
          : null;

        if (!parts[4]) {
          const createChapter = app.querySelector('[data-action="chapter-create"]');
          if (createChapter && chaptersNode) {
            createChapter.addEventListener('click', () => openChapterModal(chaptersNode, null, { refresh }));
          }

          app.querySelectorAll('[data-action="chapter-edit"]').forEach((button) => {
            button.addEventListener('click', () => {
              const id = Number(button.getAttribute('data-id'));
              const targetChapter = state.subjectChapters.find((item) => item.id === id);
              if (targetChapter && chaptersNode) {
                openChapterModal(chaptersNode, targetChapter, { refresh });
              }
            });
          });

          app.querySelectorAll('[data-action="chapter-delete"]').forEach((button) => {
            button.addEventListener('click', async () => {
              const id = Number(button.getAttribute('data-id'));
              if (!id || !chaptersNode) return;
              if (!confirm('Delete this chapter?')) return;
              try {
                await withLoading(async () => {
                  await api.deleteSubjectChapter(subjectId, id);
                  invalidateSubjectChapters(subjectId, chaptersNode.id);
                  invalidateSubjectTopics(id);
                  await renderApp({ force: true });
                  showToast('Chapter deleted');
                });
              } catch (error) {
                showToast(error.message, 'error');
              }
            });
          });
        } else if (hasTopics) {
          const topicSegment = parts[5];
          const topicId = topicSegment === 'topics' ? Number(parts[6]) : null;

          if (topicSegment === 'topics' && Number.isFinite(topicId) && state.topicDetail) {
            const topicSection = parts[7] || 'overview';
            const questionSection = parts[8] || '';

            const editTopic = app.querySelector('[data-action="topic-edit"]');
            if (editTopic) {
              editTopic.addEventListener('click', () => openTopicModal(state.topicDetail.chapter, state.topicDetail.topic, { refresh }));
            }

            const editChapter = app.querySelector('[data-action="chapter-edit"]');
            if (editChapter && node) {
              editChapter.addEventListener('click', () => openChapterModal(node, state.topicDetail.chapter, { refresh }));
            }

            if (topicSection === 'notes') {
              const addNote = app.querySelector('[data-action="topic-note-add"]');
              if (addNote) {
                addNote.addEventListener('click', () => openNoteModal({ owner: 'topic', ownerId: state.topicDetail.topic.id }, { refresh }));
              }

              app.querySelectorAll('[data-action="topic-note-delete"]').forEach((button) => {
                button.addEventListener('click', async () => {
                  const noteId = Number(button.getAttribute('data-id'));
                  if (!noteId) return;
                  try {
                    await withLoading(async () => {
                      await api.deleteTopicNote(state.topicDetail.topic.id, noteId);
                      invalidateTopicDetail(state.topicDetail.topic.id);
                      await renderApp({ force: true });
                    });
                  } catch (error) {
                    showToast(error.message, 'error');
                  }
                });
              });
            }

            if (topicSection === 'videos') {
              const addVideo = app.querySelector('[data-action="topic-video-add"]');
              if (addVideo) {
                addVideo.addEventListener('click', () => openVideoModal({ owner: 'topic', ownerId: state.topicDetail.topic.id }, { refresh }));
              }

              app.querySelectorAll('[data-action="topic-video-delete"]').forEach((button) => {
                button.addEventListener('click', async () => {
                  const videoId = Number(button.getAttribute('data-id'));
                  if (!videoId) return;
                  try {
                    await withLoading(async () => {
                      await api.deleteTopicVideo(state.topicDetail.topic.id, videoId);
                      invalidateTopicDetail(state.topicDetail.topic.id);
                      await renderApp({ force: true });
                    });
                  } catch (error) {
                    showToast(error.message, 'error');
                  }
                });
              });
            }

            if (topicSection === 'questions' && questionSection) {
              app.querySelectorAll('[data-action="topic-question-delete"]').forEach((button) => {
                button.addEventListener('click', async () => {
                  const id = Number(button.getAttribute('data-id'));
                  if (!id) return;
                  if (!confirm('Delete this question?')) return;
                  try {
                    await withLoading(async () => {
                      await api.deleteTopicQuestion(state.topicDetail.topic.id, id);
                      invalidateTopicDetail(state.topicDetail.topic.id);
                      await renderApp({ force: true });
                    });
                  } catch (error) {
                    showToast(error.message, 'error');
                  }
                });
              });
            }
          } else if (chapter) {
            const createTopic = app.querySelector('[data-action="topic-create"]');
            if (createTopic) {
              createTopic.addEventListener('click', () => openTopicModal(chapter, null, { refresh }));
            }

            const editChapter = app.querySelector('[data-action="chapter-edit"]');
            if (editChapter && node) {
              editChapter.addEventListener('click', () => openChapterModal(node, chapter, { refresh }));
            }

            app.querySelectorAll('[data-action="topic-edit"]').forEach((button) => {
              button.addEventListener('click', () => {
                const id = Number(button.getAttribute('data-id'));
                const topic = state.subjectTopics.find((item) => item.id === id);
                if (topic) {
                  openTopicModal(chapter, topic, { refresh });
                }
              });
            });

            app.querySelectorAll('[data-action="topic-delete"]').forEach((button) => {
              button.addEventListener('click', async () => {
                const id = Number(button.getAttribute('data-id'));
                if (!id) return;
                if (!confirm('Delete this topic?')) return;
                try {
                  await withLoading(async () => {
                    await api.deleteTopic(chapter.id, id);
                    invalidateSubjectTopics(chapter.id);
                    await renderApp({ force: true });
                    showToast('Topic deleted');
                  });
                } catch (error) {
                  showToast(error.message, 'error');
                }
              });
            });
          }
        } else if (state.chapterDetail) {
          const chapterSection = parts[5] || 'overview';
          const questionSection = parts[6] || '';
          const cqSectionKey = questionSection === 'cq' ? String(parts[7] || '').toUpperCase() : '';

          const editChapter = app.querySelector('[data-action="chapter-edit"]');
          if (editChapter) {
            editChapter.addEventListener('click', () => openChapterModal(node || state.chapterDetail.node, state.chapterDetail.chapter, { refresh }));
          }

          if (chapterSection === 'notes') {
            const addNote = app.querySelector('[data-action="note-add"]');
            if (addNote) {
              addNote.addEventListener('click', () => openNoteModal({ owner: 'chapter', ownerId: state.chapterDetail.chapter.id }, { refresh }));
            }

            app.querySelectorAll('[data-action="note-delete"]').forEach((button) => {
              button.addEventListener('click', async () => {
                const noteId = Number(button.getAttribute('data-id'));
                if (!noteId) return;
                try {
                  await withLoading(async () => {
                    await api.deleteChapterNote(state.chapterDetail.chapter.id, noteId);
                    invalidateChapterDetail(state.chapterDetail.chapter.id);
                    await renderApp({ force: true });
                  });
                } catch (error) {
                  showToast(error.message, 'error');
                }
              });
            });
          }

          if (chapterSection === 'videos') {
            const addVideo = app.querySelector('[data-action="video-add"]');
            if (addVideo) {
              addVideo.addEventListener('click', () => openVideoModal({ owner: 'chapter', ownerId: state.chapterDetail.chapter.id }, { refresh }));
            }

            app.querySelectorAll('[data-action="video-delete"]').forEach((button) => {
              button.addEventListener('click', async () => {
                const videoId = Number(button.getAttribute('data-id'));
                if (!videoId) return;
                try {
                  await withLoading(async () => {
                    await api.deleteChapterVideo(state.chapterDetail.chapter.id, videoId);
                    invalidateChapterDetail(state.chapterDetail.chapter.id);
                    await renderApp({ force: true });
                  });
                } catch (error) {
                  showToast(error.message, 'error');
                }
              });
            });
          }

          if (chapterSection === 'questions' && ((questionSection === 'cq' && cqSectionKey) || questionSection === 'mcq')) {
            app.querySelectorAll('[data-action="question-delete"]').forEach((button) => {
              button.addEventListener('click', async () => {
                const id = Number(button.getAttribute('data-id'));
                if (!id) return;
                if (!confirm('Delete this question?')) return;
                try {
                  await withLoading(async () => {
                    await api.deleteChapterQuestion(state.chapterDetail.chapter.id, id);
                    invalidateChapterDetail(state.chapterDetail.chapter.id);
                    await renderApp({ force: true });
                  });
                } catch (error) {
                  showToast(error.message, 'error');
                }
              });
            });
          }
        }
      }

      const saveLabelsButtons = app.querySelectorAll('[data-action="labels-save"]');
      if (saveLabelsButtons.length) {
        const detail = state.topicDetail || state.chapterDetail;
        if (detail) {
          const currentLabels = detail.labels || DEFAULT_LABELS;
          saveLabelsButtons.forEach((saveLabels) => {
            saveLabels.addEventListener('click', async () => {
              const getValue = (key, fallback) => {
                const input = app.querySelector(`[data-label="${key}"]`);
                if (!input) return fallback;
                return String(input.value || '').trim();
              };

              const payload = {
                typeLabels: {
                  CQ: getValue('type-CQ', currentLabels.types.CQ || DEFAULT_LABELS.types.CQ),
                  MCQ: getValue('type-MCQ', currentLabels.types.MCQ || DEFAULT_LABELS.types.MCQ)
                },
                sectionLabels: {
                  KNOWLEDGE: getValue('section-KNOWLEDGE', currentLabels.sections.KNOWLEDGE || DEFAULT_LABELS.sections.KNOWLEDGE),
                  TWO: getValue('section-TWO', currentLabels.sections.TWO || DEFAULT_LABELS.sections.TWO),
                  THREE: getValue('section-THREE', currentLabels.sections.THREE || DEFAULT_LABELS.sections.THREE),
                  FOUR: getValue('section-FOUR', currentLabels.sections.FOUR || DEFAULT_LABELS.sections.FOUR)
                }
              };

              try {
                await withLoading(async () => {
                  await api.updateQuestionLabels(detail.subject.id, payload);
                  invalidateSubjectDetail(detail.subject.id);
                  if (detail.topic) {
                    invalidateTopicDetail(detail.topic.id);
                  } else if (detail.chapter) {
                    invalidateChapterDetail(detail.chapter.id);
                  }
                  await renderApp({ force: true });
                  showToast('Titles saved');
                });
              } catch (error) {
                showToast(error.message, 'error');
              }
            });
          });
        }
      }

      const questionForm = app.querySelector('[data-form="question-page"]');
      if (questionForm) {
        questionForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const formData = new FormData(questionForm);
          const mode = String(questionForm.getAttribute('data-mode') || 'new');
          const type = String(questionForm.getAttribute('data-type') || 'CQ');
          const section = String(questionForm.getAttribute('data-section') || '');
          const owner = String(questionForm.getAttribute('data-owner') || 'chapter');
          const ownerId = Number(questionForm.getAttribute('data-owner-id'));
          const questionId = Number(questionForm.getAttribute('data-id'));
          const backHref = String(questionForm.getAttribute('data-back-href') || '');
          let questionText = String(formData.get('question') || '').trim();
          let answerText = String(formData.get('answer') || '').trim();

          try {
            await withLoading(async () => {
              if (!Number.isFinite(ownerId)) {
                throw new Error('Invalid question target');
              }

              if (type === 'MCQ') {
                if (!questionText) {
                  throw new Error('Question is required');
                }
                const options = ['A', 'B', 'C', 'D'].map((label) => String(formData.get(`option${label}`) || '').trim());
                const correctOption = String(formData.get('correctOption') || '').trim();
                if (options.some((option) => !option)) {
                  throw new Error('All four options are required');
                }
                if (!correctOption) {
                  throw new Error('Select the correct option');
                }
                const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctOption);
                if (correctIndex < 0) {
                  throw new Error('Invalid correct option');
                }
                answerText = options[correctIndex];

                const imageFile = formData.get('image');
                let imageKey = null;
                if (imageFile instanceof File && imageFile.size > 0) {
                  const upload = await api.uploadMedia(imageFile, 'subject-questions');
                  imageKey = upload.data.key;
                }

                if (mode === 'edit' && Number.isFinite(questionId)) {
                  const payload = { questionText, answerText, options, correctOption };
                  if (imageKey) payload.imageKey = imageKey;
                  if (owner === 'topic') {
                    await api.updateTopicQuestion(ownerId, questionId, payload);
                    invalidateTopicDetail(ownerId);
                  } else {
                    await api.updateChapterQuestion(ownerId, questionId, payload);
                    invalidateChapterDetail(ownerId);
                  }
                } else {
                  const payload = { typeKey: 'MCQ', sectionKey: null, questionText, answerText, options, correctOption };
                  if (imageKey) payload.imageKey = imageKey;
                  if (owner === 'topic') {
                    await api.addTopicQuestion(ownerId, payload);
                    invalidateTopicDetail(ownerId);
                  } else {
                    await api.addChapterQuestion(ownerId, payload);
                    invalidateChapterDetail(ownerId);
                  }
                }
              } else {
                const attachment = formData.get('attachment');
                const attachmentTarget = String(formData.get('attachmentTarget') || 'answer');
                if (!questionText || !answerText) {
                  throw new Error('Question and answer are required');
                }

                if (attachment instanceof File && attachment.size > 0) {
                  const upload = await api.uploadMedia(attachment, 'subject-questions');
                  const link = mediaUrl(upload.data.key);
                  if (attachmentTarget === 'question') {
                    questionText = `${questionText}\n${link}`;
                  } else {
                    answerText = `${answerText}\n${link}`;
                  }
                }

                if (mode === 'edit' && Number.isFinite(questionId)) {
                  if (owner === 'topic') {
                    await api.updateTopicQuestion(ownerId, questionId, { questionText, answerText });
                    invalidateTopicDetail(ownerId);
                  } else {
                    await api.updateChapterQuestion(ownerId, questionId, { questionText, answerText });
                    invalidateChapterDetail(ownerId);
                  }
                } else {
                  if (type === 'CQ' && !section) {
                    throw new Error('CQ section is required');
                  }
                  if (owner === 'topic') {
                    await api.addTopicQuestion(ownerId, {
                      typeKey: type,
                      sectionKey: type === 'CQ' ? section : null,
                      questionText,
                      answerText
                    });
                    invalidateTopicDetail(ownerId);
                  } else {
                    await api.addChapterQuestion(ownerId, {
                      typeKey: type,
                      sectionKey: type === 'CQ' ? section : null,
                      questionText,
                      answerText
                    });
                    invalidateChapterDetail(ownerId);
                  }
                }
              }

              if (backHref) {
                window.location.hash = backHref;
              }
              await renderApp({ force: true });
            });
          } catch (error) {
            showToast(error.message, 'error');
          }
        });
      }

      app.querySelectorAll('[data-action="node-edit"]').forEach((button) => {
        button.addEventListener('click', () => {
          const id = Number(button.getAttribute('data-id'));
          const target = getNodeById(state.subjectNodes, id);
          if (target) {
            openNodeModal(subjectId, target, { refresh });
          }
        });
      });
    }
  }

}

async function init() {
  ensureLoadingOverlay();
  await withLoading(async () => {
    const session = await api.getSession();
    if (session && session.user) {
      state.user = session.user;
      resetCache();
      await renderApp({ force: true });
      window.addEventListener('hashchange', () => {
        renderApp();
      });
    } else {
      try {
        const status = await api.bootstrapStatus();
        renderLogin(status.canBootstrap);
      } catch (error) {
        renderLogin(false);
      }
    }
  });
}

init();
