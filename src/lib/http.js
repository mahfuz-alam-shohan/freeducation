function redirect(location) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
    },
  });
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}

export { htmlResponse, redirect };
