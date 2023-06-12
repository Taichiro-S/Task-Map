export function charLengthCalc(
  str: string | number,
  printableASCIIWidth: number,
  japaneseWidth: number,
  emptyWidth: number,
): number {
  str = String(str)
  const printableASCII = str.match(/[\x20-\x7E]/g) || []
  const japaneseChars =
    str.match(
      /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーａ-ｚＡ-Ｚ０-９々〆〤　]/gu,
    ) || []

  // Calculate width based on character count
  const printableASCIITotalWidth = printableASCII.length * printableASCIIWidth
  const japaneseTotalWidth = japaneseChars.length * japaneseWidth

  const totalWidth =
    printableASCIITotalWidth + japaneseTotalWidth < emptyWidth
      ? emptyWidth
      : printableASCIITotalWidth + japaneseTotalWidth

  return totalWidth
}
