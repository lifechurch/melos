const getPathWithoutLocale = require('./get-path-without-locale')

module.exports = function getLocalizedLink(path, locale) {
  let targetPath = getPathWithoutLocale(path)
  if (!targetPath.startsWith('/')) {
    targetPath = `/${targetPath}`
  }
  console.log('TARGET', targetPath)
  return `/${locale}${targetPath}`
}
