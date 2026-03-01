export function renderAvatarButton({ isAuthenticated, avatarVersion, avatarFallback }) {
  const label = isAuthenticated ? "Open profile" : "Open login menu";
  return `<button id="appAvatar" class="app-avatar" data-avatar-version="${avatarVersion}" aria-label="${label}" aria-expanded="false" aria-haspopup="dialog" aria-busy="false"><img id="appAvatarImage" class="app-avatar-image" alt="" hidden /><span id="appAvatarFallback" class="app-avatar-fallback">${avatarFallback}</span><span class="app-avatar-loader" aria-hidden="true"></span></button>`;
}
