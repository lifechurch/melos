const fp = require('fastify-plugin')
const version = require('./version')
const versions = require('./versions')

module.exports = fp(function BibleVersions(fastify, opts, next) {

  fastify.get('/versions', versions)
  fastify.get('/versions/:slug', version)
  fastify.get('/:lng/versions', versions)
  fastify.get('/:lng/versions/:slug', version)

  next()
}, {
  name: 'bible-versions',
  decorators: {
    fastify: [
      'captureException',
    ],
    reply: [
      'newrelic',
      'captureException',
    ],
    request: [
      'getVersionLanguages',
      'getVersionsForLanguage',
      'getVersionsForPublisher',
      'bibleVersionCount',
      'bibleLanguageCount'
    ]
  }
})