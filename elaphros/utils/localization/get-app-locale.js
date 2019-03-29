const fourLetterLocales = [
  'en-gb',
  'es-es',
  'pt-pt',
  'zh-cn',
  'zh-hk',
  'zh-tw',
  'my-mm'
]

const threeLetterLocales = [
  'ckb',
  'tlh'
]

module.exports = function getAppLocale({
  locale,
  locale2,
  locale3,
}) {
  if (locale && fourLetterLocales.indexOf(locale.toLowerCase()) !== -1) return locale
  if (locale3 && threeLetterLocales.indexOf(locale3.toLowerCase()) !== -1) return locale3
  return locale2 || locale || locale3
}
