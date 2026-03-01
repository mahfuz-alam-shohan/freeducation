const encoder = new TextEncoder();
const PBKDF2_PRIMARY_ITERATIONS = 210_000;
const PBKDF2_FALLBACK_ITERATIONS = 100_000;

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derivePasswordBits(keyMaterial, salt, iterations) {
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );
}

function isIterationLimitError(error) {
  const detail = String(error?.message || error || "").toLowerCase();
  return detail.includes("iteration") && (detail.includes("not supported") || detail.includes("above"));
}

export async function hashPassword(password, saltBase64) {
  const salt = saltBase64 ? fromBase64(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);

  let bits;
  try {
    bits = await derivePasswordBits(keyMaterial, salt, PBKDF2_PRIMARY_ITERATIONS);
  } catch (error) {
    if (!isIterationLimitError(error)) throw error;
    bits = await derivePasswordBits(keyMaterial, salt, PBKDF2_FALLBACK_ITERATIONS);
  }

  return { salt: toBase64(salt), hash: toBase64(bits) };
}

export async function verifyPassword(password, salt, hash) {
  const derived = await hashPassword(password, salt);
  return timingSafeEqual(derived.hash, hash);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
