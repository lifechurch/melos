const localeList = require('../../localization/locale-list.json')

module.exports = function getAppLocaleDetails(appLocale) {
  const matchingLocales = localeList.filter(({
    locale,
    locale2,
    locale3,
  }) => {
    if (
      appLocale === locale ||
      appLocale === locale3 ||
      appLocale === locale2
    ) {
      return true
    }
    return false
  })
  if (matchingLocales.length === 0) return null
  return matchingLocales.shift()
}
