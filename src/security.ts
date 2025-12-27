const encoder = new TextEncoder();

export const hashPassword = async (password: string, salt: string) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );
  return bufferToHex(bits);
};

export const createPasswordHash = async (password: string) => {
  const salt = randomToken(16);
  const derived = await hashPassword(password, salt);
  return `${salt}:${derived}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = await hashPassword(password, salt);
  const hashBytes = encoder.encode(hash);
  const derivedBytes = encoder.encode(derived);
  if (hashBytes.length !== derivedBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < hashBytes.length; i += 1) {
    diff |= hashBytes[i] ^ derivedBytes[i];
  }
  return diff === 0;
};

export const randomToken = (length = 32) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
};

export const sha256 = async (value: string) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bufferToHex(hashBuffer);
};

const bufferToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
