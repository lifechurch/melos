
function getCanonicalUrl(type, ...args) {
  let typeFn
  try {
    typeFn = require(`./${type}`)
  } catch (e) {
    throw new Error('Invalid SEOUtil Type')
  }
  return typeFn.getCanonicalUrl.apply(this, args)
}

module.exports = {
  getCanonicalUrl
}
