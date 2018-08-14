let newrelic
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic')
}

const Raven = require('raven')
const api = require('@youversion/js-api')
const deepLinkPath = require('@youversion/utils/lib/bible/deepLinkPath').default
const validateApiResponse = require('../utils/validate-api-response')
const getDefaultImages = require('../utils/get-default-images')
const getLocalizedLink = require('../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../utils/localization/get-path-without-locale')
const localeList = require('../localization/locale-list.json')
const getAppLocale = require('../utils/localization/get-app-locale')
const seoUtils = require('../utils/seo')
const Bible = api.getClient('bible')
const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1.KJV'

module.exports = function bibleChapter(req, reply) {
  if (newrelic) {
    newrelic.setTransactionName('bible-chapter')
  }

  const { versionId, usfm: rawUsfm } = req.params
  const usfm = rawUsfm.split('.').slice(0, 2).join('.').toUpperCase()
  const { host, query, path } = req.urlData()
  const fullRequestURL = `https://${host ? host : ''}${path ? path : ''}${query ? query : ''}`
  const requestHost = `https://${host ? host : ''}`
  const defaultImages = getDefaultImages(requestHost)

  const appLocales = localeList.map((locale) => {
    return getAppLocale(locale)
  })

  const chapterPromise = Bible.call("chapter").params({
    id: versionId,
    reference: usfm
  }).setEnvironment(process.env.NODE_ENV).get()

  const versionPromise = Bible.call("version").params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  const allPromises = Promise.all([ chapterPromise, versionPromise ])

  allPromises.then(([ chapter, version ]) => {
    const deepLink = deepLinkPath(usfm, versionId, version.abbreviation)

    if (!validateApiResponse(chapter)) {
      req.log.warn(`Invalid Bible reference ${usfm} in version ${versionId}`)
      return reply.redirect(303, `/bible/${versionId}`)
    }

    if (!validateApiResponse(version)) {
      req.log.warn(`Invalid Bible version ${versionId}`)
      return reply.redirect(303, `/bible/${DEFAULT_VERSION}/${usfm}`)
    }

    const pathWithoutLocale = seoUtils.getCanonicalUrl('bible', version.id, version.local_abbreviation, usfm)
    const canonicalUrl = `https://${host ? host : ''}${pathWithoutLocale}`

    const verseLinks = () => {
      const regex = /data-usfm=\"(\S*\.\S*\.\S*)\"/g
      let m
      let matches = new Set()
      while ((m = regex.exec(chapter.content)) !== null) {

        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            matches.add(match)
          }
        })
      }
      return [ ...matches ]
    }

    return reply.view('/ui/pages/bible/chapter.marko', {
      chapterPromise,
      versionPromise,
      allPromises,
      versionId,
      fullRequestURL,
      canonicalUrl,
      requestHost,
      deepLink,
      getLocalizedLink,
      getPathWithoutLocale,
      pathWithoutLocale,
      appLocales,
      verseLinks: verseLinks(),
      metaImages: defaultImages.bible
    })
  }, (e) => {
    Raven.captureException(e)
    req.log.error(`Error getting Bible reference ${e.toString()}`)
    return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
  })
}
