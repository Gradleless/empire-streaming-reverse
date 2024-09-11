export async function sha256(v: string) {
  const msgBuffer = new TextEncoder().encode(v);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('');
  return hashHex;
}
