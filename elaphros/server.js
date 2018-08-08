if (process.env.ELAPHROS_SENTRY_DSN) {
  var Raven = require('raven');
  Raven.config(process.env.ELAPHROS_SENTRY_DSN).install();
}

if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

/* Set App Defaults */
const PORT = process.env.PORT || 3030

/* Require Node.js Modules */
const path = require('path')

/* Require Fastify Modules */
const fastify = require('fastify')({ logger: true })
const marko = require('marko')
const fastifyCaching = require('fastify-caching')

/* Liveness / Readiness Probe Routes */
const ping = require('./route-handlers/ping')

/* Require Route Handlers */
const bibleChapter = require('./route-handlers/bible-chapter')
const bibleVersionWithDefaultReference = require('./route-handlers/bible-version-with-default-reference')
const bibleReferenceWithDefaultVersion = require('./route-handlers/bible-reference-with-default-version')
const bibleVerse = require('./route-handlers/bible-verse')
const loaderio = require('./route-handlers/loaderio')
const bibleOffline = require('./route-handlers/bible-offline')

/* Require JSON Handlers */
const bibleBooks = require('./json-handlers/bible-books')
const bibleChapters = require('./json-handlers/bible-chapters')
const bibleVersions = require('./json-handlers/bible-versions')
const bibleLanguages = require('./json-handlers/bible-languages')
const appLocales = require('./json-handlers/app-locales')
const manifest = require('./json-handlers/manifest')

/* Require Util Functions */
const isVerseOrChapter = require('@youversion/utils/lib/bible/isVerseOrChapter').default
const sanitizeString = require('./utils/sanitize-string')

/* Register Compression Middleware */
fastify.register(require('fastify-compress'))

/* Register Cookie Middleware */
fastify.register(require('fastify-cookie'), (err) => {
  Raven.captureException(err)
  if (err) throw err
})

/* Register favicon Middleware */
fastify.register(require('fastify-favicon'))

/* Register Static Middleware */
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/static-assets'
})

/* Register Caching Middleware */
fastify.register(
  fastifyCaching,
  {
    privacy: 'public',
    expiresIn: 604800,
    cache: false
  },
  (err) => {
    Raven.captureException(err)
    if (err) throw err
  }
)

/* Register Marko middleware */
fastify.register(require('point-of-view'), {
  engine: {
    marko: marko
  }
})

/* Register URL Data Middleware */
fastify.register(require('fastify-url-data'), (err) => {
  Raven.captureException(err)
  if (err) fastify.log.error(`Error loading URL Data middleware: ${err.toString()}`)
})

/* Listen for Requests with Auth Cookies */
fastify.addHook('preHandler', (req, reply, next) => {
  /**
   * AUTH cookies
   * a = user.id
   * b = user.username
   * c = user.password
   *
   * t = user.third party token (Facebook, Google, etc.)
   * ti = user.third party token id
   *
   * To be considered valid, we need either a+b+c or t+ti
   **/
  const urlData = req.urlData()

  if (urlData.host === "localhost") {
    fastify.log.info(`Request made to 'localhost'. Ignoring redirect behavior.`)
    next()
    return
  }

  const WWW_SUBDOMAIN = process.env.WWW_SUBDOMAIN || 'www.'
  const MY_SUBDOMAIN = process.env.MY_SUBDOMAIN || 'my.'
  const signedInWithEmail = !!(req.cookies && req.cookies.a && req.cookies.b && req.cookies.c)
  const signedInWithTP = !!(req.cookies && req.cookies.t && req.cookies.ti)
  const isSignedIn = signedInWithEmail || signedInWithTP
  const isWwwSubdomain =  urlData.host.startsWith(WWW_SUBDOMAIN)
  const isMySubdomain = urlData.host.startsWith(MY_SUBDOMAIN)

  function getUrl(hostName, port, path, query) {
    return `//${hostName}${port ? `:${port}` : ''}${path}${query ? `?${query}` : ''}`
  }

  if (isSignedIn && isWwwSubdomain) {
    const hostName = urlData.host.replace(WWW_SUBDOMAIN, MY_SUBDOMAIN)
    fastify.log.info(`User is signed in. Redirecting from '${WWW_SUBDOMAIN}' to '${MY_SUBDOMAIN}'`)
    reply.redirect(getUrl(hostName, urlData.port, urlData.path, urlData.query))
    return
  }

  if (!isSignedIn && isMySubdomain) {
    const hostName = urlData.host.replace(MY_SUBDOMAIN, WWW_SUBDOMAIN)
    fastify.log.info(`User is not signed in. Redirecting from '${MY_SUBDOMAIN}' to '${WWW_SUBDOMAIN}'`)
    reply.redirect(getUrl(hostName, urlData.port, urlData.path, urlData.query))
    return
  }

  next()
})

/* Liveness / Readiness Probe Routes */
fastify.get('/ping', ping)

/* Web App Manifest */
fastify.get('/manifest.json', manifest)

/* Service Worker */
fastify.get('/sw.js', (req, reply) => {
  reply.sendFile('sw.js')
})

/* LoaderIO Route */
fastify.get('/loaderio-41e1b70fc18e0a45b5d52827b90fded3/', loaderio)

/* Bible Routes */
fastify.get('/bible-offline', bibleOffline)
fastify.get('/bible', bibleReferenceWithDefaultVersion)
fastify.get('/bible/:versionId', bibleVersionWithDefaultReference)
fastify.get('/bible/:versionId/:usfm', (req, reply) => {
  const { isVerse, isChapter } = isVerseOrChapter(req.params.usfm)
  if (isChapter) {
    return bibleChapter(req, reply)
  } else if (isVerse) {
    return bibleVerse(req, reply)
  } else {
    req.log.warn(`Invalid Bible reference: ${usfm}. Neither Chapter nor Verse.`)
  }
})

/* Bible JSON Endpoints */
fastify.get('/json/bible/books/:versionId', bibleBooks)
fastify.get('/json/bible/books/:versionId/:book/chapters', bibleChapters)
fastify.get('/json/bible/versions/:languageTag', bibleVersions)
fastify.get('/json/bible/languages', bibleLanguages)


/* Application JSON Endpoints */
fastify.get('/json/app/locales', appLocales)

/* Fallthrough 404 Handler */
fastify.setNotFoundHandler((req, reply) => {
  reply.code(404).type('text/html').send('Not Found')
})


/* Start Listening on PORT */
fastify.listen(PORT, '0.0.0.0', function (err) {
  if (err) {
    Raven.captureException(err)
    fastify.log.error(`Error starting Fastify server: ${err.toString()}`)
    process.exit(1)
  }
  fastify.log.info(`Server started listening on ${fastify.server.address().port}`)
})
