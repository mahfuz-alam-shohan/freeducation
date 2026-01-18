import { base64UrlDecode, base64UrlEncode, signPayload, verifySignature } from "./crypto.js";

const encoder = new TextEncoder();

async function createSessionCookie(user, secret) {
  const payload = {
    sub: user.id,
    role: user.role,
    name: user.display_name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };
  const payloadEncoded = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await signPayload(payloadEncoded, secret);
  return `${payloadEncoded}.${signature}`;
}

async function readSessionCookie(request, secret) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    })
  );
  if (!cookies.session) {
    return null;
  }
  const [payloadEncoded, signature] = cookies.session.split(".");
  if (!payloadEncoded || !signature) {
    return null;
  }
  const isValid = await verifySignature(payloadEncoded, signature, secret);
  if (!isValid) {
    return null;
  }
  const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadEncoded));
  const payload = JSON.parse(payloadJson);
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}

export { createSessionCookie, readSessionCookie };
