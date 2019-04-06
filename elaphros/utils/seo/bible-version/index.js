const slugify = require('slugify')

function getCanonicalUrl(versionId, englishName, locale = 'en', encode = true) {
  const nameSlug = slugify(englishName).toLowerCase()
  const url = `${locale === 'en' ? '' : `/${locale}`}/versions/${versionId}-${nameSlug}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}
