let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

const api = require('@youversion/js-api')
const validateApiResponse = require('../utils/validate-api-response')
const getFirstUsfmForVersion = require('../utils/bible/get-first-usfm-for-version')
const Bible = api.getClient('bible')
const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'

module.exports = function bibleVersionWithDefaultReference(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-reference-with-default-version')
  }

  return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
}
