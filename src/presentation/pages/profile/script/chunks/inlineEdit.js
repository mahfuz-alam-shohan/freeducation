export const PROFILE_SCRIPT_INLINE_EDIT = `
const getFieldFormControls = (field, form) => {
  if (field === 'date_of_birth') {
    return {
      dayInput: form.elements.day,
      monthInput: form.elements.month,
      yearInput: form.elements.year,
    };
  }

  return { valueInput: form.elements.value };
};

const closeInlineEdit = (field) => {
  const trigger = panelAbout.querySelector('[data-edit-trigger="' + field + '"]');
  const form = panelAbout.querySelector('[data-edit-form="' + field + '"]');
  const row = panelAbout.querySelector('[data-field="' + field + '"]');
  if (!trigger || !form || !row) return;

  const existingTimer = editAnimationTimers.get(field);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    editAnimationTimers.delete(field);
  }

  form.classList.remove('is-visible');
  const hideTimer = window.setTimeout(() => {
    form.hidden = true;
    trigger.hidden = false;
    row.classList.remove('is-editing');
    editAnimationTimers.delete(field);
  }, 380);
  editAnimationTimers.set(field, hideTimer);

  if (activeEditField === field) activeEditField = null;
};

const openInlineEdit = (field) => {
  if (isSavingInlineEdit) return;
  if (activeEditField && activeEditField !== field) {
    closeInlineEdit(activeEditField);
  }

  const trigger = panelAbout.querySelector('[data-edit-trigger="' + field + '"]');
  const form = panelAbout.querySelector('[data-edit-form="' + field + '"]');
  const row = panelAbout.querySelector('[data-field="' + field + '"]');
  if (!trigger || !form || !row) return;

  const existingTimer = editAnimationTimers.get(field);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
    editAnimationTimers.delete(field);
  }

  const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);

  if (field === 'date_of_birth') {
    const parts = (profileState.date_of_birth || '').split('-');
    if (dayInput) dayInput.value = parts[2] ? String(Number(parts[2])) : '';
    if (monthInput) monthInput.value = parts[1] || '';
    if (yearInput) yearInput.value = parts[0] || '';
  } else if (field === 'gender' && valueInput) {
    valueInput.value = profileState.gender && profileState.gender !== '-' ? profileState.gender : 'Prefer not to say';
  } else if (valueInput) {
    valueInput.value = profileState[field] && profileState[field] !== '-' ? profileState[field] : '';
  }

  trigger.hidden = true;
  form.hidden = false;
  row.classList.add('is-editing');

  requestAnimationFrame(() => {
    form.classList.add('is-visible');
    const focusTarget = dayInput || valueInput;
    if (!focusTarget) return;
    focusTarget.focus();
    if (typeof focusTarget.select === 'function' && focusTarget.type !== 'date') focusTarget.select();
  });

  activeEditField = field;
};

const setInlineEditBusy = (busy) => {
  isSavingInlineEdit = busy;
  editTriggers.forEach((button) => {
    button.disabled = busy;
  });
  editForms.forEach((form) => {
    const field = form.getAttribute('data-edit-form');
    if (!field) return;
    const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);
    if (valueInput) valueInput.disabled = busy;
    if (dayInput) dayInput.disabled = busy;
    if (monthInput) monthInput.disabled = busy;
    if (yearInput) yearInput.disabled = busy;
    const submit = form.querySelector('button[type="submit"]');
    const cancel = form.querySelector('[data-edit-cancel]');
    if (submit) submit.disabled = busy;
    if (cancel) cancel.disabled = busy;
  });
};

const saveInlineEdit = async (field, value) => {
  setInlineEditBusy(true);
  showMessage('Updating profile...');

  try {
    const response = await fetch(API_BASE + '/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ field, value }),
      signal,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to update profile');

    const profile = result.profile || {};
    profileState.name = profile.name || '-';
    profileState.email = profile.email || '-';
    profileState.date_of_birth = profile.date_of_birth || '';
    profileState.gender = profile.gender || '-';
    profileState.user_type = profile.user_type || 'User';

    hydrateAboutSection();
    closeInlineEdit(field);
    showMessage('Profile updated.');
  } catch (error) {
    if (error?.name === 'AbortError') return;
    showMessage(error?.message || 'Unable to update profile', { type: 'error', inline: true });
  } finally {
    setInlineEditBusy(false);
  }
};
`;
