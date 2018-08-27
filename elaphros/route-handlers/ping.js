const newrelic = require('../server/get-new-relic')()

module.exports = function ping(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('k8s-liveness-probe')
  }

  reply.send()
}
