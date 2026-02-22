export function parseCookies(request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return {};
  return Object.fromEntries(
    cookie.split(";").map((part) => {
      const [k, ...v] = part.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );
}

export function methodNotAllowed() {
  return new Response("Method Not Allowed", { status: 405 });
}
