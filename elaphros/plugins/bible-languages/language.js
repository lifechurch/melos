const httpErrors = require('http-errors')
const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getFirstUsfmForVersion = require('../../utils/bible/get-first-usfm-for-version')

module.exports = function BibleLanguage(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-language')
  }

  const { host } = req.urlData()
  const { language } = req.params
  const versionLanguage = req.getVersionLanguage(language)

  if (typeof versionLanguage === 'undefined') {
    const message = `Invalid Bible language: ${language}`
    reply.captureException(new Error(message), message)
    return reply.send(new httpErrors.NotFound())
  }

  const canonicalPath = getLocalizedLink('/languages', req.detectedLng)
  const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

  return reply.view('/ui/pages/bible-languages/language.marko', {
    req,
    getLocalizedLink,
    getFirstUsfmForVersion,
    language: req.getVersionLanguage(language),
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
