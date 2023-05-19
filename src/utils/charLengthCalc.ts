export function charLengthCalc(
  str: any,
  alphabetWidth: number,
  japaneseWidth: number,
  emptyWidth: number,
) {
  const alphabets = str.match(/[A-Za-z0-9]/g) || []
  const japaneseChars =
    str.match(
      /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーａ-ｚＡ-Ｚ０-９々〆〤]/gu,
    ) || []

  // Calculate width based on character count
  const alphabetsTotalWidth = alphabets.length * alphabetWidth
  const japaneseTotalWidth = japaneseChars.length * japaneseWidth

  const totalWidth =
    alphabetsTotalWidth + japaneseTotalWidth < emptyWidth
      ? emptyWidth + 'px'
      : `${alphabetsTotalWidth + japaneseTotalWidth}px`

  return totalWidth
}
