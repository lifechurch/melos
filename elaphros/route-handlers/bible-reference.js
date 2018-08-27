const Raven = require('raven')
const isVerseOrChapter = require('@youversion/utils/lib/bible/isVerseOrChapter').default
const httpErrors = require('http-errors')
const newrelic = require('../server/get-new-relic')()
const bibleChapter = require('./bible-chapter')
const bibleVerse = require('./bible-verse')

module.exports = function bibleReference(req, reply) {
  const { isVerse, isChapter } = isVerseOrChapter(req.params.usfm)
  if (isChapter) {
    return bibleChapter(req, reply)
  } else if (isVerse) {
    return bibleVerse(req, reply)
  } else {
    if (newrelic) {
      newrelic.setTransactionName('not-found-bible')
    }
    const message = 'Invalid Bible reference: Neither Chapter nor Verse.'
    Raven.captureException(new Error(message), { tags: { usfm: req.params.usfm } })
    req.log.warn(`${message} [ ${req.params.usfm} ]`)
    return reply.send(new httpErrors.NotFound())
  }
}
