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

const setProfilePostMenuState = (menuRoot, open) => {
  if (!(menuRoot instanceof HTMLElement)) return;
  const expanded = Boolean(open);
  menuRoot.dataset.open = expanded ? '1' : '0';
  const trigger = menuRoot.querySelector('[data-action="toggle-post-menu"]');
  if (trigger instanceof HTMLElement) trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const menu = menuRoot.querySelector('.post-ops-menu');
  if (menu instanceof HTMLElement) menu.hidden = !expanded;
};

const closeAllProfilePostMenus = (exceptRoot = null) => {
  document.querySelectorAll('.post-ops[data-open="1"]').forEach((menuRoot) => {
    if (exceptRoot && menuRoot === exceptRoot) return;
    setProfilePostMenuState(menuRoot, false);
  });
};

const handleProfilePostDelete = async (postId, triggerButton) => {
  if (!postId) return;
  if (triggerButton instanceof HTMLButtonElement) triggerButton.disabled = true;
  try {
    const response = await fetch('/api/social/posts/' + encodeURIComponent(postId), { method: 'DELETE', signal });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error || 'Unable to delete post');

    const safeId = Number(postId || 0);
    if (safeId > 0) myPostsById.delete(safeId);
    if (activeProfileModalPostId && Number(activeProfileModalPostId) === safeId) closeProfilePostModal();

    setMyPostsStatus('Post deleted.');
    await fetchMyPosts({ reset: true });
  } catch (error) {
    if (error?.name === 'AbortError') return;
    setMyPostsStatus(error?.message || 'Unable to delete post', true);
  } finally {
    if (triggerButton instanceof HTMLButtonElement) triggerButton.disabled = false;
  }
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

  const menuToggleTrigger = target.closest('[data-action="toggle-post-menu"]');
  if (menuToggleTrigger) {
    event.preventDefault();
    const menuRoot = menuToggleTrigger.closest('.post-ops');
    if (!(menuRoot instanceof HTMLElement)) return;
    const shouldOpen = menuRoot.dataset.open !== '1';
    closeAllProfilePostMenus(menuRoot);
    setProfilePostMenuState(menuRoot, shouldOpen);
    return;
  }

  const deleteTrigger = target.closest('[data-action="delete-post"]');
  if (deleteTrigger instanceof HTMLButtonElement) {
    event.preventDefault();
    closeAllProfilePostMenus();
    await handleProfilePostDelete(postId, deleteTrigger);
    return;
  }

  const openCommentsTrigger = target.closest('[data-action="open-profile-comments"]');
  if (openCommentsTrigger) {
    closeAllProfilePostMenus();
    openProfilePostModal(postId, false);
    return;
  }

  const focusCommentTrigger = target.closest('[data-action="focus-profile-comment"]');
  if (focusCommentTrigger) {
    closeAllProfilePostMenus();
    openProfilePostModal(postId, true);
    return;
  }

  const toggleLikeTrigger = target.closest('[data-action="toggle-profile-like"]');
  if (toggleLikeTrigger instanceof HTMLButtonElement) {
    closeAllProfilePostMenus();
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
document.addEventListener('pointerdown', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('.post-ops')) return;
  closeAllProfilePostMenus();
}, { signal });
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profilePostModal?.getAttribute('aria-hidden') === 'false') {
    closeProfilePostModal();
  }
}, { signal });
`;
