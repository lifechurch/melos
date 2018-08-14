let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

module.exports = function ping(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('k8s-liveness-probe')
  }

  reply.send()
}
