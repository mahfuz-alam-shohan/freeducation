export const PROFILE_SCRIPT_POSTS_RENDER_AND_MODAL = `
const PROFILE_POSTS_LIMIT = 8;
const PROFILE_POSTS_MAX_BYTES = 180000;
let myPostsInitialized = false;
let myPostsLoading = false;
let myPostsHasMore = true;
let myPostsNextCursor = '';
const myPostsById = new Map();
const brokenProfilePostImages = window.__socialBrokenPostImages instanceof Set ? window.__socialBrokenPostImages : new Set();
window.__socialBrokenPostImages = brokenProfilePostImages;
let activeProfileModalPostId = 0;
const profilePostModal = document.getElementById('profilePostModal');
const profilePostModalContent = document.getElementById('profilePostModalContent');
const profilePageBody = document.body;
let movedProfileModalToBody = false;
if (profilePostModal && profilePostModal.parentElement !== profilePageBody) {
  profilePageBody.appendChild(profilePostModal);
  movedProfileModalToBody = true;
}
if (typeof window.__registerCleanup === 'function') {
  window.__registerCleanup(() => {
    if (window.markBrokenProfilePostImage) delete window.markBrokenProfilePostImage;
    profilePageBody.classList.remove('profile-post-modal-open');
    if (movedProfileModalToBody && profilePostModal?.isConnected) profilePostModal.remove();
  });
}

const escapePostValue = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const markBrokenProfilePostImage = (value) => {
  const key = String(value || '').trim();
  if (!key) return;
  brokenProfilePostImages.add(key);
};
window.markBrokenProfilePostImage = markBrokenProfilePostImage;

const isBrokenProfilePostImage = (value) => {
  const key = String(value || '').trim();
  return Boolean(key) && brokenProfilePostImages.has(key);
};

const setMyPostsStatus = (message, isError = false) => {
  if (!profilePostsStatus) return;
  const text = String(message || '').trim();
  profilePostsStatus.hidden = !text;
  profilePostsStatus.textContent = text;
  profilePostsStatus.classList.toggle('is-error', Boolean(isError && text));
};

const updateMyPostsLoadMore = () => {
  if (!profilePostsLoadMore) return;
  profilePostsLoadMore.hidden = !myPostsHasMore;
  profilePostsLoadMore.disabled = myPostsLoading;
  profilePostsLoadMore.textContent = myPostsLoading ? 'Loading...' : 'Load more';
};

const profileContextFromSocial = new URLSearchParams(window.location.search).get('from') === 'social';
const profileHrefForAuthor = (author) => {
  const authorId = Number(author?.id || 0);
  return authorId > 0 ? ('/profile/' + authorId + (profileContextFromSocial ? '?from=social' : '')) : '';
};

const renderMyPostCard = (post, options = {}) => {
  const forModal = Boolean(options?.forModal);
  if (window.__socialPostUi?.renderPostCard) {
    return window.__socialPostUi.renderPostCard(post, {
      forModal,
      canInteract: PROFILE_CAN_INTERACT,
      profileHrefForAuthor,
      isBrokenImage: isBrokenProfilePostImage,
      brokenMarker: 'markBrokenProfilePostImage',
      openCommentsAction: 'open-profile-comments',
      focusCommentAction: 'focus-profile-comment',
      toggleLikeAction: 'toggle-profile-like',
      commentComposerAction: 'profile-comment',
      maxImages: 3,
      cardClass: 'profile-post-card' + (forModal ? ' profile-post-card-modal' : ''),
      mediaHrefForIndex: forModal
        ? null
        : ((item, imageIndex) => {
          const pid = Number(item?.id || 0);
          if (pid <= 0) return '';
          return '/social/post/' + pid + (imageIndex > 0 ? ('?image=' + imageIndex) : '');
        }),
    });
  }

  return '<article class="post-card profile-post-card" data-post-id="' + Number(post?.id || 0) + '"><div class="post-body">' + escapePostValue(post?.body || '') + '</div></article>';
};

const getMyPostById = (postId) => {
  const id = Number(postId || 0);
  if (!id) return null;
  return myPostsById.get(id) || null;
};

const renderProfilePostModal = (postId, focusComment = false) => {
  if (!profilePostModalContent) return false;
  const post = getMyPostById(postId);
  if (!post) return false;
  profilePostModalContent.innerHTML = renderMyPostCard(post, { forModal: true });
  if (focusComment) {
    const input = profilePostModalContent.querySelector('input[name="comment"]');
    if (input instanceof HTMLInputElement) requestAnimationFrame(() => input.focus());
  }
  return true;
};

const openProfilePostModal = (postId, focusComment = false) => {
  if (!profilePostModal || !profilePostModalContent) return false;
  const post = getMyPostById(postId);
  if (!post) return false;
  activeProfileModalPostId = Number(post.id);
  profilePostModal.setAttribute('aria-hidden', 'false');
  profilePageBody.classList.add('profile-post-modal-open');
  renderProfilePostModal(postId, focusComment);
  return true;
};

const closeProfilePostModal = () => {
  if (!profilePostModal || !profilePostModalContent) return;
  activeProfileModalPostId = 0;
  profilePostModal.setAttribute('aria-hidden', 'true');
  profilePostModalContent.innerHTML = '';
  profilePageBody.classList.remove('profile-post-modal-open');
};

const buildMyPostsFeedPath = () => {
  const params = new URLSearchParams();
  if (PROFILE_READ_ONLY && PROFILE_USER_ID > 0) {
    params.set('userId', String(PROFILE_USER_ID));
  } else {
    params.set('scope', 'mine');
  }
  params.set('limit', String(PROFILE_POSTS_LIMIT));
  params.set('maxBytes', String(PROFILE_POSTS_MAX_BYTES));
  if (myPostsNextCursor) params.set('cursor', myPostsNextCursor);
  return '/api/social/feed?' + params.toString();
};

const appendMyPosts = (posts, replace = false) => {
  if (!profilePostsList) return;
  const items = Array.isArray(posts) ? posts : [];

  if (replace) {
    profilePostsList.innerHTML = '';
    myPostsById.clear();
  }

  if (!items.length && replace) {
    profilePostsList.innerHTML = '<p class="profile-posts-empty">No posts yet.</p>';
    return;
  }

  if (!items.length) return;

  const newItems = [];
  for (const post of items) {
    const id = Number(post?.id || 0);
    if (!id) continue;
    const isExisting = myPostsById.has(id);
    myPostsById.set(id, post);
    if (!isExisting || replace) newItems.push(post);
  }

  if (!newItems.length) return;

  const emptyState = profilePostsList.querySelector('.profile-posts-empty');
  if (emptyState) emptyState.remove();
  profilePostsList.insertAdjacentHTML('beforeend', newItems.map((post) => renderMyPostCard(post)).join(''));
};
`;
