const fp = require('fastify-plugin')

module.exports = fp(function HealthChecks(fastify, opts, next) {
  fastify.get('/ping', function ping(req, reply) {
    if (reply.newrelic) {
      reply.newrelic.setTransactionName('health-check')
    }
    reply.send()
  })

  next()
}, {
  name: 'health-checks',
  decorators: {
    reply: [
      'newrelic'
    ]
  }
})