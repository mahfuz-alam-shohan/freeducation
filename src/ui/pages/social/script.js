export const SOCIAL_SCRIPT = `
(() => {
  const page = document.querySelector('.social-page');
  if (!page) return;

  const mode = page.dataset.mode || 'feed';
  const canInteract = page.dataset.canInteract === '1';
  const status = document.getElementById('socialStatus');
  const feed = document.getElementById('socialFeed');

  const createForm = document.getElementById('createPostForm');
  const postText = document.getElementById('postText');
  const postImage = document.getElementById('postImage');
  const previewWrap = document.getElementById('imagePreviewWrap');
  const previewImage = document.getElementById('imagePreview');
  const clearImageButton = document.getElementById('clearImageButton');
  const submitPostButton = document.getElementById('submitPostButton');
  const uploadProgressWrap = document.getElementById('uploadProgressWrap');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadProgressValue = document.getElementById('uploadProgressValue');

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

  const compressImageToDataUrl = async (file, onProgress) => {
    if (!file) return '';

    const bitmap = await createImageBitmap(file);
    const maxSide = 1280;
    const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * ratio));
    const height = Math.max(1, Math.round(bitmap.height * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const targetBytes = 260000;
    let quality = 0.68;
    let bestDataUrl = '';

    for (let attempt = 0; attempt < 7; attempt += 1) {
      const testQuality = Math.max(0.22, quality - attempt * 0.08);
      const dataUrl = canvas.toDataURL('image/jpeg', testQuality);
      const estimatedBytes = Math.floor((dataUrl.length * 3) / 4);
      bestDataUrl = dataUrl;
      if (typeof onProgress === 'function') {
        onProgress(Math.min(92, 40 + attempt * 8));
      }
      if (estimatedBytes <= targetBytes || testQuality <= 0.24) break;
    }

    return bestDataUrl;
  };

  const updatePreview = async () => {
    if (!postImage || !previewWrap || !previewImage) return;
    const file = postImage.files?.[0];
    if (!file) {
      previewImage.removeAttribute('src');
      previewWrap.hidden = true;
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewImage.src = objectUrl;
    previewWrap.hidden = false;
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
    if (!feed) return;
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
      if (submitPostButton) submitPostButton.disabled = true;
      setStatus('Preparing post image...');
      setProgress(10);

      const file = postImage?.files?.[0];
      const imageData = await compressImageToDataUrl(file, setProgress);
      setProgress(95);

      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: postText?.value || '', imageData }),
      });

      if (!response.ok) {
        setStatus(await readErrorMessage(response, 'Unable to post'));
        return;
      }

      setProgress(100);
      setStatus('Post created. Redirecting...');
      window.setTimeout(() => {
        window.location.assign('/social');
      }, 350);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to post');
      resetProgress();
    } finally {
      if (submitPostButton) submitPostButton.disabled = false;
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

  if (mode === 'feed') {
    if (feed) {
      feed.addEventListener('click', onFeedAction);
      feed.addEventListener('submit', onFeedAction);
      loadFeed().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load community feed'));
    }
    return;
  }

  if (mode === 'create') {
    if (createForm) createForm.addEventListener('submit', submitPost);
    if (postImage) postImage.addEventListener('change', updatePreview);
    if (clearImageButton) {
      clearImageButton.addEventListener('click', () => {
        if (postImage) postImage.value = '';
        updatePreview();
      });
    }
  }
})();
`;
