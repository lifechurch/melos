const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')
const getLocalizedLink = require('../../utils/localization/get-localized-link')

module.exports = function BibleVersions(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-versions')
  }

  const { host } = req.urlData()
  const canonicalPath = getLocalizedLink('/versions', req.detectedLng)
  const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

  return reply.view('/ui/pages/bible-versions/versions.marko', {
    req,
    getLocalizedLink,
    $global: {
      __: reply.res.__,
      __mf: reply.res.__mf,
      locale: req.detectedLng,
      seoUtils,
      bibleToAppLocale,
      textDirection: 'ltr',
      localeDetails: getAppLocaleDetails(req.detectedLng),
      canonicalUrl,
      canonicalPath,
    }
  })
}
