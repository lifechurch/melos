/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')
const api = require('@youversion/js-api')

const Bible = api.getClient('bible')

module.exports = fp(function bibleConfigDecorator(fastify, opts, next) {
  Bible
    .call('configuration')
    .setEnvironment(process.env.NODE_ENV)
    .get()
    .then(configuration => {
      console.log('CONFIG')
      fastify.decorateReply('bibleConfiguration', configuration)
      fastify.decorateReply('getDefaultBibleVersion', function getDefaultBibleVersion() {
        console.log('BCD')
      })
      next()
    })
}, {
  name: 'bibleConfiguration'
})