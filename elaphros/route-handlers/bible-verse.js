const Raven = require('raven')
const api = require('@youversion/js-api')
const selectImageFromList = require('@youversion/utils/lib/images/selectImageFromList').default
const chapterifyUsfm = require('@youversion/utils/lib/bible/chapterifyUsfm').default
const getReferencesTitle = require('@youversion/utils/lib/bible/getReferencesTitle').default
const expandUsfm = require('@youversion/utils/lib/bible/expandUsfm').default
const deepLinkPath = require('@youversion/utils/lib/bible/deepLinkPath').default
const validateApiResponse = require('../utils/validate-api-response')
const getDefaultImages = require('../utils/get-default-images')
const getAppLocale = require('../utils/localization/get-app-locale')
const getLocalizedLink = require('../utils/localization/get-localized-link')
const getPathWithoutLocale = require('../utils/localization/get-path-without-locale')
const localeList = require('../localization/locale-list.json')
const Bible = api.getClient('bible')
const Image = api.getClient('images')
const ReadingPlans = api.getClient('reading-plans')

module.exports = function bibleVerse(req, reply) {
  const { versionId, usfm: rawUsfm } = req.params
  const usfm = rawUsfm.split('.').slice(0, 3).join('.').toUpperCase()
  const { host, query, path } = req.urlData()
  const fullRequestURL = `https://${host ? host : ''}${path ? path : ''}${query ? query : ''}`
  const requestHost = `https://${host ? host : ''}`
  const pathWithoutLocale = getPathWithoutLocale(path)
  const defaultImages = getDefaultImages(requestHost)
  const versesUsfm = expandUsfm(usfm)

  const imagesUsfm = versesUsfm.reduce((accumulator = [], usfm) => {
    return accumulator.concat(usfm.split('+'))
  }, [])

  const appLocales = localeList.map((locale) => {
    return getAppLocale(locale)
  })

  const versePromise = Bible.call('verses').params({
    id: versionId,
    references: versesUsfm,
    format: 'text'
  }).setEnvironment(process.env.NODE_ENV).get()

  const versionPromise = Bible.call("version").params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  const imagesPromise = Image.call("items").params({
    usfm: imagesUsfm,
    language_tag: 'en'
  }).setEnvironment(process.env.NODE_ENV).get()

  const plansPromise = ReadingPlans.call("plans_by_reference").params({
    usfm: imagesUsfm[0],
    language_tag: 'en'
  }).setEnvironment(process.env.NODE_ENV).get()

  const configPromise = ReadingPlans.call("configuration").setEnvironment(process.env.NODE_ENV).get()

  const allPromises = Promise.all([ versePromise, versionPromise, imagesPromise, plansPromise, configPromise ])

  allPromises.then(([ verses, version, images, plans, config ]) => {
    const referenceTitle = getReferencesTitle({ bookList: version.books, usfmList: versesUsfm })
    const deepLink = deepLinkPath(chapterifyUsfm(usfm), versionId, version.abbreviation, usfm.split('.').splice(-1))
    let twitterCard = 'summary'

    if (validateApiResponse(images) && images.length > 0) {
      data.selectImageFromList({ images: data.images.renditions, width: 320, height: 320 })
    } else {

    }

    if (!validateApiResponse(verses)) {
      req.log.warn(`Invalid Bible Verse reference ${usfm} in version ${versionId}`)
      return reply.redirect(303, `/bible/${versionId}`)
    }

    if (!validateApiResponse(version)) {
      req.log.warn(`Invalid Bible version ${versionId}`)
      return reply.redirect(303, `/bible/${DEFAULT_VERSION}/${usfm}`)
    }

    const prerenderedImages = (validateApiResponse(images) && ('images' in images) && images.images.length > 0)
      ? images.images.filter((image) => !image.editable)
      : []

    const relatedPlans = (validateApiResponse(plans) && ('reading_plans' in plans) && plans.reading_plans.length > 0)
      ? plans.reading_plans
      : []

    const description = verses.verses.map((verse) =>
      verse.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim().substring(0,200)
    ).join(' ')

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
      twitterCard = "summary_large_image"
      const imageUrl = `https:${selectImageFromList({ images: prerenderedImages[0].renditions, width: 1280, height: 1280 }).url}`
      return {
        twitter: imageUrl,
        facebook: imageUrl,
        other: imageUrl
      }
    }

    return reply.view('/ui/pages/bible/verse.marko', {
      versePromise,
      versionPromise,
      allPromises,
      versionId,
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
      pathWithoutLocale,
      description,
      appLocales
    })
  }, (e) => {
    Raven.captureException(e)
    req.log.error(`Error getting Bible reference ${e.toString()}`)
    return reply.redirect(307, `/bible/${DEFAULT_VERSION}/${DEFAULT_USFM}`)
  })
}
