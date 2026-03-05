export const SITE_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Freeducation favicon">
  <defs>
    <linearGradient id="freeduFaviconGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#2f8cff" />
      <stop offset="100%" stop-color="#133764" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#freeduFaviconGradient)" />
  <text x="32" y="42" text-anchor="middle" font-family="Segoe Script, Bradley Hand, Lucida Handwriting, Comic Sans MS, cursive" font-size="36" font-weight="600" fill="#ffffff">F</text>
</svg>`;

export function faviconResponse() {
  return new Response(SITE_FAVICON_SVG, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
