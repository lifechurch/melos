module.exports = function getFirstUsfmForVersion(version) {
  let usfm
  try {
    usfm = version
    .books[0]
    .chapters[0]
    .usfm
    .toUpperCase()
    .indexOf('INTRO') === -1
      ? version.books[0].chapters[0].usfm
      : version.books[0].chapters[1].usfm
  } catch(e) {
    fastify.log.warn(`Failed to get first usfm for version: ${e.toString()}`)
    usfm = null
  }
  return usfm
}
