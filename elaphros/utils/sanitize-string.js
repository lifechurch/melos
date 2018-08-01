/* If s is null, undefined, empty or 'null' then defaultValue, else s */
module.exports = function sanitizeString(s, defaultValue) {
  if (!s || s === 'null' || s === '' || typeof s !== 'string' || s.length === 0) {
    return defaultValue
  }
  return s
}
