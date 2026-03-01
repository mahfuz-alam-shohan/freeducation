export const PROFILE_SCRIPT_POSTS_INTERACTIONS = `
const handleProfilePostToggleLike = async (postCard, postId, triggerButton) => {
  if (!PROFILE_CAN_INTERACT) return;
  if (!postCard || !postId || !triggerButton) return;
  triggerButton.disabled = true;
  try {
    const response = await fetch('/api/social/posts/' + encodeURIComponent(postId) + '/reactions', { method: 'POST', signal });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error || 'Unable to react');

    const post = getMyPostById(postId);
    const previousLiked = Boolean(post?.likedByViewer);
    const nextLiked = Boolean(result?.liked);
    const currentReactionCount = Math.max(0, Number(post?.reactionCount || parseLikeCount(postCard.querySelector('.post-stat-likes')?.textContent)));
    const delta = nextLiked === previousLiked ? 0 : (nextLiked ? 1 : -1);
    const nextReactionCount = Math.max(0, currentReactionCount + delta);

    if (post) {
      post.likedByViewer = nextLiked;
      post.reactionCount = nextReactionCount;
      myPostsById.set(Number(postId), post);
    }

    updateProfileLikeUi(postCard, nextLiked, nextReactionCount);
    if (activeProfileModalPostId && Number(activeProfileModalPostId) === Number(postId)) {
      renderProfilePostModal(postId);
    }
  } catch (error) {
    if (error?.name === 'AbortError') return;
    setMyPostsStatus(error?.message || 'Unable to react', true);
  } finally {
    triggerButton.disabled = false;
  }
};

const resolveProfilePostContext = (target) => {
  const postCard = target?.closest('.post-card');
  const postId = postCard?.getAttribute('data-post-id') || '';
  return { postCard, postId };
};

const onProfilePostsClick = async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const closeModalTrigger = target.closest('[data-action="close-profile-post-modal"]');
  if (closeModalTrigger) {
    closeProfilePostModal();
    return;
  }

  const { postCard, postId } = resolveProfilePostContext(target);
  if (!postCard || !postId) return;

  const openCommentsTrigger = target.closest('[data-action="open-profile-comments"]');
  if (openCommentsTrigger) {
    openProfilePostModal(postId, false);
    return;
  }

  const focusCommentTrigger = target.closest('[data-action="focus-profile-comment"]');
  if (focusCommentTrigger) {
    openProfilePostModal(postId, true);
    return;
  }

  const toggleLikeTrigger = target.closest('[data-action="toggle-profile-like"]');
  if (toggleLikeTrigger instanceof HTMLButtonElement) {
    if (!PROFILE_CAN_INTERACT) return;
    await handleProfilePostToggleLike(postCard, postId, toggleLikeTrigger);
  }
};

const onProfilePostsSubmit = async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) return;
  if (target.getAttribute('data-action') !== 'profile-comment') return;
  if (!PROFILE_CAN_INTERACT) return;

  event.preventDefault();
  const postCard = target.closest('.post-card');
  const postId = postCard?.getAttribute('data-post-id') || '';
  const input = target.querySelector('input[name="comment"]');
  const text = input instanceof HTMLInputElement ? String(input.value || '').trim() : '';
  if (!postId || !text) return;

  try {
    const response = await fetch('/api/social/posts/' + encodeURIComponent(postId) + '/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
      signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error || 'Unable to comment');

    if (input instanceof HTMLInputElement) input.value = '';
    await fetchMyPosts({ reset: true });
    openProfilePostModal(postId, true);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    setMyPostsStatus(error?.message || 'Unable to comment', true);
  }
};

if (profilePostsList) {
  profilePostsList.addEventListener('click', onProfilePostsClick, { signal });
}
if (profilePostModal) {
  profilePostModal.addEventListener('click', onProfilePostsClick, { signal });
  profilePostModal.addEventListener('submit', onProfilePostsSubmit, { signal });
}
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profilePostModal?.getAttribute('aria-hidden') === 'false') {
    closeProfilePostModal();
  }
}, { signal });
`;
