function getCanonicalUrl(language_tag, locale = 'en', encode = true) {
  const url = `${locale === 'en' ? '' : `/${locale}`}/languages/${language_tag.toLowerCase()}`
  if (encode) {
    return encodeURI(url)
  }
  return url
}

module.exports = {
  getCanonicalUrl
}