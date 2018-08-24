const getPathWithoutLocale = require('./get-path-without-locale')

module.exports = function getLocalizedLink(path, locale) {
  let targetPath = getPathWithoutLocale(path)
  if (!targetPath.startsWith('/')) {
    targetPath = `/${targetPath}`
  }
  return `${locale === 'en' ? '' : `/${locale}`}${targetPath}`
}
