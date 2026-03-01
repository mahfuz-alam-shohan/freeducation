export const PROFILE_SCRIPT_POSTS_FEED_LOAD = `
const fetchMyPosts = async (options = {}) => {
  const reset = Boolean(options?.reset);
  if (myPostsLoading) return;
  if (!reset && !myPostsHasMore) return;

  myPostsLoading = true;
  setMyPostsStatus(reset ? (PROFILE_READ_ONLY ? 'Loading posts...' : 'Loading your posts...') : 'Loading more posts...');
  updateMyPostsLoadMore();

  if (reset) {
    myPostsHasMore = true;
    myPostsNextCursor = '';
  }

  try {
    const response = await fetch(buildMyPostsFeedPath(), { signal });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || 'Unable to load posts');

    const posts = Array.isArray(data.posts) ? data.posts : [];
    const hasMore = Boolean(data?.hasMore && data?.nextCursor);

    appendMyPosts(posts, reset);

    if (!posts.length && !reset) {
      myPostsHasMore = false;
      myPostsNextCursor = '';
    } else {
      myPostsHasMore = hasMore;
      myPostsNextCursor = hasMore ? String(data.nextCursor) : '';
    }

    if (!posts.length && reset) setMyPostsStatus('');
    else if (!myPostsHasMore) setMyPostsStatus('You are all caught up.');
    else setMyPostsStatus('');

    if (activeProfileModalPostId) {
      const hasActivePost = renderProfilePostModal(activeProfileModalPostId);
      if (!hasActivePost) closeProfilePostModal();
    }
  } catch (error) {
    if (error?.name === 'AbortError') return;
    if (reset) myPostsInitialized = false;
    setMyPostsStatus(error?.message || 'Unable to load posts', true);
  } finally {
    myPostsLoading = false;
    updateMyPostsLoadMore();
  }
};

ensureMyPostsLoaded = async () => {
  if (myPostsInitialized || myPostsLoading) return;
  myPostsInitialized = true;
  await fetchMyPosts({ reset: true });
};

profilePostsLoadMore.addEventListener('click', () => {
  fetchMyPosts({ reset: false });
}, { signal });

const parseLikeCount = (value) => {
  const match = String(value || '').match(/\\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
};

const updateProfileLikeUi = (postCard, liked, reactionCount) => {
  if (!postCard) return;
  const likeButton = postCard.querySelector('[data-action="toggle-profile-like"]');
  const likesLabel = postCard.querySelector('.post-stat-likes');
  if (likeButton) {
    likeButton.classList.toggle('is-liked', liked);
    likeButton.setAttribute('aria-pressed', liked ? 'true' : 'false');
    const likeLabel = likeButton.querySelector('.post-like-label');
    if (likeLabel) likeLabel.textContent = liked ? 'Liked' : 'Like';
    else likeButton.textContent = liked ? 'Liked' : 'Like';
  }
  if (likesLabel) likesLabel.textContent = Math.max(0, Number(reactionCount || 0)) + ' likes';
};
`;
