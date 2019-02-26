const newrelic = require('../server/get-new-relic')()
const seoUtils = require('../utils/seo')
const bibleToAppLocale = require('../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../utils/localization/get-app-locale-details')
const getLocalizedLink = require('../utils/localization/get-localized-link')

module.exports = function bibleOffline(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-offline')
  }

  const { host } = req.urlData()
  const locale = bibleToAppLocale(req.detectedLng)
  const canonicalPath = getLocalizedLink('/bible-offline', locale)
  const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

  return reply.view('/ui/pages/bible/offline.marko', {
    $global: {
      __: reply.res.__,
      __mf: reply.res.__mf,
      locale,
      seoUtils,
      bibleToAppLocale,
      textDirection: 'ltr',
      localeDetails: getAppLocaleDetails(req.detectedLng),
      canonicalUrl,
      canonicalPath
    }
  })
}
