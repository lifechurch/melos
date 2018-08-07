const api = require('@youversion/js-api')
const validateApiResponse = require('../utils/validate-api-response')
const getFirstUsfmForVersion = require('../utils/bible/get-first-usfm-for-version')
const Bible = api.getClient('bible')
const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'

module.exports = function bibleVersionWithDefaultReference(req, reply) {
  const { versionId } = req.params

  const versionPromise = Bible.call("version").params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  versionPromise.then((version) => {
    if (!validateApiResponse(version)) {
      req.log.warn(`Invalid Bible version ${versionId}`)
      return reply.redirect(303, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
    }
    const firstUsfm = getFirstUsfmForVersion(version)
    return reply.redirect(301, `/bible/${versionId}/${firstUsfm}`)
  }, (e) => {
    req.log.error(`Error getting Bible version ${e.toString}`)
    return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
  })
}
