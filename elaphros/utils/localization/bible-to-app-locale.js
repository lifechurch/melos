const localeList = require('../../localization/locale-list.json')
const getAppLocale = require('./get-app-locale')

module.exports = function bibleToAppLocale(params) {
  try {
    const {
      language_tag,
    } = params
    const matchingLocales = localeList.filter(({
      bibleLocale,
    }) => {
      if (bibleLocale === language_tag) {
        return true
      }
      return false
    })
    if (matchingLocales.length === 0) return 'en'
    return getAppLocale(matchingLocales.shift())
  } catch (e) {
    return localeList[0]
  }
}
