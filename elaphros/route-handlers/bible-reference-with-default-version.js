const newrelic = require('../server/get-new-relic')()

const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'

module.exports = function bibleVersionWithDefaultReference(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-reference-with-default-version')
  }

  return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
}
