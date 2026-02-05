import { api } from '../api/index.js';
import { withLoading } from '../core/loading.js';
import { invalidateUsers } from '../core/cache.js';
import { renderUserForm } from '../../components/form.js';
import { showToast } from '../../components/toast.js';

export function openCreateModal({ refresh } = {}) {
  const modalMarkup = renderUserForm();
  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.querySelector('[data-modal]');
  const closeButtons = modal.querySelectorAll('[data-action="close-modal"]');
  closeButtons.forEach((btn) => btn.addEventListener('click', () => modal.remove()));

  const form = modal.querySelector('[data-form="user-create"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    try {
      await withLoading(async () => {
        await api.createUser(payload);
        modal.remove();
        invalidateUsers();
        if (refresh) {
          await refresh({ force: true });
        }
        showToast('User created');
      });
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
