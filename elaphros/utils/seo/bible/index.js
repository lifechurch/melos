function getCanonicalUrl(versionId, versionAbbr, usfm, locale = 'en', encode = true) {
  const url = `${locale === 'en' ? '' : `/${locale}`}/bible/${versionId}/${usfm.toUpperCase()}.${versionAbbr.toUpperCase()}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}
