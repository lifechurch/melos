const fp = require('fastify-plugin')
const api = require('@youversion/js-api')
const httpErrors = require('http-errors')
const unpackRailsCookie = require('./unpack-rails-cookie')

const Users = api.getClient('users')

const RAILS_SIGNED_SECRET = process.env.RAILS_SIGNED_SECRET || null

module.exports = fp(function LoggedInUser(fastify, opts, next) {
  async function loggedInUser(req, reply) {
    const protocol = req.hostname.startsWith('localhost') ? 'http' : 'https'
    reply.header('AMP-Access-Control-Allow-Source-Origin', `${protocol}://${req.hostname}`)

    if (!RAILS_SIGNED_SECRET) {
      reply.captureException(new Error('RAILS SIGNED SECRET not set in ENV'), 'RAILS SIGNED SECRET not set in ENV')
      return httpErrors.InternalServerError()
    }

    if (!req.cookies) {
      reply.captureException(new Error('Cannot read cookies on this request'), 'Cannot read cookies on this request')
      return httpErrors.InternalServerError()
    }

    try {
      const username = unpackRailsCookie(req.cookies.bb, RAILS_SIGNED_SECRET)
      const password = unpackRailsCookie(req.cookies.cc, RAILS_SIGNED_SECRET)
      const tp_token = unpackRailsCookie(req.cookies.tt, RAILS_SIGNED_SECRET)

      const signedInWithEmail = Boolean(username && password)
      const signedInWithTP = Boolean(tp_token)

      let user

      if (signedInWithEmail) {
        try {
          user = await Users.call('view')
            .auth(username, password)
            .setEnvironment(process.env.NODE_ENV)
            .get()
        } catch (e) {
          reply.captureException(e, `Unable to fetch user ${e.message}`)
        }
      }

      if (signedInWithTP) {
        try {
          user = await Users.call('view')
            .auth(tp_token)
            .setEnvironment(process.env.NODE_ENV)
            .get()
        } catch (e) {
          reply.captureException(e, `Unable to fetch user ${e.message}`)
        }
      }

      return {
        user,
        signedInWithEmail,
        signedInWithTP,
        signedIn: signedInWithEmail || signedInWithTP
      }
    } catch (e) {
      reply.captureException(e, 'Error parsing user cookies.')
      return httpErrors.InternalServerError()
    }
  }

  fastify.get('/logged-in-user', loggedInUser)
  next()
}, {
  name: 'logged-in-user',
  decorators: {
    fastify: [
      'captureException',
    ],
    reply: [
      'newrelic',
      'captureException',
    ],
    request: []
  }
})