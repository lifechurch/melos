/* eslint-disable prefer-arrow-callback */
const fp = require('fastify-plugin')
const api = require('@youversion/js-api')
const getAppLocaleDetails = require('../utils/localization/get-app-locale-details')
const getAppLocale = require('../utils/localization/get-app-locale')
const localeList = require('../localization/locale-list.json')
const getFirstUsfmForVersion = require('../utils/bible/get-first-usfm-for-version')

const DEFAULT_VERSION = process.env.BIBLE_DEFAULT_VERSION || 1
const DEFAULT_USFM = process.env.BIBLE_DEFAULT_USFM || 'JHN.1'
const DEFAULT_VERSION_ABBR = process.env.BIBLE_DEFAULT_VERSION_ABBR || 'KJV'

const Bible = api.getClient('bible')
const bibleLocaleMap = {}

module.exports = fp(async function bibleConfigDecorator(fastify, opts, next) {
  let defaultBibleVersions

  try {
    ({ default_versions: defaultBibleVersions } = await Bible.call('configuration')
      .setEnvironment(process.env.NODE_ENV)
      .get()
    )
  } catch (error) {
    fastify.captureException(error)
    return next()
  }

  const versionPromises = localeList.map(async locale => {
    let version
    let versionId = DEFAULT_VERSION
    let cachedVersion = {}
    const appLocale = getAppLocale(locale)
    const appLocaleDetails = getAppLocaleDetails(appLocale)

    const [ bibleVersion ] = defaultBibleVersions.filter(fVersion => {
      return fVersion.language_tag === appLocaleDetails.bibleLocale
    })

    if (typeof bibleVersion === 'undefined') {
      fastify.log.error(`Could not retrieve default Bible version for ${appLocale} (${appLocaleDetails.englishName})`)
    } else {
      ({ id: versionId } = bibleVersion)
    }

    try {
      version = await Bible.call('version')
        .params({ id: versionId })
        .setEnvironment(process.env.NODE_ENV)
        .get()
    } catch (error) {
      fastify.captureException(error)
    }

    if (typeof version === 'undefined' || version === null) {
      fastify.log.error(`Couldn't load Bible version from API: ${bibleVersion}`)
      cachedVersion = {
        id: DEFAULT_VERSION,
        abbr: DEFAULT_VERSION_ABBR,
        usfm: DEFAULT_USFM
      }
    } else {
      cachedVersion = {
        id: version.id,
        abbr: version.abbreviation,
        usfm: getFirstUsfmForVersion(version, fastify.log) || DEFAULT_USFM
      }
    }

    bibleLocaleMap[appLocale] = cachedVersion
  })

  try {
    await Promise.all(versionPromises)
  } catch (error) {
    fastify.captureException(error)
    return next()
  }

  fastify.decorateRequest('getDefaultBibleVersion', function getDefaultBibleVersion() {
    console.log('DL', this.detectedLng)
    const appLocale = this.detectedLng || 'en'
    return bibleLocaleMap[appLocale]
  })

  fastify.log.info(`Preloaded ${Object.keys(bibleLocaleMap).length} default Bible versions.`)

  return next()
}, {
  name: 'bibleConfiguration',
  decorators: {
    fastify: [
      'captureException'
    ]
  }
})