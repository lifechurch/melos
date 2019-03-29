const queryString = require('query-string')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../../utils/localization/get-path-without-locale')
const localeList = require('../../localization/locale-list.json')
const getAppLocale = require('../../utils/localization/get-app-locale')
const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')

module.exports = function friendshipAccept(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('friendship-accept')
  }
  const { acceptStatus } = req.params
  const { host, query, path } = req.urlData()
  const queryObject = queryString.parse(query) || {}

  const {
    error
  } = queryObject

  const fullRequestPath = `${path || ''}${query || ''}`
  const fullRequestURL = `https://${host || ''}${fullRequestPath}`
  const requestHost = `https://${host || ''}`

  const appLocales = localeList.map((locale) => {
    return getAppLocale(locale)
  })

  return reply.view('/ui/pages/user-accounts/friendship-accept.marko', {
    fullRequestURL,
    requestHost,
    getLocalizedLink,
    getPathWithoutLocale,
    appLocales,
    success: acceptStatus === 'success',
    error,
    $global: {
      __: reply.res.__,
      __mf: reply.res.__mf,
      locale: req.detectedLng,
      seoUtils,
      bibleToAppLocale,
      textDirection: 'ltr',
      localeDetails: getAppLocaleDetails(req.detectedLng),
      canonicalUrl: fullRequestURL,
      canonicalPath: fullRequestPath
    }
  })
}
