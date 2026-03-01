export function htmlRedirect(location) {
  return new Response(null, { status: 302, headers: { location } });
}
