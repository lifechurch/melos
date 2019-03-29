const fp = require('fastify-plugin')

/* Bible Routes */
const bibleReference = require('./bible-reference')
const bibleVersionWithDefaultReference = require('./bible-version-with-default-reference')
const bibleReferenceWithDefaultVersion = require('./bible-reference-with-default-version')
const bibleOffline = require('./bible-offline')
const bibleCompare = require('./bible-compare')
const jsonBibleBooks = require('./json-bible-books')
const jsonBibleChapters = require('./json-bible-chapters')
const jsonBibleVersions = require('./json-bible-versions')
const jsonBibleLanguages = require('./json-bible-languages')

module.exports = fp(function Bible(fastify, opts, next) {

  fastify.get('/bible-offline', bibleOffline)
  fastify.get('/:lng/bible-offline', bibleOffline)

  fastify.get('/bible', bibleReferenceWithDefaultVersion)
  fastify.get('/:lng/bible', bibleReferenceWithDefaultVersion)

  fastify.get('/bible/:versionId', bibleVersionWithDefaultReference)
  fastify.get('/:lng/bible/:versionId', bibleVersionWithDefaultReference)

  fastify.get('/bible/compare/:usfm', bibleCompare)
  fastify.get('/:lng/bible/compare/:usfm', bibleCompare)

  fastify.get('/bible/:versionId/:usfm', bibleReference)
  fastify.get('/:lng/bible/:versionId/:usfm', bibleReference)

  fastify.get('/json/bible/books/:versionId', jsonBibleBooks)
  fastify.get('/json/bible/books/:versionId/:book/chapters', jsonBibleChapters)
  fastify.get('/json/bible/versions/:languageTag', jsonBibleVersions)
  fastify.get('/json/bible/languages', jsonBibleLanguages)

  next()
}, {
  name: 'bible',
  decorators: {
    fastify: [
      'captureException',
    ],
    reply: [
      'newrelic',
      'captureException',
    ],
    request: [
      'getDefaultBibleVersion'
    ]
  }
})