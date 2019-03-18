/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')
const newrelic = require('../server/get-new-relic')()

module.exports = fp(function newrelicDecorator(fastify, opts, next) {
  fastify.decorateReply('newrelic', newrelic)
  next()
}, {
  name: 'newrelic'
})
