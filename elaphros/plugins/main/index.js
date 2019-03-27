const fp = require('fastify-plugin')
const handleNotFound = require('./global-not-found-handler')
const handleError = require('./global-error-handler')

module.exports = fp(function main(fastify, opts, next) {
  fastify.setNotFoundHandler(handleNotFound)
  fastify.setErrorHandler(handleError)

  fastify.ready(err => {
    if (err) {
      fastify.captureException(err, 'Problem loading some plugins: ')
    }
  })

  next()
}, {
  name: 'main',
  dependencies: [
    'cors',
    'i18n',
    'redirect-authenticated',
    'manifest',
    'service-worker',
    'bible',
    'confirmations'
  ],
  decorators: {
    fastify: [
      'captureException'
    ],
    reply: [
      'newrelic',
      'captureException'
    ],
    request: [
      'urlData'
    ]
  }
})