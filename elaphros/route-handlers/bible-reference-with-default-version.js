const seoUtils = require('../utils/seo')

const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'
const DEFAULT_VERSION_ABBR = process.env.BIBLE_DEFAULT_VERSION_ABBR || 'KJV'

module.exports = function bibleReferenceWithDefaultVersion(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-reference-with-default-version')
  }

  return reply.redirect(307, seoUtils.getCanonicalUrl('bible', `${DEFAULT_VERSION}`, `${DEFAULT_VERSION_ABBR}`, `${DEFAULT_USFM}`, req.detectedLng))
}
