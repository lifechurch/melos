const getPathWithoutLocale = require('./get-path-without-locale')

module.exports = function getLocalizedLink(path, locale) {
  return parts.join(`/${locale}/${getPathWithoutLocale(path)}`)
}
