const httpErrors = require('http-errors')

module.exports = function globalErrorHandler(err, req, reply) {
  reply.captureException(err)
  reply.send(new httpErrors.InternalServerError())
}
