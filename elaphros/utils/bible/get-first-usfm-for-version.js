module.exports = function getFirstUsfmForVersion(version, log) {
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
  } catch (e) {
    log.warn(`Failed to get first usfm for version: ${e.toString()}`)
    usfm = null
  }
  return usfm
}
