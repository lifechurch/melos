const newrelic = require('../server/get-new-relic')()

module.exports = function serviceWorker(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('js-service-worker')
  }
  reply.sendFile('sw.js')
}
