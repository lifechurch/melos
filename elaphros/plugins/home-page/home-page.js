const httpErrors = require('http-errors')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const seoUtils = require('../../utils/seo')
const validateApiResponse = require('../../utils/validate-api-response')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')

module.exports = function homePage(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('home-page')
  }

  const { host } = req.urlData()
  const canonicalPath = getLocalizedLink('/', req.detectedLng)
  const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

  return reply.view('/ui/pages/home-page/home-page.marko', {
    $global: {
      __: reply.res.__,
      __mf: reply.res.__mf,
      locale: req.detectedLng,
      textDirection: 'ltr',
      localeDetails: getAppLocaleDetails(req.detectedLng),
      canonicalUrl,
      canonicalPath,
      getLocalizedLink,
      seoUtils
    }
  })
}