const fp = require('fastify-plugin')

module.exports = fp(function ServiceWorker(fastify, opts, next) {
  fastify.get('/sw.js', function manifest(req, reply) {
    if (reply.newrelic) {
      reply.newrelic.setTransactionName('js-service-worker')
    }

    reply.sendFile('sw.js')
  })

  next()
}, {
  name: 'service-worker',
  decorators: {
    reply: [
      'newrelic'
    ]
  }
})
