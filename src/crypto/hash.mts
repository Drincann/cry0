export async function hexSha256(data: string): Promise<string> {
  const utf8 = new TextEncoder().encode(data);
  return globalThis.crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hex;
  });
}