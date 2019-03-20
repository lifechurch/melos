const fp = require('fastify-plugin')
const userAccountConfirmation = require('./user-account-confirmation')
const friendshipAccept = require('./friendship-accept')

module.exports = fp(function Confirmations(fastify, opts, next) {
  fastify.get('/confirmation', userAccountConfirmation)
  fastify.get('/:lng/confirmation', userAccountConfirmation)

  fastify.get('/friendships/accept/:acceptStatus', friendshipAccept)
  fastify.get('/:lng/friendships/accept/:acceptStatus', friendshipAccept)

  next()
}, {
  name: 'confirmations',
  decorators: {
    fastify: [
      'captureException'
    ],
    reply: [
      'captureException'
    ]
  }
})