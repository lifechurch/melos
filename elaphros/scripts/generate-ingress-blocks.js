/* eslint-disable import/no-extraneous-dependencies */
const rtlDetect = require('rtl-detect')
const getAppLocale = require('../utils/localization/get-app-locale')
const locales = require('../localization/locale-list.json')

const blacklist = [
  'en-GB'
]

const output = locales.map((locale) => {
  return getAppLocale(locale)
}).sort().map((appLocale) => {
  const rtl = rtlDetect.isRtlLang(appLocale)
  const blacklisted = blacklist.indexOf(appLocale) !== -1
  if (!rtl && !blacklisted) {
    return `
    - path: ${appLocale === 'en' ? '' : `/${appLocale}`}/bible
      backend:
        serviceName: elaphros-$CI_ENVIRONMENT_SLUG
        servicePort: $PORT
    - path: ${appLocale === 'en' ? '' : `/${appLocale}`}/bible-offline
      backend:
        serviceName: elaphros-$CI_ENVIRONMENT_SLUG
        servicePort: $PORT
    - path: ${appLocale === 'en' ? '' : `/${appLocale}`}/confirmation
      backend:
        serviceName: elaphros-$CI_ENVIRONMENT_SLUG
        servicePort: $PORT
    - path: ${appLocale === 'en' ? '' : `/${appLocale}`}/friendships/accept
      backend:
        serviceName: elaphros-$CI_ENVIRONMENT_SLUG
        servicePort: $PORT`
  }
  return ''
}).join('')

console.log(output)
