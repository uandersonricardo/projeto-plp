export function calculateHashCode(value: any): number {
  const str = String(value);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; // 32-bit int
  }
  return hash;
}
