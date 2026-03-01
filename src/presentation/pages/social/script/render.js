export const SOCIAL_SCRIPT_RENDER = `
  const postUi = window.__socialPostUi;
  const profileHrefForAuthor = (author) => {
    const authorId = Number(author?.id || 0);
    return authorId > 0 ? '/profile/' + authorId + '?from=social' : '';
  };

  const renderAvatar = (author) => {
    if (!postUi?.renderAvatar) return '';
    return postUi.renderAvatar(author, { profileHrefForAuthor });
  };

  const renderComments = (comments) => {
    if (!postUi?.renderComments) return '<p class="comment-empty">No comments yet.</p>';
    return postUi.renderComments(comments);
  };

  const renderCommentComposer = () => {
    if (!postUi?.renderCommentComposer) return '';
    return postUi.renderCommentComposer({ canInteract, formAction: 'comment' });
  };

  const renderSocialSearchItem = (profile, options = {}) => {
    const id = Number(profile?.id || 0);
    if (!id) return '';
    const rawName = String(profile?.name || 'User');
    const name = escapeHtml(rawName);
    const role = escapeHtml(profile?.userType || profile?.role || '');
    const email = escapeHtml(profile?.email || '');
    const profileUrl = escapeHtml(profile?.profileUrl || ('/profile/' + id + '?from=social'));
    const avatarUrl = String(profile?.avatarUrl || '').trim();
    const avatarInitial = escapeHtml(rawName.slice(0, 1).toUpperCase() || 'U');
    const avatarMarkup = avatarUrl
      ? '<span class="avatar"><img src="' + escapeHtml(avatarUrl) + '" alt="' + name + ' avatar" loading="lazy"></span>'
      : '<span class="avatar">' + avatarInitial + '</span>';
    const compactClass = options?.compact ? ' social-profile-search-item-compact' : '';
    const subtitle = role && email ? (role + ' · ' + email) : (role || email || 'Profile');
    return '<a class="social-profile-search-item' + compactClass + '" href="' + profileUrl + '" data-action="social-open-profile" data-profile-id="' + id + '">' +
      '<span class="social-profile-search-avatar">' + avatarMarkup + '</span>' +
      '<span class="social-profile-search-text">' +
        '<span class="social-profile-search-name">' + name + '</span>' +
        '<span class="social-profile-search-subtitle">' + subtitle + '</span>' +
      '</span>' +
    '</a>';
  };

  const renderSocialSearchList = (profiles, options = {}) => {
    const list = Array.isArray(profiles) ? profiles : [];
    if (!list.length) {
      return '<p class="social-profile-search-empty">' + escapeHtml(options?.emptyMessage || 'No profiles found.') + '</p>';
    }
    const items = list
      .map((profile) => renderSocialSearchItem(profile, options))
      .filter((markup) => Boolean(String(markup || '').trim()));
    if (!items.length) {
      return '<p class="social-profile-search-empty">' + escapeHtml(options?.emptyMessage || 'No matches found.') + '</p>';
    }
    return '<div class="social-profile-search-list">' + items.join('') + '</div>';
  };

  const renderThreadedComments = (comments, options = {}) => {
    const list = Array.isArray(comments) ? comments : [];
    if (!list.length) return '<p class="comment-empty">No comments yet.</p>';
    const scope = options?.scope === 'modal' ? 'modal' : 'detail';
    const activeReplyCommentId = Math.max(0, Number(options?.activeReplyCommentId || 0));
    const reactionAction = scope === 'modal' ? 'modal-toggle-comment-reaction' : 'detail-toggle-comment-reaction';
    const replyToggleAction = scope === 'modal' ? 'modal-toggle-comment-reply' : 'detail-toggle-comment-reply';
    const replyFormAction = scope === 'modal' ? 'modal-comment-reply' : 'detail-comment-reply';
    const likeIcon = '<svg class="post-like-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3C7.2 16.7 4 13.8 4 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.9c0 3.5-3.2 6.4-8 10z"></path></svg>';
    const renderCommentItem = (comment, depth = 0) => {
      const commentId = Number(comment?.id || 0);
      const reactionCount = Math.max(0, Number(comment?.reactionCount || 0));
      const isLiked = Boolean(comment?.likedByViewer);
      const avatarInitial = escapeHtml((comment?.author?.name || 'U').slice(0, 1).toUpperCase());
      const avatarUrl = String(comment?.author?.avatarUrl || '').trim();
      const avatarClass = avatarUrl ? 'social-detail-comment-avatar has-image' : 'social-detail-comment-avatar';
      const authorName = escapeHtml(comment?.author?.name || 'User');
      const replyList = Array.isArray(comment?.replies) ? comment.replies : [];
      const replyThread = depth === 0 && replyList.length
        ? '<div class="social-detail-comment-replies">' + replyList.map((reply) => renderCommentItem(reply, 1)).join('') + '</div>'
        : '';
      const reactionClass = isLiked ? 'social-detail-comment-react is-liked' : 'social-detail-comment-react';
      const replyToggle = canInteract && commentId > 0
        ? '<button class="social-detail-comment-reply-toggle" type="button" data-action="' + replyToggleAction + '" data-comment-id="' + commentId + '">Reply</button>'
        : '';
      const isReplyOpen = canInteract && commentId > 0 && activeReplyCommentId === commentId;
      const replyForm = isReplyOpen
        ? '<form class="social-detail-comment-reply-form" data-action="' + replyFormAction + '" data-comment-id="' + commentId + '"><input type="text" maxlength="600" name="comment" placeholder="Reply"><button type="submit">Reply</button></form>'
        : '';
      const imageMarkup = avatarUrl
        ? '<img src="' + escapeHtml(avatarUrl) + '" alt="' + authorName + ' avatar" loading="lazy" onerror="this.parentElement.classList.remove(\\'has-image\\');this.remove();">'
        : '';

      return '<article class="social-detail-comment-item' + (depth > 0 ? ' is-reply' : '') + '" style="--comment-depth:' + depth + '" data-comment-id="' + commentId + '">' +
        '<div class="' + avatarClass + '" data-initial="' + avatarInitial + '">' +
          imageMarkup +
        '</div>' +
        '<div class="social-detail-comment-main">' +
          '<div class="social-detail-comment-bubble">' +
            '<div class="social-detail-comment-author">' + authorName + '</div>' +
            '<div class="social-detail-comment-body">' + escapeHtml(comment?.body || '') + '</div>' +
          '</div>' +
          '<div class="social-detail-comment-actions">' +
            '<span class="social-detail-comment-time-inline">' + escapeHtml(formatTime(comment?.createdAt || '')) + '</span>' +
            replyToggle +
          '</div>' +
          replyForm +
          replyThread +
        '</div>' +
        '<div class="social-detail-comment-react-rail">' +
          '<button class="' + reactionClass + '" type="button" aria-pressed="' + (isLiked ? 'true' : 'false') + '" data-action="' + reactionAction + '" data-comment-id="' + commentId + '">' + likeIcon + '</button>' +
          '<span class="social-detail-comment-react-count">' + reactionCount + '</span>' +
        '</div>' +
      '</article>';
    };
    return list.map((comment) => renderCommentItem(comment, 0)).join('');
  };

  const renderDetailComments = (comments) => renderThreadedComments(comments, {
    scope: 'detail',
    activeReplyCommentId: activeDetailReplyCommentId,
  });

  const renderModalComments = (comments) => renderThreadedComments(comments, {
    scope: 'modal',
    activeReplyCommentId: activeModalReplyCommentId,
  });

  const renderDetailSidebarMeta = (post) => {
    if (!post || typeof post !== 'object') return '';
    const profileHref = profileHrefForAuthor(post.author);
    const authorName = escapeHtml(post.author?.name || 'User');
    const authorRole = escapeHtml(post.author?.role || '');
    const authorLine = authorRole ? (authorName + ' - ' + authorRole) : authorName;
    const authorMarkup = profileHref
      ? '<a class="social-detail-author-name" href="' + escapeHtml(profileHref) + '">' + authorLine + '</a>'
      : '<span class="social-detail-author-name">' + authorLine + '</span>';
    const bodyText = String(post.body || '').trim();

    return '<div class="social-detail-author-row">' +
      renderAvatar(post.author) +
      '<div class="social-detail-author-meta">' +
        authorMarkup +
        '<div class="social-detail-time">' + escapeHtml(formatTime(post.createdAt)) + '</div>' +
      '</div>' +
    '</div>' +
    (bodyText ? '<p class="social-detail-body">' + escapeHtml(bodyText) + '</p>' : '');
  };

  const renderDetailInlinePanel = (post) => {
    const likeCount = Number(post?.reactionCount || 0);
    const commentCount = Math.max(0, Number(post?.commentCount || (Array.isArray(post?.comments) ? post.comments.length : 0)));
    const likeLabel = post?.likedByViewer ? 'Liked' : 'Like';
    const likeClass = post?.likedByViewer ? 'social-detail-like social-like post-action-button is-liked' : 'social-detail-like social-like post-action-button';
    const disabledAttr = canInteract ? '' : ' disabled';
    const likeIcon = '<svg class="post-like-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3C7.2 16.7 4 13.8 4 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.9c0 3.5-3.2 6.4-8 10z"></path></svg>';

    return '<section class="social-detail-inline">' +
      '<div class="social-detail-post-meta social-detail-inline-meta">' + renderDetailSidebarMeta(post) + '</div>' +
      '<section class="social-detail-reaction social-detail-inline-reaction" aria-label="Post reactions">' +
        '<button class="' + likeClass + '" type="button" data-action="detail-like-inline" aria-pressed="' + (post?.likedByViewer ? 'true' : 'false') + '"' + disabledAttr + '>' + likeIcon + '<span class="post-like-label">' + likeLabel + '</span></button>' +
        '<p class="social-detail-meta">' + likeCount + ' likes ' + commentCount + ' comments</p>' +
      '</section>' +
      '<section class="social-detail-comments-wrap social-detail-inline-comments" aria-label="Post comments">' +
        '<h3 class="social-detail-comments-title">Comments</h3>' +
        '<div class="social-detail-comments" aria-live="polite">' + renderDetailComments(post?.comments) + '</div>' +
        (canInteract
          ? '<form class="social-detail-comment-form" data-action="detail-comment-inline"><input type="text" maxlength="600" name="comment" placeholder="Write a comment"><button type="submit">Comment</button></form>'
          : '<p class="social-readonly">Login required to comment or like.</p>') +
      '</section>' +
    '</section>';
  };

  const renderModalThreadPanel = (post) => {
    return '<section class="post-thread post-thread-modal">' +
      '<h3 class="social-detail-comments-title">Comments</h3>' +
      '<div class="social-detail-comments" aria-live="polite">' + renderModalComments(post?.comments) + '</div>' +
      (canInteract
        ? '<form class="social-detail-comment-form social-modal-comment-form" data-action="modal-comment"><input type="text" maxlength="600" name="comment" placeholder="Write a comment"><button type="submit">Comment</button></form>'
        : '<p class="social-readonly">Login required to comment or like.</p>') +
    '</section>';
  };

  const mediaSourcesForPost = (post) => {
    if (!postUi?.mediaSourcesForPost) return [];
    return postUi.mediaSourcesForPost(post, { isBrokenImage: isBrokenPostImage, maxImages: 3 });
  };

  const syncDetailImageQuery = () => {
    if (mode !== 'post') return;
    const params = new URLSearchParams(window.location.search);
    if (activeDetailImageIndex > 0) params.set('image', String(activeDetailImageIndex));
    else params.delete('image');
    const query = params.toString();
    const nextUrl = window.location.pathname + (query ? ('?' + query) : '');
    if (nextUrl !== (window.location.pathname + window.location.search)) {
      window.history.replaceState(null, '', nextUrl);
    }
  };

  const normalizeDetailImageIndex = (post, options = {}) => {
    const list = mediaSourcesForPost(post);
    if (!list.length) {
      activeDetailImageIndex = 0;
      syncDetailImageQuery();
      return { list, index: 0 };
    }
    const count = list.length;
    const requested = Number.isInteger(Number(options.index)) ? Number(options.index) : activeDetailImageIndex;
    const wrap = Boolean(options.wrap);
    let safeIndex = requested;
    if (wrap) {
      safeIndex = ((requested % count) + count) % count;
    } else {
      safeIndex = Math.max(0, Math.min(count - 1, requested));
    }
    if (safeIndex !== activeDetailImageIndex) {
      activeDetailImageIndex = safeIndex;
      syncDetailImageQuery();
    } else if (mode === 'post') {
      syncDetailImageQuery();
    }
    return { list, index: safeIndex };
  };

  const cycleDetailImage = (step) => {
    if (mode !== 'post' || !Number.isInteger(detailPostId) || detailPostId <= 0) return false;
    const post = getPostById(detailPostId);
    if (!post) return false;
    const normalized = normalizeDetailImageIndex(post, { index: activeDetailImageIndex + Number(step || 0), wrap: true });
    if (!normalized.list.length) return false;
    renderDetailView(post);
    return true;
  };

  const mediaMarkupForPost = (post, options = {}) => {
    const forDetail = Boolean(options.forDetail);
    const forModal = Boolean(options.forModal);
    const renderableUrls = mediaSourcesForPost(post);
    if (!renderableUrls.length) return '';

    if (forDetail) {
      const normalized = normalizeDetailImageIndex(post);
      const baseImageSrc = normalized.list[normalized.index] || '';
      const imageSrc = baseImageSrc
        ? baseImageSrc + (post.updatedAt ? (baseImageSrc.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(post.updatedAt) : '')
        : '';
      const hasMultiple = normalized.list.length > 1;
      const navControls = hasMultiple
        ? (
          '<button class="post-media-nav post-media-nav-prev" type="button" data-action="detail-prev-image" aria-label="Previous image">&#10094;</button>' +
          '<button class="post-media-nav post-media-nav-next" type="button" data-action="detail-next-image" aria-label="Next image">&#10095;</button>' +
          '<div class="post-media-counter">' + (normalized.index + 1) + ' / ' + normalized.list.length + '</div>'
        )
        : '';
      return '<div class="post-media post-media-detail">' +
        '<figure class="post-media-item post-media-item-detail">' +
          '<img class="post-image post-image-detail" src="' + escapeHtml(imageSrc) + '" data-base-src="' + escapeHtml(baseImageSrc) + '" alt="Post image" loading="lazy" decoding="async" fetchpriority="high" style="width:100%;height:100%;object-fit:scale-down;object-position:center;" onerror="markBrokenPostImage(this.dataset.baseSrc);">' +
          navControls +
        '</figure>' +
      '</div>';
    }

    const items = renderableUrls.map((baseImageSrc, imageIndex) => {
      const imageSrc = baseImageSrc
        ? baseImageSrc + (post.updatedAt ? (baseImageSrc.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(post.updatedAt) : '')
        : '';
      const imageTag = '<img class="post-image" src="' + escapeHtml(imageSrc) + '" data-base-src="' + escapeHtml(baseImageSrc) + '" alt="Post image" loading="lazy" decoding="async" fetchpriority="low" onerror="markBrokenPostImage(this.dataset.baseSrc);this.closest(\\'.post-media-item\\').style.display=\\'none\\';">';
      const detailHref = '/social/post/' + Number(post.id || 0);
      const useLink = !forDetail && !forModal && Number(post.id || 0) > 0;
      const href = detailHref + (imageIndex > 0 ? ('?image=' + imageIndex) : '');
      const mediaContent = useLink ? '<a class="post-media-link" href="' + escapeHtml(href) + '" data-action="open-post-detail" data-post-id="' + Number(post.id || 0) + '" data-image-index="' + imageIndex + '">' + imageTag + '</a>' : imageTag;
      return '<figure class="post-media-item">' + mediaContent + '</figure>';
    }).join('');

    return '<div class="post-media post-media-grid post-media-grid-' + Math.min(3, renderableUrls.length) + '">' + items + '</div>';
  };

  const renderPostCard = (post, options = {}) => {
    const forModal = Boolean(options.forModal);
    const forDetail = Boolean(options.forDetail);
    if (!forDetail && !forModal && postUi?.renderPostCard) {
      return postUi.renderPostCard(post, {
        forModal,
        canInteract,
        profileHrefForAuthor,
        isBrokenImage: isBrokenPostImage,
        brokenMarker: 'markBrokenPostImage',
        openCommentsAction: 'open-comments',
        focusCommentAction: 'focus-comment',
        toggleLikeAction: 'toggle-like',
        commentComposerAction: 'comment',
        mediaHrefForIndex: (item, imageIndex) => {
          if (forModal) return '';
          const postId = Number(item?.id || 0);
          if (postId <= 0) return '';
          return '/social/post/' + postId + (imageIndex > 0 ? ('?image=' + imageIndex) : '');
        },
      });
    }

    if (forModal) {
      const likeCount = Math.max(0, Number(post?.reactionCount || 0));
      const commentCount = Math.max(0, Number(post?.commentCount || (Array.isArray(post?.comments) ? post.comments.length : 0)));
      const likeClass = post?.likedByViewer ? 'social-like is-liked post-action-button' : 'social-like post-action-button';
      const likeLabel = post?.likedByViewer ? 'Liked' : 'Like';
      const likeDisabledAttr = canInteract ? '' : ' disabled';
      const profileHref = profileHrefForAuthor(post?.author);
      const authorName = escapeHtml(post?.author?.name || 'User');
      const authorRole = escapeHtml(post?.author?.role || '');
      const authorLine = authorRole ? (authorName + ' - ' + authorRole) : authorName;
      const authorMarkup = profileHref
        ? '<a class="post-author post-author-link post-author-link-name" href="' + escapeHtml(profileHref) + '">' + authorLine + '</a>'
        : '<span class="post-author">' + authorLine + '</span>';
      const mediaMarkup = mediaMarkupForPost(post, { forModal: true, forDetail: false });
      const likeIcon = '<svg class="post-like-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3C7.2 16.7 4 13.8 4 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.9c0 3.5-3.2 6.4-8 10z"></path></svg>';

      return '<article class="post-card post-card-modal post-card-modal-social-thread" data-post-id="' + Number(post?.id || 0) + '">' +
        '<div class="post-head">' +
          renderAvatar(post?.author) +
          '<div class="post-meta">' +
            authorMarkup +
            '<span class="post-time">' + escapeHtml(formatTime(post?.createdAt || '')) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="post-body">' + escapeHtml(post?.body || '') + '</div>' +
        mediaMarkup +
        '<div class="post-stats">' +
          '<span class="post-stat-likes">' + likeCount + ' likes</span>' +
          '<span class="post-stat-comments">' + commentCount + ' comments</span>' +
        '</div>' +
        '<div class="post-actions">' +
          '<button class="' + likeClass + '" type="button" data-action="toggle-like" aria-pressed="' + (post?.likedByViewer ? 'true' : 'false') + '"' + likeDisabledAttr + '>' + likeIcon + '<span class="post-like-label">' + likeLabel + '</span></button>' +
          '<button class="post-action-button post-action-comment" type="button" data-action="modal-focus-comment">Comment</button>' +
        '</div>' +
        renderModalThreadPanel(post) +
      '</article>';
    }

    return '<article class="post-card' + (forModal ? ' post-card-modal' : '') + '" data-post-id="' + Number(post.id) + '">' +
      '<div class="post-head">' +
        renderAvatar(post.author) +
        '<div class="post-meta">' +
          '<span class="post-author">' + escapeHtml(post.author?.name || 'User') + '</span>' +
          '<span class="post-time">' + escapeHtml(formatTime(post.createdAt)) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="post-body">' + escapeHtml(post.body || '') + '</div>' +
      mediaMarkupForPost(post, { forModal, forDetail }) +
      (forDetail ? '' : '') +
      (forModal ? '<section class="post-thread">' + renderComments(post.comments) + renderCommentComposer() + '</section>' : '') +
    '</article>';
  };

  const renderModalPost = (postId, focusComment = false) => {
    if (!modalContent) return false;
    const post = getPostById(postId);
    if (!post) return false;
    modalContent.innerHTML = renderPostCard(post, { forModal: true });
    if (focusComment && canInteract) {
      const input = modalContent.querySelector('form[data-action="modal-comment"] input[name="comment"]') || modalContent.querySelector('input[name="comment"]');
      if (input instanceof HTMLInputElement) {
        window.requestAnimationFrame(() => input.focus());
      }
    }
    return true;
  };

  const syncActiveModalPost = () => {
    if (!body.classList.contains('social-modal-open') || !activeModalPostId) return;
    const activePost = getPostById(activeModalPostId);
    if (activePost) renderModalPost(activeModalPostId);
    else closePostModal();
  };

  const renderDetailView = (post, options = {}) => {
    if (!post) return false;
    if (detailPostShell) {
      const mediaMarkup = mediaMarkupForPost(post, { forDetail: true });
      detailPostShell.innerHTML = '<article class="post-card post-card-detail-media" data-post-id="' + Number(post.id || 0) + '">' +
        (mediaMarkup || '<div class="comment-empty">No image found for this post.</div>') +
      '</article>' +
      renderDetailInlinePanel(post);
    }
    if (detailPostMeta) {
      detailPostMeta.innerHTML = renderDetailSidebarMeta(post);
    }

    const likeCount = Number(post.reactionCount || 0);
    const commentCount = Math.max(0, Number(post?.commentCount || (Array.isArray(post?.comments) ? post.comments.length : 0)));
    if (detailLikeButton) {
      detailLikeButton.classList.toggle('is-liked', Boolean(post.likedByViewer));
      detailLikeButton.setAttribute('aria-pressed', post.likedByViewer ? 'true' : 'false');
      detailLikeButton.disabled = !canInteract;
    }
    if (detailLikeLabel) {
      detailLikeLabel.textContent = post.likedByViewer ? 'Liked' : 'Like';
    }
    if (detailMeta) {
      detailMeta.textContent = likeCount + ' likes ' + commentCount + ' comments';
    }
    if (detailComments) {
      detailComments.innerHTML = renderDetailComments(post.comments);
    }
    if (options.focusComment && canInteract) {
      const inlineInput = detailPostShell?.querySelector('form[data-action="detail-comment-inline"] input[name="comment"]');
      const targetInput = inlineInput instanceof HTMLInputElement
        ? inlineInput
        : (detailCommentInput instanceof HTMLInputElement ? detailCommentInput : null);
      if (targetInput instanceof HTMLInputElement) {
        window.requestAnimationFrame(() => targetInput.focus());
      }
    }
    return true;
  };

  const loadDetailPost = async (options = {}) => {
    if (mode !== 'post' || !Number.isInteger(detailPostId) || detailPostId <= 0) return null;
    setStatus(options.message || 'Loading post...');
    try {
      const response = await fetch('/api/social/posts/' + encodeURIComponent(detailPostId), {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) {
        const errorMessage = await readErrorMessage(response, 'Unable to load post');
        throw new Error(errorMessage);
      }
      const payload = await response.json().catch(() => ({}));
      const post = payload?.post && typeof payload.post === 'object' ? payload.post : null;
      if (!post) throw new Error('Post not found');
      setFeedPosts([post], { replace: true });
      normalizeDetailImageIndex(post);
      renderDetailView(post, options);
      setStatus('');
      return post;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load post';
      setStatus(message);
      if (detailPostShell) {
        detailPostShell.innerHTML = '<article class="post-card"><p class="comment-empty">' + escapeHtml(message) + '</p></article>';
      }
      if (detailComments) detailComments.innerHTML = '';
      return null;
    }
  };

  const setFeedTailMessage = () => {
    if (!feedTail) return;
    if (feedLoadError) {
      feedTail.textContent = feedLoadError;
      return;
    }
    if (feedLoading && !feedPosts.length) {
      feedTail.textContent = 'Loading posts...';
      return;
    }
    if (feedLoading) {
      feedTail.textContent = 'Loading more posts...';
      return;
    }
    if (!feedHasMore && feedPosts.length) {
      feedTail.textContent = 'You are all caught up.';
      return;
    }
    feedTail.textContent = '';
  };

  const buildFeedPath = () => {
    const params = new URLSearchParams();
    if (scope === 'mine') params.set('scope', 'mine');
    params.set('limit', String(FEED_PAGE_LIMIT));
    params.set('maxBytes', String(FEED_PAGE_MAX_BYTES));
    if (feedNextCursor) params.set('cursor', feedNextCursor);
    return '/api/social/feed?' + params.toString();
  };

  const replaceFeedCards = (posts) => {
    if (!feed) return;
    if (posts.length) {
      feed.innerHTML = posts.map((post) => renderPostCard(post)).join('');
      return;
    }
    feed.innerHTML = '<div class="empty-feed">' + (scope === 'mine' ? "You haven't posted yet." : 'No posts yet.') + '</div>';
  };

  const appendFeedCards = (posts) => {
    if (!feed || !posts.length) return;
    const emptyNode = feed.querySelector('.empty-feed');
    if (emptyNode) emptyNode.remove();
    feed.insertAdjacentHTML('beforeend', posts.map((post) => renderPostCard(post)).join(''));
  };

  const parseFeedPagination = (payload) => {
    const pagination = payload?.pagination && typeof payload.pagination === 'object' ? payload.pagination : {};
    const cursorCandidate = typeof payload?.nextCursor === 'string'
      ? payload.nextCursor
      : (typeof pagination.nextCursor === 'string' ? pagination.nextCursor : '');
    const hasMoreCandidate = typeof payload?.hasMore === 'boolean'
      ? payload.hasMore
      : Boolean(pagination.hasMore);
    return {
      hasMore: Boolean(hasMoreCandidate && cursorCandidate),
      nextCursor: cursorCandidate,
    };
  };

  const loadFeed = async (options = {}) => {
    if (!feed) return;
    const append = Boolean(options?.append);
    const reset = Boolean(options?.reset) || !append;
    if (feedLoading) return;
    if (append && !feedHasMore) return;
    if (append && feedLoadError) return;

    feedLoading = true;
    feedLoadError = '';

    if (reset) {
      feedNextCursor = '';
      feedHasMore = true;
      feedAutoLoadArmed = false;
      setFeedPosts([], { replace: true });
      feed.innerHTML = '';
      setStatus('Loading feed...');
    }

    setFeedTailMessage();

    try {
      const requestController = new AbortController();
      const relayAbort = () => requestController.abort();
      signal.addEventListener('abort', relayAbort, { once: true });
      const timeoutId = window.setTimeout(() => {
        requestController.abort();
      }, 12000);

      const response = await fetch(buildFeedPath(), {
        headers: { accept: 'application/json' },
        signal: requestController.signal,
        cache: 'no-store',
      }).finally(() => {
        window.clearTimeout(timeoutId);
        signal.removeEventListener('abort', relayAbort);
      });
      if (!response.ok) {
        const errorMessage = await readErrorMessage(response, 'Unable to load community feed');
        throw new Error(errorMessage);
      }

      const data = await response.json().catch(() => ({}));
      const posts = Array.isArray(data.posts) ? data.posts : [];
      const pagination = parseFeedPagination(data);
      let appendedPosts = posts;

      if (reset) {
        appendedPosts = setFeedPosts(posts, { replace: true }) || [];
        replaceFeedCards(appendedPosts);
      } else if (posts.length) {
        appendedPosts = setFeedPosts(posts) || [];
        appendFeedCards(appendedPosts);
      }

      // Prevent infinite auto-load loops if server repeats the same chunk.
      if (append && posts.length > 0 && appendedPosts.length === 0) {
        feedHasMore = false;
        feedNextCursor = '';
        feedLoadError = 'Auto-loading paused to prevent repeated requests.';
        setFeedTailMessage();
        return;
      }

      if (!posts.length && append) {
        feedHasMore = false;
        feedNextCursor = '';
      } else {
        feedHasMore = pagination.hasMore;
        feedNextCursor = pagination.hasMore ? pagination.nextCursor : '';
      }

      syncActiveModalPost();
      if (reset) setStatus('');
    } catch (error) {
      if (error?.name === 'AbortError') {
        if (signal.aborted) return;
        feedLoadError = 'Feed request timed out. Scroll to retry.';
        setStatus(feedLoadError);
        return;
      }
      feedLoadError = error instanceof Error ? error.message : 'Unable to load community feed';
      setStatus(feedLoadError);
      throw error;
    } finally {
      feedLoading = false;
      setFeedTailMessage();
    }
  };

  const observeFeedEnd = () => {
    if (!feedSentinel) return;
    const armAutoLoad = () => {
      if (feedLoadError) {
        feedLoadError = '';
        setStatus('');
        setFeedTailMessage();
      }
      feedAutoLoadArmed = true;
    };

    window.addEventListener('scroll', armAutoLoad, { signal, passive: true });
    window.addEventListener('wheel', armAutoLoad, { signal, passive: true });
    window.addEventListener('touchmove', armAutoLoad, { signal, passive: true });

    const loadMore = () => {
      if (!feedHasMore || feedLoading || feedLoadError) return;
      if (!feedAutoLoadArmed) return;
      const now = Date.now();
      if (now - feedLastAutoLoadAt < 420) return;
      feedAutoLoadArmed = false;
      feedLastAutoLoadAt = now;
      loadFeed({ append: true }).catch(() => {});
    };

    if (typeof IntersectionObserver === 'function') {
      if (feedObserver) feedObserver.disconnect();
      feedObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadMore();
      }, { root: null, rootMargin: '120px 0px 180px 0px', threshold: 0.01 });
      feedObserver.observe(feedSentinel);
      return;
    }

    const onScrollFallback = () => {
      const rect = feedSentinel.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 280) loadMore();
    };

    window.addEventListener('scroll', onScrollFallback, { signal, passive: true });
    window.addEventListener('resize', onScrollFallback, { signal, passive: true });
    onScrollFallback();
  };
`;
