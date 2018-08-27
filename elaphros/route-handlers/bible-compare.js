const Raven = require('raven')
const httpErrors = require('http-errors')
const api = require('@youversion/js-api')
const selectImageFromList = require('@youversion/utils/lib/images/selectImageFromList').default
const chapterifyUsfm = require('@youversion/utils/lib/bible/chapterifyUsfm').default
const getReferencesTitle = require('@youversion/utils/lib/bible/getReferencesTitle').default
const expandUsfm = require('@youversion/utils/lib/bible/expandUsfm').default
const isVerseOrChapter = require('@youversion/utils/lib/bible/isVerseOrChapter').default
const newrelic = require('../server/get-new-relic')()
const validateApiResponse = require('../utils/validate-api-response')
const getDefaultImages = require('../utils/get-default-images')
const getAppLocale = require('../utils/localization/get-app-locale')
const getLocalizedLink = require('../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../utils/localization/get-path-without-locale')
const seoUtils = require('../utils/seo')
const localeList = require('../localization/locale-list.json')
const bibleToAppLocale = require('../utils/localization/bible-to-app-locale')
const getAppLocaleDetails = require('../utils/localization/get-app-locale-details')

const Bible = api.getClient('bible')
const Image = api.getClient('images')
const ReadingPlans = api.getClient('reading-plans')
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.3.16'

const versionIds = [ 105, 100, 97, 12, 1588, 59, 1849, 1, 116, 111 ]
const versionId = 111

module.exports = function bibleCompare(req, reply) {
  const { usfm: rawUsfm } = req.params

  const { isVerse } = isVerseOrChapter(rawUsfm)

  if (!isVerse) {
    if (newrelic) {
      newrelic.setTransactionName('not-found-bible-compare')
    }
    return reply.send(new httpErrors.NotFound())
  }

  if (newrelic) {
    newrelic.setTransactionName('bible-verse')
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
    Raven.captureException(err)
  })

  const plansPromise = ReadingPlans.call('plans_by_reference').params({
    usfm: imagesUsfm[0],
    language_tag: req.detectedLng
  }).setEnvironment(process.env.NODE_ENV).get()

  const configPromise = ReadingPlans.call('configuration').setEnvironment(process.env.NODE_ENV).get()

  const allPromises = Promise.all([ versePromise, versionPromise, imagesPromise, plansPromise, configPromise ])

  allPromises.then(([ verses, version, images, plans, config ]) => {
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

    const relatedPlans = (validateApiResponse(plans) && ('reading_plans' in plans) && plans.reading_plans.length > 0)
      ? plans.reading_plans
      : []

    // const description = verses.verses.map((verse) => { return verse.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim().substring(0, 200) }).join(' ')

    const description = verses.verses.map((verse) => {
      return verse.verses.map((innerVerse) => { return innerVerse.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim().substring(0, 200) })
    }).join(' ')

    function getReadingPlanImage(id, width = 320, height = 180) {
      if (!validateApiResponse(config)) return {}
      const url = config.images.reading_plans.url
        .replace('{image_id}', id)
        .replace('{0}', width)
        .replace('{1}', height)
      return { url, width, height }
    }

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
      plans: relatedPlans,
      getReadingPlanImage,
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
    Raven.captureException(e)
    req.log.error(`Error getting Bible reference ${e.toString()}`)
    return reply.redirect(307, seoUtils.getCanonicalUrl('bible-compare', `${DEFAULT_USFM}`, req.detectedLng))
  })
}
