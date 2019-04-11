const parameterize = require('parameterize')
const stringex = require('stringex')

function getCanonicalUrl(version, locale = 'en', encode = true) {
  const title = version.local_title || version.title
  const abbr = version.local_abbreviation || version.abbreviation
  const slug = parameterize([
    version.id,
    abbr ? abbr.toUpperCase() : '',
    stringex.toUrl(title)
  ].join(' '))

  const url = `${locale === 'en' ? '' : `/${locale}`}/versions/${slug}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}
