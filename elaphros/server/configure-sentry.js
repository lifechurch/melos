/* eslint-disable global-require */
module.exports = function configureSentry() {
  let Raven
  if (process.env.ELAPHROS_SENTRY_DSN) {
    Raven = require('raven')
    Raven.config(process.env.ELAPHROS_SENTRY_DSN, { sampleRate: 0.5 }).install()
  }
  return Raven
}
