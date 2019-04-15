const fp = require('fastify-plugin')
const language = require('./language')
const languages = require('./languages')

module.exports = fp(function BibleVersions(fastify, opts, next) {

  fastify.get('/languages', languages)
  fastify.get('/languages/:language', language)
  fastify.get('/:lng/languages', languages)
  fastify.get('/:lng/languages/:language', language)

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
      'getVersionLanguage',
      'getPopularVersionLanguages',
      'getUnpopularVersionLanguages',
      'getVersionsForLanguage',
      'getVersionsForPublisher',
      'bibleVersionCount',
      'bibleLanguageCount'
    ]
  }
})