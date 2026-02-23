export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-cache, max-age=0, must-revalidate",
      ...headers,
    },
  });
}

export function html(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-cache, max-age=0, must-revalidate",
      ...headers,
    },
  });
}

export function redirect(location, headers = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, ...headers },
  });
}
