module.exports = function getPathWithoutLocale(path) {
  const parts = path.split('/')

  const startIndex = path.startsWith('/') ? 1 : 0
  const twoLetterPattern = /^[a-z]{2}$/
  const threeLetterPattern = /^[a-z]{3}$/
  const fourLetterPattern = /^[a-z]{2}\-[A-Z]{2}$/

  if (twoLetterPattern.test(parts[startIndex]) || threeLetterPattern.test(parts[startIndex]) || fourLetterPattern.test(parts[startIndex])) {
    parts.splice(startIndex, 1)
  }

  return parts.join('/')
}
