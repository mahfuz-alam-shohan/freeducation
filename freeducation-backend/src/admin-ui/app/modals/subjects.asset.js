import { api } from '../api/index.js';
import { state } from '../core/state.js';
import { withLoading } from '../core/loading.js';
import { invalidateSubjectDetail, invalidateSubjects } from '../core/cache.js';
import { renderSubjectModal } from '../../components/subjects.list.js';
import { renderNodeModal } from '../../components/subjects.detail.js';
import { showToast } from '../../components/toast.js';

export function openSubjectModal(subject = null, { refresh } = {}) {
  const modalMarkup = renderSubjectModal(state.subjectModules, subject);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="subject-form"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const templateIdValue = formData.get('templateId') || (subject ? subject.templateId : '');
    const templateId = Number(templateIdValue);

    try {
      await withLoading(async () => {
        if (!subject && !Number.isFinite(templateId)) {
          throw new Error('Subject skeleton is required');
        }
        if (subject) {
          await api.updateSubject(subject.id, { name });
        } else {
          await api.createSubject({ name, templateId });
        }
        modal.remove();
        invalidateSubjects();
        if (subject) {
          invalidateSubjectDetail(subject.id);
        }
        if (refresh) {
          await refresh({ force: true });
        }
        showToast(subject ? 'Subject updated' : 'Subject created');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

export function openNodeModal(subjectId, node, { refresh } = {}) {
  const modalMarkup = renderNodeModal(node);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="node-form"]');
  const imageKeyInput = form.querySelector('input[name="imageKey"]');
  const fileInput = form.querySelector('input[name="imageFile"]');
  const clearBtn = modal.querySelector('[data-action="node-clear-image"]');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      imageKeyInput.value = '';
      if (fileInput) fileInput.value = '';
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const displayName = String(formData.get('displayName') || '').trim();
    let imageKey = String(formData.get('imageKey') || '').trim();

    try {
      await withLoading(async () => {
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const upload = await api.uploadMedia(fileInput.files[0], 'subject-nodes');
          imageKey = upload.data.key;
        }
        await api.updateSubjectNode(subjectId, node.id, {
          displayName: displayName || null,
          imageKey: imageKey || null
        });
        modal.remove();
        invalidateSubjectDetail(subjectId);
        if (refresh) {
          await refresh({ force: true });
        }
        showToast('Node updated');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
