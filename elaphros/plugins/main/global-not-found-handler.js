module.exports = function globalNotFoundHandler(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('not-found-generic')
  }
  reply.code(404).type('text/html').send('Not Found')
}
