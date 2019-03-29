const httpErrors = require('http-errors')
const api = require('@youversion/js-api')
const selectImageFromList = require('@youversion/utils/lib/images/selectImageFromList').default
const chapterifyUsfm = require('@youversion/utils/lib/bible/chapterifyUsfm').default
const getReferencesTitle = require('@youversion/utils/lib/bible/getReferencesTitle').default
const expandUsfm = require('@youversion/utils/lib/bible/expandUsfm').default
const isVerseOrChapter = require('@youversion/utils/lib/bible/isVerseOrChapter').default
const validateApiResponse = require('../../utils/validate-api-response')
const getDefaultImages = require('../../utils/get-default-images')
const getAppLocale = require('../../utils/localization/get-app-locale')
const getLocalizedLink = require('../../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../../utils/localization/get-path-without-locale')
const seoUtils = require('../../utils/seo')
const localeList = require('../../localization/locale-list.json')
const bibleToAppLocale = require('../../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../../utils/localization/get-app-locale-details')

const Bible = api.getClient('bible')
const Image = api.getClient('images')
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.3.16'

const versionIds = [ 105, 100, 97, 12, 1588, 59, 1849, 1, 116, 111 ]
const versionId = 111

module.exports = function bibleCompare(req, reply) {
  const { usfm: rawUsfm } = req.params

  const { isVerse } = isVerseOrChapter(rawUsfm)

  if (!isVerse) {
    if (reply.newrelic) {
      reply.newrelic.setTransactionName('not-found-bible-compare')
    }
    return reply.send(new httpErrors.NotFound())
  }

  if (reply.newrelic) {
    reply.newrelic.setTransactionName('bible-compare')
  }

  const usfm = rawUsfm.split('.').slice(0, 3).join('.').toUpperCase()
  const { host, query, path } = req.urlData()
  const fullRequestURL = `https://${host || ''}${path || ''}${query || ''}`
  const requestHost = `https://${host || ''}`
  const defaultImages = getDefaultImages(requestHost)
  const versesUsfm = expandUsfm(usfm).map((v) => {
    return v.split('+').slice(0, 25).join('+')
  })

  const imagesUsfm = versesUsfm.reduce((accumulator = [], imageUsfm) => {
    return accumulator.concat(imageUsfm.split('+'))
  }, [])

  const appLocales = localeList.map((locale) => {
    return getAppLocale(locale)
  })

  const versePromise = Bible.call('verses').params({
    ids: versionIds,
    references: versesUsfm,
    format: 'text'
  }).setEnvironment(process.env.NODE_ENV).get()

  const versionPromise = Bible.call('version').params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  const imagesPromise = Image.call('items').params({
    usfm: imagesUsfm,
    language_tag: req.detectedLng
  }).setEnvironment(process.env.NODE_ENV).get()

  imagesPromise.catch((err) => {
    reply.captureException(err, null)
  })

  const allPromises = Promise.all([ versePromise, versionPromise, imagesPromise ])

  allPromises.then(([ verses, version, images ]) => {
    const referenceTitle = getReferencesTitle({ bookList: version.books, usfmList: versesUsfm })

    const deepLink = ''
    let twitterCard = 'summary'

    if (!validateApiResponse(verses)) {
      req.log.warn(`Invalid Bible Verse reference ${usfm} in version ${versionIds.join(', ')}`)
      return reply.redirect(303, seoUtils.getCanonicalUrl('bible-compare', DEFAULT_USFM, 'en'))
    }

    if (!validateApiResponse(version)) {
      req.log.warn(`Invalid Bible version ${versionIds}`)
      return reply.redirect(303, seoUtils.getCanonicalUrl('bible-compare', DEFAULT_USFM, 'en'))
    }

    const canonicalPath = seoUtils.getCanonicalUrl('bible-compare', referenceTitle.usfm, 'en')
    const canonicalUrl = `${host ? `https://${host}` : ''}${canonicalPath}`

    const prerenderedImages = (validateApiResponse(images) && ('images' in images) && images.images.length > 0)
      ? images.images.filter((image) => { return !image.editable })
      : []

    const description = verses.verses.map((verse) => {
      return verse.verses.map((innerVerse) => { return innerVerse.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim().substring(0, 200) })
    }).join(' ')

    function getMetaImages() {
      if (prerenderedImages.length === 0) return defaultImages.bible
      twitterCard = 'summary_large_image'
      const imageUrl = `https:${selectImageFromList({ images: prerenderedImages[0].renditions, width: 1280, height: 1280 }).url}`
      return {
        twitter: imageUrl,
        facebook: imageUrl,
        other: imageUrl
      }
    }

    return reply.view('/ui/pages/bible/compare.marko', {
      versePromise,
      versionPromise,
      allPromises,
      versionIds,
      fullRequestURL,
      requestHost,
      images: prerenderedImages,
      selectImageFromList,
      chapterifyUsfm,
      deepLink,
      referenceTitle,
      usfm,
      metaImages: getMetaImages(),
      twitterCard,
      getLocalizedLink,
      getPathWithoutLocale,
      description,
      appLocales,
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
    return reply.redirect(307, seoUtils.getCanonicalUrl('bible-compare', `${DEFAULT_USFM}`, req.detectedLng))
  })
}
