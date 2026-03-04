export function renderAvatarButton({ isAuthenticated, avatarVersion, avatarFallback, href = "" }) {
  const label = isAuthenticated ? "Open profile posts" : "Go to login";
  const targetHref = String(href || "").trim() || (isAuthenticated ? "/admin/profile?tab=posts#posts" : "/login");
  return `<button id="appAvatar" class="app-avatar" data-avatar-version="${avatarVersion}" data-avatar-href="${targetHref}" aria-label="${label}" aria-busy="false"><img id="appAvatarImage" class="app-avatar-image" alt="" hidden /><span id="appAvatarFallback" class="app-avatar-fallback">${avatarFallback}</span><span class="app-avatar-loader" aria-hidden="true"></span></button>`;
}
