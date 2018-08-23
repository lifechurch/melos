const api = require('@youversion/js-api')
const Raven = require('raven')
const newrelic = require('../server/get-new-relic')()

const Bible = api.getClient('bible')

module.exports = async function bibleChapters(req) {
  if (newrelic) {
    newrelic.setTransactionName('json-bible-chapters')
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
    Raven.captureException(e)
    req.log.error(`Error getting list of Bible book: ${e.toString()}`)
    return e
  }
}
