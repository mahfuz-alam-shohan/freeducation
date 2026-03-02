export const SOCIAL_POST_UI_SCRIPT = `
(() => {
  if (window.__socialPostUi) return;

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const formatTime = (iso) => {
    if (!iso) return 'now';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return 'now';
    return parsed.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderComments = (comments) => {
    if (!comments?.length) return '<p class="comment-empty">No comments yet.</p>';
    return '<div class="comment-list">' + comments.map((comment) => (
      '<div class="comment-item">' +
        '<div class="comment-author">' + escapeHtml(comment.author?.name || 'User') + '</div>' +
        '<div>' + escapeHtml(comment.body || '') + '</div>' +
      '</div>'
    )).join('') + '</div>';
  };

  const renderCommentComposer = (options = {}) => {
    if (!options.canInteract) return '';
    const formAction = String(options.formAction || 'comment');
    const placeholder = String(options.placeholder || 'Write a comment');
    const buttonLabel = String(options.buttonLabel || 'Comment');
    return '<form class="social-comment-form social-comment-form-modal" data-action="' + escapeHtml(formAction) + '">' +
      '<input type="text" maxlength="600" name="comment" placeholder="' + escapeHtml(placeholder) + '">' +
      '<button type="submit">' + escapeHtml(buttonLabel) + '</button>' +
    '</form>';
  };

  const renderAvatar = (author, options = {}) => {
    const profileHrefForAuthor = typeof options.profileHrefForAuthor === 'function'
      ? options.profileHrefForAuthor
      : () => '';
    const profileHref = profileHrefForAuthor(author);
    const initial = escapeHtml((author?.name || 'U').slice(0, 1).toUpperCase());
    const avatarShell = author?.avatarUrl
      ? '<span class="avatar"><img src="' + escapeHtml(author.avatarUrl) + '" alt="' + escapeHtml(author.name || 'User') + ' avatar" loading="lazy"></span>'
      : '<span class="avatar">' + initial + '</span>';
    return profileHref
      ? '<a class="post-author-link post-author-link-avatar" href="' + escapeHtml(profileHref) + '">' + avatarShell + '</a>'
      : avatarShell;
  };

  const mediaSourcesForPost = (post, options = {}) => {
    const list = Array.isArray(post?.imageUrls) ? post.imageUrls : [];
    const baseUrls = list.length ? list : (post?.imageUrl ? [post.imageUrl] : []);
    const maxImages = Number.isInteger(Number(options.maxImages)) ? Number(options.maxImages) : 3;
    const isBrokenImage = typeof options.isBrokenImage === 'function' ? options.isBrokenImage : (() => false);
    return baseUrls.filter((src) => !isBrokenImage(src)).slice(0, Math.max(1, maxImages));
  };

  const mediaMarkupForPost = (post, options = {}) => {
    const isBrokenImage = typeof options.isBrokenImage === 'function' ? options.isBrokenImage : (() => false);
    const brokenMarker = String(options.brokenMarker || 'markBrokenPostImage');
    const mediaHrefForIndex = typeof options.mediaHrefForIndex === 'function' ? options.mediaHrefForIndex : null;
    const renderableUrls = mediaSourcesForPost(post, { isBrokenImage, maxImages: options.maxImages });
    if (!renderableUrls.length) return '';

    const items = renderableUrls.map((baseImageSrc, index) => {
      const imageSrc = baseImageSrc
        ? baseImageSrc + (post?.updatedAt ? (baseImageSrc.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(post.updatedAt) : '')
        : '';
      const imageTag = '<img class="post-image" src="' + escapeHtml(imageSrc) + '" data-base-src="' + escapeHtml(baseImageSrc) + '" alt="Post image" loading="lazy" decoding="async" fetchpriority="low" onerror="' + escapeHtml(brokenMarker) + '(this.dataset.baseSrc);this.closest(\\'.post-media-item\\').style.display=\\'none\\';">';
      const href = mediaHrefForIndex ? String(mediaHrefForIndex(post, index) || '') : '';
      const content = href
        ? '<a class="post-media-link" href="' + escapeHtml(href) + '">' + imageTag + '</a>'
        : imageTag;
      return '<figure class="post-media-item">' + content + '</figure>';
    }).join('');

    return '<div class="post-media post-media-grid post-media-grid-' + Math.min(3, renderableUrls.length) + '">' + items + '</div>';
  };

  const renderPostMenu = (post) => {
    const canManage = Boolean(post?.canManage || post?.isOwner);
    if (!canManage) return '';
    const dotsIcon = '<svg class="post-ops-trigger-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="18" cy="12" r="1.8"></circle></svg>';
    const deleteIcon = '<svg class="post-ops-item-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 10v7"></path><path d="M14 10v7"></path></svg>';
    return '<div class="post-ops" data-post-ops data-open="0">' +
      '<button class="post-ops-trigger" type="button" data-action="toggle-post-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Post options">' +
        dotsIcon +
      '</button>' +
      '<div class="post-ops-menu" role="menu" hidden>' +
        '<button class="post-ops-item is-danger" type="button" data-action="delete-post" role="menuitem">' + deleteIcon + '<span>Delete post</span></button>' +
      '</div>' +
    '</div>';
  };

  const renderPostCard = (post, options = {}) => {
    const forModal = Boolean(options.forModal);
    const canInteract = Boolean(options.canInteract);
    const profileHrefForAuthor = typeof options.profileHrefForAuthor === 'function'
      ? options.profileHrefForAuthor
      : (() => '');
    const reactionCount = Math.max(0, Number(post?.reactionCount || 0));
    const commentCount = Math.max(0, Number(post?.commentCount || (Array.isArray(post?.comments) ? post.comments.length : 0)));
    const likeClass = post?.likedByViewer ? 'social-like is-liked post-action-button' : 'social-like post-action-button';
    const likeLabel = post?.likedByViewer ? 'Liked' : 'Like';
    const likeDisabledAttr = canInteract ? '' : ' disabled';
    const openCommentsAction = String(options.openCommentsAction || 'open-comments');
    const focusCommentAction = String(options.focusCommentAction || 'focus-comment');
    const toggleLikeAction = String(options.toggleLikeAction || 'toggle-like');
    const commentAction = forModal && canInteract ? focusCommentAction : openCommentsAction;
    const commentComposerAction = String(options.commentComposerAction || 'comment');
    const cardClass = String(options.cardClass || '');

    const profileHref = profileHrefForAuthor(post?.author);
    const authorName = escapeHtml(post?.author?.name || 'User');
    const authorRole = escapeHtml(post?.author?.role || '');
    const authorLine = authorRole ? (authorName + ' - ' + authorRole) : authorName;
    const authorMarkup = profileHref
      ? '<a class="post-author post-author-link post-author-link-name" href="' + escapeHtml(profileHref) + '">' + authorLine + '</a>'
      : '<span class="post-author">' + authorLine + '</span>';

    const mediaMarkup = mediaMarkupForPost(post, {
      isBrokenImage: options.isBrokenImage,
      brokenMarker: options.brokenMarker,
      mediaHrefForIndex: options.mediaHrefForIndex,
      maxImages: options.maxImages,
    });

    return '<article class="post-card' + (cardClass ? (' ' + escapeHtml(cardClass)) : '') + '" data-post-id="' + Number(post?.id || 0) + '">' +
      '<div class="post-head">' +
        renderAvatar(post?.author, { profileHrefForAuthor }) +
        '<div class="post-meta">' +
          authorMarkup +
          '<span class="post-time">' + escapeHtml(formatTime(post?.createdAt || '')) + '</span>' +
        '</div>' +
        renderPostMenu(post) +
      '</div>' +
      '<div class="post-body">' + escapeHtml(post?.body || '') + '</div>' +
      mediaMarkup +
      '<div class="post-stats">' +
        '<span class="post-stat-likes">' + reactionCount + ' likes</span>' +
        '<button class="post-stat-comments" type="button" data-action="' + escapeHtml(openCommentsAction) + '">' + commentCount + ' comments</button>' +
      '</div>' +
      '<div class="post-actions">' +
        '<button class="' + likeClass + '" type="button" data-action="' + escapeHtml(toggleLikeAction) + '" aria-pressed="' + (post?.likedByViewer ? 'true' : 'false') + '"' + likeDisabledAttr + '><svg class="post-like-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3C7.2 16.7 4 13.8 4 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.9c0 3.5-3.2 6.4-8 10z"></path></svg><span class="post-like-label">' + likeLabel + '</span></button>' +
        '<button class="post-action-button post-action-comment" type="button" data-action="' + escapeHtml(commentAction) + '">Comment</button>' +
      '</div>' +
      (forModal
        ? ('<section class="post-thread">' +
          renderComments(post?.comments) +
          renderCommentComposer({ canInteract, formAction: commentComposerAction }) +
        '</section>')
        : '') +
    '</article>';
  };

  window.__socialPostUi = {
    escapeHtml,
    formatTime,
    renderComments,
    renderCommentComposer,
    renderAvatar,
    renderPostMenu,
    mediaSourcesForPost,
    mediaMarkupForPost,
    renderPostCard,
  };
})();
`;
