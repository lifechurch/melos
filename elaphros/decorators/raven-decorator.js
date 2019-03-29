/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')
const raven = require('raven')

module.exports = fp(function ravenDecorator(fastify, opts, next) {
  if (process.env.ELAPHROS_SENTRY_DSN) {
    raven.config(process.env.ELAPHROS_SENTRY_DSN, { sampleRate: 0.5 }).install()
  }

  function captureException(error, friendlyMessage = null, params = null) {
    fastify.log.error(`${friendlyMessage || ''} ${error.toString()}`)
    if (process.env.ELAPHROS_SENTRY_DSN) {
      raven.captureException(error, params)
    }
  }

  fastify.decorateReply('captureException', captureException)
  fastify.decorate('captureException', captureException)

  next()
}, {
  name: 'raven'
})