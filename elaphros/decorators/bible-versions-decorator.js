const fp = require('fastify-plugin')
const api = require('@youversion/js-api')
const getAppLocaleDetails = require('../utils/localization/get-app-locale-details')
const bibleToAppLocale = require('../utils/localization/bible-to-app-locale')

const Bible = api.getClient('bible')

function createVersionMap(versionList) {
  const versionMap = {}
  const versionLanguageMap = {}
  const versionPublisherMap = {}
  const versionLanguages = []
  const versionPublishers = []
  const bibleVersionCount = versionList.length

  versionList.forEach((v) => {
    versionMap[v.id] = v
    if (!Array.isArray(versionLanguageMap[v.language.language_tag])) {
      versionLanguageMap[v.language.language_tag] = []
      versionLanguages.push(v.language)
    }
    versionLanguageMap[v.language.language_tag].push(v.id)

    if (v.publisher_id) {
      if (!Array.isArray(versionPublisherMap[v.publisher_id])) {
        versionPublisherMap[v.publisher_id] = []
        versionPublishers.push(v.publisher_id)
      }
      versionPublisherMap[v.publisher_id].push(v.id)
    }
  })

  const bibleLanguageCount = versionLanguages.length
  const biblePublisherCount = versionPublishers.length

  function getVersionLanguages(bibleLanguage) {
    versionLanguages.sort((l1, l2) => {
      if (l1.language_tag === bibleLanguage && l2.language_tag !== bibleLanguage) return -1
      if (l1.language_tag !== bibleLanguage && l2.language_tag === bibleLanguage) return 1

      if (l1.local_name > l2.local_name) return 1
      if (l1.local_name < l2.local_name) return -1
      return 0
    })
    return versionLanguages
  }

  function getVersionLanguage(bibleLanguage) {
    return versionLanguages.filter(lang => {
      return lang.language_tag === bibleLanguage
    }).pop()
  }

  function getPopularVersionLanguages(bibleLanguage) {
    return getVersionLanguages(bibleLanguage).filter(lang => {
      return Boolean(bibleToAppLocale(lang) !== 'en' || lang.language_tag === 'eng')
    })
  }

  function getUnpopularVersionLanguages(bibleLanguage) {
    return getVersionLanguages(bibleLanguage).filter(lang => {
      return Boolean(bibleToAppLocale(lang) === 'en' && lang.language_tag !== 'eng')
    })
  }

  function getVersionsForLanguage(bibleLanguage) {
    const languageVersions = versionLanguageMap[bibleLanguage].map((versionId) => {
      return versionMap[versionId]
    })

    languageVersions.sort((v1, v2) => {
      if (v1.local_title > v2.local_title) return 1
      if (v1.local_title < v2.local_title) return -1
      return 0
    })

    return languageVersions
  }

  function getVersionsForPublisher(publisherId) {
    const publisherVersions = versionPublisherMap[publisherId].map((versionId) => {
      return versionMap[versionId]
    })

    publisherVersions.sort((v1, v2) => {
      if (v1.local_title > v2.local_title) return 1
      if (v1.local_title < v2.local_title) return -1
      return 0
    })

    return publisherVersions
  }

  return {
    getVersionsForLanguage,
    getVersionLanguages,
    getVersionLanguage,
    getPopularVersionLanguages,
    getUnpopularVersionLanguages,
    bibleVersionCount,
    bibleLanguageCount,
    biblePublisherCount,
    getVersionsForPublisher
  }
}

module.exports = fp(async function BibleVersionsDecorator(fastify, opts, next) {

  let versionList
  try {
    ({ versions: versionList } = await Bible.call('versions')
      .params({ type: 'all' })
      .setEnvironment(process.env.NODE_ENV)
      .get()
    )
  } catch (error) {
    fastify.captureException(error)
  }

  const {
    getVersionsForLanguage,
    getVersionLanguages,
    getVersionLanguage,
    getPopularVersionLanguages,
    getUnpopularVersionLanguages,
    getVersionsForPublisher,
    bibleLanguageCount,
    bibleVersionCount,
  } = createVersionMap(versionList)


  fastify.decorateRequest('getVersionLanguages', function handleGetVersionLanguages() {
    const localeDetails = getAppLocaleDetails(this.detectedLng || 'en')
    return getVersionLanguages(localeDetails.bibleLocale)
  })

  fastify.decorateRequest('getPopularVersionLanguages', function handleGetPopularVersionLanguages() {
    const localeDetails = getAppLocaleDetails(this.detectedLng || 'en')
    return getPopularVersionLanguages(localeDetails.bibleLocale)
  })

  fastify.decorateRequest('getUnpopularVersionLanguages', function handleGetUnpopularVersionLanguages() {
    const localeDetails = getAppLocaleDetails(this.detectedLng || 'en')
    return getUnpopularVersionLanguages(localeDetails.bibleLocale)
  })

  fastify.decorateRequest('getVersionLanguage', getVersionLanguage)
  fastify.decorateRequest('getVersionsForLanguage', getVersionsForLanguage)
  fastify.decorateRequest('getVersionsForPublisher', getVersionsForPublisher)
  fastify.decorateRequest('bibleLanguageCount', bibleLanguageCount)
  fastify.decorateRequest('bibleVersionCount', bibleVersionCount)

  fastify.log.info('Setup Bible version decorators')

  next()
}, {
  name: 'bibleVersionsDecorator',
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