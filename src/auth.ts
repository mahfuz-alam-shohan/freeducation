export async function hashPassword(password: string, saltHex: string) {
  const enc = new TextEncoder();
  const msgBuffer = enc.encode(password + saltHex);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
