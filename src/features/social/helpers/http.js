export function objectToResponse(object, maxAge = "public, max-age=604800") {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || maxAge);
  return new Response(object.body, { headers });
}
