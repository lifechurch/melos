const localeList = require('../../localization/locale-list.json')
const getAppLocale = require('./get-app-locale')

module.exports = function bibleToAppLocale(params) {
  try {
    const {
      name,
      language_tag,
      iso_639_1,
      iso_639_3
    } = params
    const matchingLocales = localeList.filter(({
      englishName,
      locale,
      locale3,
      other
    }) => {
      if (
        language_tag === locale3 ||
        iso_639_3 === locale3 ||
        iso_639_1 === locale.replace('-', '_') ||
        iso_639_3 === locale3.split('_')[0] ||
        language_tag === other ||
        name === englishName
      ) {
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
