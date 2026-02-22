const ITERATIONS = 100000;
const HASH_LENGTH = 32;

function bytesToBase64(bytes) {
  let s = "";
  const view = new Uint8Array(bytes);
  for (const b of view) s += String.fromCharCode(b);
  return btoa(s);
}

function base64ToBytes(base64) {
  const raw = atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: ITERATIONS,
    },
    keyMaterial,
    HASH_LENGTH * 8,
  );

  return {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(bits),
    iterations: ITERATIONS,
  };
}

export async function verifyPassword(password, stored) {
  const salt = base64ToBytes(stored.salt);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const safeIterations = Math.min(Number(stored.iterations || 0), ITERATIONS);
  if (!Number.isFinite(safeIterations) || safeIterations < 1) return false;

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: safeIterations,
    },
    keyMaterial,
    HASH_LENGTH * 8,
  );

  const actual = new Uint8Array(bits);
  const expected = base64ToBytes(stored.hash);
  if (actual.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < actual.length; i += 1) mismatch |= actual[i] ^ expected[i];
  return mismatch === 0;
}
