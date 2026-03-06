import { imageToolsModule } from "../../../shared/client/imageTools.js";

export const SOCIAL_SCRIPT_BOOTSTRAP = `
(() => {
  const page = document.querySelector('.social-page');
  if (!page) return;

  const body = document.body;
  const modeRaw = String(page.dataset.mode || '').toLowerCase();
  const mode = ["post", "search", "mates", "mate-requests"].includes(modeRaw) ? modeRaw : "feed";
  const scopeRaw = String(page.dataset.scope || '').toLowerCase();
  const scope = ['mine', 'mates', 'mate-requests'].includes(scopeRaw) ? scopeRaw : 'feed';
  const detailPostId = Number.parseInt(String(page.dataset.postId || ''), 10);
  const initialSearchQuery = String(page.dataset.searchQuery || '').trim();
  const canInteract = page.dataset.canInteract === '1';
  const focusComposer = page.dataset.focusComposer === '1';
  const MAX_POST_IMAGES = 4;
  const FEED_PAGE_LIMIT = 12;
  const FEED_PAGE_MAX_BYTES = 220000;

  const controller = new AbortController();
  const { signal } = controller;
  const status = document.getElementById('socialStatus');
  const feed = document.getElementById('socialFeed');
  const feedTail = document.getElementById('socialFeedTail');
  const feedSentinel = document.getElementById('socialFeedSentinel');
  const rightRail = document.getElementById('socialRightSidebar');
  const socialMenuClose = document.getElementById('socialMenuClose');
  const socialHeaderSearchRoot = document.getElementById('socialHeaderSearchRoot');
  const socialHeaderSearchToggle = document.getElementById('socialHeaderSearchToggle');
  const socialHeaderSearchForm = document.getElementById('socialHeaderSearchForm');
  const socialHeaderSearchInput = document.getElementById('socialHeaderSearchInput');
  const socialHeaderSearchClear = document.getElementById('socialHeaderSearchClear');
  const socialHeaderSearchDropdown = document.getElementById('socialHeaderSearchDropdown');
  const composeMenu = document.querySelector('.social-compose-menu');
  const socialSidebarDefault = document.getElementById('socialSidebarDefault');
  const socialCommentsPanel = document.getElementById('socialCommentsPanel');
  const socialCommentsContent = document.getElementById('socialCommentsContent');
  const socialCommentsPanelTitle = document.getElementById('socialCommentsPanelTitle');
  const socialCommentsPanelMeta = document.getElementById('socialCommentsPanelMeta');
  const socialMobileCommentsTray = document.getElementById('socialMobileCommentsTray');
  const socialMobileCommentsContent = document.getElementById('socialMobileCommentsContent');
  const socialMobileCommentsTitle = document.getElementById('socialMobileCommentsTitle');
  const socialMobileCommentsMeta = document.getElementById('socialMobileCommentsMeta');
  const detailBackFab = document.getElementById('socialDetailBackFab');
  const detailPostShell = document.getElementById('socialPostFocus');
  const detailPostMeta = document.getElementById('socialDetailPostMeta');
  const detailLikeButton = document.getElementById('socialDetailLikeButton');
  const detailLikeLabel = document.getElementById('socialDetailLikeLabel');
  const detailMeta = document.getElementById('socialDetailMeta');
  const detailComments = document.getElementById('socialDetailComments');
  const detailCommentForm = document.getElementById('socialDetailCommentForm');
  const detailCommentInput = document.getElementById('socialDetailCommentInput');
  const socialSearchHeading = document.getElementById('socialSearchHeading');
  const socialSearchResults = document.getElementById('socialSearchResults');
  const socialMatesList = document.getElementById('socialMatesList');
  const socialMatesSummary = document.getElementById('socialMatesSummary');
  const socialMateRequestsSummary = document.getElementById('socialMateRequestsSummary');
  const socialMateIncomingList = document.getElementById('socialMateIncomingList');
  const socialMateOutgoingList = document.getElementById('socialMateOutgoingList');
  let movedDetailBackFabToBody = false;
  if (mode === 'post' && detailBackFab && detailBackFab.parentElement !== body) {
    body.appendChild(detailBackFab);
    movedDetailBackFabToBody = true;
  }

  const createForm = document.getElementById('createPostForm');
  const postText = document.getElementById('postText');
  const postImage = document.getElementById('postImage');
  const openPostImagePicker = document.getElementById('openPostImagePicker');
  const previewWrap = document.getElementById('imagePreviewWrap');
  const previewList = document.getElementById('imagePreviewList');
  const submitPostButton = document.getElementById('submitPostButton');
  const uploadProgressWrap = document.getElementById('uploadProgressWrap');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadProgressValue = document.getElementById('uploadProgressValue');
  if (postImage) postImage.multiple = true;
  const detailImageParam = (() => {
    if (mode !== 'post') return 0;
    const raw = new URLSearchParams(window.location.search).get('image');
    const parsed = Number.parseInt(String(raw || ''), 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  })();

  let selectedPostImages = [];
  let activeDetailImageIndex = detailImageParam;
  let activeDetailReplyCommentId = 0;
  let activeModalReplyCommentId = 0;
  let feedPosts = [];
  let feedNextCursor = '';
  let feedHasMore = true;
  let feedLoading = false;
  let feedLoadError = '';
  let feedObserver = null;
  let feedAutoLoadArmed = false;
  let feedLastAutoLoadAt = 0;
  let activeModalPostId = 0;
  let searchDebounceTimer = 0;
  let activeSearchRequestId = 0;
  const brokenPostImages = window.__socialBrokenPostImages instanceof Set ? window.__socialBrokenPostImages : new Set();
  window.__socialBrokenPostImages = brokenPostImages;

  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      controller.abort();
      for (const entry of selectedPostImages) {
        if (entry?.previewObjectUrl) URL.revokeObjectURL(entry.previewObjectUrl);
      }
      if (window.markBrokenPostImage) delete window.markBrokenPostImage;
      body.classList.remove('social-shell-enter', 'social-shell-ready');
      body.classList.remove('social-comments-open');
      body.classList.remove('social-mobile-comments-open');
      body.classList.remove('social-post-page');
      body.classList.remove('social-search-open');
      if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
      if (feedObserver) feedObserver.disconnect();
      if (movedDetailBackFabToBody && detailBackFab?.isConnected) detailBackFab.remove();
    });
  }

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const setStatus = (message) => {
    if (status) status.textContent = message || '';
  };

  const formatTime = (iso) => {
    if (!iso) return 'now';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return 'now';
    return parsed.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const readErrorMessage = async (response, fallback) => {
    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      const payload = await response.json().catch(() => ({}));
      if (payload?.error && payload?.detail) return payload.error + ' (' + payload.detail + ')';
      if (payload?.error) return payload.error;
      if (payload?.detail) return String(payload.detail);
    }
    const raw = await response.text().catch(() => '');
    return raw.trim() || fallback;
  };
${imageToolsModule()}

  const markBrokenPostImage = (value) => {
    const key = String(value || '').trim();
    if (!key) return;
    brokenPostImages.add(key);
  };
  window.markBrokenPostImage = markBrokenPostImage;

  const isBrokenPostImage = (value) => {
    const key = String(value || '').trim();
    return Boolean(key) && brokenPostImages.has(key);
  };

  const compressImageToDataUrl = async (file, onProgress) => {
    return compressFileToDataUrl(file, {
      maxWidth: 1800,
      maxHeight: 1800,
      targetBytes: 520000,
      minQuality: 0.58,
      quality: 0.9,
      qualityStep: 0.05,
      maxPasses: 7,
      outputType: String(file?.type || '').toLowerCase() === 'image/webp' ? 'image/webp' : 'image/jpeg',
      preserveAlpha: true,
      throwIfTooLarge: true,
      tooLargeMessage: 'Unable to prepare image',
      onProgress,
    });
  };

  const postImageFingerprint = (file) => [
    String(file?.name || ''),
    String(file?.size || 0),
    String(file?.lastModified || 0),
  ].join(':');

  const updatePreview = () => {
    if (!previewWrap || !previewList) return;
    if (!selectedPostImages.length) {
      previewList.innerHTML = '';
      previewWrap.hidden = true;
      return;
    }

    const markup = selectedPostImages.map((entry, index) => {
      const previewSource = entry.previewObjectUrl || entry.previewDataUrl || '';
      const mediaMarkup = previewSource
        ? ('<img src="' + escapeHtml(previewSource) + '" alt="' + escapeHtml(entry.file?.name || 'Selected image') + '" loading="lazy">')
        : ('<div class="image-preview-fallback" aria-hidden="true">' + escapeHtml((entry.file?.name || 'Image').slice(0, 1).toUpperCase()) + '</div>');
      return '<figure class="image-preview-thumb">' +
        mediaMarkup +
        '<button class="image-preview-remove" type="button" data-action="remove-selected-image" data-image-index="' + index + '" aria-label="Remove image">&times;</button>' +
      '</figure>';
    }).join('');

    previewList.innerHTML = markup;
    previewWrap.hidden = false;
  };

  const clearSelectedPostImages = () => {
    for (const entry of selectedPostImages) {
      if (entry?.previewObjectUrl) URL.revokeObjectURL(entry.previewObjectUrl);
    }
    selectedPostImages = [];
    if (postImage) postImage.value = '';
    updatePreview();
    setComposerExpanded(false);
  };

  const getSelectedPostImages = () => selectedPostImages.map((entry) => entry.file);

  const removeSelectedPostImage = (index) => {
    const targetIndex = Number.parseInt(String(index || ''), 10);
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= selectedPostImages.length) return;
    const [removed] = selectedPostImages.splice(targetIndex, 1);
    if (removed?.previewObjectUrl) URL.revokeObjectURL(removed.previewObjectUrl);
    updatePreview();
    setComposerExpanded(false);
  };

  const addSelectedPostImages = (fileList) => {
    const incoming = Array.from(fileList || [])
      .filter((file) => file && typeof file === 'object' && typeof file.name === 'string')
      .filter((file) => {
        const type = String(file.type || '').toLowerCase();
        if (type.startsWith('image/')) return true;
        const name = String(file.name || '').toLowerCase();
        return /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(name);
      });

    if (!incoming.length) return;

    const next = [...selectedPostImages];
    let truncated = false;
    for (const file of incoming) {
      if (next.length >= MAX_POST_IMAGES) {
        truncated = true;
        break;
      }
      const entry = {
        id: postImageFingerprint(file) + ':' + Math.random().toString(36).slice(2),
        file,
        previewDataUrl: '',
        previewObjectUrl: '',
      };
      try {
        entry.previewObjectUrl = URL.createObjectURL(file);
      } catch {
        entry.previewObjectUrl = '';
      }
      next.push(entry);
    }

    if (truncated) {
      setStatus('You can add up to ' + MAX_POST_IMAGES + ' images per post.');
    }

    selectedPostImages = next.slice(0, MAX_POST_IMAGES);
    setStatus(selectedPostImages.length ? (selectedPostImages.length + ' image' + (selectedPostImages.length > 1 ? 's selected' : ' selected')) : '');
    if (postImage) postImage.value = '';
    updatePreview();
    setComposerExpanded(true);
  };

  const setProgress = (value) => {
    if (!uploadProgressWrap || !uploadProgress || !uploadProgressValue) return;
    uploadProgressWrap.hidden = false;
    const safe = Math.max(0, Math.min(100, Math.round(value)));
    uploadProgress.value = safe;
    uploadProgressValue.textContent = safe + '%';
  };

  const resetProgress = () => {
    if (!uploadProgressWrap || !uploadProgress || !uploadProgressValue) return;
    uploadProgressWrap.hidden = true;
    uploadProgress.value = 0;
    uploadProgressValue.textContent = '0%';
  };

  const setComposerExpanded = (expanded) => {
    const shouldStayExpanded = selectedPostImages.length > 0 || Boolean(uploadProgressWrap && !uploadProgressWrap.hidden);
    const active = Boolean(expanded) || shouldStayExpanded;
    page.classList.toggle('is-compose-expanded', active);
    body.classList.toggle('social-compose-expanded', active);
    if (composeMenu) composeMenu.dataset.hasImages = selectedPostImages.length > 0 ? '1' : '0';
  };

  const isMobileSocial = () => window.matchMedia('(max-width: 899px)').matches;
  const closeSocialMenu = () => {
    body.classList.remove('menu-open');
    const menuButton = document.getElementById('appMenuOpen');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    const menuOverlay = document.getElementById('appMenuOverlay');
    if (menuOverlay) menuOverlay.setAttribute('aria-hidden', 'true');
  };

  const setFeedPosts = (posts, options = {}) => {
    const incoming = Array.isArray(posts) ? posts : [];
    if (options?.replace) {
      feedPosts = [...incoming];
      return [...feedPosts];
    }

    if (!incoming.length) return;
    const existingIds = new Set(feedPosts.map((post) => Number(post?.id || 0)).filter((id) => id > 0));
    const appended = [];
    for (const post of incoming) {
      const postId = Number(post?.id || 0);
      if (!postId || existingIds.has(postId)) continue;
      existingIds.add(postId);
      feedPosts.push(post);
      appended.push(post);
    }

    return appended;
  };

  const getPostById = (postId) => {
    const id = Number(postId || 0);
    if (!id) return null;
    return feedPosts.find((post) => Number(post?.id || 0) === id) || null;
  };

  const openPostModal = (postId) => {
    const post = getPostById(postId);
    if (!post) return false;
    activeModalPostId = Number(post.id);
    if (isMobileSocial() && socialMobileCommentsTray && socialMobileCommentsContent) {
      socialMobileCommentsTray.setAttribute('aria-hidden', 'false');
      body.classList.add('social-mobile-comments-open');
      return true;
    }
    if (!socialCommentsPanel || !socialCommentsContent) return false;
    socialCommentsPanel.setAttribute('aria-hidden', 'false');
    if (socialSidebarDefault) socialSidebarDefault.setAttribute('aria-hidden', 'true');
    body.classList.add('social-comments-open');
    return true;
  };

  const closePostModal = () => {
    activeModalPostId = 0;
    activeModalReplyCommentId = 0;
    if (socialCommentsPanel) socialCommentsPanel.setAttribute('aria-hidden', 'true');
    if (socialSidebarDefault) socialSidebarDefault.setAttribute('aria-hidden', 'false');
    if (socialCommentsContent) socialCommentsContent.innerHTML = '';
    if (socialCommentsPanelTitle) socialCommentsPanelTitle.textContent = 'Comments';
    if (socialCommentsPanelMeta) socialCommentsPanelMeta.textContent = '';
    body.classList.remove('social-comments-open');
    if (socialMobileCommentsTray) socialMobileCommentsTray.setAttribute('aria-hidden', 'true');
    if (socialMobileCommentsContent) socialMobileCommentsContent.innerHTML = '';
    if (socialMobileCommentsTitle) socialMobileCommentsTitle.textContent = 'Comments';
    if (socialMobileCommentsMeta) socialMobileCommentsMeta.textContent = '';
    body.classList.remove('social-mobile-comments-open');
  };

  body.classList.add('social-shell-enter');
  if (mode === 'post') body.classList.add('social-post-page');
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      body.classList.add('social-shell-ready');
    });
  });

  if (composeMenu) {
    composeMenu.addEventListener('pointerenter', () => setComposerExpanded(true), { signal });
    composeMenu.addEventListener('pointerleave', () => setComposerExpanded(false), { signal });
    composeMenu.addEventListener('focusin', () => setComposerExpanded(true), { signal });
    composeMenu.addEventListener('focusout', () => {
      const hasFocusInside = composeMenu.matches(':focus-within');
      if (!hasFocusInside) setComposerExpanded(false);
    }, { signal });
  }

  if (rightRail) {
    rightRail.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]');
      if (!link) return;
      if (!isMobileSocial()) return;
      window.requestAnimationFrame(() => closeSocialMenu());
    }, { signal });
  }

  if (socialMenuClose) {
    socialMenuClose.addEventListener('click', () => closeSocialMenu(), { signal });
  }
  if (focusComposer && canInteract && postText) {
    setComposerExpanded(true);
    window.requestAnimationFrame(() => postText.focus());
  }

  resetProgress();
  setComposerExpanded(false);
`;
