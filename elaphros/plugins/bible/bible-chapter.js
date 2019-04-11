const api = require('@youversion/js-api')
const httpErrors = require('http-errors')
const deepLinkPath = require('@youversion/utils/lib/bible/deepLinkPath').default
const validateApiResponse = require('../../utils/validate-api-response')
const getDefaultImages = require('../../utils/get-default-images')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../../utils/localization/get-path-without-locale')
const localeList = require('../../localization/locale-list.json')
const getAppLocale = require('../../utils/localization/get-app-locale')
const seoUtils = require('../../utils/seo')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')

const Bible = api.getClient('bible')

module.exports = function bibleChapter(req, reply) {
  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-chapter')
  }

  const { id: defaultVersionId } = req.getDefaultBibleVersion()

  const { versionId, usfm: rawUsfm } = req.params
  const usfm = rawUsfm.split('.').slice(0, 2).join('.').toUpperCase()
  const { host, query, path } = req.urlData()
  const fullRequestURL = `https://${host || ''}${path || ''}${query || ''}`
  const requestHost = `https://${host || ''}`
  const defaultImages = getDefaultImages(requestHost)

  const appLocales = localeList.map((locale) => {
    return getAppLocale(locale)
  })

  const chapterPromise = Bible.call('chapter').params({
    id: versionId,
    reference: usfm
  }).setEnvironment(process.env.NODE_ENV).get()

  const versionPromise = Bible.call('version').params({
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
      return reply.redirect(303, `/bible/${defaultVersionId}/${usfm}`)
    }
    const canonicalPath = seoUtils.getCanonicalUrl('bible', version.id, version.local_abbreviation, chapter.reference.usfm[0], bibleToAppLocale(version.language))
    const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

    const verseLinks = () => {
      /* eslint-disable no-cond-assign */
      const regex = /data-usfm=\"(\S*\.\S*\.\S*)\"/g
      let m
      const matches = new Set()
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
      requestHost,
      deepLink,
      getLocalizedLink,
      getPathWithoutLocale,
      appLocales,
      verseLinks: verseLinks(),
      metaImages: defaultImages.bible,
      $global: {
        __: reply.res.__,
        __mf: reply.res.__mf,
        locale: req.detectedLng,
        seoUtils,
        bibleToAppLocale,
        textDirection: 'ltr',
        localeDetails: getAppLocaleDetails(req.detectedLng),
        canonicalUrl,
        canonicalPath
      }
    })
  }, (e) => {
    reply.captureException(e, 'Error getting Bible reference')
    return reply.send(new httpErrors.NotFound())
  })
}
