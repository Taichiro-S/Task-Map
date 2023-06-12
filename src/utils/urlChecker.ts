export const urlChecker = (url: string) => {
  const urlRegex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/
  return urlRegex.test(url)
}
