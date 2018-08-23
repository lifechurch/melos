const newrelic = require('../server/get-new-relic')()

module.exports = function ping(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-offline')
  }

  return reply.view('/ui/pages/bible/offline.marko', {})
}
