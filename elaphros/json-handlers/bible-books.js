const api = require('@youversion/js-api')
const sanitizeString = require('../utils/sanitize-string')
const Bible = api.getClient('bible').setEnvironment(process.env.NODE_ENV)

module.exports = async function bibleBooks(req, reply) {
  const { versionId } = req.params
  const filter = sanitizeString(req.query.filter, false)

  try {
    const version = await Bible.call("version").params({ id: versionId }).get()
    const items = version.books
      .filter((book) => {
        if (!!filter) {
          return book.human.toLowerCase().startsWith(filter.toLowerCase())
        }
        return true
      })
      .map((book) => {
        return {
          human: book.human,
          usfm: book.usfm
        }
      })
    return { items }
  } catch (e) {
    req.log.error(`Error getting list of Bible book: ${e.toString()}`)
    return e
  }
}
