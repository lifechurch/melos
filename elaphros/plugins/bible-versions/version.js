const api = require('@youversion/js-api')
const httpErrors = require('http-errors')
const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getFirstUsfmForVersion = require('../../utils/bible/get-first-usfm-for-version')
const validateApiResponse = require('../../utils/validate-api-response')

const Bible = api.getClient('Bible')

module.exports = function BibleVersion(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-version')
  }

  const { host } = req.urlData()
  const { slug } = req.params
  const versionId = Number.parseInt(slug.split('-').shift(), 10)

  if (Number.isNaN(versionId)) {
    reply.captureException(new Error('Invalid Bible version. Must be a number.'), 'Invalid Bible version id. Must be a number.')
    return reply.send(new httpErrors.NotFound())
  }

  const versionPromise = Bible.call('version')
    .params({ id: versionId })
    .setEnvironment(process.env.NODE_ENV)
    .get()

  const allPromises = Promise.all([ versionPromise ])

  allPromises.then(([ version ]) => {
    if (!validateApiResponse(version)) {
      reply.captureException(new Error('Invalid Bible version'), 'Invalid Bible version')
      return reply.send(new httpErrors.NotFound())
    }

    const canonicalPath = seoUtils.getCanonicalUrl('bible-version', version, req.detectedLng)
    const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

    return reply.view('/ui/pages/bible-versions/version.marko', {
      req,
      getLocalizedLink,
      allPromises,
      getFirstUsfmForVersion,
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
  }, (e) => {
    reply.captureException(e, 'Error getting Bible Version')
    return reply.send(new httpErrors.NotFound())
  })
}
