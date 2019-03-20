const api = require('@youversion/js-api')

const Bible = api.getClient('bible')

module.exports = async function bibleChapters(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('json-bible-chapters')
  }

  const { versionId, book } = req.params

  try {
    const version = await Bible.call('version').params({
      id: versionId
    }).setEnvironment(process.env.NODE_ENV).get()

    const selectedBook = version.books.filter((b) => {
      return b.usfm === book
    })[0]

    return {
      items: selectedBook.chapters.map((chapter) => {
        return {
          human: chapter.human,
          usfm: chapter.usfm
        }
      })
    }
  } catch (e) {
    reply.captureException(e, 'Error getting list of Bible books: ')
    return e
  }
}
