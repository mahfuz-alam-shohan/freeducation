export const SOCIAL_SCRIPT_ACTIONS = `
  const waitFor = (ms) => new Promise((resolve) => window.setTimeout(resolve, Math.max(0, Number(ms) || 0)));

  const submitPost = async (event) => {
    event.preventDefault();
    if (!canInteract) return;

    let postedSuccessfully = false;
    try {
      if (submitPostButton) submitPostButton.disabled = true;
      resetProgress();

      const stage = (value, message) => {
        setProgress(value);
        if (message) setStatus(message);
      };

      const selectedFiles = getSelectedPostImages();
      const imagesData = [];

      if (selectedFiles.length) {
        const total = selectedFiles.length;
        for (let index = 0; index < total; index += 1) {
          const file = selectedFiles[index];
          const rangeStart = 8 + Math.round((index / total) * 62);
          const rangeEnd = 8 + Math.round(((index + 1) / total) * 62);
          stage(rangeStart, 'Preparing image ' + (index + 1) + ' of ' + total + '...');
          const imageData = await compressImageToDataUrl(file, (value) => {
            const safe = Math.max(0, Math.min(100, Number(value) || 0));
            const normalized = rangeStart + Math.round(((rangeEnd - rangeStart) * safe) / 100);
            setProgress(normalized);
          });
          if (imageData) imagesData.push(imageData);
        }
      }

      stage(imagesData.length ? 82 : 55, 'Publishing post...');

      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: postText?.value || '', imagesData }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Unable to post'));
      }

      stage(100, 'Post published');
      postedSuccessfully = true;
      if (postText) postText.value = '';
      clearSelectedPostImages();
      await waitFor(220);
      resetProgress();
      setStatus('Post created successfully');
      await loadFeed({ reset: true });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to post');
      resetProgress();
    } finally {
      if (!postedSuccessfully) resetProgress();
      if (submitPostButton) submitPostButton.disabled = false;
    }
  };

  const resolvePostContext = (target) => {
    const postCard = target?.closest('.post-card');
    if (!postCard) return { postCard: null, postId: '' };
    return { postCard, postId: postCard.getAttribute('data-post-id') || '' };
  };

  const openCommentsModal = (postId, focusComment = false) => {
    if (!postId) return;
    if (!openPostModal(postId)) return;
    activeModalReplyCommentId = 0;
    renderModalPost(postId, focusComment);
    refreshPostState(postId, { focusComment }).catch(() => {});
  };

  const upsertPostState = (postId, nextPost) => {
    const safeId = Number.parseInt(String(postId || ''), 10);
    if (!Number.isInteger(safeId) || safeId <= 0 || !nextPost || typeof nextPost !== 'object') return null;
    const current = getPostById(safeId);
    if (current && typeof current === 'object') {
      Object.assign(current, nextPost);
      return current;
    }
    setFeedPosts([{ ...nextPost, id: safeId }], { replace: false });
    return getPostById(safeId);
  };

  const refreshPostState = async (postId, options = {}) => {
    const safeId = Number.parseInt(String(postId || ''), 10);
    if (!Number.isInteger(safeId) || safeId <= 0) return null;
    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(safeId), {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || await readErrorMessage(response, 'Unable to load post'));
      const nextPost = payload?.post && typeof payload.post === 'object' ? payload.post : null;
      if (!nextPost) throw new Error('Post not found');
      const syncedPost = upsertPostState(safeId, nextPost);
      if (body.classList.contains('social-modal-open') && Number(activeModalPostId || 0) === safeId) {
        renderModalPost(safeId, Boolean(options.focusComment));
      }
      return syncedPost;
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setStatus(error instanceof Error ? error.message : 'Unable to load post');
      }
      return null;
    }
  };

  const parseLikeCount = (value) => {
    const match = String(value || '').match(/\\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  };

  const normalizeSearchQuery = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
  const isDesktopViewport = () => window.matchMedia('(min-width: 900px)').matches;
  let headerSearchPinned = mode === 'search';

  const navigateToSocialPath = (path) => {
    const safePath = String(path || '').trim();
    if (!safePath) return;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(safePath);
      return;
    }
    window.location.href = safePath;
  };

  const setHeaderSearchOpen = (open, options = {}) => {
    if (!(socialHeaderSearchRoot instanceof HTMLElement) || !(socialHeaderSearchToggle instanceof HTMLElement)) return;
    const nextOpen = Boolean(open) || headerSearchPinned;
    const hasQuery = socialHeaderSearchInput instanceof HTMLInputElement
      ? Boolean(normalizeSearchQuery(socialHeaderSearchInput.value))
      : false;
    socialHeaderSearchRoot.classList.toggle('is-open', nextOpen);
    socialHeaderSearchRoot.dataset.open = nextOpen ? '1' : '0';
    socialHeaderSearchToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    body.classList.toggle('social-search-open', nextOpen);
    if (!nextOpen || !hasQuery) {
      closeHeaderSearchDropdown();
    }
    if (nextOpen && Boolean(options.focus) && socialHeaderSearchInput instanceof HTMLInputElement) {
      window.requestAnimationFrame(() => socialHeaderSearchInput.focus());
    }
  };

  const setHeaderSearchClearVisibility = () => {
    if (!(socialHeaderSearchInput instanceof HTMLInputElement) || !(socialHeaderSearchClear instanceof HTMLElement)) return;
    socialHeaderSearchClear.hidden = !normalizeSearchQuery(socialHeaderSearchInput.value);
  };

  const closeHeaderSearchDropdown = () => {
    if (!(socialHeaderSearchDropdown instanceof HTMLElement)) return;
    socialHeaderSearchDropdown.hidden = true;
    socialHeaderSearchDropdown.innerHTML = '';
  };

  const renderHeaderSearchDropdown = (profiles, options = {}) => {
    if (mode === 'search') return;
    if (!(socialHeaderSearchDropdown instanceof HTMLElement)) return;
    if (!(socialHeaderSearchRoot instanceof HTMLElement) || !socialHeaderSearchRoot.classList.contains('is-open')) return;
    let markup = renderSocialSearchList(profiles, {
      compact: true,
      emptyMessage: options?.emptyMessage || 'No matches found.',
    });
    if (!String(markup || '').trim()) {
      markup = '<p class="social-profile-search-empty">No matches found.</p>';
    }
    socialHeaderSearchDropdown.innerHTML = markup;
    socialHeaderSearchDropdown.hidden = false;
  };

  const buildSocialSearchPath = (query) => {
    const params = new URLSearchParams();
    const safeQuery = normalizeSearchQuery(query);
    if (safeQuery) params.set('q', safeQuery);
    const qs = params.toString();
    return '/social/search' + (qs ? ('?' + qs) : '');
  };

  const fetchSocialSearchResults = async (query, options = {}) => {
    const safeQuery = normalizeSearchQuery(query);
    const limit = Math.max(1, Math.min(30, Number.parseInt(String(options?.limit || 12), 10) || 12));
    const requestId = ++activeSearchRequestId;
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (safeQuery) params.set('q', safeQuery);

    try {
      const response = await fetch('/api/social/profiles/search?' + params.toString(), {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (requestId !== activeSearchRequestId) return null;
      if (!response.ok) {
        throw new Error(payload?.error || await readErrorMessage(response, 'Unable to search profiles'));
      }
      return Array.isArray(payload?.results) ? payload.results : [];
    } catch (error) {
      if (requestId !== activeSearchRequestId) return null;
      if (error?.name === 'AbortError') return null;
      throw error;
    }
  };

  const applySearchPageState = (options = {}) => {
    if (!(socialSearchResults instanceof HTMLElement)) return;
    if (socialSearchHeading instanceof HTMLElement) {
      socialSearchHeading.textContent = options?.heading || 'Search results';
    }
    if (options?.loading) {
      socialSearchResults.innerHTML = '<p class="social-profile-search-empty">Searching profiles...</p>';
      return;
    }
    if (options?.error) {
      socialSearchResults.innerHTML = '<p class="social-profile-search-empty">' + escapeHtml(options.error) + '</p>';
      return;
    }
    socialSearchResults.innerHTML = renderSocialSearchList(options?.profiles, {
      emptyMessage: options?.emptyMessage || 'No profiles found.',
    });
  };

  const loadSearchPageResults = async (query) => {
    if (mode !== 'search') return;
    const safeQuery = normalizeSearchQuery(query);
    const heading = safeQuery ? ('Results for "' + safeQuery + '"') : 'Find people';
    if (!safeQuery) {
      applySearchPageState({
        heading,
        profiles: [],
        emptyMessage: 'Type a name, email, or role to search.',
      });
      return;
    }
    applySearchPageState({ heading, loading: true });
    try {
      const results = await fetchSocialSearchResults(safeQuery, { limit: 24 });
      if (!results) return;
      applySearchPageState({
        heading,
        profiles: results,
        emptyMessage: safeQuery ? 'No matching profiles found.' : 'No profiles available yet.',
      });
    } catch (error) {
      applySearchPageState({
        heading,
        error: error instanceof Error ? error.message : 'Unable to search profiles',
      });
    }
  };

  const runHeaderSearch = async (query, options = {}) => {
    if (mode === 'search') {
      await loadSearchPageResults(query);
      return;
    }
    const safeQuery = normalizeSearchQuery(query);
    if (!(socialHeaderSearchRoot instanceof HTMLElement) || !socialHeaderSearchRoot.classList.contains('is-open')) {
      closeHeaderSearchDropdown();
      return;
    }
    const minChars = Number.parseInt(String(options?.minChars || 2), 10) || 2;
    if (safeQuery.length < minChars) {
      closeHeaderSearchDropdown();
      return;
    }
    try {
      const results = await fetchSocialSearchResults(safeQuery, { limit: 8 });
      if (!results) return;
      renderHeaderSearchDropdown(results, {
        emptyMessage: safeQuery ? 'No matching profiles found.' : 'Start typing to search profiles.',
      });
    } catch (error) {
      renderHeaderSearchDropdown([], {
        emptyMessage: error instanceof Error ? error.message : 'Unable to search profiles',
      });
    }
  };

  const findCommentById = (comments, commentId) => {
    const list = Array.isArray(comments) ? comments : [];
    const targetId = Number.parseInt(String(commentId || ''), 10);
    if (!Number.isInteger(targetId) || targetId <= 0) return null;
    for (const comment of list) {
      if (Number(comment?.id || 0) === targetId) return comment;
      const nested = findCommentById(comment?.replies, targetId);
      if (nested) return nested;
    }
    return null;
  };

  const commentReactionPending = new Set();

  const animateCommentReactionIcon = (options = {}) => {
    const commentId = Number.parseInt(String(options.commentId || ''), 10);
    if (!Number.isInteger(commentId) || commentId <= 0) return;
    const actionNames = Array.isArray(options.actionNames) ? options.actionNames : [];
    const roots = Array.isArray(options.roots) ? options.roots : [];
    for (const root of roots) {
      if (!(root instanceof Element)) continue;
      for (const actionName of actionNames) {
        const icon = root.querySelector('[data-action="' + String(actionName) + '"][data-comment-id="' + commentId + '"] .post-like-icon');
        if (icon instanceof HTMLElement) {
          icon.classList.remove('is-like-pop');
          void icon.offsetWidth;
          icon.classList.add('is-like-pop');
          window.setTimeout(() => icon.classList.remove('is-like-pop'), 380);
          return;
        }
      }
    }
  };

  const updateCommentReactionUi = (options = {}) => {
    const commentId = Number.parseInt(String(options.commentId || ''), 10);
    if (!Number.isInteger(commentId) || commentId <= 0) return;
    const liked = Boolean(options.liked);
    const reactionCount = Math.max(0, Number(options.reactionCount || 0));
    const roots = Array.isArray(options.roots) ? options.roots : [];
    const actionNames = Array.isArray(options.actionNames) ? options.actionNames : [];

    for (const root of roots) {
      if (!(root instanceof Element)) continue;
      for (const actionName of actionNames) {
        const selector = '[data-action="' + String(actionName) + '"][data-comment-id="' + commentId + '"]';
        const buttons = root.querySelectorAll(selector);
        for (const button of buttons) {
          if (!(button instanceof HTMLElement)) continue;
          button.classList.toggle('is-liked', liked);
          button.setAttribute('aria-pressed', liked ? 'true' : 'false');
          const rail = button.closest('.social-detail-comment-react-rail');
          const countLabel = rail?.querySelector('.social-detail-comment-react-count');
          if (countLabel) countLabel.textContent = String(reactionCount);
        }
      }
    }
  };

  const setActiveDetailReplyComment = (commentId, options = {}) => {
    const nextId = Number.parseInt(String(commentId || 0), 10);
    const safeId = Number.isInteger(nextId) && nextId > 0 ? nextId : 0;
    const post = Number.isInteger(detailPostId) && detailPostId > 0 ? getPostById(detailPostId) : null;
    if (!post) {
      activeDetailReplyCommentId = 0;
      return;
    }

    activeDetailReplyCommentId = activeDetailReplyCommentId === safeId ? 0 : safeId;
    renderDetailView(post);

    if (Boolean(options.focus) && activeDetailReplyCommentId > 0) {
      const selector = 'form[data-action="detail-comment-reply"][data-comment-id="' + activeDetailReplyCommentId + '"] input[name="comment"]';
      const preferredRoot = isMobileSocial() ? detailPostShell : rightRail;
      const input = (preferredRoot instanceof Element ? preferredRoot.querySelector(selector) : null) || document.querySelector(selector);
      if (input instanceof HTMLInputElement) {
        window.requestAnimationFrame(() => input.focus());
      }
    }
  };

  const setActiveModalReplyComment = (postId, commentId, options = {}) => {
    const safePostId = Number.parseInt(String(postId || ''), 10);
    if (!Number.isInteger(safePostId) || safePostId <= 0) return;
    const post = getPostById(safePostId);
    if (!post) return;
    const nextId = Number.parseInt(String(commentId || 0), 10);
    const safeId = Number.isInteger(nextId) && nextId > 0 ? nextId : 0;
    activeModalReplyCommentId = activeModalReplyCommentId === safeId ? 0 : safeId;
    renderModalPost(safePostId, false);

    if (Boolean(options.focus) && activeModalReplyCommentId > 0) {
      const selector = 'form[data-action="modal-comment-reply"][data-comment-id="' + activeModalReplyCommentId + '"] input[name="comment"]';
      const input = modalContent instanceof Element ? modalContent.querySelector(selector) : null;
      if (input instanceof HTMLInputElement) {
        window.requestAnimationFrame(() => input.focus());
      }
    }
  };

  const collectPostCardsById = (postId) => {
    const safeId = Number.parseInt(String(postId || ''), 10);
    if (!Number.isInteger(safeId) || safeId <= 0) return [];
    const selector = '.post-card[data-post-id="' + safeId + '"]';
    const cards = [];
    const seen = new Set();
    const collect = (root) => {
      if (!(root instanceof Element)) return;
      root.querySelectorAll(selector).forEach((card) => {
        if (!(card instanceof HTMLElement)) return;
        if (seen.has(card)) return;
        seen.add(card);
        cards.push(card);
      });
    };
    collect(feed);
    collect(modalContent);
    return cards;
  };

  const setLikeButtonsDisabled = (postId, disabled) => {
    for (const card of collectPostCardsById(postId)) {
      const likeButton = card.querySelector('[data-action="toggle-like"]');
      if (likeButton instanceof HTMLButtonElement) likeButton.disabled = Boolean(disabled);
    }
  };

  const setDetailLikeButtonsDisabled = (disabled) => {
    const nextDisabled = Boolean(disabled) || !canInteract;
    if (detailLikeButton instanceof HTMLButtonElement) detailLikeButton.disabled = nextDisabled;
    const roots = [detailPostShell, rightRail];
    for (const root of roots) {
      if (!(root instanceof Element)) continue;
      root.querySelectorAll('[data-action="detail-like-inline"]').forEach((button) => {
        if (button instanceof HTMLButtonElement) button.disabled = nextDisabled;
      });
    }
  };

  const updateSocialLikeUi = (postId, liked, reactionCount, options = {}) => {
    const shouldAnimate = Boolean(options?.animate);
    for (const card of collectPostCardsById(postId)) {
      const likeButton = card.querySelector('[data-action="toggle-like"]');
      if (likeButton instanceof HTMLElement) {
        likeButton.classList.toggle('is-liked', Boolean(liked));
        likeButton.setAttribute('aria-pressed', liked ? 'true' : 'false');
        const label = likeButton.querySelector('.post-like-label');
        if (label) label.textContent = liked ? 'Liked' : 'Like';
        else likeButton.textContent = liked ? 'Liked' : 'Like';
        if (shouldAnimate) {
          const icon = likeButton.querySelector('.post-like-icon');
          if (icon instanceof HTMLElement) {
            icon.classList.remove('is-like-pop');
            void icon.offsetWidth;
            icon.classList.add('is-like-pop');
            window.setTimeout(() => icon.classList.remove('is-like-pop'), 380);
          }
        }
      }
      const likesLabel = card.querySelector('.post-stat-likes');
      if (likesLabel) likesLabel.textContent = Math.max(0, Number(reactionCount || 0)) + ' likes';
    }
  };

  const updateDetailLikeUi = (post, liked, reactionCount, options = {}) => {
    const shouldAnimate = Boolean(options?.animate);
    const safeLiked = Boolean(liked);
    const safeReactionCount = Math.max(0, Number(reactionCount || 0));
    const commentCount = Math.max(0, Number(post?.commentCount || (Array.isArray(post?.comments) ? post.comments.length : 0)));

    if (detailLikeButton instanceof HTMLElement) {
      detailLikeButton.classList.toggle('is-liked', safeLiked);
      detailLikeButton.setAttribute('aria-pressed', safeLiked ? 'true' : 'false');
      if (shouldAnimate) {
        const icon = detailLikeButton.querySelector('.post-like-icon');
        if (icon instanceof HTMLElement) {
          icon.classList.remove('is-like-pop');
          void icon.offsetWidth;
          icon.classList.add('is-like-pop');
          window.setTimeout(() => icon.classList.remove('is-like-pop'), 380);
        }
      }
    }

    if (detailLikeLabel) detailLikeLabel.textContent = safeLiked ? 'Liked' : 'Like';
    if (detailMeta) detailMeta.textContent = safeReactionCount + ' likes ' + commentCount + ' comments';

    const roots = [detailPostShell, rightRail];
    for (const root of roots) {
      if (!(root instanceof Element)) continue;
      root.querySelectorAll('[data-action="detail-like-inline"]').forEach((button) => {
        if (!(button instanceof HTMLElement)) return;
        button.classList.toggle('is-liked', safeLiked);
        button.setAttribute('aria-pressed', safeLiked ? 'true' : 'false');
        const label = button.querySelector('.post-like-label');
        if (label) label.textContent = safeLiked ? 'Liked' : 'Like';
        if (shouldAnimate) {
          const icon = button.querySelector('.post-like-icon');
          if (icon instanceof HTMLElement) {
            icon.classList.remove('is-like-pop');
            void icon.offsetWidth;
            icon.classList.add('is-like-pop');
            window.setTimeout(() => icon.classList.remove('is-like-pop'), 380);
          }
        }
      });
      root.querySelectorAll('.social-detail-inline-reaction .social-detail-meta').forEach((meta) => {
        if (meta instanceof HTMLElement) meta.textContent = safeReactionCount + ' likes ' + commentCount + ' comments';
      });
    }
  };

  const onSocialClick = async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const closeModalTrigger = target.closest('[data-action="close-modal"]');
    if (closeModalTrigger) {
      closePostModal();
      return;
    }

    const { postCard, postId } = resolvePostContext(target);
    if (!postCard || !postId) return;

    const openCommentsTrigger = target.closest('[data-action="open-comments"]');
    if (openCommentsTrigger) {
      openCommentsModal(postId, false);
      return;
    }

    const focusCommentTrigger = target.closest('[data-action="focus-comment"]');
    if (focusCommentTrigger) {
      openCommentsModal(postId, true);
      return;
    }

    const modalFocusCommentTrigger = target.closest('[data-action="modal-focus-comment"]');
    if (modalFocusCommentTrigger) {
      event.preventDefault();
      const input = modalContent?.querySelector('form[data-action="modal-comment"] input[name="comment"]');
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }

    const modalCommentReactionTrigger = target.closest('[data-action="modal-toggle-comment-reaction"]');
    if (modalCommentReactionTrigger) {
      event.preventDefault();
      await toggleModalCommentReaction(postId, modalCommentReactionTrigger.getAttribute('data-comment-id'));
      return;
    }

    const modalReplyToggleTrigger = target.closest('[data-action="modal-toggle-comment-reply"]');
    if (modalReplyToggleTrigger) {
      event.preventDefault();
      setActiveModalReplyComment(postId, modalReplyToggleTrigger.getAttribute('data-comment-id'), { focus: true });
      return;
    }

    const toggleLikeTrigger = target.closest('[data-action="toggle-like"]');
    if (toggleLikeTrigger instanceof HTMLButtonElement) {
      event.preventDefault();
      if (!canInteract) return;
      if (toggleLikeTrigger.disabled) return;
      const post = getPostById(postId);
      const previousLiked = Boolean(post?.likedByViewer ?? toggleLikeTrigger.classList.contains('is-liked'));
      const currentReactionCount = Math.max(
        0,
        Number(post?.reactionCount ?? parseLikeCount(postCard.querySelector('.post-stat-likes')?.textContent))
      );
      const optimisticLiked = !previousLiked;
      const optimisticReactionCount = Math.max(0, currentReactionCount + (optimisticLiked ? 1 : -1));
      if (post) {
        post.likedByViewer = optimisticLiked;
        post.reactionCount = optimisticReactionCount;
      }
      updateSocialLikeUi(postId, optimisticLiked, optimisticReactionCount, { animate: optimisticLiked && !previousLiked });
      setLikeButtonsDisabled(postId, true);
      try {
        const response = await fetch('/api/social/posts/' + encodeURIComponent(postId) + '/reactions', { method: 'POST' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result?.error || await readErrorMessage(response, 'Unable to react'));
        }
        const nextLiked = typeof result?.liked === 'boolean' ? result.liked : optimisticLiked;
        const delta = nextLiked === previousLiked ? 0 : (nextLiked ? 1 : -1);
        const nextReactionCount = Math.max(0, currentReactionCount + delta);
        if (post) {
          post.likedByViewer = nextLiked;
          post.reactionCount = nextReactionCount;
        }
        updateSocialLikeUi(postId, nextLiked, nextReactionCount);
        setStatus('');
      } catch (error) {
        if (post) {
          post.likedByViewer = previousLiked;
          post.reactionCount = currentReactionCount;
        }
        updateSocialLikeUi(postId, previousLiked, currentReactionCount);
        if (error?.name !== 'AbortError') {
          setStatus(error instanceof Error ? error.message : 'Unable to react');
        }
      } finally {
        setLikeButtonsDisabled(postId, false);
      }
      return;
    }

  };

  const onSocialSubmit = async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) return;
    const action = String(target.getAttribute('data-action') || '');
    if (['modal-comment', 'modal-comment-reply'].includes(action)) {
      await submitModalComment(event);
      return;
    }
    if (action !== 'comment') return;

    event.preventDefault();
    if (!canInteract) return;

    const postCard = target.closest('.post-card');
    const postId = postCard?.getAttribute('data-post-id') || '';
    if (!postId) return;

    const input = target.querySelector('input[name="comment"]');
    const text = input instanceof HTMLInputElement ? input.value : '';
    if (!text.trim()) return;

    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(postId) + '/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        setStatus(await readErrorMessage(response, 'Unable to comment'));
        return;
      }
      if (input instanceof HTMLInputElement) input.value = '';
      await loadFeed({ reset: true });
      openCommentsModal(postId, true);
    } catch {
      setStatus('Unable to comment');
    }
  };

  let detailLikePending = false;

  const toggleDetailLike = async () => {
    if (!canInteract || !Number.isInteger(detailPostId) || detailPostId <= 0 || detailLikePending) return;
    const post = getPostById(detailPostId);
    if (!post) return;

    const previousLiked = Boolean(post.likedByViewer);
    const previousCount = Math.max(0, Number(post.reactionCount || 0));
    const optimisticLiked = !previousLiked;
    const optimisticCount = Math.max(0, previousCount + (optimisticLiked ? 1 : -1));
    post.likedByViewer = optimisticLiked;
    post.reactionCount = optimisticCount;
    updateDetailLikeUi(post, optimisticLiked, optimisticCount, { animate: optimisticLiked && !previousLiked });
    updateSocialLikeUi(detailPostId, optimisticLiked, optimisticCount, { animate: optimisticLiked && !previousLiked });
    setDetailLikeButtonsDisabled(true);
    detailLikePending = true;

    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(detailPostId) + '/reactions', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || await readErrorMessage(response, 'Unable to react'));
      const nextLiked = typeof result?.liked === 'boolean' ? result.liked : optimisticLiked;
      const delta = nextLiked === previousLiked ? 0 : (nextLiked ? 1 : -1);
      const nextCount = Math.max(0, previousCount + delta);
      post.likedByViewer = nextLiked;
      post.reactionCount = nextCount;
      updateDetailLikeUi(post, nextLiked, nextCount);
      updateSocialLikeUi(detailPostId, nextLiked, nextCount);
      setStatus('');
    } catch (error) {
      post.likedByViewer = previousLiked;
      post.reactionCount = previousCount;
      updateDetailLikeUi(post, previousLiked, previousCount);
      updateSocialLikeUi(detailPostId, previousLiked, previousCount);
      if (error?.name !== 'AbortError') {
        setStatus(error instanceof Error ? error.message : 'Unable to react');
      }
    } finally {
      detailLikePending = false;
      setDetailLikeButtonsDisabled(false);
    }
  };

  const toggleDetailCommentReaction = async (commentId) => {
    if (!canInteract) return;
    const safeCommentId = Number.parseInt(String(commentId || ''), 10);
    if (!Number.isInteger(safeCommentId) || safeCommentId <= 0) return;
    const pendingKey = 'detail:' + safeCommentId;
    if (commentReactionPending.has(pendingKey)) return;
    const post = Number.isInteger(detailPostId) && detailPostId > 0 ? getPostById(detailPostId) : null;
    if (!post) return;

    const comment = findCommentById(post.comments, safeCommentId);
    if (!comment) return;
    commentReactionPending.add(pendingKey);

    const previousLiked = Boolean(comment.likedByViewer);
    const previousCount = Math.max(0, Number(comment.reactionCount || 0));
    const optimisticLiked = !previousLiked;
    const optimisticCount = Math.max(0, previousCount + (optimisticLiked ? 1 : -1));
    comment.likedByViewer = optimisticLiked;
    comment.reactionCount = optimisticCount;
    updateCommentReactionUi({
      commentId: safeCommentId,
      liked: optimisticLiked,
      reactionCount: optimisticCount,
      actionNames: ['detail-toggle-comment-reaction'],
      roots: [detailPostShell, rightRail],
    });
    if (optimisticLiked && !previousLiked) {
      animateCommentReactionIcon({
        commentId: safeCommentId,
        actionNames: ['detail-toggle-comment-reaction'],
        roots: [detailPostShell, rightRail],
      });
    }

    try {
      const response = await fetch('/api/social/comments/' + encodeURIComponent(safeCommentId) + '/reactions', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || await readErrorMessage(response, 'Unable to react'));
      const nextLiked = typeof result?.liked === 'boolean' ? result.liked : optimisticLiked;
      const delta = nextLiked === previousLiked ? 0 : (nextLiked ? 1 : -1);
      comment.likedByViewer = nextLiked;
      comment.reactionCount = Math.max(0, previousCount + delta);
      updateCommentReactionUi({
        commentId: safeCommentId,
        liked: nextLiked,
        reactionCount: comment.reactionCount,
        actionNames: ['detail-toggle-comment-reaction'],
        roots: [detailPostShell, rightRail],
      });
      if (nextLiked && !previousLiked) {
        animateCommentReactionIcon({
          commentId: safeCommentId,
          actionNames: ['detail-toggle-comment-reaction'],
          roots: [detailPostShell, rightRail],
        });
      }
      setStatus('');
    } catch (error) {
      comment.likedByViewer = previousLiked;
      comment.reactionCount = previousCount;
      updateCommentReactionUi({
        commentId: safeCommentId,
        liked: previousLiked,
        reactionCount: previousCount,
        actionNames: ['detail-toggle-comment-reaction'],
        roots: [detailPostShell, rightRail],
      });
      if (error?.name !== 'AbortError') {
        setStatus(error instanceof Error ? error.message : 'Unable to react');
      }
    } finally {
      commentReactionPending.delete(pendingKey);
    }
  };

  const toggleModalCommentReaction = async (postId, commentId) => {
    if (!canInteract) return;
    const safePostId = Number.parseInt(String(postId || ''), 10);
    const safeCommentId = Number.parseInt(String(commentId || ''), 10);
    if (!Number.isInteger(safePostId) || safePostId <= 0 || !Number.isInteger(safeCommentId) || safeCommentId <= 0) return;
    const pendingKey = 'modal:' + safeCommentId;
    if (commentReactionPending.has(pendingKey)) return;
    const post = getPostById(safePostId);
    if (!post) return;
    const comment = findCommentById(post.comments, safeCommentId);
    if (!comment) return;
    commentReactionPending.add(pendingKey);

    const previousLiked = Boolean(comment.likedByViewer);
    const previousCount = Math.max(0, Number(comment.reactionCount || 0));
    const optimisticLiked = !previousLiked;
    comment.likedByViewer = optimisticLiked;
    comment.reactionCount = Math.max(0, previousCount + (optimisticLiked ? 1 : -1));
    updateCommentReactionUi({
      commentId: safeCommentId,
      liked: optimisticLiked,
      reactionCount: comment.reactionCount,
      actionNames: ['modal-toggle-comment-reaction'],
      roots: [modalContent],
    });
    if (optimisticLiked && !previousLiked) {
      animateCommentReactionIcon({
        commentId: safeCommentId,
        actionNames: ['modal-toggle-comment-reaction'],
        roots: [modalContent],
      });
    }

    try {
      const response = await fetch('/api/social/comments/' + encodeURIComponent(safeCommentId) + '/reactions', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || await readErrorMessage(response, 'Unable to react'));
      const nextLiked = typeof result?.liked === 'boolean' ? result.liked : optimisticLiked;
      const delta = nextLiked === previousLiked ? 0 : (nextLiked ? 1 : -1);
      comment.likedByViewer = nextLiked;
      comment.reactionCount = Math.max(0, previousCount + delta);
      updateCommentReactionUi({
        commentId: safeCommentId,
        liked: nextLiked,
        reactionCount: comment.reactionCount,
        actionNames: ['modal-toggle-comment-reaction'],
        roots: [modalContent],
      });
      if (nextLiked && !previousLiked) {
        animateCommentReactionIcon({
          commentId: safeCommentId,
          actionNames: ['modal-toggle-comment-reaction'],
          roots: [modalContent],
        });
      }
      setStatus('');
    } catch (error) {
      comment.likedByViewer = previousLiked;
      comment.reactionCount = previousCount;
      updateCommentReactionUi({
        commentId: safeCommentId,
        liked: previousLiked,
        reactionCount: previousCount,
        actionNames: ['modal-toggle-comment-reaction'],
        roots: [modalContent],
      });
      if (error?.name !== 'AbortError') {
        setStatus(error instanceof Error ? error.message : 'Unable to react');
      }
    } finally {
      commentReactionPending.delete(pendingKey);
    }
  };

  const submitModalComment = async (event) => {
    event.preventDefault();
    if (!canInteract) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const action = String(form.getAttribute('data-action') || '');
    if (!['modal-comment', 'modal-comment-reply'].includes(action)) return;

    const postCard = form.closest('.post-card');
    const postId = postCard?.getAttribute('data-post-id') || '';
    const safePostId = Number.parseInt(String(postId || ''), 10);
    if (!Number.isInteger(safePostId) || safePostId <= 0) return;
    const input = form.querySelector('input[name="comment"]');
    if (!(input instanceof HTMLInputElement)) return;
    const text = String(input.value || '').trim();
    if (!text) return;
    const replyTargetId = action === 'modal-comment-reply'
      ? Number.parseInt(String(form.getAttribute('data-comment-id') || ''), 10)
      : 0;

    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(safePostId) + '/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(replyTargetId > 0 ? { text, parentCommentId: replyTargetId } : { text }),
      });
      if (!response.ok) {
        setStatus(await readErrorMessage(response, 'Unable to comment'));
        return;
      }
      input.value = '';
      if (replyTargetId > 0) activeModalReplyCommentId = 0;
      await refreshPostState(safePostId, { focusComment: action === 'modal-comment' });
    } catch {
      setStatus('Unable to comment');
    }
  };

  const submitDetailComment = async (event) => {
    event.preventDefault();
    if (!canInteract || !Number.isInteger(detailPostId) || detailPostId <= 0) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const inlineInput = form.querySelector('input[name="comment"]');
    const input = inlineInput instanceof HTMLInputElement
      ? inlineInput
      : (detailCommentInput instanceof HTMLInputElement ? detailCommentInput : null);
    if (!(input instanceof HTMLInputElement)) return;
    const text = String(input.value || '').trim();
    if (!text) return;
    const action = String(form.getAttribute('data-action') || '');
    const replyTargetId = action === 'detail-comment-reply'
      ? Number.parseInt(String(form.getAttribute('data-comment-id') || ''), 10)
      : 0;

    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(detailPostId) + '/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(replyTargetId > 0 ? { text, parentCommentId: replyTargetId } : { text }),
      });
      if (!response.ok) {
        setStatus(await readErrorMessage(response, 'Unable to comment'));
        return;
      }
      input.value = '';
      if (replyTargetId > 0) activeDetailReplyCommentId = 0;
      await loadDetailPost({ focusComment: action !== 'detail-comment-reply' });
    } catch {
      setStatus('Unable to comment');
    }
  };

  if (feed) {
    feed.addEventListener('click', onSocialClick, { signal });
    feed.addEventListener('submit', onSocialSubmit, { signal });
    observeFeedEnd();
    loadFeed({ reset: true }).catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load community feed'));
  }

  if (postModal) {
    postModal.addEventListener('click', onSocialClick, { signal });
    postModal.addEventListener('submit', onSocialSubmit, { signal });
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('social-modal-open')) {
      closePostModal();
      return;
    }
    if (event.key === 'Escape' && socialHeaderSearchRoot instanceof HTMLElement && socialHeaderSearchRoot.classList.contains('is-open')) {
      closeHeaderSearchDropdown();
      const hasQuery = socialHeaderSearchInput instanceof HTMLInputElement
        ? Boolean(normalizeSearchQuery(socialHeaderSearchInput.value))
        : false;
      if (!headerSearchPinned && !hasQuery) {
        setHeaderSearchOpen(false);
      }
    }
  }, { signal });

  if (createForm) createForm.addEventListener('submit', submitPost, { signal });
  if (openPostImagePicker && postImage) {
    openPostImagePicker.addEventListener('click', () => {
      if (submitPostButton?.disabled) return;
      setComposerExpanded(true);
      postImage.click();
    }, { signal });
  }

  if (postImage) {
    postImage.addEventListener('change', () => {
      addSelectedPostImages(postImage.files);
    }, { signal });
  }

  if (previewWrap) {
    previewWrap.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const removeButton = target.closest('[data-action="remove-selected-image"]');
      if (!removeButton) return;
      const index = removeButton.getAttribute('data-image-index');
      removeSelectedPostImage(index);
    }, { signal });
  }

  if (socialHeaderSearchRoot instanceof HTMLElement && socialHeaderSearchToggle instanceof HTMLButtonElement) {
    if (!headerSearchPinned) {
      setHeaderSearchOpen(false);
    } else {
      setHeaderSearchOpen(true);
    }

    socialHeaderSearchToggle.addEventListener('click', (event) => {
      event.preventDefault();
      if (headerSearchPinned) {
        setHeaderSearchOpen(true, { focus: true });
        return;
      }
      const isOpen = socialHeaderSearchRoot.classList.contains('is-open');
      const hasQuery = socialHeaderSearchInput instanceof HTMLInputElement
        ? Boolean(normalizeSearchQuery(socialHeaderSearchInput.value))
        : false;
      if (isOpen && !hasQuery) {
        setHeaderSearchOpen(false);
        return;
      }
      setHeaderSearchOpen(true, { focus: true });
    }, { signal });

    if (isDesktopViewport()) {
      socialHeaderSearchRoot.addEventListener('pointerenter', () => {
        if (headerSearchPinned) return;
        setHeaderSearchOpen(true);
      }, { signal });
      socialHeaderSearchRoot.addEventListener('pointerleave', () => {
        if (headerSearchPinned) return;
        const hasFocus = socialHeaderSearchRoot.matches(':focus-within');
        const hasQuery = socialHeaderSearchInput instanceof HTMLInputElement
          ? Boolean(normalizeSearchQuery(socialHeaderSearchInput.value))
          : false;
        if (!hasFocus && !hasQuery) setHeaderSearchOpen(false);
      }, { signal });
    }
  }

  if (socialHeaderSearchInput instanceof HTMLInputElement) {
    if (!normalizeSearchQuery(socialHeaderSearchInput.value) && initialSearchQuery) {
      socialHeaderSearchInput.value = initialSearchQuery;
    }
    setHeaderSearchClearVisibility();

    socialHeaderSearchInput.addEventListener('input', () => {
      setHeaderSearchOpen(true);
      setHeaderSearchClearVisibility();
      if (mode === 'search') {
        const nextPath = buildSocialSearchPath(socialHeaderSearchInput.value);
        const currentPath = window.location.pathname + window.location.search;
        if (nextPath !== currentPath) window.history.replaceState(null, '', nextPath);
      }
      if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
      searchDebounceTimer = window.setTimeout(() => {
        runHeaderSearch(socialHeaderSearchInput.value).catch(() => {});
      }, 260);
    }, { signal });

    socialHeaderSearchInput.addEventListener('focus', () => {
      setHeaderSearchOpen(true);
      if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
      searchDebounceTimer = window.setTimeout(() => {
        runHeaderSearch(socialHeaderSearchInput.value).catch(() => {});
      }, 120);
    }, { signal });

    socialHeaderSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeHeaderSearchDropdown();
        const hasQuery = Boolean(normalizeSearchQuery(socialHeaderSearchInput.value));
        if (!headerSearchPinned && !hasQuery) {
          setHeaderSearchOpen(false);
        }
      }
    }, { signal });
  }

  if (socialHeaderSearchClear instanceof HTMLButtonElement && socialHeaderSearchInput instanceof HTMLInputElement) {
    socialHeaderSearchClear.addEventListener('click', () => {
      socialHeaderSearchInput.value = '';
      setHeaderSearchClearVisibility();
      closeHeaderSearchDropdown();
      if (mode === 'search') {
        const nextPath = buildSocialSearchPath('');
        const currentPath = window.location.pathname + window.location.search;
        if (nextPath !== currentPath) window.history.replaceState(null, '', nextPath);
        loadSearchPageResults('').catch(() => {});
      }
      if (!headerSearchPinned) {
        setHeaderSearchOpen(false);
      } else {
        setHeaderSearchOpen(true, { focus: true });
      }
    }, { signal });
  }

  if (socialHeaderSearchForm instanceof HTMLFormElement && socialHeaderSearchInput instanceof HTMLInputElement) {
    socialHeaderSearchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const safeQuery = normalizeSearchQuery(socialHeaderSearchInput.value);
      const nextPath = buildSocialSearchPath(safeQuery);
      closeHeaderSearchDropdown();
      if (mode === 'search') {
        const currentPath = window.location.pathname + window.location.search;
        if (nextPath !== currentPath) {
          window.history.replaceState(null, '', nextPath);
        }
        headerSearchPinned = true;
        setHeaderSearchOpen(true);
        loadSearchPageResults(safeQuery).catch(() => {});
        return;
      }
      navigateToSocialPath(nextPath);
    }, { signal });
  }

  if (socialHeaderSearchDropdown instanceof HTMLElement) {
    socialHeaderSearchDropdown.addEventListener('click', () => {
      closeHeaderSearchDropdown();
    }, { signal });
  }

  document.addEventListener('pointerdown', (event) => {
    if (!(socialHeaderSearchRoot instanceof Element)) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (socialHeaderSearchRoot.contains(target)) return;
    closeHeaderSearchDropdown();
    if (!headerSearchPinned) setHeaderSearchOpen(false);
  }, { signal });

  const onDetailInteractionsClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const inlineLike = target.closest('[data-action="detail-like-inline"]');
    if (inlineLike) {
      event.preventDefault();
      toggleDetailLike();
      return;
    }

    const commentReactionButton = target.closest('[data-action="detail-toggle-comment-reaction"]');
    if (commentReactionButton) {
      event.preventDefault();
      toggleDetailCommentReaction(commentReactionButton.getAttribute('data-comment-id'));
      return;
    }

    const replyToggle = target.closest('[data-action="detail-toggle-comment-reply"]');
    if (replyToggle) {
      event.preventDefault();
      setActiveDetailReplyComment(replyToggle.getAttribute('data-comment-id'), { focus: true });
      return;
    }

    const prev = target.closest('[data-action="detail-prev-image"]');
    if (prev) {
      event.preventDefault();
      cycleDetailImage(-1);
      return;
    }

    const next = target.closest('[data-action="detail-next-image"]');
    if (next) {
      event.preventDefault();
      cycleDetailImage(1);
    }
  };

  const onDetailInteractionsSubmit = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) return;
    const action = String(target.getAttribute('data-action') || '');
    if (!['detail-comment', 'detail-comment-inline', 'detail-comment-reply'].includes(action)) return;
    submitDetailComment(event);
  };

  if (mode === 'post' && Number.isInteger(detailPostId) && detailPostId > 0) {
    loadDetailPost({ focusComment: focusComposer }).catch(() => {});
    if (detailPostShell) {
      detailPostShell.addEventListener('click', onDetailInteractionsClick, { signal });
      detailPostShell.addEventListener('submit', onDetailInteractionsSubmit, { signal });
    }
    if (rightRail) {
      rightRail.addEventListener('click', onDetailInteractionsClick, { signal });
      rightRail.addEventListener('submit', onDetailInteractionsSubmit, { signal });
    }
    if (detailLikeButton) {
      detailLikeButton.addEventListener('click', () => {
        toggleDetailLike();
      }, { signal });
    }
  }

  if (mode === 'search') {
    headerSearchPinned = true;
    setHeaderSearchOpen(true);
    const sourceQuery = normalizeSearchQuery((socialHeaderSearchInput instanceof HTMLInputElement ? socialHeaderSearchInput.value : '') || initialSearchQuery);
    loadSearchPageResults(sourceQuery).catch(() => {});
  }
})();
`;
