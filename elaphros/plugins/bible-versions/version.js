const api = require('@youversion/js-api')
const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getFirstUsfmForVersion = require('../../utils/bible/get-first-usfm-for-version')

const Bible = api.getClient('Bible')

module.exports = function BibleVersions(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-versions')
  }

  const { host } = req.urlData()
  const { slug } = req.params
  const versionId = slug.split('-').shift()

  const versionPromise = Bible.call('version')
    .params({ id: versionId })
    .setEnvironment(process.env.NODE_ENV)
    .get()

  const allPromises = Promise.all([ versionPromise ])

  const canonicalPath = getLocalizedLink('/versions', req.detectedLng)
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
}
