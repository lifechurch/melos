/* eslint-disable global-require */
module.exports = function getNewRelic() {
  let newrelic
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    newrelic = require('newrelic')
  }
  return newrelic
}
