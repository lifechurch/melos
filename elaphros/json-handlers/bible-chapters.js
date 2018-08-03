const api = require('@youversion/js-api')
const Bible = api.getClient('bible').setEnvironment(process.env.NODE_ENV)

module.exports = async function bibleChapters(req, reply) {
  const { versionId, book } = req.params

  try {
    const version = await Bible.call("version").params({
      id: versionId
    }).get()

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
    req.log.error(`Error getting list of Bible book: ${e.toString()}`)
    return e
  }
}
