const fp = require('fastify-plugin')
const api = require('@youversion/js-api')
const getAppLocaleDetails = require('../utils/localization/get-app-locale-details')

const Bible = api.getClient('bible')

function createVersionMap(versionList) {
  const versionMap = {}
  const versionLanguageMap = {}
  const versionLanguages = []

  versionList.forEach((v) => {
    versionMap[v.id] = v
    if (!Array.isArray(versionLanguageMap[v.language.language_tag])) {
      versionLanguageMap[v.language.language_tag] = []
      versionLanguages.push(v.language)
    }
    versionLanguageMap[v.language.language_tag].push(v.id)
  })

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

  return {
    getVersionsForLanguage,
    getVersionLanguages
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
    getVersionLanguages
  } = createVersionMap(versionList)


  fastify.decorateRequest('getVersionLanguages', function handleGetVersionLanguages() {
    const localeDetails = getAppLocaleDetails(this.detectedLng || 'en')
    return getVersionLanguages(localeDetails.bibleLocale)
  })

  fastify.decorateRequest('getVersionsForLanguage', getVersionsForLanguage)
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