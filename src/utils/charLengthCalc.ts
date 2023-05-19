export function charLengthCalc(
  str: any,
  printableASCIIWidth: number,
  japaneseWidth: number,
  emptyWidth: number,
) {
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
      ? emptyWidth + 'px'
      : `${printableASCIITotalWidth + japaneseTotalWidth}px`

  return totalWidth
}
