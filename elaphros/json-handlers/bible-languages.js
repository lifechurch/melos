const api = require('@youversion/js-api')
const sanitizeString = require('../utils/sanitize-string')
const Bible = api.getClient('bible')

module.exports = async function bibleLanguages(req, reply) {
  const filter = sanitizeString(req.query.filter, false)

  try {
    const response = await Bible.call("configuration").get()
    const items = response.default_versions
      .filter((version) => {
        if (!!filter) {
          return version.local_name.toLowerCase().startsWith(filter.toLowerCase()) ||
            version.name.toLowerCase().startsWith(filter.toLowerCase())
        }
        return true
      }).map((version) => {
        return {
          tag: version.language_tag,
          local_name: version.local_name,
          has_audio: version.has_audio
        }
      })
    return { items }
  } catch (e) {
    req.log.error(`Error getting list of Bible book: ${e.toString()}`)
    return e
  }
}
