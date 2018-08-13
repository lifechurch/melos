function getCanonicalUrl(versionId, versionAbbr, usfm, locale = 'en') {
  return `${locale === 'en' ? '' : `/${locale}`}/bible/${versionId}/${usfm.toUpperCase()}.${versionAbbr.toUpperCase()}`
}

module.exports = {
  getCanonicalUrl
}
