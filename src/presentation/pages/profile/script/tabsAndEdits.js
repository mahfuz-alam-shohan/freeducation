export const PROFILE_SCRIPT_TABS_AND_EDITS = `
tabPosts.addEventListener('click', () => switchTab('posts'), { signal });
tabAbout.addEventListener('click', () => switchTab('about'), { signal });
if (tabSecurity && !PROFILE_READ_ONLY) {
  tabSecurity.addEventListener('click', () => switchTab('security'), { signal });
}

const profileTabs = [tabPosts, tabAbout];
if (tabSecurity && !PROFILE_READ_ONLY) profileTabs.push(tabSecurity);
const focusRelativeTab = (currentTab, delta) => {
  const startIndex = profileTabs.indexOf(currentTab);
  if (startIndex < 0) return;
  const nextIndex = (startIndex + delta + profileTabs.length) % profileTabs.length;
  const nextTab = profileTabs[nextIndex];
  const tabKey = tabKeyFromElement(nextTab);
  switchTab(tabKey);
  focusTab(nextTab);
};

profileTabs.forEach((tab) => {
  tab.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusRelativeTab(tab, 1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusRelativeTab(tab, -1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      switchTab('posts');
      focusTab(tabPosts);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const lastTab = profileTabs[profileTabs.length - 1] || tabPosts;
      switchTab(tabKeyFromElement(lastTab));
      focusTab(lastTab);
    }
  }, { signal });
});

const profileUrlParams = new URLSearchParams(window.location.search);
const profileHash = (window.location.hash || '').replace('#', '').toLowerCase();
const requestedTabRaw = String(profileUrlParams.get('tab') || profileHash || '').toLowerCase();
const requestedProfileTab = (!PROFILE_READ_ONLY && requestedTabRaw === 'security')
  ? 'security'
  : (requestedTabRaw === 'about' ? 'about' : 'posts');
switchTab(requestedProfileTab);

if (!PROFILE_READ_ONLY && profileUrlParams.get('openPassword') === '1' && openPasswordForm && passwordForm) {
  switchTab('security');
  if (passwordForm.hidden) passwordForm.hidden = false;
  openPasswordForm.textContent = 'Close password form';
}

if (!PROFILE_READ_ONLY && openPasswordForm && passwordForm) {
  openPasswordForm.addEventListener('click', () => {
    if (profilePage.classList.contains('is-loading')) return;

    const shouldOpen = passwordForm.hidden;
    passwordForm.hidden = !shouldOpen;
    openPasswordForm.textContent = shouldOpen ? 'Close password form' : 'Change password';
  }, { signal });
}

if (!PROFILE_READ_ONLY) {
  editTriggers.forEach((button) => {
    button.addEventListener('click', () => {
      const field = button.getAttribute('data-edit-trigger');
      if (!field) return;
      openInlineEdit(field);
    }, { signal });
  });

  editCancels.forEach((button) => {
    button.addEventListener('click', () => {
      const field = button.getAttribute('data-edit-cancel');
      if (!field) return;
      closeInlineEdit(field);
    }, { signal });
  });

  editForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSavingInlineEdit) return;

      const field = form.getAttribute('data-edit-form');
      if (!field) return;

      const { valueInput, dayInput, monthInput, yearInput } = getFieldFormControls(field, form);

      if (field === 'date_of_birth') {
        const day = String(dayInput?.value || '').trim();
        const month = String(monthInput?.value || '').trim();
        const year = String(yearInput?.value || '').trim();
        if (!day || !month || !year) {
          showMessage('Enter day, month, and year for date of birth.', { type: 'error', inline: true });
          return;
        }

        const dobValue = year.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
        const parsedDob = new Date(dobValue);
        if (Number.isNaN(parsedDob.getTime()) || parsedDob.toISOString().slice(0, 10) !== dobValue) {
          showMessage('Enter a valid date of birth.', { type: 'error', inline: true });
          return;
        }

        await saveInlineEdit(field, dobValue);
        return;
      }

      if (!valueInput) return;
      await saveInlineEdit(field, String(valueInput.value || '').trim());
    }, { signal });
  });
}
`;
