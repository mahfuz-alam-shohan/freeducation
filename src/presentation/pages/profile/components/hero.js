import { PROFILE_ICONS } from "./icons.js";

export function renderProfileHero(user, options = {}) {
  const readOnly = Boolean(options.readOnly);
  const initials = (user?.name || "A").slice(0, 2).toUpperCase();
  const name = user?.name || "User";
  const role = user?.user_type || "User";
  const viewBadge = readOnly
    ? `<p class="profile-viewing-badge" aria-label="Viewing profile">Viewing: ${name}</p>`
    : "";

  return `<article class="profile-hero">${viewBadge}<div id="coverPanel" class="profile-cover" aria-label="Cover photo"><img id="coverImage" class="profile-cover-image" alt="Cover" hidden /><button id="coverAction" class="profile-image-action profile-image-action-cover" type="button" aria-label="Change cover photo" title="Change cover photo">${PROFILE_ICONS.camera}</button><div id="coverUploadProgress" class="profile-media-progress" hidden><p id="coverUploadText">Preparing upload...</p><div class="profile-media-progress-track"><span id="coverUploadBar"></span></div></div></div><div class="profile-head"><div id="avatarPanel" class="profile-avatar-wrap" aria-label="Profile photo"><img id="avatarImage" class="profile-avatar-image" alt="Profile" hidden /><span id="avatarFallback" class="profile-avatar-fallback">${initials}</span><button id="avatarAction" class="profile-image-action profile-image-action-avatar" type="button" aria-label="Change profile photo" title="Change profile photo">${PROFILE_ICONS.camera}</button><div id="avatarUploadProgress" class="profile-media-progress profile-media-progress-avatar" hidden><p id="avatarUploadText">Preparing upload...</p><div class="profile-media-progress-track"><span id="avatarUploadBar"></span></div></div></div><div class="profile-title"><h1 id="profileTitleName">${name}</h1><p>${role}</p></div></div><div id="imageActionMenu" class="profile-image-menu" role="menu" hidden><button id="viewImageButton" class="profile-menu-btn" type="button" role="menuitem">View picture</button><button id="changeImageButton" class="profile-menu-btn" type="button" role="menuitem">Upload picture</button></div><input id="imageUploadInput" type="file" accept="image/png,image/jpeg,image/webp" hidden /></article>`;
}
