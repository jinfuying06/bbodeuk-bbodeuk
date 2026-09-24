/** Korean particle by the last syllable's final consonant: particle("세면대", "을/를") → "를". Non-Hangul → no-batchim form. */
export function particle(word: string, pair: "을/를" | "이/가"): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  const [withBatchim, without] = pair.split("/");
  return hasBatchim ? withBatchim : without;
}
