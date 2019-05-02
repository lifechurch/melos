const fp = require('fastify-plugin')
const homePage = require('./home-page')

module.exports = fp(function Confirmations(fastify, opts, next) {
  fastify.get('/', homePage)
  fastify.get('/:lng/', homePage)

  next()
}, {
  name: 'home-page',
  decorators: {
    fastify: [
      'captureException'
    ],
    reply: [
      'captureException'
    ]
  }
})