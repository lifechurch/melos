const slugify = require('slugify')

function getCanonicalUrl(versionId, englishName, englishAbbr, locale = 'en', encode = true) {
  const slug = [
    versionId,
    slugify(englishAbbr).toLowerCase(),
    slugify(englishName).toLowerCase()
  ].join('-').replace(/\'/g, '')

  const url = `${locale === 'en' ? '' : `/${locale}`}/versions/${slug}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}
