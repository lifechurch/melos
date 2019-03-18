/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')

module.exports = fp(function main(fastify, opts, next) {
  console.log('this', this)
  next()
}, {
  name: 'main',
  dependencies: [
    'bible'
  ],
  decorators: {
    reply: [
      'newrelic',
      'raven'
    ]
  }
})