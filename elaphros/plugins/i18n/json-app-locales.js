const getAppLocale = require('../../utils/localization/get-app-locale')
const localeList = require('../../localization/locale-list.json')
const sanitizeString = require('../../utils/sanitize-string')

module.exports = function appLocales(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('json-app-locales')
  }

  const filter = sanitizeString(req.query.filter, false)
  const items = localeList
    .filter((locale) => {
      if (filter) {
        return locale.nativeName.toLowerCase().startsWith(filter.toLowerCase()) ||
        locale.englishName.toLowerCase().startsWith(filter.toLowerCase()) ||
        locale.locale.toLowerCase().startsWith(filter.toLowerCase())
      }
      return true
    })
    .map((locale) => {
      return {
        nativeName: locale.nativeName,
        englishName: locale.englishName,
        appLocale: getAppLocale(locale)
      }
    })

  reply.send({ items })
}
