const fp = require('fastify-plugin')
const cors = require('cors')

module.exports = fp(function configureCORS(fastify, opts, next) {
  fastify.use(cors({
    origin: [
      /\.bible\.com$/,
      'cdn.ampproject.org',
      /\.cdn.ampproject\.org$/,
      /localhost:3000$/
    ],
    credentials: true,
    methods: [ 'GET', 'POST' ]
  }))

  fastify.options('*', (req, reply) => { reply.send() })

  next()
}, {
  name: 'cors'
})

