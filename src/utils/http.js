export function htmlHeaders() {
  return {
    "Content-Type": "text/html; charset=utf-8",
  };
}

export function redirect(path) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
    },
  });
}
