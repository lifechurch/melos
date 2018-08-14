const seoUtils = require('./utils/seo')
const canonicalUrl = seoUtils.getCanonicalUrl('bible', 1, 'niv', 'mat.1')
console.log({ canonicalUrl })
