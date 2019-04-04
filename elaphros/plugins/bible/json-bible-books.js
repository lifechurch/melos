const api = require('@youversion/js-api')
const sanitizeString = require('../../utils/sanitize-string')

const Bible = api.getClient('bible')

module.exports = async function bibleBooks(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('json-bible-books')
  }

  const { versionId } = req.params
  const filter = sanitizeString(req.query.filter, false)

  try {
    const version = await Bible.call('version').params({ id: versionId }).setEnvironment(process.env.NODE_ENV).get()
    const items = version.books
      .filter((book) => {
        if (filter) {
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
    reply.captureException(e, 'Error getting list of Bible books: ')
    return e
  }
}