const isVerseOrChapter = require('@youversion/utils/lib/bible/isVerseOrChapter').default
const httpErrors = require('http-errors')
const bibleChapter = require('./bible-chapter')
const bibleVerse = require('./bible-verse')

module.exports = function bibleReference(req, reply) {
  const { isVerse, isChapter } = isVerseOrChapter(req.params.usfm)
  if (isChapter) {
    return bibleChapter(req, reply)
  } else if (isVerse) {
    return bibleVerse(req, reply)
  } else {
    if (reply.newrelic) {
      reply.newrelic.setTransactionName('not-found-bible')
    }
    const message = 'Invalid Bible reference: Neither Chapter nor Verse.'
    reply.captureException(new Error(message), `${message} [ ${req.params.usfm} ]`, { tags: { usfm: req.params.usfm } })
    return reply.send(new httpErrors.NotFound())
  }
}
