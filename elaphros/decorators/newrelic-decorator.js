/* eslint-disable global-require */
const fp = require('fastify-plugin')

let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

module.exports = fp(function newrelicDecorator(fastify, opts, next) {
  fastify.decorateReply('newrelic', newrelic)
  fastify.decorate('newrelic', newrelic)
  next()
}, {
  name: 'newrelic'
})
