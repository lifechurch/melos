const api = require('@youversion/js-api')
const sanitizeString = require('../utils/sanitize-string')
const Bible = api.getClient('bible').setEnvironment(process.env.NODE_ENV)

module.exports = async function bibleVersions(req, reply) {
  const languageTag = sanitizeString(req.params.languageTag, 'eng')
  const filter = sanitizeString(req.query.filter, false)

  try {
    const response = await Bible.call("versions").params({
      type: 'all',
      language_tag: languageTag
    }).get()

    if (!Array.isArray(response.versions)) {
      req.log.warn(`No versions for: ${languageTag}`)
      return reply.redirect(307, '/json/bible/versions/eng')
    }

    const items = response.versions
      .filter((version) => {
        if (!!filter) {
          return version.local_title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
            version.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
            version.abbreviation.toLowerCase().startsWith(filter.toLowerCase()) ||
            version.local_abbreviation.toLowerCase().startsWith(filter.toLowerCase())
        }
        return true
      }).map((version) => {
        return {
          id: version.id,
          local_title: version.local_title,
          audio: version.audio
        }
      })
    return { items }
  } catch (e) {
    req.log.error(`Error fetching versions for: ${languageTag}. ${e.toString()}`)
    return reply.redirect(307, '/json/bible/versions/eng')
  }
}
