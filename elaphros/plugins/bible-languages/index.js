const fp = require('fastify-plugin')
const language = require('./language')
const languages = require('./languages')

module.exports = fp(function BibleVersions(fastify, opts, next) {

  fastify.get('/languages', languages)
  fastify.get('/languages/:slug', language)
  fastify.get('/:lng/languages', languages)
  fastify.get('/:lng/languages/:slug', language)

  next()
}, {
  name: 'bible-languages',
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