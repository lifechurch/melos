module.exports = function getCookieDomainFromRequest(request) {
  if (!request || !request.hostname) {
    throw new Error('Cannot read Request object to determine host name for cookie')
  }

  if (request.hostname.indexOf('localhost') !== -1) {
    return 'localhost'
  }

  const a = request.hostname.split('.')

  if (!Array.isArray(a)) {
    throw new Error('Cannot determine host name for cookie')
  }

  if (a.length < 3) return `.${a.join('.')}`

  return `.${a.slice(1).join('.')}`
}