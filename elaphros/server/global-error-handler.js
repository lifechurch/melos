const Raven = require('raven')
const httpErrors = require('http-errors')

module.exports = function globalErrorHandler(err, req, reply) {
  Raven.captureException(err)
  reply.send(new httpErrors.InternalServerError())
}
