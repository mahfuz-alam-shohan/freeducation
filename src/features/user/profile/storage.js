export async function putProfileImageToStorage(env, { binary, contentType, objectKey }) {
  await env.BUCKET.put(objectKey, binary, {
    httpMetadata: { contentType, cacheControl: "public, max-age=604800" },
  });
}

export function imageResponse(object, maxAge = "public, max-age=604800") {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || maxAge);
  return new Response(object.body, { headers });
}
