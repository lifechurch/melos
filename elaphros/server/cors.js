const cors = require('cors')

module.exports = function configureCORS(fastify) {
  fastify.use(cors({
    origin: [
      /\.bible\.com$/,
      'cdn.ampproject.org',
      /\.cdn.ampproject\.org$/
    ],
    methods: [ 'GET', 'POST' ]
  }))

  fastify.options('*', (req, reply) => { reply.send() })
}
