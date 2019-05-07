
const crypto = require('crypto')
const Marshal = require('marshal')

module.exports = function unpackRailsCookie(cookie, secret) {
  if (typeof cookie !== 'string') return null
  if (typeof secret !== 'string') return null

  // Rails cookie sessions contain data and a digest joined by '--'
  const session = cookie.split('--')
  const data = session[0]
  const digest = session[1]

  // crate an HMAC out of the secret Rails uses to sign the cookies (<rails root>/config/secret_token.yml, etc.)
  const hmac = crypto.createHmac('sha1', secret)
  hmac.update(data)

  // validate the cookie session data secret
  if (secret && (digest === hmac.digest('hex'))) {
    // the Marshaled session is base64 encoded
    const buffer = new Buffer.from(data, 'base64')
    const marshal = new Marshal(buffer)
    return marshal.parsed
  }

  return null
}
