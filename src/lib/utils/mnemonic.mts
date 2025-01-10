export function wordsToEntropyBufferSize(length: 12 | 15 | 18 | 21 | 24): number | undefined {
  if (length == 12) return 128
  if (length == 15) return 160
  if (length == 18) return 192
  if (length == 21) return 224
  if (length == 24) return 256
}
