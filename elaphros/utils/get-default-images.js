module.exports = function getDefaultImages(requestHost, languageTag = 'en') {
  return {
    bible: {
      twitter: `${requestHost}/static-assets/icons/bible/121/${languageTag}.png`,
      facebook: `${requestHost}/static-assets/icons/bible/200/${languageTag}.png`,
      other: `${requestHost}/static-assets/icons/bible/200/${languageTag}.png`
    }
  }
}
