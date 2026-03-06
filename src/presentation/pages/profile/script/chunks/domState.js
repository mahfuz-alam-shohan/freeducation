export function profileScriptDomState(apiBaseLiteral, configLiteral) {
  return `
const API_BASE = ${apiBaseLiteral};
const PROFILE_CONFIG = ${configLiteral};

const tabAbout = document.getElementById('tabAbout');
const tabPosts = document.getElementById('tabPosts');
const tabSecurity = document.getElementById('tabSecurity');
const panelAbout = document.getElementById('panelAbout');
const panelPosts = document.getElementById('panelPosts');
const panelSecurity = document.getElementById('panelSecurity');
const profilePostsList = document.getElementById('profilePostsList');
const profilePostsStatus = document.getElementById('profilePostsStatus');
const profilePostsLoadMore = document.getElementById('profilePostsLoadMore');
const openPasswordForm = document.getElementById('openPasswordForm');
const passwordForm = document.getElementById('passwordForm');
const profileLogoutButton = document.getElementById('profileLogoutButton');
const profileMsg = document.getElementById('profileMsg');
const profilePage = document.querySelector('.profile-page');
const profilePageLoader = document.getElementById('profilePageLoader');
const profileTabIndicator = document.getElementById('profileTabIndicator');

const imageActionMenu = document.getElementById('imageActionMenu');
const imageUploadInput = document.getElementById('imageUploadInput');
const changeImageButton = document.getElementById('changeImageButton');
const viewImageButton = document.getElementById('viewImageButton');
const avatarUploadProgress = document.getElementById('avatarUploadProgress');
const avatarUploadText = document.getElementById('avatarUploadText');
const avatarUploadBar = document.getElementById('avatarUploadBar');
const coverUploadProgress = document.getElementById('coverUploadProgress');
const coverUploadText = document.getElementById('coverUploadText');
const coverUploadBar = document.getElementById('coverUploadBar');

const imageViewModal = document.getElementById('imageViewModal');
const closeViewModal = document.getElementById('closeViewModal');
const imageBigPreview = document.getElementById('imageBigPreview');

const avatarPanel = document.getElementById('avatarPanel');
const coverPanel = document.getElementById('coverPanel');
const avatarAction = document.getElementById('avatarAction');
const coverAction = document.getElementById('coverAction');
const avatarImage = document.getElementById('avatarImage');
const coverImage = document.getElementById('coverImage');
const avatarFallback = document.getElementById('avatarFallback');

const profileTitleName = document.getElementById('profileTitleName');
const aboutName = document.getElementById('aboutName');
const aboutEmail = document.getElementById('aboutEmail');
const aboutDob = document.getElementById('aboutDob');
const aboutGender = document.getElementById('aboutGender');
const aboutRole = document.getElementById('aboutRole');
const profileMateActionWrap = document.getElementById('profileMateActionWrap');
const profileMateAddButton = document.getElementById('profileMateAddButton');
const profileMateIncomingActions = document.getElementById('profileMateIncomingActions');
const profileMateAcceptButton = document.getElementById('profileMateAcceptButton');
const profileMateDeclineButton = document.getElementById('profileMateDeclineButton');
const profileMateOutgoingActions = document.getElementById('profileMateOutgoingActions');
const profileMateCancelButton = document.getElementById('profileMateCancelButton');
const profileMateConnectedActions = document.getElementById('profileMateConnectedActions');
const profileMateFollowToggleButton = document.getElementById('profileMateFollowToggleButton');
const profileMateRemoveButton = document.getElementById('profileMateRemoveButton');
const profileMateStateLabel = document.getElementById('profileMateStateLabel');

const editTriggers = Array.from(document.querySelectorAll('[data-edit-trigger]'));
const editForms = Array.from(document.querySelectorAll('[data-edit-form]'));
const editCancels = Array.from(document.querySelectorAll('[data-edit-cancel]'));

if (!tabAbout || !tabPosts || !panelAbout || !panelPosts || !profilePostsList || !profilePostsStatus || !profilePostsLoadMore || !profileMsg || !profilePage || !profilePageLoader || !profileTabIndicator || !aboutName || !profileTitleName || !avatarPanel || !coverPanel || !avatarImage || !coverImage || !avatarFallback) return;

const PROFILE_READ_ONLY = Boolean(PROFILE_CONFIG?.readOnly || profilePage?.dataset?.readOnly === '1');
const PROFILE_USER_ID = Number.parseInt(String(PROFILE_CONFIG?.profileUserId || profilePage?.dataset?.profileUserId || 0), 10) || 0;
const PROFILE_VIEWER_ID = Number.parseInt(String(PROFILE_CONFIG?.viewerUserId || 0), 10) || 0;
const PROFILE_CAN_INTERACT = PROFILE_CONFIG?.canInteract !== false;

if (PROFILE_READ_ONLY) {
  if (tabSecurity) {
    tabSecurity.hidden = true;
    tabSecurity.setAttribute('aria-hidden', 'true');
  }
  if (panelSecurity) panelSecurity.hidden = true;
}

const controller = new AbortController();
const { signal } = controller;
if (typeof window.__registerCleanup === 'function') window.__registerCleanup(() => controller.abort());
const avatarVersionStorageKey = 'freeducation-avatar-version';

let currentImageType = 'avatar';
const hasImage = { avatar: false, cover: false };
let isUploadingImage = false;
let tabSwitchTimer = null;
let activeEditField = null;
let isSavingInlineEdit = false;
const editAnimationTimers = new Map();
let imageMenuCloseTimer = null;
let imageModalCloseTimer = null;
let ensureMyPostsLoaded = null;
let activeTabKey = 'posts';
let profileMateStatus = { status: 'none', requestId: 0, relationId: 0, followingByViewer: false };
let profileMateBusy = false;

const profileState = {
  name: '-',
  email: '-',
  date_of_birth: '',
  gender: '-',
  user_type: 'User',
};

const setPageLoading = (loading) => {
  profilePage.classList.toggle('is-loading', loading);
  profilePage.setAttribute('aria-busy', loading ? 'true' : 'false');
  profilePageLoader.setAttribute('aria-busy', loading ? 'true' : 'false');
  profilePageLoader.hidden = !loading;
};

const resetUploadUi = () => {
  const entries = [
    [avatarUploadProgress, avatarUploadText, avatarUploadBar],
    [coverUploadProgress, coverUploadText, coverUploadBar],
  ];
  entries.forEach(([wrap, label, bar]) => {
    if (wrap) wrap.hidden = true;
    if (label) label.textContent = 'Preparing upload...';
    if (bar) bar.style.width = '0%';
  });
};

const clearInlineMessage = () => {
  profileMsg.hidden = true;
  profileMsg.textContent = '';
  profileMsg.style.color = '';
};

const showMessage = (message, options = {}) => {
  const { type = 'success', inline = false } = options;

  if (inline && message) {
    profileMsg.hidden = false;
    profileMsg.textContent = message;
    profileMsg.style.color = type === 'error' ? '#ff9ca1' : '';
  } else {
    clearInlineMessage();
  }

  if (typeof window.__showAppStatus === 'function' && message) {
    window.__showAppStatus(message, type === 'error' ? 'error' : 'success');
  }
};

const updateTabIndicator = (activeTab) => {
  if (!activeTab || !profileTabIndicator) return;
  const tabsWrap = profileTabIndicator.parentElement;
  if (!tabsWrap) return;

  const wrapRect = tabsWrap.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  profileTabIndicator.style.width = tabRect.width + 'px';
  profileTabIndicator.style.transform = 'translateX(' + (tabRect.left - wrapRect.left) + 'px)';
};

const tabConfigs = {
  about: { tab: tabAbout, panel: panelAbout },
  posts: { tab: tabPosts, panel: panelPosts },
  security: { tab: tabSecurity, panel: panelSecurity },
};
const tabOrder = PROFILE_READ_ONLY ? ['posts', 'about'] : ['posts', 'about', 'security'];

const tabKeyFromElement = (tabElement) => {
  if (tabElement === tabPosts) return 'posts';
  if (tabElement === tabSecurity) return 'security';
  return 'about';
};

const switchTab = (targetTabKey = 'posts') => {
  if (profilePage.classList.contains('is-loading')) return;

  const normalizedKey = PROFILE_READ_ONLY && targetTabKey === 'security' ? 'posts' : targetTabKey;
  const nextKey = tabConfigs[normalizedKey] ? normalizedKey : 'posts';
  const nextConfig = tabConfigs[nextKey];
  const prevConfig = tabConfigs[activeTabKey] || tabConfigs.about;
  if (!nextConfig?.tab || !nextConfig?.panel) return;

  tabOrder.forEach((key) => {
    const config = tabConfigs[key];
    if (!config?.tab) return;
    const isActive = key === nextKey;
    config.tab.classList.toggle('is-active', isActive);
    config.tab.setAttribute('aria-selected', String(isActive));
  });
  updateTabIndicator(nextConfig.tab);

  if (prevConfig?.panel && prevConfig.panel !== nextConfig.panel) {
    prevConfig.panel.classList.remove('is-active');
    prevConfig.panel.classList.add('is-leaving');
    nextConfig.panel.hidden = false;
    nextConfig.panel.classList.add('is-active');

    if (tabSwitchTimer) window.clearTimeout(tabSwitchTimer);
    tabSwitchTimer = window.setTimeout(() => {
      if (prevConfig?.panel) {
        prevConfig.panel.hidden = true;
        prevConfig.panel.classList.remove('is-leaving');
      }
      tabSwitchTimer = null;
    }, 280);
  }

  activeTabKey = nextKey;

  if (nextKey !== 'security' && openPasswordForm && passwordForm) {
    passwordForm.hidden = true;
    openPasswordForm.textContent = 'Change password';
  }

  if (nextKey === 'posts' && typeof ensureMyPostsLoaded === 'function') {
    ensureMyPostsLoaded();
  }
};

const focusTab = (tab) => {
  if (tab && typeof tab.focus === 'function') tab.focus();
};

const formatDob = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const hydrateAboutSection = () => {
  aboutName.textContent = profileState.name || '-';
  aboutEmail.textContent = profileState.email || '-';
  aboutDob.textContent = formatDob(profileState.date_of_birth);
  aboutGender.textContent = profileState.gender || '-';
  aboutRole.textContent = profileState.user_type || 'User';
  profileTitleName.textContent = profileState.name || 'User';
  avatarFallback.textContent = (profileState.name || 'A').slice(0, 2).toUpperCase();
};
`;
}
