import { api } from '../api/index.js';
import { state } from '../core/state.js';
import { withLoading } from '../core/loading.js';
import {
  invalidateChapterDetail,
  invalidateSubjectChapters,
  invalidateTopicDetail
} from '../core/cache.js';
import { renderChapterModal } from '../../components/subjects.chapters.js';
import { renderNoteModal, renderQuestionModal, renderVideoModal } from '../../components/subjects.chapter.detail.js';
import { showToast } from '../../components/toast.js';

export function openChapterModal(node, chapter = null, { refresh } = {}) {
  const subjectId = state.activeSubject
    ? state.activeSubject.id
    : (state.chapterDetail ? state.chapterDetail.subject.id : (state.topicDetail ? state.topicDetail.subject.id : null));
  if (!subjectId || !node) return;

  const modalMarkup = renderChapterModal(node, chapter);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="chapter-form"]');
  const imageKeyInput = form.querySelector('input[name="imageKey"]');
  const fileInput = form.querySelector('input[name="imageFile"]');
  const clearBtn = modal.querySelector('[data-action="chapter-clear-image"]');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      imageKeyInput.value = '';
      if (fileInput) fileInput.value = '';
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    let imageKey = String(formData.get('imageKey') || '').trim();

    try {
      await withLoading(async () => {
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const upload = await api.uploadMedia(fileInput.files[0], 'subject-chapters');
          imageKey = upload.data.key;
        }

        if (chapter) {
          await api.updateSubjectChapter(subjectId, chapter.id, { name, imageKey: imageKey || null });
        } else {
          await api.createSubjectChapter(subjectId, {
            nodeId: node.id,
            name,
            imageKey: imageKey || null
          });
        }

        modal.remove();
        invalidateSubjectChapters(subjectId, node.id);
        if (chapter) {
          invalidateChapterDetail(chapter.id);
          if (state.topicDetail && state.topicDetail.chapter.id === chapter.id) {
            invalidateTopicDetail(state.topicDetail.topic.id);
          }
        }
        if (refresh) {
          await refresh({ force: true });
        }
        showToast(chapter ? 'Chapter updated' : 'Chapter created');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

export function openNoteModal(context = {}, { refresh } = {}) {
  const owner = context.owner || (state.topicDetail ? 'topic' : 'chapter');
  const ownerId = context.ownerId || (owner === 'topic' ? state.topicDetail?.topic.id : state.chapterDetail?.chapter.id);
  if (!ownerId) return;

  const modalMarkup = renderNoteModal();
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="note-form"]');
  const imageKeyInput = form.querySelector('input[name="imageKey"]');
  const fileInput = form.querySelector('input[name="imageFile"]');
  const clearBtn = modal.querySelector('[data-action="note-clear-image"]');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (imageKeyInput) imageKeyInput.value = '';
      if (fileInput) fileInput.value = '';
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const note = String(formData.get('note') || '').trim();
    let imageKey = String(formData.get('imageKey') || '').trim();
    if (!note) return;

    try {
      await withLoading(async () => {
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const upload = await api.uploadMedia(fileInput.files[0], 'subject-notes');
          imageKey = upload.data.key;
        }

        if (owner === 'topic') {
          await api.addTopicNote(ownerId, { note, imageKey: imageKey || null });
          invalidateTopicDetail(ownerId);
        } else {
          await api.addChapterNote(ownerId, { note, imageKey: imageKey || null });
          invalidateChapterDetail(ownerId);
        }
        modal.remove();
        if (refresh) {
          await refresh({ force: true });
        }
        showToast('Note added');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

export function openVideoModal(context = {}, { refresh } = {}) {
  const owner = context.owner || (state.topicDetail ? 'topic' : 'chapter');
  const ownerId = context.ownerId || (owner === 'topic' ? state.topicDetail?.topic.id : state.chapterDetail?.chapter.id);
  if (!ownerId) return;

  const modalMarkup = renderVideoModal();
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="video-form"]');
  const modeSelect = form.querySelector('select[name="mode"]');
  const urlField = modal.querySelector('[data-video-field="url"]');
  const fileField = modal.querySelector('[data-video-field="file"]');

  const syncMode = () => {
    const mode = modeSelect.value;
    if (urlField) urlField.style.display = mode === 'link' ? '' : 'none';
    if (fileField) fileField.style.display = mode === 'upload' ? '' : 'none';
  };

  modeSelect.addEventListener('change', syncMode);
  syncMode();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const mode = String(formData.get('mode') || 'link');
    const title = String(formData.get('title') || '').trim();
    const author = String(formData.get('author') || '').trim();
    const url = String(formData.get('url') || '').trim();
    const file = formData.get('file');

    try {
      await withLoading(async () => {
        if (!title) {
          throw new Error('Video title is required');
        }
        if (mode === 'link' && !url) {
          throw new Error('Video link is required');
        }
        if (mode === 'upload' && !(file instanceof File)) {
          throw new Error('Video file is required');
        }
        const payload = {
          mode,
          title,
          author: author || null,
          url: null,
          fileKey: null
        };

        if (mode === 'link') {
          payload.url = url || null;
        } else if (file instanceof File) {
          const upload = await api.uploadMedia(file, 'subject-videos');
          payload.fileKey = upload.data.key;
        }

        if (owner === 'topic') {
          await api.addTopicVideo(ownerId, payload);
          invalidateTopicDetail(ownerId);
        } else {
          await api.addChapterVideo(ownerId, payload);
          invalidateChapterDetail(ownerId);
        }
        modal.remove();
        if (refresh) {
          await refresh({ force: true });
        }
        showToast('Video added');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

export function openQuestionModal(labels, question = null, presetType = 'CQ', presetSection = '', { refresh } = {}) {
  const modalMarkup = renderQuestionModal(labels, question, presetType, presetSection);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="question-form"]');
  const typeSelect = form.querySelector('select[name="type"]');
  const sectionField = modal.querySelector('[data-question-field="section"]');
  const sectionSelect = form.querySelector('select[name="section"]');
  const lockedSection = presetSection || (question ? question.sectionKey || '' : '');

  const syncType = () => {
    const type = typeSelect.value;
    if (sectionField) {
      sectionField.style.display = type === 'CQ' ? '' : 'none';
    }
  };

  if (typeSelect) {
    typeSelect.addEventListener('change', syncType);
    if (presetType) {
      typeSelect.disabled = true;
    }
  }
  if (sectionSelect && lockedSection) {
    sectionSelect.value = lockedSection;
    sectionSelect.disabled = true;
  }
  syncType();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const mode = form.getAttribute('data-mode');
    const type = String(formData.get('type') || presetType);
    const section = lockedSection || String(formData.get('section') || '');
    const questionText = String(formData.get('question') || '').trim();
    const answerText = String(formData.get('answer') || '').trim();

    try {
      await withLoading(async () => {
        if (mode === 'edit' && question) {
          if (!questionText || !answerText) {
            throw new Error('Question and answer are required');
          }
          await api.updateChapterQuestion(state.chapterDetail.chapter.id, question.id, {
            questionText,
            answerText
          });
        } else {
          if (type === 'CQ' && !section) {
            throw new Error('CQ section is required');
          }
          if (!questionText || !answerText) {
            throw new Error('Question and answer are required');
          }
          await api.addChapterQuestion(state.chapterDetail.chapter.id, {
            typeKey: type,
            sectionKey: type === 'CQ' ? section : null,
            questionText,
            answerText
          });
        }
        modal.remove();
        invalidateChapterDetail(state.chapterDetail.chapter.id);
        if (refresh) {
          await refresh({ force: true });
        }
        showToast(question ? 'Question updated' : 'Question added');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
