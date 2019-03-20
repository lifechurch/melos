const seoUtils = require('../../utils/seo')

module.exports = function bibleReferenceWithDefaultVersion(req, reply) {
  const { id, abbr, usfm } = req.getDefaultBibleVersion()

  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-reference-with-default-version')
  }

  return reply.redirect(307, seoUtils.getCanonicalUrl('bible', `${id}`, `${abbr}`, `${usfm}`, req.detectedLng))
}
