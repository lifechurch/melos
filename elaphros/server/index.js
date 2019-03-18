/* eslint-disable no-unused-vars, global-require */
const path = require('path')
const fastify = require('fastify')({ logger: true })

// Decorators
fastify.register(require('../decorators/newrelic-decorator'))
fastify.register(require('../decorators/raven-decorator'))
fastify.register(require('../decorators/bible-config-decorator'))

// Plugins
fastify.register(require('../plugins/bible'))
fastify.register(require('../plugins/i18n'))

fastify.register(require('fastify-compress'))
fastify.register(require('fastify-cookie'))
fastify.register(require('fastify-favicon'))
fastify.register(require('fastify-url-data'))
fastify.register(require('fastify-static'), { root: path.join(__dirname, '../assets'), prefix: '/static-assets' })
fastify.register(require('fastify-caching'), { privacy: 'public', expiresIn: 604800, cache: false })
fastify.register(require('point-of-view'), { engine: { marko: require('marko') } })

require('./cors')(fastify)
// fastify.register(require('../plugins/i18n'))
require('./redirect-authenticated')(fastify)

/* Liveness / Readiness Probe Routes */
fastify.get('/ping', require('../route-handlers/ping'))

/* Web App Manifest */
fastify.get('/manifest.json', require('../json-handlers/manifest'))

/* Service Worker */
fastify.get('/sw.js', require('../route-handlers/service-worker'))

/* User Account Routes */
const userAccountConfirmation = require('../route-handlers/user-account-confirmation')
const friendshipAccept = require('../route-handlers/friendship-accept')

fastify.get('/confirmation', userAccountConfirmation)
fastify.get('/:lng/confirmation', userAccountConfirmation)

fastify.get('/friendships/accept/:acceptStatus', friendshipAccept)
fastify.get('/:lng/friendships/accept/:acceptStatus', friendshipAccept)

fastify.register(require('../plugins/main'))

// fastify.register(require('../plugins/bible'))

// /* Bible JSON Endpoints */
fastify.get('/json/bible/books/:versionId', require('../json-handlers/bible-books'))
fastify.get('/json/bible/books/:versionId/:book/chapters', require('../json-handlers/bible-chapters'))
fastify.get('/json/bible/versions/:languageTag', require('../json-handlers/bible-versions'))
fastify.get('/json/bible/languages', require('../json-handlers/bible-languages'))

/* Application JSON Endpoints */
fastify.get('/json/app/locales', require('../json-handlers/app-locales'))

/* Global Handlers */
fastify.setNotFoundHandler(require('./global-not-found-handler'))
fastify.setErrorHandler(require('./global-error-handler'))

/* Start Listening on PORT */
const PORT = process.env.PORT || 3030
fastify.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    // Raven.captureException(err)
    console.log(err.stack)
    fastify.log.error(`Error starting Fastify server: ${err.toString()}`)
    process.exit(1)
  }
  fastify.log.info(`Server started listening on ${fastify.server.address().port}`)
})
