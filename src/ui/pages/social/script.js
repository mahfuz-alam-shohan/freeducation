export const SOCIAL_SCRIPT = `
(() => {
  const page = document.querySelector('.social-page');
  const feed = document.getElementById('socialFeed');
  const status = document.getElementById('socialStatus');
  if (!page || !feed || !status) return;

  const canInteract = page.dataset.canInteract === '1';
  const createForm = document.getElementById('createPostForm');
  const postText = document.getElementById('postText');
  const postImage = document.getElementById('postImage');

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

  const toDataUrl = (file) => new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });

  const setStatus = (message) => {
    status.textContent = message || '';
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

  const renderAvatar = (author) => {
    const initial = escapeHtml((author?.name || 'U').slice(0, 1).toUpperCase());
    if (author?.avatarUrl) {
      return '<span class="avatar"><img src="' + escapeHtml(author.avatarUrl) + '" alt="' + escapeHtml(author.name || 'User') + ' avatar" loading="lazy"></span>';
    }
    return '<span class="avatar">' + initial + '</span>';
  };

  const renderComments = (comments) => {
    if (!comments?.length) return '';
    return '<div class="comment-list">' + comments.map((comment) => (
      '<div class="comment-item">' +
        '<div class="comment-author">' + escapeHtml(comment.author?.name || 'User') + '</div>' +
        '<div>' + escapeHtml(comment.body || '') + '</div>' +
      '</div>'
    )).join('') + '</div>';
  };

  const renderPost = (post) => {
    const imageHtml = post.imageUrl ? '<img class="post-image" src="' + escapeHtml(post.imageUrl) + '" alt="Post image" loading="lazy">' : '';
    const likeClass = post.likedByViewer ? 'social-like is-liked' : 'social-like';
    const likeLabel = post.likedByViewer ? 'Liked' : 'Like';

    return '<article class="post-card" data-post-id="' + Number(post.id) + '">' +
      '<div class="post-head">' +
        renderAvatar(post.author) +
        '<div class="post-meta">' +
          '<span class="post-author">' + escapeHtml(post.author?.name || 'User') + ' · ' + escapeHtml(post.author?.role || '') + '</span>' +
          '<span class="post-time">' + escapeHtml(formatTime(post.createdAt)) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="post-body">' + escapeHtml(post.body || '') + '</div>' +
      imageHtml +
      '<div class="post-actions">' +
        '<button class="' + likeClass + '" data-action="toggle-like">' + likeLabel + ' (' + Number(post.reactionCount || 0) + ')</button>' +
      '</div>' +
      renderComments(post.comments) +
      (canInteract
        ? '<form class="social-comment-form" data-action="comment"><input type="text" maxlength="600" name="comment" placeholder="Write a comment"><button type="submit">Comment</button></form>'
        : '') +
    '</article>';
  };

  const loadFeed = async () => {
    setStatus('Loading feed...');
    const response = await fetch('/api/social/feed');
    if (!response.ok) {
      const errorMessage = await readErrorMessage(response, 'Unable to load community feed');
      throw new Error(errorMessage);
    }

    const data = await response.json().catch(() => ({}));
    const posts = Array.isArray(data.posts) ? data.posts : [];
    feed.innerHTML = posts.length ? posts.map(renderPost).join('') : '<div class="empty-feed">No posts yet.</div>';
    setStatus('');
  };

  const submitPost = async (event) => {
    event.preventDefault();
    if (!canInteract) return;
    try {
      const file = postImage?.files?.[0];
      const imageData = await toDataUrl(file);

      setStatus('Posting...');
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: postText?.value || '', imageData }),
      });

      if (!response.ok) {
        setStatus(await readErrorMessage(response, 'Unable to post'));
        return;
      }

      if (postText) postText.value = '';
      if (postImage) postImage.value = '';
      setStatus('Post created');
      await loadFeed();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to post');
    }
  };

  const onFeedAction = async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const postCard = target.closest('.post-card');
    if (!postCard) return;
    const postId = postCard.getAttribute('data-post-id');
    if (!postId) return;

    if (target.matches('[data-action="toggle-like"]')) {
      if (!canInteract) return;
      try {
        const response = await fetch('/api/social/posts/' + encodeURIComponent(postId) + '/reactions', { method: 'POST' });
        if (!response.ok) {
          setStatus(await readErrorMessage(response, 'Unable to react'));
          return;
        }
        await loadFeed();
      } catch {
        setStatus('Unable to react');
      }
      return;
    }

    const form = target.closest('form[data-action="comment"]');
    if (form && event.type === 'submit') {
      event.preventDefault();
      if (!canInteract) return;
      const input = form.querySelector('input[name="comment"]');
      const text = input ? input.value : '';
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
        if (input) input.value = '';
        await loadFeed();
      } catch {
        setStatus('Unable to comment');
      }
    }
  };

  if (createForm) createForm.addEventListener('submit', submitPost);
  feed.addEventListener('click', onFeedAction);
  feed.addEventListener('submit', onFeedAction);

  loadFeed().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load community feed'));
})();
`;
