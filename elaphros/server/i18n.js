const path = require('path')
const i18n = require('i18n')
const getAppLocale = require('../utils/localization/get-app-locale')
const localeList = require('../localization/locale-list.json')
const registerMiddleware = require('./register-middleware')
const getPathWithoutLocale = require('../utils/localization/get-path-without-locale')

/* i18n Configuration */
const activeLocales = localeList.map((locale) => { return getAppLocale(locale) })

i18n.configure({
  locales: activeLocales,
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  objectNotation: true
})

module.exports = function configureI18n(fastify) {
  registerMiddleware(fastify, [
    [ 'fastify-language-parser', {
      order: [ 'path' ],
      fallbackLng: 'en',
      supportedLngs: activeLocales
    }]
  ])

  fastify.use(i18n.init)

  fastify.addHook('preHandler', (req, reply, next) => {
    const urlData = req.urlData()

    function getUrl(hostName, port, urlPath, query) {
      return `//${hostName}${port ? `:${port}` : ''}${urlPath}${query ? `?${query}` : ''}`
    }

    if ('lng' in req.params && req.detectedLng === 'en') {
      const newUrl = getUrl(urlData.host, urlData.port, getPathWithoutLocale(urlData.path), urlData.query)
      console.log('redirecting', urlData, newUrl)
      reply.redirect(newUrl)
    }

    reply.res.setLocale(req.detectedLng)
    next()
  })
}
