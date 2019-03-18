const fp = require('fastify-plugin')

/* Bible Routes */
const bibleReference = require('../route-handlers/bible-reference')
const bibleVersionWithDefaultReference = require('../route-handlers/bible-version-with-default-reference')
const bibleReferenceWithDefaultVersion = require('../route-handlers/bible-reference-with-default-version')
const bibleOffline = require('../route-handlers/bible-offline')
const bibleCompare = require('../route-handlers/bible-compare')

module.exports = fp((fastify, opts, next) => {

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

  next()
}, {
  name: 'bible',
  decorators: {
    reply: [
      'bibleConfiguration'
    ]
  }
})