const encoder = new TextEncoder();

const toBase64 = (buffer: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const fromBase64 = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const PBKDF2_ITERATIONS = 60000;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PBKDF2_ITERATIONS,
    },
    keyMaterial,
    256,
  );

  return `${toBase64(salt)}:${toBase64(derivedBits)}`;
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [saltBase64, hashBase64] = stored.split(":");
  if (!saltBase64 || !hashBase64) {
    return false;
  }

  const salt = fromBase64(saltBase64);
  const expectedHash = fromBase64(hashBase64);
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PBKDF2_ITERATIONS,
    },
    keyMaterial,
    256,
  );

  const derivedBytes = new Uint8Array(derivedBits);
  if (derivedBytes.length !== expectedHash.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < derivedBytes.length; index += 1) {
    mismatch |= derivedBytes[index] ^ expectedHash[index];
  }

  return mismatch === 0;
};
