const newrelic = require('./get-new-relic')()

module.exports = function globalNotFoundHandler(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('not-found-generic')
  }
  reply.code(404).type('text/html').send('Not Found')
}
