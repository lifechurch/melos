function getCanonicalUrl(usfm, locale = 'en', encode = true) {
  const url = `${locale === 'en' ? '' : `/${locale}`}/bible/compare/${usfm.toUpperCase()}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}
