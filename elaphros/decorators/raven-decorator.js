/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')
const raven = require('raven')

module.exports = fp(function ravenDecorator(fastify, opts, next) {
  if (process.env.ELAPHROS_SENTRY_DSN) {
    raven.config(process.env.ELAPHROS_SENTRY_DSN, { sampleRate: 0.5 }).install()
    fastify.decorateReply('raven', raven)
  } else {
    fastify.decorateReply('raven', null)
  }
  next()
}, {
  name: 'raven'
})