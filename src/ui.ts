export function renderLogo(size: number = 40): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="12" y1="24" x2="84" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#4338ca" />
        </linearGradient>
      </defs>
      <path d="M12 44 L48 24 L84 44 L48 64 Z" fill="url(#grad1)" />
      <path d="M20 48 L48 62 L76 48" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <circle cx="72" cy="52" r="6" fill="#f97316" />
    </svg>
  `;
}

export function escapeHtml(value: string): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function createHtmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}
