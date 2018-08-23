/* eslint-disable no-unused-vars, global-require */
const path = require('path')
const fastify = require('fastify')({ logger: true })
const Raven = require('./configure-sentry')()
const newrelic = require('./get-new-relic')()
const registerMiddleware = require('./register-middleware')

registerMiddleware(fastify, [
  'fastify-compress',
  'fastify-cookie',
  'fastify-favicon',
  'fastify-url-data',
  [ 'fastify-static', {
    root: path.join(__dirname, '../assets'),
    prefix: '/static-assets'
  }],
  [ 'fastify-caching', {
    privacy: 'public',
    expiresIn: 604800,
    cache: false
  }],
  [ 'point-of-view', {
    engine: {
      marko: require('marko')
    }
  }]
])

require('./cors')(fastify)
require('./i18n')(fastify)
require('./redirect-authenticated')(fastify)

/* Liveness / Readiness Probe Routes */
fastify.get('/ping', require('../route-handlers/ping'))

/* Web App Manifest */
fastify.get('/manifest.json', require('../json-handlers/manifest'))

/* Service Worker */
fastify.get('/sw.js', require('../route-handlers/service-worker'))

/* Bible Routes */
const bibleReference = require('../route-handlers/bible-reference')
fastify.get('/bible-offline', require('../route-handlers/bible-offline'))
fastify.get('/bible', require('../route-handlers/bible-reference-with-default-version'))
fastify.get('/bible/:versionId', require('../route-handlers/bible-version-with-default-reference'))

fastify.get('/bible/:versionId/:usfm', bibleReference)
fastify.get('/:lng/bible/:versionId/:usfm', bibleReference)

/* Bible JSON Endpoints */
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
    Raven.captureException(err)
    fastify.log.error(`Error starting Fastify server: ${err.toString()}`)
    process.exit(1)
  }
  fastify.log.info(`Server started listening on ${fastify.server.address().port}`)
})
