let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

module.exports = function loaderio(req, reply) {
  reply.send('loaderio-41e1b70fc18e0a45b5d52827b90fded3')
}
