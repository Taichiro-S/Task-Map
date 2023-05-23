import { charLengthCalc } from 'utils/charLengthCalc' // Import your function from its file

describe('charLengthCalc', () => {
  it('calculates width correctly for ASCII characters', () => {
    const result = charLengthCalc('Hello World', 10, 20, 100)
    expect(result).toBe('110px') // 11 ASCII characters * 10px
  })

  it('calculates width correctly for Japanese characters', () => {
    const result = charLengthCalc('こんにちは', 10, 20, 100)
    expect(result).toBe('100px') // 5 Japanese characters * 20px
  })

  it('calculates width correctly for mixed characters', () => {
    const result = charLengthCalc('Hello, こんにちは', 10, 20, 100)
    expect(result).toBe('170px') // 7 ASCII characters * 10px + 5 Japanese characters * 20px
  })

  it('returns emptyWidth when calculated width is less than emptyWidth', () => {
    const result = charLengthCalc('Hi', 10, 20, 100)
    expect(result).toBe('100px') // Calculated width (20px) is less than emptyWidth (100px)
  })

  it('handles empty strings correctly', () => {
    const result = charLengthCalc('', 10, 20, 100)
    expect(result).toBe('100px') // Empty string, should return emptyWidth
  })

  it('handles non-string inputs correctly', () => {
    const result = charLengthCalc(12345, 10, 20, 100)
    expect(result).toBe('100px') // Non-string input, should return emptyWidth
  })
})
