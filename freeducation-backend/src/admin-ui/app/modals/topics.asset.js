import { api } from '../api/index.js';
import { withLoading } from '../core/loading.js';
import { invalidateSubjectTopics, invalidateTopicDetail } from '../core/cache.js';
import { renderTopicModal } from '../../components/subjects.topics.js';
import { showToast } from '../../components/toast.js';

export function openTopicModal(chapter, topic = null, { refresh } = {}) {
  const modalMarkup = renderTopicModal(chapter, topic);
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="topic-form"]');
  const imageKeyInput = form.querySelector('input[name="imageKey"]');
  const fileInput = form.querySelector('input[name="imageFile"]');
  const clearBtn = modal.querySelector('[data-action="topic-clear-image"]');

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
          const upload = await api.uploadMedia(fileInput.files[0], 'subject-topics');
          imageKey = upload.data.key;
        }

        if (topic) {
          await api.updateTopic(chapter.id, topic.id, { name, imageKey: imageKey || null });
        } else {
          await api.createTopic(chapter.id, { name, imageKey: imageKey || null });
        }

        modal.remove();
        invalidateSubjectTopics(chapter.id);
        if (topic) {
          invalidateTopicDetail(topic.id);
        }
        if (refresh) {
          await refresh({ force: true });
        }
        showToast(topic ? 'Topic updated' : 'Topic created');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
