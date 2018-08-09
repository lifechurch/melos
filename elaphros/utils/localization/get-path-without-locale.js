module.exports = function getPathWithoutLocale(path) {
  const parts = path.split('/')

  const twoLetterPattern = /[a-z]{2}/
  const threeLetterPattern = /[a-z]{3}/
  const fourLetterPattern = /[a-z]{2}\-[A-Z]{2}/

  if (twoLetterPattern.test(parts[0]) || threeLetterPattern.test(parts[0]) || fourLetterPattern.test(parts[0])) {
    parts.shift()
  }

  return parts.join('/')
}
