const api = require('@youversion/js-api')
const validateApiResponse = require('../utils/validate-api-response')
const getFirstUsfmForVersion = require('../utils/bible/get-first-usfm-for-version')
const Bible = api.getClient('bible').setEnvironment(process.env.NODE_ENV)
const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'

module.exports = function bibleVersionWithDefaultReference(req, reply) {
  return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
}
