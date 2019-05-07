const localeList = require('../../localization/locale-list.json')
const getAppLocale = require('./get-app-locale')

module.exports = function getAppLocaleDetails(appLocale) {
  const matchingLocales = localeList.filter((localeObject) => {
    return getAppLocale(localeObject) === appLocale
  })
  if (matchingLocales.length === 0) return null
  return matchingLocales.shift()
}
