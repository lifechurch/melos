const Raven = require('raven')
const api = require('@youversion/js-api')
const seoUtils = require('../utils/seo')
const newrelic = require('../server/get-new-relic')()
const validateApiResponse = require('../utils/validate-api-response')
const getFirstUsfmForVersion = require('../utils/bible/get-first-usfm-for-version')

const Bible = api.getClient('bible')
const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'
const DEFAULT_VERSION_ABBR = process.env.BIBLE_DEFAULT_VERSION_ABBR || 'KJV'

module.exports = function bibleVersionWithDefaultReference(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-version-with-default-reference')
  }

  const { versionId } = req.params

  const versionPromise = Bible.call('version').params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  versionPromise.then((version) => {
    if (!validateApiResponse(version)) {
      req.log.warn(`Invalid Bible version ${versionId}`)
      return reply.redirect(303, seoUtils.getCanonicalUrl('bible', `${DEFAULT_VERSION}`, `${DEFAULT_VERSION_ABBR}`, `${DEFAULT_USFM}`, req.detectedLng))
    }
    const firstUsfm = getFirstUsfmForVersion(version, req.log)
    return reply.redirect(301, seoUtils.getCanonicalUrl('bible', `${versionId}`, `${version.local_abbreviation}`, `${firstUsfm}`, req.detectedLng))
  }, (e) => {
    Raven.captureException(e)
    req.log.error(`Error getting Bible version ${e.toString}`)
    return reply.redirect(307, seoUtils.getCanonicalUrl('bible', `${DEFAULT_VERSION}`, `${DEFAULT_VERSION_ABBR}`, `${DEFAULT_USFM}`, req.detectedLng))
  })
}
